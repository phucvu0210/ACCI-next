"use client";

import { useState, useEffect } from "react";
import { Search, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createRequest } from "@/lib/request";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuthStore } from '@/store/auth';
import { useRouter } from "next/navigation";

type KH = {
  maKH: number;
  tenKH: string;
  email: string;
  sdt: string;
  diaChi: string;
  loaiKH: string;
};

function formatDateToDDMMYYYY(dateStr: string): string {
  const [day, month, year] = dateStr.split('/');
  return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
}

function parseDateDDMMYYYY(dateStr: string): Date {
  const [day, month, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day); // month - 1 vì JavaScript dùng 0-based month
}

export default function CustomerRegistrationPage() {
  const [formData, setFormData] = useState({
    tenKH: "",
    sdt: "",
    email: "",
    diaChi: "",
    loaiKH: "individual",
  });

  const [existingCustomerId, setExistingCustomerId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<KH[]>([]);
  const [chiTietDangKyList, setChiTietDangKyList] = useState<any[]>([]);
  const [isAddingChiTiet, setIsAddingChiTiet] = useState(false);
  const [chiTietForm, setChiTietForm] = useState<{
    hoTenThiSinh: string;
    cccd: string;
    ngaySinh: string;
    maLichThi: string | number;
  }>({
    hoTenThiSinh: "",
    cccd: "",
    ngaySinh: "",
    maLichThi: "",
  });

  const [scheduleList, setScheduleList] = useState<any[]>([]);
  const currentUser = useAuthStore((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    const fetchSchedules = async () => {
      const schedules = (await createRequest({
        _model: "LichThi",
        _method: "GET",
        _relation: ["kyThi"],
      })) as any[];

      if (Array.isArray(schedules)) {
        setScheduleList(schedules);
      }
    };

    fetchSchedules();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleChiTietChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setChiTietForm({ ...chiTietForm, [e.target.name]: e.target.value });
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    const results = (await createRequest({
      _model: "KhachHang",
      _method: "GET",
      _where: {
        AND: [
          {
            OR: [
              { tenKH: { contains: query } },
              { sdt: { contains: query } },
              { email: { contains: query } },
            ],
          },
          { loaiKH: "individual" },
        ],
      },
    })) as KH[];

    if (Array.isArray(results)) {
      setSearchResults(results);
    }
  };

  const handleSelectKH = (kh: KH) => {
    setFormData({
      tenKH: kh.tenKH,
      email: kh.email,
      sdt: kh.sdt,
      diaChi: kh.diaChi || "",
      loaiKH: kh.loaiKH || "individual",
    });
    setExistingCustomerId(kh.maKH);
    setSearchResults([]);
  };

  const handleAddChiTiet = () => {
    setIsAddingChiTiet(true);
  };

  const handleCompleteChiTiet = () => {
    if (!chiTietForm.hoTenThiSinh || !chiTietForm.cccd || !chiTietForm.ngaySinh || !chiTietForm.maLichThi) {
      toast.error("Please fill in all the fields.");
      return;
    }

    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = chiTietForm.ngaySinh.match(dateRegex);
    if (!match) {
      toast.error("Date of Birth must follow DD/MM/YYYY format.");
      return;
    }

    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
      toast.error("Invalid Date of Birth.");
      return;
    }

    const selectedSchedule = scheduleList.find((s) => s.maLichThi === Number(chiTietForm.maLichThi));
    if (selectedSchedule && selectedSchedule.soThiSinhDK >= selectedSchedule.soThiSinhTD) {
      toast.error(`Schedule ${selectedSchedule.maLichThi} has reached maximum capacity (${selectedSchedule.soThiSinhTD}).`);
      return;
    }

    setChiTietDangKyList([...chiTietDangKyList, chiTietForm]);
    setScheduleList((prev) =>
      prev.map((s) =>
        s.maLichThi === Number(chiTietForm.maLichThi) ? { ...s, soThiSinhDK: s.soThiSinhDK + 1 } : s
      )
    );
    setChiTietForm({ hoTenThiSinh: "", cccd: "", ngaySinh: "", maLichThi: "" });
    setIsAddingChiTiet(false);
  };

  const handleFinalComplete = async () => {
    if (!chiTietDangKyList.length) {
      toast.error("Please add at least one ChiTietDangKy.");
      return;
    }

    if (!currentUser) {
      toast.error("User not logged in.");
      return;
    }

    try {
      let khachHang = existingCustomerId;
      if (!khachHang) {
        const newKhachHang = await createRequest({
          _model: "KhachHang",
          _method: "POST",
          ...formData,
        }) as { maKH: number };

        if (!newKhachHang) {
          throw new Error("Create KhachHang failed");
        }

        khachHang = newKhachHang.maKH;
      }

      const kyThiMap = new Map<number, { phi: number; count: number }>();

      for (const chiTiet of chiTietDangKyList) {
        const schedule = scheduleList.find(
          (schedule) => schedule.maLichThi === Number(chiTiet.maLichThi)
        );
        if (schedule) {
          const maKyThi = schedule.kyThi.maKyThi;
          const phi = schedule.kyThi.phi;
          if (!kyThiMap.has(maKyThi)) {
            kyThiMap.set(maKyThi, { phi, count: 0 });
          }
          kyThiMap.get(maKyThi)!.count += 1;
        }
      }

      let tongTien = 0;
      kyThiMap.forEach(({ phi, count }) => {
        tongTien += phi * count;
      });

      const phieuDangKy = await createRequest({
        _model: "PhieuDangKy",
        _method: "POST",
        ngayDangKy: new Date(),
        trangThai: "unpaid",
        tongTien,
        maKH: khachHang,
        maNVTN: currentUser.maNV,
      }) as { maPDK: number };

      if (!phieuDangKy) {
        throw new Error("Fail create PhieuDangKy.");
      }

      // Đảm bảo tất cả các thao tác với database hoàn tất trước khi chuyển hướng
      const databaseUpdates = chiTietDangKyList.map(async (chiTiet) => {
        const schedule = scheduleList.find((s) => s.maLichThi === Number(chiTiet.maLichThi));
        if (schedule) {
          await createRequest({
            _model: "LichThi",
            _method: "PUT",
            _where: { maLichThi: schedule.maLichThi },
            soThiSinhDK: schedule.soThiSinhDK,
          });
        }

        await createRequest({
          _model: "ChiTietDangKy",
          _method: "POST",
          ...chiTiet,
          cccd: chiTiet.cccd,
          ngaySinh: parseDateDDMMYYYY(chiTiet.ngaySinh),
          maLichThi: Number(chiTiet.maLichThi),
          maPDK: phieuDangKy.maPDK,
        });
      });

      // Chờ tất cả các thao tác với database hoàn tất
      await Promise.all(databaseUpdates);

      // Hiển thị thông báo thành công
      toast.success("Registration successful");

      // Chờ 1 giây trước khi chuyển hướng
      setTimeout(() => {
        router.push(`/email?maPDK=${phieuDangKy.maPDK}`);
      }, 1000);

      // Reset state sau khi hoàn tất
      setChiTietDangKyList([]);
      setFormData({ tenKH: "", sdt: "", email: "", diaChi: "", loaiKH: "individual" });
      setExistingCustomerId(null);

    } catch (error) {
      console.error(error);
      toast.error("Error during registration: " + (error.message || "Unknown error"));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      _model: "KhachHang",
      ...(existingCustomerId
        ? { _method: "PUT" as "PUT", _where: { maKH: existingCustomerId } }
        : { _method: "POST" as "POST" }),
      ...formData,
    };

    const res = await createRequest(payload);

    if (res) {
      toast.success(existingCustomerId ? "Customer updated" : "New customer created");
      console.log("Response:", res);
    }

    setExistingCustomerId(null);
    setFormData({ tenKH: "", sdt: "", email: "", diaChi: "", loaiKH: "individual" });
  };

  return (
    <div className="min-h-screen w-screen bg-amber-50 font-aftersick">
      <div className="p-6">
        <div className="bg-[#FDFAE7] border-none">
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <h4 className="text-[#e2725b] text-4xl self-start">ACCI</h4>
                <h1 className="text-2xl font-semibold mt-1 text-black font-aftersick">
                  Register for <span className="text-orange-500">Individual Customer</span>
                </h1>
              </div>

              <div>
                <p className="text-sm font-medium mb-2 text-black font-aftersick">Search</p>
                <div className="relative">
                  <Input
                    className="pl-3 pr-10 py-2 rounded-4xl border-black border w-full text-black font-goldplay"
                    placeholder="Search by name, phone, or email"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  <Search className="absolute right-3 top-2.5 h-4 w-4" />
                  {searchResults.length > 0 && (
                    <ul className="absolute bg-white border rounded-md mt-1 w-full z-10 max-h-60 overflow-y-auto font-goldplay">
                      {searchResults.map((kh, index) => (
                        <li
                          key={index}
                          className="p-2 hover:bg-gray-100 text-black cursor-pointer font-goldplay"
                          onClick={() => handleSelectKH(kh)}
                        >
                          {`${kh.tenKH} - ${kh.email} - ${kh.sdt}`}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <InputField label="Name" name="tenKH" value={formData.tenKH} onChange={handleChange} placeholder="Alice" />
                <InputField label="Phone" name="sdt" value={formData.sdt} onChange={handleChange} placeholder="+84123456789" />
                <InputField label="Email" name="email" value={formData.email} onChange={handleChange} placeholder="abc@example.com" />
                <InputField label="Address" name="diaChi" value={formData.diaChi} onChange={handleChange} placeholder="HOME" />

                {chiTietDangKyList.map((chiTiet, index) => {
                  const selectedSchedule = scheduleList.find(
                    (schedule) => Number(schedule.maLichThi) === Number(chiTiet.maLichThi)
                  );

                  return (
                    <div key={index} className="p-4 bg-[#fceec7] border-[#F16F33] text-black border-3 rounded-md mb-2 relative">
                      <button
                        type="button"
                        className="absolute top-2 right-2 text-black hover:text-red-700"
                        onClick={() => {
                          const updatedList = chiTietDangKyList.filter((_, i) => i !== index);
                          setChiTietDangKyList(updatedList);
                          if (selectedSchedule) {
                            setScheduleList((prev) =>
                              prev.map((s) =>
                                s.maLichThi === selectedSchedule.maLichThi
                                  ? { ...s, soThiSinhDK: s.soThiSinhDK - 1 }
                                  : s
                              )
                            );
                          }
                        }}
                      >
                        <X />
                      </button>
                      <p>
                        <span className="font-aftersick">Name:</span>{' '}
                        <span className="font-goldplay">{chiTiet.hoTenThiSinh}</span>
                      </p>

                      <div className="flex justify-between">
                        <p>
                          <span className="font-aftersick">CID:</span>{' '}
                          <span className="font-goldplay">{chiTiet.cccd}</span>
                        </p>
                        <p>
                          <span className="font-aftersick">Date of Birth:</span>{' '}
                          <span className="font-goldplay">{formatDateToDDMMYYYY(chiTiet.ngaySinh)}</span>
                        </p>
                      </div>

                      {selectedSchedule && (
                        <p>
                          <span className="font-aftersick">Schedule:</span>{' '}
                          <span className="font-goldplay">
                            {`${new Date(selectedSchedule.thoiGianThi).toLocaleString()} - ${selectedSchedule.kyThi.tenKT}`}
                          </span>
                        </p>
                      )}
                    </div>
                  );
                })}

                {isAddingChiTiet ? (
                  <div className="p-4 border-2 border-[#F16F33] rounded-md">
                    <div className="space-y-2">
                      <div>
                        <label className="text-sm font-medium text-black font-aftersick">Schedule</label>
                        <Select
                          onValueChange={(value) =>
                            setChiTietForm({ ...chiTietForm, maLichThi: parseInt(value) })
                          }
                          value={chiTietForm.maLichThi ? String(chiTietForm.maLichThi) : ""}
                        >
                          <SelectTrigger className="mt-1 border-black border w-full text-black font-goldplay">
                            <SelectValue placeholder="Select a schedule" />
                          </SelectTrigger>
                          <SelectContent>
                            {scheduleList.map((schedule) => {
                              const isFull = schedule.soThiSinhDK >= schedule.soThiSinhTD;
                              return (
                                <SelectItem
                                  key={schedule.maLichThi}
                                  value={schedule.maLichThi.toString()}
                                  className="font-goldplay"
                                  disabled={isFull}
                                >
                                  {`Exam: ${schedule.kyThi.tenKT} - Time: ${new Date(schedule.thoiGianThi).toLocaleString()} - Quantity: ${schedule.soThiSinhDK}/${schedule.soThiSinhTD}`}
                                  {isFull && " (Full)"}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                      <InputField label="Name" name="hoTenThiSinh" value={chiTietForm.hoTenThiSinh} onChange={handleChiTietChange} placeholder="Enter name" />
                      <InputField label="CID" name="cccd" value={chiTietForm.cccd} onChange={handleChiTietChange} placeholder="Enter CID" />
                      <InputField label="Date of Birth" name="ngaySinh" value={chiTietForm.ngaySinh} onChange={handleChiTietChange} placeholder="DD/MM/YYYY" />

                      <div className="flex justify-end pt-2">
                        <Button type="button" onClick={handleCompleteChiTiet} className="bg-[#FCE2A9] hover:bg-amber-300 text-black rounded px-4 py-2 text-sm font-aftersick">
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Button
                    type="button"
                    onClick={handleAddChiTiet}
                    className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-4 py-2 text-sm flex items-center gap-1 font-aftersick"
                  >
                    <Plus className="h-4 w-4" />
                    Add Info
                  </Button>
                )}

                <div className="flex justify-end pt-4">
                  <Button
                    type="button"
                    onClick={handleFinalComplete}
                    className="bg-[#FCE2A9] hover:bg-amber-300 text-black px-6 py-2 rounded font-aftersick"
                  >
                    Complete
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, name, value, onChange, placeholder }: any) {
  return (
    <div>
      <label className="text-sm font-medium text-black font-aftersick">{label}</label>
      <Input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-1 border-black border-1 w-full text-black font-goldplay"
      />
    </div>
  );
}