'use client'

import { useEffect, useState } from 'react'
import { createRequest } from '@/lib/request'
import ExamCard from '@/components/ui/examCard3'
import ExamCardDetail from '@/components/ui/examCard4'
import '@/app/style/font.css'
import { Input } from '@/components/ui/input'

const aftersick = { fontFamily: '"Aftersick DEMO", Arial, sans-serif' }
const goldplay = { fontFamily: 'Goldplay, Arial, sans-serif' }

interface ExamCardData {
  name: string;
  exam: string;
  issueDate: string;
  id: string | number;
}

export default function TraCuuPhieuDuThi () {
  const [phieuList, setPhieuList] = useState<ExamCardData[]>([])
  const [filteredPhieuList, setFilteredPhieuList] = useState<ExamCardData[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCard, setSelectedCard] = useState<ExamCardData | null>(null)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    const lower = query.toLowerCase()
    const matched = phieuList.filter(p =>
      p.name.toLowerCase().includes(lower) ||
      p.exam.toLowerCase().includes(lower),
    )
    setFilteredPhieuList(matched)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await createRequest({
          _model: 'PhieuDuThi',
          _method: 'GET',
          _relation: ['chiTietDangKy', 'ketQuaThi'],
          _where: {
            ketQuaThi: {
              isNot: null,
            },
          },
        })

        if (Array.isArray(result)) {
          const filtered: any[] = []

          for (const phieu of result) {
            const maKQ = phieu.ketQuaThi?.maKQ
            const maLichThi = phieu.chiTietDangKy?.maLichThi
            if (!maKQ || !phieu.ketQuaThi || !maLichThi) {
              continue
            }

            const [cc, lichThi, giaHan] = await Promise.all([
              createRequest({
                _model: 'ChungChi',
                _method: 'GET',
                _where: { maKQ },
              }),
              createRequest({
                _model: 'LichThi',
                _method: 'GET',
                _relation: ['kyThi'],
                _where: { maLichThi },
              }),
            ])

            if (Array.isArray(cc) && cc.length > 0) {
              const tenKyThi = lichThi?.[0]?.kyThi?.tenKT || '---'
              filtered.push({
                ...phieu,
                name: phieu.chiTietDangKy?.hoTenThiSinh || 'Không rõ tên',
                exam: tenKyThi,
                issueDate: cc[0].ngayCap
                  ? new Date(cc[0].ngayCap).toLocaleDateString('vi-VN')
                  : '--',
                id: phieu.soBaoDanh || phieu.maPDT,
                giaHan,
              })
            }
          }
          console.log(filtered)
          setPhieuList(filtered)
          setFilteredPhieuList(filtered)
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu phiếu dự thi:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <div
      className="min-h-screen w-full bg-[#fef6e6] text-gray-900 flex flex-col"
      style={goldplay}
    >
      <div className="w-full px-4 py-4 flex-1 flex justify-center">
        <div className="w-full max-w-[100%] px-4 py-2">
          <h1 className="text-4xl text-[#F16F33] mb-2" style={aftersick}>
            ACCI
          </h1>
          <h2 className="text-3xl mb-4" style={aftersick}>
            Certificate
          </h2>

          {!selectedCard && (
            <>
              <div>
                <p
                  className="text-sm font-medium mb-2 text-black font-aftersick">Search</p>
                <div className="relative">
                  <Input
                    className="pl-3 pr-10 py-2 rounded-4xl border-black border w-full text-black font-goldplay"
                    placeholder="Search by name or exam"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="h-10 w-6"/>
              {filteredPhieuList.length > 0 && (
                <div className="w-full mb-6 space-y-4 cursor-pointer">
                  {filteredPhieuList.map((phieu, index) => (
                    <div key={index} onClick={() => setSelectedCard(phieu)}>
                      <ExamCard data={phieu}/>
                    </div>
                  ))}
                </div>
              )}

              {filteredPhieuList.length === 0 && (
                <p className="text-center text-gray-500 mt-6">Không có dữ liệu
                  chứng chỉ.</p>
              )}
            </>
          )}

          {selectedCard && (
            <div className="space-y-4">
              <ExamCardDetail data={selectedCard}/>
              <div className="flex w-full gap-4 justify-end">
                <button
                  className="px-4 py-2 rounded-md bg-gray-400 cursor-pointer"
                  onClick={() => setSelectedCard(null)}
                >
                  Back
                </button>
                <button
                  className="px-4 py-2 rounded-md bg-orange-500 text-white  cursor-pointer"
                  onClick={() =>
                    window.location.href = `/certificate?maPDT=${selectedCard.maPDT}`
                  }
                >
                  Select
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}