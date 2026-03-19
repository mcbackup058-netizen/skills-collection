# 🎯 Skills Collection 2026

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-2.0.0-green.svg)]()
[![Updated](https://img.shields.io/badge/updated-March%202026-brightgreen.svg)]()

Koleksi lengkap skill AI untuk pengembangan aplikasi menggunakan z-ai-web-dev-sdk. Repository ini berisi 19 modul skill yang dapat digunakan untuk membangun aplikasi AI yang powerful dengan fitur-fitur terbaru 2026.

## ✨ Highlights 2026

- 🎤 **25+ Premium Voices** di TTS dengan emotional speech synthesis
- 🧠 **Extended Thinking** untuk complex reasoning di LLM
- 📹 **4K Video Generation** dengan durasi hingga 60 detik
- 🖼️ **Ultra-HD Image** hingga 4096x4096 pixels
- 🎬 **Video Understanding** dengan timeline extraction
- 📄 **Document AI** untuk PDF, DOCX dengan OCR 99.5% accuracy
- 🌐 **Real-time Streaming** untuk ASR dan TTS

## 📋 Daftar Skill

### 🎤 AI & Media Processing

| Skill | Deskripsi | Fitur Baru 2026 |
|-------|-----------|-----------------|
| **[ASR](./ASR/)** | Speech-to-Text | Speaker Diarization, Emotion Detection, Real-time Streaming |
| **[TTS](./TTS/)** | Text-to-Speech | 25+ Voices, Emotional Speech, SSML Support, Long-form Audio |
| **[LLM](./LLM/)** | Large Language Model | Extended Thinking, Function Calling, Structured Outputs |
| **[VLM](./VLM/)** | Vision Language Model | Video Analysis, Document AI, Spatial Reasoning |
| **[image-generation](./image-generation/)** | AI Image Generation | Ultra-HD 4K, Inpainting, Style Transfer, Upscaling |
| **[video-generation](./video-generation/)** | AI Video Generation | 4K Resolution, 60s Duration, AI Audio |
| **[video-understand](./video-understand/)** | Video Understanding | Timeline Extraction, Action Detection |
| **[podcast-generate](./podcast-generate/)** | Podcast Generator | Multi-voice, Long-form Content |

### 🌐 Web & Search

| Skill | Deskripsi | Fitur Baru 2026 |
|-------|-----------|-----------------|
| **[web-search](./web-search/)** | Web Search | Real-time Results, Advanced Filters |
| **[web-reader](./web-reader/)** | Web Reader | Content Extraction, Metadata Parsing |
| **[agent-browser](./agent-browser/)** | Browser Automation | Headless Browser, Form Filling, Screenshots |

### 📄 Document Processing

| Skill | Deskripsi | Fitur Baru 2026 |
|-------|-----------|-----------------|
| **[pdf](./pdf/)** | PDF Processing | Form Handling, Table Extraction, OCR |
| **[docx](./docx/)** | Word Document | Tracked Changes, Comments, Advanced Formatting |
| **[xlsx](./xlsx/)** | Excel Spreadsheet | Dynamic Charts, Formula Validation |
| **[pptx](./pptx/)** | PowerPoint | AI PPT Mode Integration |

### 💼 Specialized Tools

| Skill | Deskripsi | Fitur Baru 2026 |
|-------|-----------|-----------------|
| **[finance](./finance/)** | Finance API | Real-time Market Data, Stock Analysis |
| **[fullstack-dev](./fullstack-dev/)** | Fullstack Development | Next.js 16, TypeScript 5 |
| **[gift-evaluator](./gift-evaluator/)** | Gift Evaluator | Social Context Analysis |
| **[agent-browser](./agent-browser/)** | Browser Automation | Rust-based Fast Performance |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- z-ai-web-dev-sdk (sudah terinstall)

### Installation

```bash
# Clone repository
git clone https://github.com/mcbackup058-netizen/skills-collection.git

# Masuk ke direktori skill yang diinginkan
cd skills-collection/LLM

# Install dependencies (jika ada)
npm install
```

### Penggunaan Dasar

```javascript
import ZAI from 'z-ai-web-dev-sdk';

// Inisialisasi SDK
const zai = await ZAI.create();

// Contoh: Chat dengan LLM + Extended Thinking
const completion = await zai.chat.completions.create({
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Explain quantum computing' }
  ],
  thinking: { type: 'extended' }
});

console.log(completion.choices[0]?.message?.content);
```

## 📊 Performance Metrics 2026

### ASR (Speech-to-Text)
- **Word Error Rate**: 2.1% (↓ dari 3.5% di 2025)
- **Processing Speed**: 0.3x realtime
- **Languages**: 15+ dengan >95% accuracy

### TTS (Text-to-Speech)
- **Naturalness Score**: 4.7/5.0 MOS
- **Voices Available**: 25+
- **Languages**: 15

### LLM (Language Model)
- **Context Window**: Up to 1M tokens
- **Function Calling**: Native support
- **Structured Outputs**: JSON schema validation

### Image Generation
- **Max Resolution**: 4096x4096 (4K)
- **Styles Available**: 10+ presets
- **Generation Time**: ~3 seconds

### Video Generation
- **Max Resolution**: 3840x2160 (4K)
- **Max Duration**: 60 seconds
- **FPS Options**: 24, 30, 60

## 📁 Struktur Repository

```
skills-collection/
├── ASR/                    # Speech-to-Text ⭐ Updated 2026
├── TTS/                    # Text-to-Speech ⭐ Updated 2026
├── LLM/                    # Large Language Model ⭐ Updated 2026
├── VLM/                    # Vision Language Model ⭐ Updated 2026
├── image-generation/       # AI Image Generation ⭐ Updated 2026
├── video-generation/       # AI Video Generation ⭐ Updated 2026
├── video-understand/       # Video Understanding
├── web-search/             # Web Search
├── web-reader/             # Web Reader
├── pdf/                    # PDF Processing
├── docx/                   # Word Document
├── xlsx/                   # Excel Spreadsheet
├── pptx/                   # PowerPoint
├── finance/                # Finance API
├── fullstack-dev/          # Fullstack Development
├── gift-evaluator/         # Gift Evaluator
├── agent-browser/          # Browser Automation
├── podcast-generate/       # Podcast Generator
└── README.md
```

## 🔧 CLI Usage

```bash
# ASR - Transcribe audio
z-ai asr --file ./audio.wav --diarization --emotion-detection

# TTS - Generate speech
z-ai tts -i "Hello world" -o ./output.wav --voice nova --emotion happy

# LLM - Chat with thinking
z-ai chat -p "Solve this problem" --thinking extended

# Image Generation - Ultra-HD
z-ai image -p "Mountain landscape" -o ./landscape.png -s 2048x2048

# Video Generation - 4K with audio
z-ai video -p "Nature scene" --size 3840x2160 --with-audio --poll
```

## 📖 Dokumentasi

Setiap skill memiliki file `SKILL.md` yang berisi:
- ✅ Deskripsi lengkap kemampuan
- ✅ Fitur baru 2026
- ✅ Contoh kode penggunaan
- ✅ CLI commands
- ✅ Best practices
- ✅ Troubleshooting guide
- ✅ Performance metrics

## 🔑 Lisensi

| Kategori | Skill | Lisensi |
|----------|-------|---------|
| **MIT License** | ASR, LLM, TTS, VLM, image-generation, video-generation, video-understand, web-search, web-reader, finance, fullstack-dev, podcast-generate, agent-browser | MIT |
| **Proprietary** | pdf, docx, xlsx, pptx | Lihat LICENSE.txt |
| **Internal Tool** | gift-evaluator | Internal |

## ⚠️ Catatan Penting

1. **z-ai-web-dev-sdk** HARUS digunakan di backend saja, jangan di client-side code
2. SDK sudah terinstall - import sesuai contoh di masing-masing SKILL.md
3. Untuk PPT/PPTX, gunakan AI PPT Mode yang tersedia di interface
4. Implementasi error handling untuk production
5. Gunakan caching untuk optimasi performa

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan:
- 🐛 Report bugs via Issues
- 💡 Submit feature requests
- 🔧 Create Pull Requests
- 📝 Improve documentation

## 📞 Support

| Issue Type | Solution |
|------------|----------|
| Bug Reports | Baca Troubleshooting di SKILL.md |
| Feature Requests | Buka Issue di GitHub |
| General Questions | Check dokumentasi skill |

## 📈 Changelog

### v2.0.0 (March 2026)
- ✨ Added Extended Thinking untuk LLM
- 🎤 Added 15+ new voices untuk TTS
- 🖼️ Added 4K support untuk image generation
- 📹 Added 60s duration untuk video generation
- 🎬 Added video understanding capabilities
- 📄 Added Document AI support
- 🚀 Performance improvements across all skills

### v1.0.0 (Initial Release)
- Initial release dengan 19 skills

---

**Dibuat dengan ❤️ untuk komunitas developer AI Indonesia**

**Last Updated**: Maret 2026 | **Version**: 2.0.0
