# My Work Schedule — Offline PWA

## Uji di Android
1. Ekstrak ZIP ini ke komputer atau hosting HTTPS.
2. Buka `index.html` melalui server lokal/HTTPS (PWA service worker tidak aktif pada `file://`).
3. Di Chrome Android, buka alamat aplikasi lalu pilih **Tambahkan ke layar utama / Install app**.
4. Setelah terpasang dan cache awal selesai, aplikasi dapat dibuka offline.

## Fitur awal
- 6 karyawan contoh (nama dapat diubah).
- 3 shift dengan jam yang dapat diatur.
- Generator jadwal, edit shift manual, OFF.
- OT per karyawan dan tanggal.
- Rekap, ekspor CSV (dapat dibuka di Excel), cetak ke PDF.
- Hari libur, backup JSON, penyimpanan lokal.
- Notifikasi browser bila izin diberikan dan aplikasi sedang aktif.

## Catatan aturan roster
Generator mengatur 2 hari OFF berurutan secara bergilir. Setiap hari ada personel inti untuk 3 shift dan personel tambahan sebagai backup/pendamping. Pola aktual perlu ditinjau sebelum dipakai operasional, karena pembagian kebutuhan orang per shift dapat berbeda di lapangan.

## Batasan versi prototipe
Ini PWA offline yang dapat dipasang dari Chrome Android, bukan APK native yang sudah ditandatangani. Pengingat browser berjalan saat aplikasi aktif; alarm terjadwal yang andal ketika aplikasi ditutup memerlukan implementasi Android native/Capacitor dan izin notifikasi lokal.
