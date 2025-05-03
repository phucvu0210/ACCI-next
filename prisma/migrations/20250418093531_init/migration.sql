BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] INT NOT NULL IDENTITY(1,1),
    [phone] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [roleId] INT,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_phone_key] UNIQUE NONCLUSTERED ([phone])
);

-- CreateTable
CREATE TABLE [dbo].[Role] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Role_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Role_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[NhanVien] (
    [maNV] INT NOT NULL IDENTITY(1,1),
    [hoTen] NVARCHAR(1000) NOT NULL,
    [sdt] VARCHAR(11) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [matKhau] NVARCHAR(1000) NOT NULL,
    [ngaySinh] DATETIME2 NOT NULL,
    [diaChi] NVARCHAR(1000) NOT NULL,
    [chucVu] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [NhanVien_pkey] PRIMARY KEY CLUSTERED ([maNV]),
    CONSTRAINT [NhanVien_sdt_key] UNIQUE NONCLUSTERED ([sdt]),
    CONSTRAINT [NhanVien_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[KhachHang] (
    [maKH] INT NOT NULL IDENTITY(1,1),
    [tenKH] NVARCHAR(1000) NOT NULL,
    [loaiKH] NVARCHAR(1000) NOT NULL,
    [sdt] VARCHAR(11) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [diaChi] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [KhachHang_pkey] PRIMARY KEY CLUSTERED ([maKH]),
    CONSTRAINT [KhachHang_sdt_key] UNIQUE NONCLUSTERED ([sdt]),
    CONSTRAINT [KhachHang_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[PhieuDangKy] (
    [maPDK] INT NOT NULL IDENTITY(1,1),
    [ngayDangKy] DATETIME2 NOT NULL,
    [trangThai] NVARCHAR(1000) NOT NULL,
    [tongTien] INT NOT NULL,
    [maKH] INT NOT NULL,
    [maNVTN] INT NOT NULL,
    CONSTRAINT [PhieuDangKy_pkey] PRIMARY KEY CLUSTERED ([maPDK])
);

-- CreateTable
CREATE TABLE [dbo].[ChiTietDangKy] (
    [maCTDK] INT NOT NULL IDENTITY(1,1),
    [hoTenThiSinh] NVARCHAR(1000) NOT NULL,
    [cccd] VARCHAR(12) NOT NULL,
    [ngaySinh] DATETIME2 NOT NULL,
    [maPDK] INT NOT NULL,
    [maLichThi] INT NOT NULL,
    CONSTRAINT [ChiTietDangKy_pkey] PRIMARY KEY CLUSTERED ([maCTDK]),
    CONSTRAINT [ChiTietDangKy_cccd_key] UNIQUE NONCLUSTERED ([cccd])
);

-- CreateTable
CREATE TABLE [dbo].[KyThi] (
    [maKyThi] INT NOT NULL IDENTITY(1,1),
    [tenKT] NVARCHAR(1000) NOT NULL,
    [muc] NVARCHAR(1000) NOT NULL,
    [phi] INT NOT NULL,
    [moTa] NVARCHAR(1000),
    CONSTRAINT [KyThi_pkey] PRIMARY KEY CLUSTERED ([maKyThi])
);

-- CreateTable
CREATE TABLE [dbo].[LichThi] (
    [maLichThi] INT NOT NULL IDENTITY(1,1),
    [thoiGianThi] DATETIME2 NOT NULL,
    [soThiSinhDK] INT NOT NULL CONSTRAINT [LichThi_soThiSinhDK_df] DEFAULT 0,
    [soThiSinhTD] INT NOT NULL CONSTRAINT [LichThi_soThiSinhTD_df] DEFAULT 1,
    [maKyThi] INT NOT NULL,
    CONSTRAINT [LichThi_pkey] PRIMARY KEY CLUSTERED ([maLichThi])
);

-- CreateTable
CREATE TABLE [dbo].[PhongThi] (
    [maPhongThi] INT NOT NULL IDENTITY(1,1),
    [tenPhong] NVARCHAR(1000) NOT NULL,
    [sucChua] INT NOT NULL,
    CONSTRAINT [PhongThi_pkey] PRIMARY KEY CLUSTERED ([maPhongThi]),
    CONSTRAINT [PhongThi_tenPhong_key] UNIQUE NONCLUSTERED ([tenPhong])
);

-- CreateTable
CREATE TABLE [dbo].[LichThi_PhongThi] (
    [maLichThi] INT NOT NULL,
    [maPhongThi] INT NOT NULL,
    [maNV] INT NOT NULL,
    [soThiSinh] INT NOT NULL CONSTRAINT [LichThi_PhongThi_soThiSinh_df] DEFAULT 0,
    CONSTRAINT [LichThi_PhongThi_pkey] PRIMARY KEY CLUSTERED ([maLichThi],[maPhongThi])
);

-- CreateTable
CREATE TABLE [dbo].[PhieuDuThi] (
    [maPDT] INT NOT NULL IDENTITY(1,1),
    [ngayPhatHanh] DATETIME2,
    [soBaoDanh] VARCHAR(10),
    [trangThai] NVARCHAR(1000) NOT NULL,
    [maCTDK] INT NOT NULL,
    [maLichThi] INT,
    [maPhongThi] INT,
    CONSTRAINT [PhieuDuThi_pkey] PRIMARY KEY CLUSTERED ([maPDT]),
    CONSTRAINT [PhieuDuThi_maCTDK_key] UNIQUE NONCLUSTERED ([maCTDK])
);

-- CreateTable
CREATE TABLE [dbo].[ThanhToan] (
    [maTT] INT NOT NULL IDENTITY(1,1),
    [thoiGianTT] DATETIME2 NOT NULL,
    [hinhThucTT] NVARCHAR(1000) NOT NULL,
    [soTien] INT NOT NULL,
    [giamGia] FLOAT(53) NOT NULL CONSTRAINT [ThanhToan_giamGia_df] DEFAULT 0,
    [maGiaoDich] INT,
    [trangThai] NVARCHAR(1000) NOT NULL,
    [loaiPhieu] NVARCHAR(1000) NOT NULL,
    [maPDK] INT,
    [maPGH] INT,
    [maNVKT] INT NOT NULL,
    CONSTRAINT [ThanhToan_pkey] PRIMARY KEY CLUSTERED ([maTT])
);

-- CreateTable
CREATE TABLE [dbo].[PhieuGiaHan] (
    [maPGH] INT NOT NULL IDENTITY(1,1),
    [tgThiCu] DATETIME2 NOT NULL,
    [tgThiMoi] DATETIME2 NOT NULL,
    [tgLapPhieu] DATETIME2 NOT NULL,
    [phiGiaHan] INT NOT NULL,
    [lyDo] NVARCHAR(1000),
    [hinhAnhMinhChung] VARBINARY(max),
    [maPDT] INT NOT NULL,
    CONSTRAINT [PhieuGiaHan_pkey] PRIMARY KEY CLUSTERED ([maPGH])
);

-- CreateTable
CREATE TABLE [dbo].[KetQuaThi] (
    [maKQ] INT NOT NULL IDENTITY(1,1),
    [diemThi] INT NOT NULL,
    [maPDT] INT NOT NULL,
    [maNVNL] INT NOT NULL,
    CONSTRAINT [KetQuaThi_pkey] PRIMARY KEY CLUSTERED ([maKQ]),
    CONSTRAINT [KetQuaThi_maPDT_key] UNIQUE NONCLUSTERED ([maPDT])
);

-- CreateTable
CREATE TABLE [dbo].[ChungChi] (
    [maCC] INT NOT NULL IDENTITY(1,1),
    [ngayCap] DATETIME2,
    [trangThaiNhan] NVARCHAR(1000) NOT NULL,
    [maKQ] INT NOT NULL,
    CONSTRAINT [ChungChi_pkey] PRIMARY KEY CLUSTERED ([maCC]),
    CONSTRAINT [ChungChi_maKQ_key] UNIQUE NONCLUSTERED ([maKQ])
);

-- CreateTable
CREATE TABLE [dbo].[QuyDinh] (
    [maQD] INT NOT NULL IDENTITY(1,1),
    [soLuongToiThieu] INT NOT NULL,
    [phiGiaHan] INT NOT NULL,
    CONSTRAINT [QuyDinh_pkey] PRIMARY KEY CLUSTERED ([maQD])
);

-- AddForeignKey
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_roleId_fkey] FOREIGN KEY ([roleId]) REFERENCES [dbo].[Role]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[PhieuDangKy] ADD CONSTRAINT [PhieuDangKy_maKH_fkey] FOREIGN KEY ([maKH]) REFERENCES [dbo].[KhachHang]([maKH]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[PhieuDangKy] ADD CONSTRAINT [PhieuDangKy_maNVTN_fkey] FOREIGN KEY ([maNVTN]) REFERENCES [dbo].[NhanVien]([maNV]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ChiTietDangKy] ADD CONSTRAINT [ChiTietDangKy_maPDK_fkey] FOREIGN KEY ([maPDK]) REFERENCES [dbo].[PhieuDangKy]([maPDK]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ChiTietDangKy] ADD CONSTRAINT [ChiTietDangKy_maLichThi_fkey] FOREIGN KEY ([maLichThi]) REFERENCES [dbo].[LichThi]([maLichThi]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[LichThi] ADD CONSTRAINT [LichThi_maKyThi_fkey] FOREIGN KEY ([maKyThi]) REFERENCES [dbo].[KyThi]([maKyThi]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[LichThi_PhongThi] ADD CONSTRAINT [LichThi_PhongThi_maLichThi_fkey] FOREIGN KEY ([maLichThi]) REFERENCES [dbo].[LichThi]([maLichThi]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[LichThi_PhongThi] ADD CONSTRAINT [LichThi_PhongThi_maPhongThi_fkey] FOREIGN KEY ([maPhongThi]) REFERENCES [dbo].[PhongThi]([maPhongThi]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[LichThi_PhongThi] ADD CONSTRAINT [LichThi_PhongThi_maNV_fkey] FOREIGN KEY ([maNV]) REFERENCES [dbo].[NhanVien]([maNV]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[PhieuDuThi] ADD CONSTRAINT [PhieuDuThi_maCTDK_fkey] FOREIGN KEY ([maCTDK]) REFERENCES [dbo].[ChiTietDangKy]([maCTDK]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[PhieuDuThi] ADD CONSTRAINT [PhieuDuThi_maLichThi_maPhongThi_fkey] FOREIGN KEY ([maLichThi], [maPhongThi]) REFERENCES [dbo].[LichThi_PhongThi]([maLichThi],[maPhongThi]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ThanhToan] ADD CONSTRAINT [ThanhToan_maPDK_fkey] FOREIGN KEY ([maPDK]) REFERENCES [dbo].[PhieuDangKy]([maPDK]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ThanhToan] ADD CONSTRAINT [ThanhToan_maPGH_fkey] FOREIGN KEY ([maPGH]) REFERENCES [dbo].[PhieuGiaHan]([maPGH]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ThanhToan] ADD CONSTRAINT [ThanhToan_maNVKT_fkey] FOREIGN KEY ([maNVKT]) REFERENCES [dbo].[NhanVien]([maNV]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[PhieuGiaHan] ADD CONSTRAINT [PhieuGiaHan_maPDT_fkey] FOREIGN KEY ([maPDT]) REFERENCES [dbo].[PhieuDuThi]([maPDT]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[KetQuaThi] ADD CONSTRAINT [KetQuaThi_maPDT_fkey] FOREIGN KEY ([maPDT]) REFERENCES [dbo].[PhieuDuThi]([maPDT]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[KetQuaThi] ADD CONSTRAINT [KetQuaThi_maNVNL_fkey] FOREIGN KEY ([maNVNL]) REFERENCES [dbo].[NhanVien]([maNV]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ChungChi] ADD CONSTRAINT [ChungChi_maKQ_fkey] FOREIGN KEY ([maKQ]) REFERENCES [dbo].[KetQuaThi]([maKQ]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
