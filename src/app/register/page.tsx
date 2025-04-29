"use client";

import { useState, useEffect } from "react";
import { Search, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createRequest } from "@/lib/request";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
//import { set } from "react-hook-form";

type KH = {
  maKH: number;
  tenKH: string;
  email: string;
  sdt: string;
  diaChi: string;
  loaiKH: string;
};

export default function CustomerRegistrationPage() {
  const [formData, setFormData] = useState({
    tenKH: "",
    sdt: "",
    email: "",
    diaChi: "",
    loaiKH: "Tu Do", 
  });

  const [existingCustomerId, setExistingCustomerId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [summaryContent, setSummaryContent] = useState(""); 
  const [contentPdf, setPdf] = useState(""); 
  const [savedEmail, setSavedEmail] = useState("");
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
      _where: { tenKH: query },
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
      loaiKH: kh.loaiKH || "Tu Do",
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

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(chiTietForm.ngaySinh)) {
      toast.error("Date of Birth must follow YYYY-MM-DD format.");
      return;
    }

    setChiTietDangKyList([...chiTietDangKyList, chiTietForm]);
    setChiTietForm({ hoTenThiSinh: "", cccd: "", ngaySinh: "", maLichThi: "" });
    setIsAddingChiTiet(false);
  };

  const handleFinalComplete = async () => {
    if (!chiTietDangKyList.length) {
      toast.error("Please add at least one ChiTietDangKy.");
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
          toast.error("Create KhachHang failed");
          return;
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
  
      console.log(">>> tongTien:", tongTien);
  
      const phieuDangKy = await createRequest({
        _model: "PhieuDangKy",
        _method: "POST",
        ngayDangKy: new Date(),
        trangThai: "Chua thanh toan",
        tongTien,
        maKH: khachHang,
        maNVTN: 1,
      }) as { maPDK: number };
  
      if (!phieuDangKy) {
        toast.error("Fail create PhieuDangKy.");
        return;
      }
  
      for (const chiTiet of chiTietDangKyList) {
        await createRequest({
          _model: "ChiTietDangKy",
          _method: "POST",
          ...chiTiet,
          cccd: chiTiet.cccd,
          ngaySinh: new Date(chiTiet.ngaySinh),
          maLichThi: Number(chiTiet.maLichThi),
          maPDK: phieuDangKy.maPDK,
        });
      }
  
      toast.success("Registration successful");

      const summary = `<strong>Customer Information</strong><br/>` +
        `Name: ${formData.tenKH}<br/>` +
        `Phone: ${formData.sdt}<br/>` +
        `Email: ${formData.email}<br/>` +
        `Address: ${formData.diaChi}<br/><br/>` +
        `<strong>Details</strong><br/>` +
        chiTietDangKyList
          .map((chiTiet) => {
            const selectedSchedule = scheduleList.find(
              (schedule) => Number(schedule.maLichThi) === Number(chiTiet.maLichThi)
            );

            return (
              `Name: ${chiTiet.hoTenThiSinh}<br/>` +
              `CCCD: ${chiTiet.cccd}<br/>` +
              `Date of Birth: ${chiTiet.ngaySinh}<br/>` +
              (selectedSchedule
                ? `   Schedule: ${new Date(selectedSchedule.thoiGianThi).toLocaleString()} - ${selectedSchedule.kyThi.tenKT}<br/><br/>`
                : "")
            );
          })
          .join("\n");

          const pdfFormat = `Customer Information\n` +
          `Name: ${formData.tenKH}\n` +
          `Phone: ${formData.sdt}\n` +
          `Email: ${formData.email}\n` +
          `Address: ${formData.diaChi}\n\n` +
          `Details\n` +
          chiTietDangKyList
            .map((chiTiet) => {
              const selectedSchedule = scheduleList.find(
                (schedule) => Number(schedule.maLichThi) === Number(chiTiet.maLichThi)
              );

              return (
                `Name: ${chiTiet.hoTenThiSinh}\n` +
                `CCCD: ${chiTiet.cccd}\n` +
                `Date of Birth: ${chiTiet.ngaySinh}\n` +
                (selectedSchedule
                  ? `Schedule: ${new Date(selectedSchedule.thoiGianThi).toLocaleString()} - ${selectedSchedule.kyThi.tenKT}\n\n`
                  : "")
              );
            })
            .join("\n");
  
      const emailForSummary = formData.email;

      setSummaryContent(summary);
      setPdf(pdfFormat);
      setShowSummary(true);
      
      setChiTietDangKyList([]);
      setFormData({ tenKH: "", sdt: "", email: "", diaChi: "", loaiKH: "Tu Do" });
      setExistingCustomerId(null);
      
      setSavedEmail(emailForSummary);
      
    } catch (error) {
      console.error(error);
      toast.error("Error registration.");
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
    setFormData({ tenKH: "", sdt: "", email: "", diaChi: "", loaiKH: "Tu Do" });
  };

  const handleSendEmail = async () => {
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: savedEmail,
          content: contentPdf,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to send email");
      }
  
      toast.success("Email sent successfully");
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error("Failed to send email");
    }
  };  

  return (
    <div className="min-h-screen w-screen bg-amber-50">
      <div className="p-6">
        <div className="bg-[#FDFAE7] border-none">
          <div className="p-6">
  
            {showSummary ? (
              // khung tom tat
              <div className="space-y-6">
                <div>
                  <h4 className="text-orange-500 font-medium text-sm">ACCI</h4>
                  <h1 className="text-2xl font-semibold mt-1 text-black">
                    Register for <span className="text-orange-500">Individual Customer</span>
                  </h1>
                </div>
                <div
                  className="w-full h-96 p-4 rounded-md border border-[#F16F33] text-black bg-[#FCE2A9] overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: summaryContent }}
                />
                <div className="flex justify-end">
                <Button
                  className="bg-orange-500 hover:bg-orange-600 text-black rounded-full px-6 py-2"
                  onClick={handleSendEmail}
                >
                  Email
                </Button>
                </div>
              </div>
            ) : (
              // Form dang ky
              <div className="space-y-6">
                <div>
                  <h4 className="text-orange-500 font-medium text-sm">ACCI</h4>
                  <h1 className="text-2xl font-semibold mt-1 text-black">
                    Register for <span className="text-orange-500">Individual Customer</span>
                  </h1>
                </div>
  
                <div>
                  <p className="text-sm font-medium mb-2 text-black">Search</p>
                  <div className="relative">
                    <Input
                      className="pl-3 pr-10 py-2 rounded-4xl border-black border w-full text-black"
                      placeholder="Alice"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                    <Search className="absolute right-3 top-2.5 h-4 w-4" />
                    {searchResults.length > 0 && (
                      <ul className="absolute bg-white border rounded-md mt-1 w-full z-10 max-h-60 overflow-y-auto">
                        {searchResults.map((kh, index) => (
                          <li
                            key={index}
                            className="p-2 hover:bg-gray-100 text-black cursor-pointer"
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
                          className="absolute top-2 right-2 text-black hover:text-red-700"
                          onClick={() => {
                            const updatedList = chiTietDangKyList.filter((_, i) => i !== index);
                            setChiTietDangKyList(updatedList);
                          }}
                        >
                          <X />
                        </button>
                        <p><strong>Name:</strong> {chiTiet.hoTenThiSinh}</p>
                        <div className="flex justify-between">
                          <p><strong>CCCD:</strong> {chiTiet.cccd}</p>
                          <p><strong>Date of Birth:</strong> {chiTiet.ngaySinh}</p>
                        </div>
                        {selectedSchedule && (
                          <p><strong>Schedule:</strong> {`${new Date(selectedSchedule.thoiGianThi).toLocaleString()} - ${selectedSchedule.kyThi.tenKT}`}</p>
                        )}
                      </div>
                    );
                  })}
  
                  {isAddingChiTiet ? (
                    <div className="p-4 border-2 border-[#F16F33] rounded-md">
                      <div className="space-y-2">
                        <div>
                          <label className="text-sm font-medium text-black">Schedule</label>
                          <Select
                            onValueChange={(value) =>
                              setChiTietForm({ ...chiTietForm, maLichThi: parseInt(value) })
                            }
                            value={chiTietForm.maLichThi ? String(chiTietForm.maLichThi) : ""}
                          >
                            <SelectTrigger className="mt-1 border-black border w-full text-black">
                              <SelectValue placeholder="Select a schedule" />
                            </SelectTrigger>
                            <SelectContent>
                              {scheduleList.map((schedule) => (
                                <SelectItem key={schedule.maLichThi} value={schedule.maLichThi.toString()}>
                                  {`Exam: ${schedule.kyThi.tenKT} - Time: ${new Date(schedule.thoiGianThi).toLocaleString()} - Quantity: ${schedule.soThiSinhDK}/${schedule.soThiSinhTD}`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <InputField label="Name" name="hoTenThiSinh" value={chiTietForm.hoTenThiSinh} onChange={handleChiTietChange} placeholder="Enter name" />
                        <InputField label="CCCD" name="cccd" value={chiTietForm.cccd} onChange={handleChiTietChange} placeholder="Enter CCCD" />
                        <InputField label="Date of Birth" name="ngaySinh" value={chiTietForm.ngaySinh} onChange={handleChiTietChange} placeholder="Enter date of birth" />
  
                        <div className="flex justify-end pt-2">
                          <Button type="button" onClick={handleCompleteChiTiet} className="bg-[#FCE2A9] hover:bg-amber-300 text-black rounded px-4 py-2 text-sm">
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleAddChiTiet}
                      className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-4 py-2 text-sm flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      Add Info
                    </Button>
                  )}
  
                  <div className="flex justify-end pt-4">
                    <Button
                      type="button"
                      onClick={handleFinalComplete}
                      className="bg-[#FCE2A9] hover:bg-amber-300 text-black px-6 py-2 rounded"
                    >
                      Complete
                    </Button>
                  </div>
                </form>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, name, value, onChange, placeholder }: any) {
  return (
    <div>
      <label className="text-sm font-medium text-black">{label}</label>
      <Input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-1 border-black border-1 w-full text-black"
      />
    </div>
  );
}
