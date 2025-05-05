'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup } from '@/components/ui/radioGroup';
import ExamCard from '@/components/ui/examCard2';
import { toast } from "sonner";
import '@/app/style/font.css';

const aftersick = { fontFamily: '"Aftersick DEMO", Arial, sans-serif' };
const goldplay = { fontFamily: 'Goldplay, Arial, sans-serif' };

const defaultParams = {
  maPDT: '2',
  maCTDK: '222',
  maCC: '1111',
  maKQ: '1111',
  maKH: '2',
  maKyThi: '211',
  maLichThi: '10',
  maPhongThi: '3',
};

interface ExamCardData {
  name: string;
  cid: string;
  exam: string;
  registerType: string;
  issueDate: string;
  id: string;
  room: string;
  examResult: string;
  certificateIssueDate: string;
  certificateStatus: string;
  maPDT: string;
  maKH: string;
  maCTDK: string;
  maKyThi: string;
  maLichThi: string;
  maPhongThi: string;
  maKQ: string;
  maCC: string;
}

export default function ReceiveCertificatePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [examCardData, setExamCardData] = useState<ExamCardData | null>(null);
  const [result, setResult] = useState('');
  const [receivedDate, setReceivedDate] = useState('');
  const [certificate, setCertificate] = useState('no');
  const [status, setStatus] = useState('not received');
  const [maCC, setMaCC] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = Object.fromEntries(
      Object.entries(defaultParams).map(([key, value]) => [
        key,
        searchParams.get(key) || value,
      ])
    ) as typeof defaultParams;

    fetchExamCardData(params);
  }, [searchParams]);

  async function fetchExamCardData(params: typeof defaultParams) {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams(params).toString();
      const response = await fetch(`/api/certificates?${queryParams}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch exam card data');
      }

      const data = await response.json();
      const normalized = normalizeExamCardData(data);

      setExamCardData(normalized);
      setResult(normalized.examResult !== 'N/A' ? normalized.examResult : '');
      setReceivedDate(
        normalized.certificateIssueDate !== 'N/A'
          ? normalized.certificateIssueDate
          : ''
      );
      setCertificate(
        normalized.certificateIssueDate !== 'N/A' || normalized.certificateStatus !== 'N/A'
          ? 'yes'
          : 'no'
      );
      setStatus(
        normalized.certificateStatus !== 'N/A' ? normalized.certificateStatus : 'not received'
      );
      setMaCC(normalized.maCC);
    } catch (err: any) {
      setError(err.message);
      setExamCardData(null);
    } finally {
      setLoading(false);
    }
  }

  function normalizeExamCardData(data: any): ExamCardData {
    const formatDateTime = (isoString: string | undefined): string => {
      if (!isoString) return 'N/A';
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return 'N/A';
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    const formatDate = (isoString: string | undefined): string => {
      if (!isoString) return 'N/A';
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return 'N/A';
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    return {
      name: data.chiTietDangKy?.phieuDangKy?.khachHang?.tenKH || 'N/A',
      cid: data.chiTietDangKy?.cccd || 'N/A',
      exam: `${formatDateTime(data.lichThiPhongThi?.lichThi?.thoiGianThi)
      } - ${data.lichThiPhongThi?.lichThi?.kyThi?.tenKT || 'N/A'}` || 'N/A',
      registerType: data.chiTietDangKy?.phieuDangKy?.khachHang?.loaiKH || 'N/A',
      issueDate: formatDateTime(data.ngayPhatHanh) || 'N/A',
      id: data.soBaoDanh || 'N/A',
      room: data.lichThiPhongThi?.phongThi?.tenPhong || 'N/A',
      examResult: data.ketQuaThi?.diemThi || 'N/A',
      certificateIssueDate: formatDate(data.ketQuaThi?.chungChi?.ngayCap) || 'N/A',
      certificateStatus: data.ketQuaThi?.chungChi?.trangThaiNhan || 'N/A',
      maPDT: data.maPDT?.toString() || 'N/A',
      maKH: data.chiTietDangKy?.phieuDangKy?.maKH?.toString() || 'N/A',
      maCTDK: data.chiTietDangKy?.maCTDK?.toString() || 'N/A',
      maKyThi: data.chiTietDangKy?.lichThi?.kyThi?.maKyThi?.toString() || 'N/A',
      maLichThi: data.chiTietDangKy?.lichThi?.maLichThi?.toString() || 'N/A',
      maPhongThi: data.lichThiPhongThi?.phongThi?.maPhongThi?.toString() || 'N/A',
      maKQ: data.ketQuaThi?.maKQ?.toString() || 'N/A',
      maCC: data.ketQuaThi?.chungChi?.maCC?.toString() || 'N/A',
    };
  }

  const handleConfirm = async () => {
    try {
      if (!maCC || maCC === 'N/A') {
        throw new Error('maCC is required');
      }

      const [day, month, year] = receivedDate.split('/');
      const formattedDate = receivedDate ? `${year}-${month}-${day}` : null;

      if (status === 'received' && !receivedDate) {
        toast.error("Invalid received date");
        return;
      }

      const payload = {
        maCC,
        ngayCap: formattedDate,
        trangThaiNhan: String(status),
      };

      const response = await fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save data');
      }

      toast.success("Data saved successfully!");
      setTimeout(() => {
        router.push('/home');
      }, 1000);
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FDFAE7] text-gray-900 flex flex-col" style={goldplay}>
      <div className="w-full px-4 py-4 flex-1 flex justify-center">
        <div className="w-full max-w-[100%] px-4 py-2">
          <h1 className="text-4xl text-[#F16F33] mb-2" style={aftersick}>
            ACCI
          </h1>
          <h2 className="text-3xl mb-4" style={aftersick}>
            Certificate
          </h2>

          {loading && <div className="text-center">Loading...</div>}
          {error && (
            <div className="text-orange-500 text-center p-4 bg-orange-100 rounded-md">Error: {error}</div>
          )}
          {!loading && !error && !examCardData && (
            <div className="text-center p-4 bg-yellow-100 rounded-md">No data available</div>
          )}

          {examCardData && (
            <>
              <div className="w-full mb-6">
                <ExamCard data={examCardData} />
              </div>
              <div className="mb-6 w-full">
                <label className="block mb-1 opacity-50" style={aftersick}>
                  Result
                </label>
                <Input
                  value={result}
                  onChange={() => { }}
                  className="w-full h-12 border-1 border-black rounded opacity-50"
                  disabled={true}
                />
              </div>
              <div className="mb-6 w-full">
                <label className="block mb-1" style={aftersick}>
                  Received Date
                </label>
                <Input
                  type="text"
                  value={receivedDate}
                  onChange={(e) => setReceivedDate(e.target.value)}
                  placeholder="dd/mm/yyyy"
                  className="w-full h-12 border-1 border-black rounded"
                  style={goldplay}
                  disabled={status === 'not received'}
                />
              </div>
              <div className="w-full mb-6">
                <RadioGroup
                  title="Certificate"
                  name="certificate"
                  value={certificate}
                  onChange={() => { }}
                  options={[
                    { label: 'Yes', value: 'yes' },
                    { label: 'No', value: 'no' },
                  ]}
                  className="opacity-50 pointer-events-none"
                  disabled={true}
                />
              </div>
              <div className="w-full mb-6">
                <RadioGroup
                  title="Certificate Status"
                  name="certificateStatus"
                  value={status}
                  onChange={setStatus}
                  options={[
                    { label: 'Received', value: 'received' },
                    { label: 'Not received', value: 'not received' },
                  ]}
                />
              </div>
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={handleConfirm}
                  className="w-26 h-12 bg-[#fce2a9] text-black hover:bg-[#eec38f] px-6 py-2 rounded text-base"
                  style={{ ...aftersick, fontWeight: 400, borderColor: '#F16F33' }}
                >
                  Confirm
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}