WEIGHBRIDGE-SCHEDULE v11 - OT CALCULATOR

Fitur:
- Jadwal roster 21 hari mulai 1 November 2026.
- Data 6 karyawan dan hari libur nasional 2026-2027.
- Catatan IZIN, SAKIT, ALPA, CUTI.
- Pencatatan lembur tambahan dan estimasi upah lembur.
- Backup data JSON, ekspor CSV, cetak/PDF.

Pengaturan kalkulator OT awal:
- Pola kerja: 6 hari / 40 jam.
- Upah pokok: Rp4.000.000 per bulan.
- Tunjangan tetap: Rp0.
- Tunjangan tidak tetap: Rp0.
- Tarif per jam: (upah pokok + tunjangan tetap) / 173.
- Istirahat 1 jam dianggap dibayar sesuai kebijakan perusahaan, sehingga tidak dikurangi dari durasi yang dicatat.

Penting:
- Catat hanya OT tambahan di luar jam shift terjadwal. DLS/NLS yang merupakan shift terjadwal 12 jam tidak otomatis dihitung sebagai OT oleh aplikasi.
- Pilih jenis hari dengan benar: hari kerja biasa atau istirahat mingguan/libur nasional.
- Hasil merupakan estimasi berdasarkan faktor pengali PP 35/2021, bukan penetapan payroll resmi. Periksa perjanjian kerja, jadwal istirahat, persetujuan lembur, dan ketentuan perusahaan.
- Batas umum lembur pada hari kerja adalah 4 jam per hari dan 18 jam per minggu; penerapan pada hari istirahat/libur memiliki ketentuan tersendiri.
- Data tersimpan lokal di perangkat. Lakukan backup JSON berkala.

Cara update GitHub:
1. Ekstrak ZIP.
2. Buka repository GitHub Lovmizu/weighbridge-schedule.
3. Upload/replace semua file dari ZIP ke root repository.
4. Commit changes ke branch main.
5. Setelah Pages selesai deploy, tutup tab aplikasi lalu buka ulang. Jika masih versi lama, bersihkan cache situs atau hapus lalu pasang ulang PWA.
