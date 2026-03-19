# 🎯 Skills Collection 2026

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-3.4.0-green.svg)]()
[![Updated](https://img.shields.io/badge/updated-March%202026-brightgreen.svg)]()
[![AI Step Flash](https://img.shields.io/badge/AI%20Step%20Flash-3.5-purple.svg)]()

Koleksi lengkap skill AI untuk pengembangan aplikasi menggunakan z-ai-web-dev-sdk dengan dukungan **AI Step Flash 3.5** via OpenRouter. Repository ini berisi 19 modul skill yang dapat digunakan untuk membangun aplikasi AI yang powerful dengan fitur-fitur terbaru 2026.

## ⚡ Quick Start - Super Simple!

### 🚀 One Command Setup

```bash
# 1. Clone dan masuk ke direktori
git clone https://github.com/mcbackup058-netizen/skills-collection.git
cd skills-collection

# 2. Setup API key (sekali saja)
node run.js setup sk-or-v1-your-api-key

# 3. Tanya apapun!
node run.js "Apa itu Python?"
node run.js "Cek status VPS saya"
node run.js chat   # Interactive mode
```

### 🎯 Quick VPS Commands

```bash
node run.js status    # Cek VPS status
node run.js docker    # List containers
node run.js nginx     # Check Nginx
node run.js services  # List services
```

### 💬 Interactive Chat Mode

```bash
node run.js chat

# Commands di dalam chat:
# /help    - Bantuan
# /tools   - Daftar tools
# /vps     - Info VPS
# /history - Riwayat chat
# /clear   - Hapus history
# /exit    - Keluar
```

## 🆕 AI Step Flash 3.5 Integration

Skills Collection sekarang mendukung **AI Step Flash 3.5** melalui OpenRouter API! Ini memungkinkan Anda menggunakan skill-skill ini dengan AI Step Flash 3.5 sebagai backend AI.

### Keunggulan AI Step Flash 3.5

| Feature | Capability |
|---------|------------|
| **Context Window** | 128K tokens |
| **Max Output** | 8,192 tokens |
| **Vision Support** | ✅ Image & Video |
| **Function Calling** | ✅ Native Support |
| **Streaming** | ✅ Real-time |
| **JSON Mode** | ✅ Structured Output |

### Setup AI Step Flash 3.5

```bash
# 1. Copy environment template
cp .env.example .env

# 2. Set your API key
AI_STEP_FLASH_API_KEY=sk-or-v1-your-api-key-here

# 3. Import the adapter
import AIStepFlashClient from './config/ai-step-flash-adapter';
```

### Quick Start dengan AI Step Flash 3.5

```javascript
import AIStepFlashClient from './config/ai-step-flash-adapter';

// Inisialisasi dengan API key
const client = await AIStepFlashClient.create('sk-or-v1-your-api-key');

// Chat completion
const completion = await client.chat.completions.create({
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Explain quantum computing' }
  ],
  thinking: { type: 'extended' } // Extended thinking mode
});

console.log(completion.choices[0]?.message?.content);
```

## ✨ Highlights 2026

- 🎤 **25+ Premium Voices** di TTS dengan emotional speech synthesis
- 🧠 **Extended Thinking** untuk complex reasoning di LLM
- 📹 **4K Video Generation** dengan durasi hingga 60 detik
- 🖼️ **Ultra-HD Image** hingga 4096x4096 pixels
- 🎬 **Video Understanding** dengan timeline extraction
- 📄 **Document AI** untuk PDF, DOCX dengan OCR 99.5% accuracy
- 🌐 **Real-time Streaming** untuk ASR dan TTS
- ⚡ **AI Step Flash 3.5** Integration via OpenRouter

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
- z-ai-web-dev-sdk (sudah terinstall) atau AI Step Flash 3.5 API key

### Installation

```bash
# Clone repository
git clone https://github.com/mcbackup058-netizen/skills-collection.git

# Masuk ke direktori skill yang diinginkan
cd skills-collection/LLM

# Install dependencies (jika ada)
npm install

# Setup environment untuk AI Step Flash 3.5
cp ../.env.example ../.env
# Edit .env dengan API key Anda
```

### Penggunaan dengan z-ai-web-dev-sdk

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

### Penggunaan dengan AI Step Flash 3.5

```javascript
import AIStepFlashClient from './config/ai-step-flash-adapter';

// Inisialisasi dengan API key OpenRouter
const client = await AIStepFlashClient.create('sk-or-v1-your-api-key');

// Chat completion dengan AI Step Flash 3.5
const completion = await client.chat.completions.create({
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Explain quantum computing' }
  ],
  model: 'flash-3.5', // Menggunakan AI Step Flash 3.5
  thinking: { type: 'extended' }
});

console.log(completion.choices[0]?.message?.content);
```

### Vision dengan AI Step Flash 3.5

```javascript
import AIStepFlashClient from './config/ai-step-flash-adapter';

const client = await AIStepFlashClient.create('sk-or-v1-your-api-key');

// Image analysis
const result = await client.chat.completions.createVision({
  messages: [{
    role: 'user',
    content: [
      { type: 'text', text: 'What is in this image?' },
      { type: 'image_url', image_url: { url: 'https://example.com/image.jpg' } }
    ]
  }]
});

console.log(result.choices[0]?.message?.content);
```

## 📊 Performance Metrics 2026

### AI Step Flash 3.5
- **Context Window**: 128K tokens
- **Max Output**: 8,192 tokens
- **Vision Support**: Image & Video
- **Streaming Latency**: < 200ms first token

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
├── run.js                      # ⭐ Main runner - Easy CLI
├── tools.js                    # ⭐ Real tools execution
├── package.json                # Package configuration
├── config/                     # AI Step Flash 3.5 Configuration
│   ├── ai-step-flash.config.ts
│   └── ai-step-flash-adapter.ts
├── agent-core/                 # ⭐ Smart Agent Core
│   ├── smart/                  # Smart interface
│   │   ├── SmartAgent.ts       # Auto skill detection
│   │   ├── SkillDetector.ts    # Skill detection engine
│   │   ├── config.ts           # Persistent config
│   │   └── cli.ts              # CLI interface
│   ├── vps/                    # VPS management tools
│   ├── tools/                  # Built-in tools
│   └── memory/                 # Memory management
├── ASR/                        # Speech-to-Text
├── TTS/                        # Text-to-Speech
├── LLM/                        # Large Language Model
├── VLM/                        # Vision Language Model
├── image-generation/           # AI Image Generation
├── video-generation/           # AI Video Generation
├── video-understand/           # Video Understanding
├── web-search/                 # Web Search
├── web-reader/                 # Web Reader
├── pdf/                        # PDF Processing
├── docx/                       # Word Document
├── xlsx/                       # Excel Spreadsheet
├── pptx/                       # PowerPoint
├── finance/                    # Finance API
├── fullstack-dev/              # Fullstack Development
└── README.md
```

## 🔧 CLI Usage

### Dengan z-ai-web-dev-sdk

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

### Dengan AI Step Flash 3.5

```javascript
// Gunakan adapter untuk semua operasi
import AIStepFlashClient from './config/ai-step-flash-adapter';

const client = await AIStepFlashClient.create(process.env.AI_STEP_FLASH_API_KEY);

// Chat
const chat = await client.chat.completions.create({...});

// Vision
const vision = await client.chat.completions.createVision({...});

// Function calling
const result = await client.functions.invoke('web_search', {...});
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
2. **AI Step Flash 3.5** menggunakan OpenRouter API - pastikan API key valid
3. SDK sudah terinstall - import sesuai contoh di masing-masing SKILL.md
4. Untuk PPT/PPTX, gunakan AI PPT Mode yang tersedia di interface
5. Implementasi error handling untuk production
6. Gunakan caching untuk optimasi performa
7. Rate limits: 60 requests/minute untuk AI Step Flash 3.5

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
| AI Step Flash Issues | Verifikasi API key dan rate limits |

## 📈 Changelog

### v3.4.0 (March 2026) - Smart Agent Pro
- ⭐ Real tool execution (VPS commands, web search)
- 💬 Interactive chat mode with streaming
- 📜 Conversation history with persistence
- 🎯 Quick VPS commands (status, docker, nginx, services)
- 🛠️ Auto skill detection and execution
- 📦 Easy CLI with one-command setup

### v3.2.0 (March 2026) - Smart Interface
- 🤖 Auto-skill detection based on prompt
- 🔑 One-time API key setup with persistence
- 📱 Single command for all operations
- 🖥️ Interactive CLI mode

### v3.0.0 (March 2026) - AI Step Flash Integration
- ⭐ Added AI Step Flash 3.5 integration via OpenRouter
- 📦 Added SDK-compatible adapter for seamless migration
- 🔧 Added configuration files for AI Step Flash 3.5
- 📝 Updated documentation with dual SDK support

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

**Last Updated**: Maret 2026 | **Version**: 3.4.0 | **AI Step Flash**: 3.5
