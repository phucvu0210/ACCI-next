import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

    const parsedMaCC = parseInt(maCC);
    let parsedNgayCap = null;

    // Nếu trangThaiNhan là 'not-received', đặt ngayCap thành null
    if (trangThaiNhan !== 'not-received' && isNaN(ngayCap)) {
      parsedNgayCap = new Date(ngayCap);
      if (isNaN(parsedNgayCap.getTime())) {
        return NextResponse.json({ error: 'Invalid ngayCap' }, { status: 400 });
      }
    }

    if (isNaN(parsedMaCC)) {
      return NextResponse.json({ error: 'Invalid maCC' }, { status: 400 });
    }

    console.log(`Saving certificate data: maCC=${parsedMaCC}, ngayCap=${parsedNgayCap}, trangThaiNhan=${trangThaiNhan}`);

    await prisma.chungChi.upsert({
      where: { maKQ: parsedMaCC },
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