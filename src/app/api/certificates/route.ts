import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface PhieuDuThiData {
  name: string;
  cid: string;
  exam: string;
  registerType: string;
  issueDate: string;
  id: string;
  room: string;
  examResult: string;
  PhieuDuThiIssueDate: string;
  PhieuDuThiStatus: string;
  maPDT: string;
  maKH: string;
  maCTDK: string;
  maKyThi: string;
  maLichThi: string;
  maPhongThi: string;
  maKQ: string;
  maCC: string;
}

export async function GET(request: Request) {
  try {
    console.log('API /PhieuDuThis called');
    const { searchParams } = new URL(request.url);

    const maPDT = searchParams.get('maPDT');

    let PhieuDuThi;

    if (maPDT) {
      PhieuDuThi = await prisma.phieuDuThi.findUnique({
        where: { maPDT: parseInt(maPDT)},
        include: {
          chiTietDangKy: {
            include: {
              phieuDangKy: {
                include: {
                  khachHang: true,
                }
              }
            }
          },
          ketQuaThi: {
            include: {
              chungChi: true
            }
          },
          lichThiPhongThi: {
            include: {
              lichThi: {
                include: {
                  kyThi: true,
                }
              },
              phongThi: true
            }
          }
        }
      });
    } else {
      return NextResponse.json({ error: 'Missing or unsupported query parameters' }, { status: 400 });
    }

    if (!PhieuDuThi) {
      return NextResponse.json({ error: 'No data found' }, { status: 404 });
    }

    return NextResponse.json(PhieuDuThi);
  } catch (error) {
    console.error('Error fetching PhieuDuThi data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  try {
    const { maCC, ngayCap, trangThaiNhan } = await request.json();

    if (!maCC) {
      return NextResponse.json({ error: 'maCC is required' }, { status: 400 });
    }

    // Chuyển đổi giá trị trước khi lưu vào database
    const parsedMaCC = parseInt(maCC);  // Chuyển maCC từ string thành number (Int)
    const parsedNgayCap = new Date(ngayCap);  // Chuyển ngayCap từ string thành Date

    if (isNaN(parsedMaCC)) {
      return NextResponse.json({ error: 'Invalid maCC' }, { status: 400 });
    }
    
    if (isNaN(parsedNgayCap.getTime())) {
      return NextResponse.json({ error: 'Invalid ngayCap' }, { status: 400 });
    }

    console.log(`Saving certificate data: maCC=${parsedMaCC}, ngayCap=${parsedNgayCap}, trangThaiNhan=${trangThaiNhan}`);

    // Thực hiện upsert hoặc insert vào database
    await prisma.chungChi.upsert({
      where: { maKQ: parsedMaCC },  // Giả sử maCC là maKQ trong schema
      update: {
        ngayCap: parsedNgayCap,
        trangThaiNhan,
      },
      create: {
        maKQ: parsedMaCC,
        ngayCap: parsedNgayCap,
        trangThaiNhan,
      },
    });

    return NextResponse.json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving certificate data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}