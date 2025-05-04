import prisma from "../src/lib/prisma";

async function main() {
  // QuyDinh
  await prisma.quyDinh.create({
    data: {
      soLuongToiThieu: 10,
      phiGiaHan: 50,
    },
  });

  // NhanVien
  await prisma.nhanVien.createMany({
    data: [
      { hoTen: "Nguyen Van A", sdt: "09876543210", email: "nva@example.com", matKhau: "password123", ngaySinh: new Date("1990-01-01"), diaChi: "123 Hanoi", chucVu: "reception" },
      { hoTen: "Tran Thi B", sdt: "09123456789", email: "ttb@example.com", matKhau: "password123", ngaySinh: new Date("1992-02-02"), diaChi: "456 Hanoi", chucVu: "accounting" },
      { hoTen: "Le Van C", sdt: "09333333333", email: "lvc@example.com", matKhau: "password123", ngaySinh: new Date("1988-03-03"), diaChi: "789 Hanoi", chucVu: "data entry" },
      { hoTen: "Pham Thi D", sdt: "09444444444", email: "ptd@example.com", matKhau: "password123", ngaySinh: new Date("1991-04-04"), diaChi: "101 Saigon", chucVu: "reception" },
      { hoTen: "Hoang Van E", sdt: "09555555555", email: "hve@example.com", matKhau: "password123", ngaySinh: new Date("1989-05-05"), diaChi: "202 Danang", chucVu: "accounting" },
    ],
  });

  // KhachHang
  await prisma.khachHang.createMany({
    data: [
      { tenKH: "Nguyen Thi F", loaiKH: "individual", sdt: "09666666666", email: "ntf@example.com", diaChi: "303 Hanoi" },
      { tenKH: "Cong Ty ABC", loaiKH: "corporate", sdt: "09777777777", email: "abc@example.com", diaChi: "404 Saigon" },
      { tenKH: "Tran Van G", loaiKH: "individual", sdt: "09888888888", email: "tvg@example.com", diaChi: "505 Hanoi" },
      { tenKH: "Cong Ty XYZ", loaiKH: "corporate", sdt: "09999999999", email: "xyz@example.com", diaChi: "606 Saigon" },
      { tenKH: "Le Thi H", loaiKH: "individual", sdt: "09000000000", email: "lth@example.com", diaChi: "707 Danang" },
      { tenKH: "Pham Van I", loaiKH: "individual", sdt: "09111111111", email: "pvi@example.com", diaChi: "808 Hanoi" },
      { tenKH: "Cong Ty DEF", loaiKH: "corporate", sdt: "09222222222", email: "def@example.com", diaChi: "909 Saigon" },
      { tenKH: "Hoang Thi J", loaiKH: "individual", sdt: "09333333334", email: "htj@example.com", diaChi: "1010 Hanoi" },
      { tenKH: "Nguyen Van K", loaiKH: "individualonious", sdt: "09444444445", email: "nvk@example.com", diaChi: "1111 Danang" },
      { tenKH: "Cong Ty GHI", loaiKH: "corporate", sdt: "09555555556", email: "ghi@example.com", diaChi: "1212 Saigon" },
    ],
  });

  // KyThi
  await prisma.kyThi.createMany({
    data: [
      { tenKT: "English Proficiency A1", muc: "english", phi: 80, moTa: "Basic English test" },
      { tenKT: "English Proficiency B1", muc: "english", phi: 120, moTa: "Intermediate English test" },
      { tenKT: "IT Fundamentals", muc: "information technology", phi: 100, moTa: "Basic IT skills" },
      { tenKT: "Advanced Programming", muc: "information technology", phi: 180, moTa: "Advanced coding skills" },
      { tenKT: "Business English", muc: "english", phi: 150, moTa: "English for business" },
    ],
  });

  // LichThi
  await prisma.lichThi.createMany({
    data: [
      { thoiGianThi: new Date("2025-06-01T09:00:00"), soThiSinhDK: 5, soThiSinhTD: 50, maKyThi: 1 },
      { thoiGianThi: new Date("2025-06-02T09:00:00"), soThiSinhDK: 4, soThiSinhTD: 40, maKyThi: 2 },
      { thoiGianThi: new Date("2025-06-03T09:00:00"), soThiSinhDK: 6, soThiSinhTD: 60, maKyThi: 3 },
      { thoiGianThi: new Date("2025-06-04T09:00:00"), soThiSinhDK: 7, soThiSinhTD: 50, maKyThi: 4 },
    ],
  });

  // PhongThi
  await prisma.phongThi.createMany({
    data: [
      { tenPhong: "Room A", sucChua: 30 },
      { tenPhong: "Room B", sucChua: 20 },
      { tenPhong: "Room C", sucChua: 40 },
      { tenPhong: "Room D", sucChua: 25 },
      { tenPhong: "Room E", sucChua: 35 },
    ],
  });

  // PhieuDangKy
  await prisma.phieuDangKy.createMany({
    data: [
      { ngayDangKy: new Date("2025-05-01"), trangThai: "unpaid", tongTien: 80, maKH: 1, maNVTN: 1 },
      { ngayDangKy: new Date("2025-05-02"), trangThai: "paid", tongTien: 120, maKH: 2, maNVTN: 2 },
      { ngayDangKy: new Date("2025-05-03"), trangThai: "unpaid", tongTien: 100, maKH: 3, maNVTN: 3 },
      { ngayDangKy: new Date("2025-05-04"), trangThai: "paid", tongTien: 180, maKH: 4, maNVTN: 4 },
      { ngayDangKy: new Date("2025-05-05"), trangThai: "cancel", tongTien: 150, maKH: 5, maNVTN: 5 },
      { ngayDangKy: new Date("2025-05-06"), trangThai: "unpaid", tongTien: 80, maKH: 6, maNVTN: 1 },
      { ngayDangKy: new Date("2025-05-07"), trangThai: "paid", tongTien: 120, maKH: 7, maNVTN: 2 },
      { ngayDangKy: new Date("2025-05-08"), trangThai: "unpaid", tongTien: 100, maKH: 8, maNVTN: 3 },
    ],
  });

  // ChiTietDangKy (điều chỉnh để phù hợp với 4 LichThi)
  await prisma.chiTietDangKy.createMany({
    data: [
      { hoTenThiSinh: "Nguyen Thi L", cccd: "123456789012", ngaySinh: new Date("2000-01-01"), maPDK: 1, maLichThi: 1 },
      { hoTenThiSinh: "Tran Van M", cccd: "123456789013", ngaySinh: new Date("1999-02-02"), maPDK: 1, maLichThi: 1 },
      { hoTenThiSinh: "Le Thi N", cccd: "987654321098", ngaySinh: new Date("2001-03-03"), maPDK: 2, maLichThi: 2 },
      { hoTenThiSinh: "Pham Van O", cccd: "987654321099", ngaySinh: new Date("1998-04-04"), maPDK: 2, maLichThi: 2 },
      { hoTenThiSinh: "Hoang Thi P", cccd: "456789123456", ngaySinh: new Date("2000-05-05"), maPDK: 3, maLichThi: 3 },
      { hoTenThiSinh: "Nguyen Van Q", cccd: "456789123457", ngaySinh: new Date("1997-06-06"), maPDK: 4, maLichThi: 4 },
      { hoTenThiSinh: "Tran Thi R", cccd: "789123456789", ngaySinh: new Date("1999-07-07"), maPDK: 4, maLichThi: 4 },
      { hoTenThiSinh: "Le Van S", cccd: "789123456790", ngaySinh: new Date("2002-08-08"), maPDK: 5, maLichThi: 3 },
    ],
  });

  // LichThi_PhongThi (điều chỉnh để phù hợp với 4 LichThi)
  await prisma.lichThi_PhongThi.createMany({
    data: [
      { maLichThi: 1, maPhongThi: 1, maNV: 1, soThiSinh: 5 },
      { maLichThi: 2, maPhongThi: 2, maNV: 2, soThiSinh: 4 },
      { maLichThi: 3, maPhongThi: 3, maNV: 3, soThiSinh: 6 },
      { maLichThi: 4, maPhongThi: 4, maNV: 4, soThiSinh: 7 },
    ],
  });

  // PhieuDuThi (điều chỉnh để phù hợp với 4 LichThi)
  await prisma.phieuDuThi.createMany({
    data: [
      { ngayPhatHanh: new Date("2025-05-10"), soBaoDanh: "LT01PT0101", trangThai: "issued", maCTDK: 1, maLichThi: 1, maPhongThi: 1 },
      { ngayPhatHanh: new Date("2025-05-11"), soBaoDanh: "LT01PT0102", trangThai: "issued", maCTDK: 2, maLichThi: 1, maPhongThi: 1 },
      { ngayPhatHanh: new Date("2025-05-12"), soBaoDanh: "LT02PT0201", trangThai: "issued", maCTDK: 3, maLichThi: 2, maPhongThi: 2 },
      { ngayPhatHanh: new Date("2025-05-13"), soBaoDanh: "LT02PT0202", trangThai: "issued", maCTDK: 4, maLichThi: 2, maPhongThi: 2 },
      { ngayPhatHanh: new Date("2025-05-14"), soBaoDanh: "LT03PT0301", trangThai: "issued", maCTDK: 5, maLichThi: 3, maPhongThi: 3 },
      { ngayPhatHanh: new Date("2025-05-15"), soBaoDanh: "LT04PT0401", trangThai: "issued", maCTDK: 6, maLichThi: 4, maPhongThi: 4 },
      { ngayPhatHanh: new Date("2025-05-16"), soBaoDanh: "LT04PT0402", trangThai: "issued", maCTDK: 7, maLichThi: 4, maPhongThi: 4 },
    ],
  });

  // ThanhToan
  await prisma.thanhToan.createMany({
    data: [
      { thoiGianTT: new Date("2025-05-02"), hinhThucTT: "cash", soTien: 80, giamGia: 0, maGiaoDich: 12345, trangThai: "processed", loaiPhieu: "registration", maPDK: 1, maNVKT: 2 },
      { thoiGianTT: new Date("2025-05-03"), hinhThucTT: "bank transfer", soTien: 120, giamGia: 0, maGiaoDich: 67890, trangThai: "processed", loaiPhieu: "registration", maPDK: 2, maNVKT: 2 },
      { thoiGianTT: new Date("2025-05-04"), hinhThucTT: "cash", soTien: 100, giamGia: 0, maGiaoDich: 23456, trangThai: "processed", loaiPhieu: "registration", maPDK: 3, maNVKT: 3 },
      { thoiGianTT: new Date("2025-05-05"), hinhThucTT: "bank transfer", soTien: 180, giamGia: 0, maGiaoDich: 78901, trangThai: "processed", loaiPhieu: "registration", maPDK: 4, maNVKT: 4 },
      { thoiGianTT: new Date("2025-05-06"), hinhThucTT: "cash", soTien: 150, giamGia: 0, maGiaoDich: 34567, trangThai: "processed", loaiPhieu: "registration", maPDK: 5, maNVKT: 5 },
      { thoiGianTT: new Date("2025-05-07"), hinhThucTT: "bank transfer", soTien: 80, giamGia: 0, maGiaoDich: 89012, trangThai: "processed", loaiPhieu: "registration", maPDK: 6, maNVKT: 1 },
    ],
  });

  // PhieuGiaHan
  await prisma.phieuGiaHan.createMany({
    data: [
      { tgThiCu: new Date("2025-06-01T09:00:00"), tgThiMoi: new Date("2025-06-15T09:00:00"), tgLapPhieu: new Date("2025-05-05"), phiGiaHan: 500000, lyDo: "Personal reasons", maPDT: 1 },
      { tgThiCu: new Date("2025-06-03T09:00:00"), tgThiMoi: new Date("2025-06-17T09:00:00"), tgLapPhieu: new Date("2025-05-06"), phiGiaHan: 500000, lyDo: "Health issues", maPDT: 5 },
    ],
  });

  // KetQuaThi
  await prisma.ketQuaThi.createMany({
    data: [
      { diemThi: 85.5, maPDT: 1, maNVNL: 1 },
      { diemThi: 90.0, maPDT: 2, maNVNL: 2 },
      { diemThi: 78.0, maPDT: 3, maNVNL: 3 },
      { diemThi: 92.5, maPDT: 4, maNVNL: 4 },
      { diemThi: 88.0, maPDT: 5, maNVNL: 5 },
      { diemThi: 80.0, maPDT: 6, maNVNL: 1 },
      { diemThi: 95.0, maPDT: 7, maNVNL: 2 },
    ],
  });

  // ChungChi
  await prisma.chungChi.createMany({
    data: [
      { ngayCap: new Date("2025-06-10"), trangThaiNhan: "received", maKQ: 1 },
      { ngayCap: new Date("2025-06-11"), trangThaiNhan: "not received", maKQ: 2 },
      { ngayCap: new Date("2025-06-12"), trangThaiNhan: "received", maKQ: 3 },
      { ngayCap: new Date("2025-06-13"), trangThaiNhan: "not received", maKQ: 4 },
      { ngayCap: new Date("2025-06-14"), trangThaiNhan: "received", maKQ: 5 },
      { ngayCap: new Date("2025-06-15"), trangThaiNhan: "not received", maKQ: 6 },
    ],
  });

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });