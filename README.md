# 🎯 Skills Collection

Koleksi lengkap skill AI untuk pengembangan aplikasi menggunakan z-ai-web-dev-sdk. Repository ini berbagai modul skill yang dapat digunakan untuk membangun aplikasi AI yang powerful.

## 📋 Daftar Skill

### 🎤 AI & Media Processing

| Skill | Deskripsi | Lisensi |
|-------|-----------|---------|
| **[ASR](./ASR/)** | Speech-to-Text (ASR/Automatic Speech Recognition) - Mengkonversi audio menjadi teks dengan akurat | MIT |
| **[TTS](./TTS/)** | Text-to-Speech - Mengkonversi teks menjadi suara natural dengan berbagai pilihan suara | MIT |
| **[LLM](./LLM/)** | Large Language Model Chat Completions - Untuk aplikasi conversational AI dan chatbot | MIT |
| **[VLM](./VLM/)** | Vision Language Model - Analisis gambar dan chat multimodal dengan AI | MIT |
| **[image-generation](./image-generation/)** | AI Image Generation - Membuat gambar dari deskripsi teks | MIT |
| **[video-generation](./video-generation/)** | AI Video Generation - Membuat video dari teks atau gambar | MIT |
| **[video-understand](./video-understand/)** | Video Understanding - Analisis konten video, deteksi aksi, dan pemahaman scene | MIT |
| **[podcast-generate](./podcast-generate/)** | Podcast Generator - Menghasilkan episode podcast dari konten atau hasil pencarian web | MIT |

### 🌐 Web & Search

| Skill | Deskripsi | Lisensi |
|-------|-----------|---------|
| **[web-search](./web-search/)** | Web Search - Pencarian informasi real-time dari internet | MIT |
| **[web-reader](./web-reader/)** | Web Reader - Ekstraksi konten dari halaman web | MIT |
| **[agent-browser](./agent-browser/)** | Browser Automation - Otomasi browser untuk navigasi, klik, dan snapshot halaman | MIT |

### 📄 Document Processing

| Skill | Deskripsi | Lisensi |
|-------|-----------|---------|
| **[pdf](./pdf/)** | PDF Processing - Ekstraksi teks/tabel, pembuatan, merge/split PDF, dan form handling | Proprietary |
| **[docx](./docx/)** | Word Document - Pembuatan, editing, dan analisis dokumen .docx dengan tracked changes | Proprietary |
| **[xlsx](./xlsx/)** | Excel Spreadsheet - Pembuatan spreadsheet dengan formula, formatting, dan visualisasi | Proprietary |
| **[pptx](./pptx/)** | PowerPoint - Pembuatan dan editing presentasi (Gunakan AI PPT Mode) | Proprietary |

### 💼 Specialized Tools

| Skill | Deskripsi | Lisensi |
|-------|-----------|---------|
| **[finance](./finance/)** | Finance API - Data pasar saham real-time, analisis keuangan, dan investasi | MIT |
| **[fullstack-dev](./fullstack-dev/)** | Fullstack Development - Next.js 16, TypeScript, Tailwind CSS 4, shadcn/ui, Prisma ORM | MIT |
| **[gift-evaluator](./gift-evaluator/)** | Gift Evaluator - Analisis nilai hadiah dan saran interaksi sosial | Internal Tool |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- z-ai-web-dev-sdk (sudah terinstall)

### Installation

```bash
# Clone repository
git clone https://github.com/mcbackup058-netizen/skills-collection.git

# Masuk ke direktori skill yang diinginkan
cd skills-collection/ASR

# Install dependencies (jika ada)
npm install
```

### Penggunaan Dasar

```javascript
import ZAI from 'z-ai-web-dev-sdk';

// Inisialisasi SDK
const zai = await ZAI.create();

// Contoh: Chat dengan LLM
const completion = await zai.chat.completions.create({
  messages: [
    { role: 'assistant', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Hello!' }
  ]
});

console.log(completion.choices[0]?.message?.content);
```

## 📁 Struktur Repository

```
skills-collection/
├── ASR/                    # Speech-to-Text
│   ├── SKILL.md
│   ├── scripts/
│   └── LICENSE.txt
├── LLM/                    # Large Language Model
│   ├── SKILL.md
│   ├── scripts/
│   └── LICENSE.txt
├── TTS/                    # Text-to-Speech
│   ├── SKILL.md
│   ├── scripts/
│   └── LICENSE.txt
├── VLM/                    # Vision Language Model
│   ├── SKILL.md
│   ├── scripts/
│   └── LICENSE.txt
├── image-generation/       # AI Image Generation
│   ├── SKILL.md
│   ├── scripts/
│   └── LICENSE.txt
├── video-generation/       # AI Video Generation
│   ├── SKILL.md
│   ├── scripts/
│   └── LICENSE.txt
├── video-understand/       # Video Understanding
│   ├── SKILL.md
│   ├── scripts/
│   └── LICENSE.txt
├── web-search/             # Web Search
│   ├── SKILL.md
│   ├── scripts/
│   └── LICENSE.txt
├── web-reader/             # Web Reader
│   ├── SKILL.md
│   ├── scripts/
│   └── LICENSE.txt
├── pdf/                    # PDF Processing
│   ├── SKILL.md
│   ├── scripts/
│   └── LICENSE.txt
├── docx/                   # Word Document
│   ├── SKILL.md
│   ├── scripts/
│   └── LICENSE.txt
├── xlsx/                   # Excel Spreadsheet
│   ├── SKILL.md
│   ├── scripts/
│   └── LICENSE.txt
├── pptx/                   # PowerPoint
│   └── SKILL.md
├── finance/                # Finance API
│   ├── SKILL.md
│   └── Finance_API_Doc.md
├── fullstack-dev/          # Fullstack Development
│   └── SKILL.md
├── gift-evaluator/         # Gift Evaluator
│   ├── SKILL.md
│   └── html_tools.py
├── agent-browser/          # Browser Automation
│   └── SKILL.md
├── podcast-generate/       # Podcast Generator
│   ├── SKILL.md
│   ├── generate.ts
│   └── package.json
└── README.md
```

## 📖 Dokumentasi

Setiap skill memiliki file `SKILL.md` yang berisi:
- Deskripsi lengkap kemampuan
- Contoh kode penggunaan
- CLI commands (jika tersedia)
- Best practices
- Troubleshooting guide

## 🔑 Lisensi

- **MIT License**: ASR, LLM, TTS, VLM, image-generation, video-generation, video-understand, web-search, web-reader, finance, fullstack-dev, podcast-generate, agent-browser
- **Proprietary**: pdf, docx, xlsx, pptx (lihat LICENSE.txt di masing-masing folder)
- **Internal Tool**: gift-evaluator

## ⚠️ Catatan Penting

1. **z-ai-web-dev-sdk** HARUS digunakan di backend saja, jangan di client-side code
2. SDK sudah terinstall - import sesuai contoh di masing-masing SKILL.md
3. Untuk PPT/PPTX, gunakan AI PPT Mode yang tersedia di interface

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan buat Pull Request atau Issue untuk:
- Bug fixes
- Fitur baru
- Perbaikan dokumentasi
- Contoh kode tambahan

## 📞 Support

Jika mengalami masalah:
1. Baca bagian Troubleshooting di SKILL.md masing-masing skill
2. Periksa requirements dan dependencies
3. Pastikan menggunakan SDK di backend

---

**Dibuat dengan ❤️ untuk komunitas developer AI Indonesia**
