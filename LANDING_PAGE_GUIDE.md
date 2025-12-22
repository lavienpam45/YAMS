# 🎯 YAMS Landing Page - Usage Guide

## 📌 Quick Start

### Untuk User Baru (Belum Login)
1. Akses halaman **`/`** (root page)
2. Tampilan **Landing Page** dengan:
   - Navbar dengan logo dan menu
   - Hero section dengan gambar kampus
   - Tombol **"Mulai Sekarang"** (untuk login)
   - Tombol **"Pelajari Fitur"** (scroll ke fitur section)

3. Bisa scroll down untuk lihat:
   - **Fitur Unggulan** - 4 kartu feature
   - **Mengapa Memilih YAMS** - 3 benefit points
   - **Pertanyaan Umum** - 4 FAQ items
   - **Siap Memulai?** - Green CTA section

### Untuk User Sudah Login
1. Akses halaman **`/`**
2. Tampilan **Landing Page** dengan:
   - Tombol **"Buka Dashboard →"** (direct to dashboard)
   - Tidak ada menu navigation (hanya untuk non-login users)

3. Atau akses langsung ke **`/dashboard`**

---

## 🎨 Visual Components

### Navbar
```
[Y YAMS]     [Fitur] [Tentang] [FAQ]     [Masuk] [Daftar]

atau jika sudah login:

[Y YAMS]     [Fitur] [Tentang] [FAQ]     [Dashboard]
```

**Warna:** White background dengan subtle green bottom border

**Responsive:** Menu links tersembunyi di mobile

---

### Hero Section
```
┌──────────────────────────┬──────────────┐
│ Kelola Aset Kampus      │              │
│ dengan Cerdas & Akurat  │  Kampus IMG  │
│                         │              │
│ [Mulai Sekarang] [Belajari]          │
└──────────────────────────┴──────────────┘
```

**Gambar:** `/public/images/kampus-yarsi.jpg`
**Ukuran:** Responsive (100% width on mobile, 50% on desktop)

---

### Feature Cards
```
Fitur Unggulan YAMS

[Icon] Penyusutan Otomatis  [Icon] Pelacakan Lokasi
[Desc]                     [Desc]

[Icon] Laporan Akurat      [Icon] Akses Terkontrol
[Desc]                     [Desc]
```

**Cards:** 4 column grid (responsive jadi 2 col on tablet, 1 on mobile)

---

### About/Why Section
```
Mengapa Memilih YAMS?

[Benefits List]         [Visualization Placeholder]
• Mudah Digunakan
• Perhitungan Presisi
• Support Terpercaya
```

---

### FAQ Section
```
Pertanyaan Umum

[Card] Apa itu YAMS?
[Card] Siapa yang bisa menggunakan?
[Card] Bagaimana cara login?
[Card] Apakah data saya aman?
```

---

### CTA Section
```
┌─────────────────────────────────────┐
│ Siap Memulai?                       │
│ Kelola aset dengan lebih efisien     │
│                                     │
│ [Masuk Sekarang] [Hubungi Admin]    │
└─────────────────────────────────────┘
```

**Background:** Solid green #0C7E46

---

### Footer
```
YAMS                  Kontak           Universitas
Sistem Manajemen     📧 support@      Universitas Yarsi
Aset Universitas     yarsi.ac.id      Jakarta
Yarsi
```

---

## 🔗 Navigation Links

| Link | Destination | Show When |
|------|-------------|-----------|
| Fitur | `#fitur` (scroll) | All non-login users |
| Tentang | `#tentang` (scroll) | All non-login users |
| FAQ | `#faq` (scroll) | All non-login users |
| Mulai Sekarang | `/login` | Non-login users |
| Pelajari Fitur | `#fitur` (scroll) | Non-login users |
| Buka Dashboard | `/dashboard` | Authenticated users |
| Masuk | `/login` | CTA section, non-login |
| Hubungi Admin | `/register` | CTA section, non-login |
| Pengaturan Profil | `/settings` | Header dropdown, all users |
| Keluar | `POST /logout` | Header dropdown, all users |

---

## 🎨 Warna & Styling

### Color Palette
```css
Primary: #0C7E46           /* Hijau Yarsi */
Light BG: rgba(12,126,70,0.05)  /* Very light */
Medium BG: rgba(12,126,70,0.1)  /* Light */
Text Primary: #1F2937     /* Gray-800 */
Text Muted: #6B7280       /* Gray-500 */
White: #FFFFFF            /* Background */
```

### Typography
```
H1: 48px-72px (Hero title)
H2: 36px (Section titles)
H3: 18px-24px (Card titles)
Body: 16px (Readable)
Small: 14px (Descriptions)

Font: System default (sans-serif)
```

---

## 📱 Responsive Breakpoints

### Mobile (< 768px)
- Navbar: Full width, menu links hidden
- Hero: 1 column stacked (text above image)
- Cards: 1 per row
- Font sizes: Reduced for mobile
- Padding: Increased for touch targets

### Tablet (768px - 1024px)
- Navbar: Full width
- Hero: 1-2 column (toggles)
- Cards: 2 per row
- Sidebar: Visible but narrower

### Desktop (> 1024px)
- Full width layouts
- Multi-column grids
- All features visible
- Full sidebar visible

---

## ✨ Interactive Elements

### Hover Effects
- **Links:** Color change to #0C7E46
- **Cards:** Lift up slightly (-translate-y-1)
- **Buttons:** Opacity/color transition
- **Sidebar items:** Background color when active

### Smooth Interactions
- **Page scroll:** Smooth to anchors
- **Transitions:** 200-300ms duration
- **Animations:** CSS-only (no heavy JS)

---

## 🔒 Access Control

| Page | Accessible By | Redirect To |
|------|---------------|-------------|
| `/` (Welcome) | Everyone | N/A |
| `/login` | Non-authenticated | Dashboard |
| `/dashboard` | Authenticated | N/A |
| `/assets` | Authenticated Admin+ | N/A |
| `/settings` | Authenticated | N/A |

---

## 📸 Image Assets

| Asset | Path | Size | Format |
|-------|------|------|--------|
| Kampus Yarsi | `/public/images/kampus-yarsi.jpg` | ~1920x1280px | JPG |
| Avatar Default | `/public/images/default-avatar.png` | 200x200px | PNG |

**Note:** Pastikan file `kampus-yarsi.jpg` ada di `public/images/`

---

## 🚀 Performance Tips

✅ **Lazy Load Images** - Kampus image hanya load when needed
✅ **Minimal JS** - Mostly CSS-based styling
✅ **Optimized CSS** - Tailwind purges unused styles
✅ **Caching** - Browser caches static assets
✅ **CDN Ready** - Can serve from CDN

---

## 🐛 Troubleshooting

### Gambar kampus tidak muncul?
1. Pastikan file ada: `public/images/kampus-yarsi.jpg`
2. Clear browser cache: Ctrl+Shift+Delete
3. Check browser console untuk error messages

### Menu tidak responsive?
1. Pastikan viewport meta tag ada di HTML
2. Check browser zoom (harus 100%)
3. Test di berbagai devices

### Warna berbeda dari expected?
1. Clear CSS cache
2. Rebuild: `npm run build`
3. Check Tailwind config untuk color overrides

### Scroll smooth tidak jalan?
1. Check browser compatibility
2. Pastikan JavaScript enabled
3. Test di different browsers

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `UI_IMPROVEMENTS.md` | Detailed technical changes |
| `FRONTEND_REDESIGN_SUMMARY.md` | Visual summary & features |
| `LANDING_PAGE_GUIDE.md` | This file - usage guide |

---

## ✅ Checklist untuk Launch

- [ ] Gambar kampus-yarsi.jpg sudah ada
- [ ] Warna tema #0C7E46 terlihat konsisten
- [ ] Landing page responsive di mobile
- [ ] Semua links berfungsi dengan baik
- [ ] FAQ content sesuai dengan kebutuhan
- [ ] Email support@yarsi.ac.id aktif
- [ ] Menu smooth scroll berfungsi
- [ ] Browser compatibility tested
- [ ] Performance tested
- [ ] Security headers configured

---

## 🎯 Improvement Ideas (Future)

1. **Testimonials Section** - Dari actual users
2. **Analytics Dashboard** - Track landing page performance
3. **Video Demo** - YAMS tutorial video
4. **Blog Integration** - Help articles
5. **Newsletter Signup** - Email capture
6. **Social Proof** - User count, stats
7. **Comparison Table** - YAMS vs alternatives
8. **Pricing Page** (if needed)

---

**Version:** 1.0
**Last Updated:** 21 December 2025
**Status:** ✅ Production Ready
