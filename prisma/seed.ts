import prisma from "../src/lib/prisma";

async function main() {
  const director = await prisma.role.upsert({
    where: { name: 'director' },
    update: {},
    create: { name: 'director' },
  });

  await prisma.user.upsert({
    where: { phone: '0987654321' },
    update: {},
    create: {
      phone: '0987654321',
      password: '123456',
      roleId: director.id,
    },
  })

  await prisma.khachHang.create({
    data: {
      tenKH: 'Nguyen Van A',
      loaiKH: 'Tu Do',
      sdt: '0901234567',
      email: 'test@example.com',
      diaChi: '123 Le Lai, District 1, HCM',
    },
  })

  await prisma.nhanVien.create({
    data: {
      hoTen: 'Nguyen Van B',
      sdt: '0912345678',
      email: 'abc@gmail.com',
      matKhau: '123456',
      ngaySinh: new Date('1990-01-01'),
      diaChi: '456 Nguyen Trai, District 5, HCM',
      chucVu: 'Tiep Nhan'
    },
  })

  await prisma.kyThi.create({
    data: {
      tenKT: 'IELTS',
      muc: 'Ngoai Ngu',
      phi: 200000,
      moTa: 'Ky thi Anh Van'
    },
  })

  await prisma.lichThi.create({
    data: {
      thoiGianThi: new Date('2023-10-01T09:00:00Z'),
      soThiSinhDK: 30,
      soThiSinhTD: 30,
      maKyThi: 1
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('SEED ERROR:', e); // <--- Thêm dòng này
    await prisma.$disconnect();
    process.exit(1);
  });
