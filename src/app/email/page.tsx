"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { createRequest } from "@/lib/request";
import { useRouter } from "next/navigation";

export default function EmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [summaryContent, setSummaryContent] = useState("");
  const [contentPdf, setPdf] = useState("");
  const [savedEmail, setSavedEmail] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const maPDK = searchParams.get("maPDK");

      if (!maPDK) {
        toast.error("Invalid registration ID.");
        return;
      }

      try {
        // Lấy thông tin PhieuDangKy và KhachHang
        const phieuDangKy = await createRequest({
          _model: "PhieuDangKy",
          _method: "GET",
          _where: { maPDK: Number(maPDK) },
          _relation: ["khachHang"],
        }) as any[];

        if (!phieuDangKy || phieuDangKy.length === 0) {
          toast.error("Registration not found.");
          return;
        }

        const { khachHang } = phieuDangKy[0];
        const emailForSummary = khachHang.email;

        // Lấy danh sách ChiTietDangKy với quan hệ lichThi
        const chiTietDangKyList = await createRequest({
          _model: "ChiTietDangKy",
          _method: "GET",
          _where: { maPDK: Number(maPDK) },
          _relation: ["lichThi"],
        }) as any[];

        if (!chiTietDangKyList || chiTietDangKyList.length === 0) {
          toast.error("No registration details found.");
          return;
        }

        // Lấy thông tin kyThi từ lichThi
        const lichThiIds = chiTietDangKyList.map((chiTiet) => chiTiet.lichThi.maLichThi);
        const lichThiList = await createRequest({
          _model: "LichThi",
          _method: "GET",
          _where: { maLichThi: { in: lichThiIds } },
          _relation: ["kyThi"],
        }) as any[];

        // Kiểm tra lichThiList trước khi gọi .map()
        const lichThiMap = new Map<number, any>();
        if (lichThiList && Array.isArray(lichThiList)) {
          lichThiList.forEach((lt: any) => {
            lichThiMap.set(lt.maLichThi, lt);
          });
        } else {
          toast.error("No schedule information found.");
        }

        // Tạo summary
        const summary = `<strong>Customer Information</strong><br/>` +
          `Name: ${khachHang.tenKH}<br/>` +
          `Phone: ${khachHang.sdt}<br/>` +
          `Email: ${khachHang.email}<br/>` +
          `Address: ${khachHang.diaChi || "N/A"}<br/><br/>` +
          `<strong>Details</strong><br/>` +
          chiTietDangKyList
            .map((chiTiet: any) => {
              const lichThi = lichThiMap.get(chiTiet.lichThi.maLichThi);
              const kyThi = lichThi ? lichThi.kyThi : null;
              return (
                `Name: ${chiTiet.hoTenThiSinh}<br/>` +
                `CCCD: ${chiTiet.cccd}<br/>` +
                `Date of Birth: ${new Date(chiTiet.ngaySinh).toISOString().split('T')[0]}<br/>` +
                (lichThi && kyThi
                  ? `   Schedule: ${new Date(lichThi.thoiGianThi).toLocaleString()} - ${kyThi.tenKT}<br/><br/>`
                  : "   Schedule: Not available<br/><br/>")
              );
            })
            .join("\n");

        // Tạo pdfFormat
        const pdfFormat = `Customer Information\n` +
          `Name: ${khachHang.tenKH}\n` +
          `Phone: ${khachHang.sdt}\n` +
          `Email: ${khachHang.email}\n` +
          `Address: ${khachHang.diaChi || "N/A"}\n\n` +
          `Details\n` +
          chiTietDangKyList
            .map((chiTiet: any) => {
              const lichThi = lichThiMap.get(chiTiet.lichThi.maLichThi);
              const kyThi = lichThi ? lichThi.kyThi : null;
              return (
                `Name: ${chiTiet.hoTenThiSinh}\n` +
                `CCCD: ${chiTiet.cccd}\n` +
                `Date of Birth: ${new Date(chiTiet.ngaySinh).toISOString().split('T')[0]}\n` +
                (lichThi && kyThi
                  ? `Schedule: ${new Date(lichThi.thoiGianThi).toLocaleString()} - ${kyThi.tenKT}\n\n`
                  : `Schedule: Not available\n\n`)
              );
            })
            .join("\n");

        setSummaryContent(summary);
        setPdf(pdfFormat);
        setSavedEmail(emailForSummary);
      } catch (error) {
        console.error(error);
        toast.error("Error fetching registration details: " + (error.message || "Unknown error"));
      }
    };

    fetchData();
  }, [searchParams]);

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
      // Chuyển hướng về trang home sau 2 giây
      setTimeout(() => {
        router.push("/home");
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error("Failed to send email: " + (error.message || "Unknown error"));
    }
  };

  return (
    <div className="min-h-screen w-screen bg-amber-50 font-aftersick">
      <div className="p-6">
        <div className="bg-[#FDFAE7] border-none">
          <div className="p-6 space-y-6">
            <div>
              <h4 className="text-orange-500 font-medium text-sm font-aftersick">ACCI</h4>
              <h1 className="text-2xl font-semibold mt-1 text-black font-aftersick">
                Email Confirmation
              </h1>
            </div>
            <div
              className="w-full h-96 p-4 rounded-md border border-[#F16F33] text-black bg-[#FCE2A9] overflow-y-auto font-goldplay"
              dangerouslySetInnerHTML={{ __html: summaryContent }}
            />
            <div className="flex justify-end">
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-black rounded-full px-6 py-2 font-aftersick"
                onClick={handleSendEmail}
              >
                Email
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}