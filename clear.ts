import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearDatabase() {
  try {
    // Bảng phụ thuộc cuối cùng xóa trước
    await prisma.chungChi.deleteMany();
    await prisma.ketQuaThi.deleteMany();
    await prisma.phieuGiaHan.deleteMany();
    await prisma.phieuDuThi.deleteMany();
    await prisma.chiTietDangKy.deleteMany();
    await prisma.thanhToan.deleteMany();
    await prisma.lichThi_PhongThi.deleteMany();
    await prisma.phieuDangKy.deleteMany();

    await prisma.lichThi.deleteMany();
    await prisma.phongThi.deleteMany();
    await prisma.kyThi.deleteMany();

    await prisma.khachHang.deleteMany();
    await prisma.nhanVien.deleteMany();

    await prisma.user.deleteMany();
    await prisma.role.deleteMany();

    await prisma.quyDinh.deleteMany();

    console.log('✅ Toàn bộ dữ liệu đã được xóa sạch.');
  } catch (error) {
    console.error('❌ Lỗi khi xóa dữ liệu:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearDatabase();
