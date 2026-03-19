---
name: TTS
description: Implement text-to-speech (TTS) capabilities using the z-ai-web-dev-sdk or AI Step Flash 3.5. Use this skill when the user needs to convert text into natural-sounding speech, create audio content, build voice-enabled applications, or generate spoken audio files. Supports 25+ voices across 15 languages, adjustable speed/pitch/volume, emotional speech, SSML support, and various audio formats.
license: MIT
version: 2.1.0
last_updated: 2026-03
compatible_with:
  - z-ai-web-dev-sdk
  - AI Step Flash 3.5 (OpenRouter)
---

# TTS (Text to Speech) Skill

This skill guides the implementation of text-to-speech (TTS) functionality using the z-ai-web-dev-sdk package or AI Step Flash 3.5 via OpenRouter, enabling conversion of text into natural-sounding speech audio.

## Skills Path

**Skill Location**: `{project_path}/skills/TTS`

**Reference Scripts**: Example test scripts are available in the `{Skill Location}/scripts/` directory for quick testing and reference. See `{Skill Location}/scripts/tts.ts` for a working example.

## 🆕 AI Step Flash 3.5 Support

This skill now supports **AI Step Flash 3.5** with TTS capabilities via OpenRouter API!

### Using TTS with AI Step Flash 3.5

```javascript
import AIStepFlashClient from '../config/ai-step-flash-adapter';
import fs from 'fs';

const client = await AIStepFlashClient.create('sk-or-v1-your-api-key');

// Generate speech from text
const response = await client.audio.tts.create({
  input: 'Hello, this is a test message from AI Step Flash 3.5!',
  voice: 'nova',
  speed: 1.0,
  emotion: 'neutral',
  response_format: 'wav'
});

// Get array buffer from Response object
const arrayBuffer = await response.arrayBuffer();
const buffer = Buffer.from(new Uint8Array(arrayBuffer));

fs.writeFileSync('./output.wav', buffer);
console.log('Audio saved to output.wav');
```

### TTS with Emotions

```javascript
// Happy voice
await client.audio.tts.create({
  input: 'Congratulations on your achievement!',
  voice: 'nova',
  emotion: 'happy',
  response_format: 'wav'
});

// Calm narration
await client.audio.tts.create({
  input: 'Welcome to our meditation session.',
  voice: 'yunxi',
  emotion: 'calm',
  response_format: 'wav'
});
```

## Overview

Text-to-Speech allows you to build applications that generate spoken audio from text input, supporting various voices, speeds, and output formats for diverse use cases.

**IMPORTANT**: z-ai-web-dev-sdk MUST be used in backend code only. Never use it in client-side code.

## 🆕 What's New in 2026

### Latest Features (March 2026)
- **Emotional Speech Synthesis**: Generate speech with emotions (happy, sad, excited, calm, etc.)
- **SSML Support**: Full Speech Synthesis Markup Language support
- **25+ Premium Voices**: Expanded voice library with natural-sounding voices
- **15 Languages**: Support for 15 languages including regional accents
- **Voice Cloning**: Clone voices from short audio samples (Enterprise)
- **Long-form Audio**: Support for texts up to 10,000 characters
- **Real-time Streaming**: WebSocket-based streaming synthesis
- **Pitch Control**: Fine-grained pitch adjustment
- **Pause and Emphasis**: Natural pauses and word emphasis

### Performance Improvements
- 50% faster audio generation
- 30% improvement in naturalness scores (MOS: 4.7/5.0)
- Reduced latency for streaming synthesis (under 200ms)
- Support for audio files up to 60 minutes

## API Limitations and Constraints

### Input Text Constraints
- **Standard Mode**: 4,000 characters per request
- **Long-form Mode**: 10,000 characters per request
- **Streaming Mode**: Unlimited with chunked input

### Audio Parameters
| Parameter | Range | Default | Description |
|-----------|-------|---------|-------------|
| speed | 0.25 - 4.0 | 1.0 | Speech speed multiplier |
| pitch | -12 to +12 | 0 | Pitch adjustment in semitones |
| volume | 0.1 - 10.0 | 1.0 | Output volume level |

### Format and Streaming
- **Streaming**: PCM format only
- **Non-streaming**: WAV, MP3, OGG, FLAC, AAC
- **Sample Rate**: 8000, 16000, 24000, 44100, 48000 Hz
- **Bit Rate**: 128kbps - 320kbps (MP3/AAC)

## Prerequisites

The z-ai-web-dev-sdk package is already installed. Import it as shown in the examples below.

## CLI Usage (For Simple Tasks)

### Basic TTS

```bash
# Convert text to speech (default WAV format)
z-ai tts --input "Hello, world" --output ./hello.wav

# Using short options with voice selection
z-ai tts -i "Welcome to our service" -o ./welcome.wav --voice nova

# MP3 format with custom speed
z-ai tts -i "Quick announcement" -o ./announce.mp3 --format mp3 --speed 1.5
```

### Emotional Speech (NEW 2026)

```bash
# Generate speech with emotion
z-ai tts -i "Congratulations on your success!" -o ./congrats.wav --emotion happy

# Calm narration
z-ai tts -i "Let me explain this concept" -o ./explain.wav --emotion calm

# Excited announcement
z-ai tts -i "We have exciting news!" -o ./news.wav --emotion excited
```

### SSML Support (NEW 2026)

```bash
# Use SSML for fine control
z-ai tts -i '<speak>Hello <emphasis>world</emphasis><break time="500ms"/>How are you?</speak>' -o ./ssml.wav

# SSML with prosody
z-ai tts -i '<speak><prosody rate="slow" pitch="+2st">This is slower and higher</prosody></speak>' -o ./prosody.wav
```

### Long-form Audio (NEW 2026)

```bash
# Generate long audio (up to 60 minutes)
z-ai tts -i ./long_article.txt -o ./audiobook.wav --long-form

# With chapter markers
z-ai tts -i ./book_chapter.txt -o ./chapter1.wav --long-form --chapters
```

### CLI Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `--input, -i` | Text or file path | Required |
| `--output, -o` | Output file path | Required |
| `--voice, -v` | Voice name | nova |
| `--speed, -s` | Speed (0.25-4.0) | 1.0 |
| `--pitch, -p` | Pitch (-12 to +12) | 0 |
| `--format, -f` | Audio format (wav/mp3/ogg/flac/aac) | wav |
| `--emotion, -e` | Emotion (neutral/happy/sad/excited/calm/angry) | neutral |
| `--sample-rate` | Sample rate in Hz | 24000 |
| `--stream` | Enable streaming | false |
| `--long-form` | Enable long-form synthesis | false |
| `--ssml` | Treat input as SSML | false |

## Available Voices (2026)

### Chinese Voices (中文语音)

| Voice | Gender | Style | Best For |
|-------|--------|-------|----------|
| tongtong | Female | 温暖亲切 | Customer service, narration |
| chuichui | Female | 活泼可爱 | Entertainment, casual content |
| xiaochen | Male | 沉稳专业 | News, business, education |
| kazi | Male | 清晰标准 | Tutorials, instructions |
| douji | Male | 自然流畅 | Conversations, podcasts |
| luodo | Female | 富有感染力 | Storytelling, marketing |
| yunxi | Female | 温柔甜美 | Audiobooks, meditation |
| yunyang | Male | 年轻活力 | Youth content, games |

### English Voices

| Voice | Gender | Accent | Style | Best For |
|-------|--------|--------|-------|----------|
| nova | Female | American | Warm, natural | General purpose |
| alloy | Male | American | Professional | Business, education |
| echo | Male | American | Deep, resonant | Narration, trailers |
| shimmer | Female | British | Refined | Audiobooks, documentaries |
| onyx | Male | British | Authoritative | News, presentations |
| fable | Female | American | Storytelling | Children's content |
| jam | Male | British | Gentle, refined | Meditation, relaxation |

### Additional Languages

| Language | Voices Available | Codes |
|----------|-----------------|-------|
| Japanese | 4 | ja-JP |
| Korean | 3 | ko-KR |
| Spanish | 5 | es-ES, es-MX |
| French | 4 | fr-FR |
| German | 3 | de-DE |
| Portuguese | 3 | pt-BR, pt-PT |
| Italian | 2 | it-IT |
| Russian | 2 | ru-RU |
| Arabic | 2 | ar-SA |
| Hindi | 2 | hi-IN |
| Vietnamese | 2 | vi-VN |
| Thai | 2 | th-TH |

## Basic TTS Implementation

### Simple Text to Speech

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function textToSpeech(text, outputPath) {
  const zai = await ZAI.create();

  const response = await zai.audio.tts.create({
    input: text,
    voice: 'nova',
    speed: 1.0,
    pitch: 0,
    response_format: 'wav',
    stream: false
  });

  // Get array buffer from Response object
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(new Uint8Array(arrayBuffer));

  fs.writeFileSync(outputPath, buffer);
  return outputPath;
}

// Usage
await textToSpeech('Hello, world!', './output.wav');
```

### Emotional Speech Synthesis (NEW 2026)

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function synthesizeWithEmotion(text, emotion, outputPath) {
  const zai = await ZAI.create();

  const response = await zai.audio.tts.create({
    input: text,
    voice: 'nova',
    emotion: emotion, // 'neutral', 'happy', 'sad', 'excited', 'calm', 'angry'
    response_format: 'wav'
  });

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(new Uint8Array(arrayBuffer));

  fs.writeFileSync(outputPath, buffer);
  return outputPath;
}

// Usage examples
await synthesizeWithEmotion('Welcome back!', 'happy', './welcome.wav');
await synthesizeWithEmotion('We apologize for the inconvenience.', 'calm', './apology.wav');
await synthesizeWithEmotion('This is amazing news!', 'excited', './news.wav');
```

### SSML Support (NEW 2026)

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function synthesizeSSML(ssml, outputPath) {
  const zai = await ZAI.create();

  const response = await zai.audio.tts.create({
    input: ssml,
    input_type: 'ssml', // Specify SSML input
    voice: 'nova',
    response_format: 'wav'
  });

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(new Uint8Array(arrayBuffer));

  fs.writeFileSync(outputPath, buffer);
  return outputPath;
}

// Usage with SSML
const ssml = `
<speak>
  Welcome to our service!
  <break time="500ms"/>
  <emphasis level="strong">Important:</emphasis> 
  Please listen carefully.
  <prosody rate="slow" pitch="+2st">
    This section is slower and higher pitched.
  </prosody>
  <say-as interpret-as="telephone">555-123-4567</say-as>
</speak>
`;

await synthesizeSSML(ssml, './ssml_output.wav');
```

### Long-form Audio Generation (NEW 2026)

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function generateLongForm(text, outputPath) {
  const zai = await ZAI.create();

  const response = await zai.audio.tts.create({
    input: text,
    voice: 'nova',
    long_form: true, // Enable long-form synthesis
    response_format: 'mp3', // Recommended for long audio
    bit_rate: 192000
  });

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(new Uint8Array(arrayBuffer));

  fs.writeFileSync(outputPath, buffer);
  
  return {
    path: outputPath,
    duration: buffer.length / 24000 / 2 // Approximate duration
  };
}

// Usage - Generate audiobook chapter
const chapterText = fs.readFileSync('./chapter1.txt', 'utf8');
const result = await generateLongForm(chapterText, './chapter1.mp3');
```

## Advanced Use Cases

### Real-time Streaming Synthesis (NEW 2026)

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import { WebSocket } from 'ws';
import fs from 'fs';

class StreamingTTS {
  constructor() {
    this.zai = null;
    this.ws = null;
  }

  async initialize() {
    this.zai = await ZAI.create();
  }

  async startStreaming(outputPath, options = {}) {
    const streamUrl = await this.zai.audio.tts.getStreamUrl({
      voice: options.voice || 'nova',
      format: 'pcm'
    });

    const outputStream = fs.createWriteStream(outputPath);
    
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(streamUrl);

      this.ws.on('message', (data) => {
        outputStream.write(data);
      });

      this.ws.on('close', () => {
        outputStream.end();
        resolve(outputPath);
      });

      this.ws.on('error', reject);
    });
  }

  sendText(text) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ text }));
    }
  }

  endStreaming() {
    if (this.ws) {
      this.ws.send(JSON.stringify({ end: true }));
    }
  }
}

// Usage
const tts = new StreamingTTS();
await tts.initialize();

await tts.startStreaming('./output.pcm');
tts.sendText('Hello, this is streaming audio. ');
tts.sendText('We can send multiple text chunks. ');
tts.sendText('The audio is generated in real-time.');
tts.endStreaming();
```

### Multi-voice Dialogue

```javascript
import ZAI from 'zai-web-dev-sdk';
import fs from 'fs';

async function generateDialogue(dialogue, outputPath) {
  const zai = await ZAI.create();
  const audioBuffers = [];

  for (const line of dialogue) {
    const response = await zai.audio.tts.create({
      input: line.text,
      voice: line.voice,
      emotion: line.emotion || 'neutral',
      response_format: 'wav'
    });

    const arrayBuffer = await response.arrayBuffer();
    audioBuffers.push(Buffer.from(new Uint8Array(arrayBuffer)));
    
    // Add small pause between lines
    await new Promise(r => setTimeout(r, 100));
  }

  // Concatenate all buffers
  const totalLength = audioBuffers.reduce((sum, buf) => sum + buf.length, 0);
  const combinedBuffer = Buffer.concat(audioBuffers, totalLength);

  fs.writeFileSync(outputPath, combinedBuffer);
  return outputPath;
}

// Usage
const dialogue = [
  { text: "Good morning, how can I help you?", voice: 'xiaochen' },
  { text: "I'd like to know more about your services.", voice: 'tongtong' },
  { text: "Of course! Let me explain our offerings.", voice: 'xiaochen', emotion: 'happy' }
];

await generateDialogue(dialogue, './dialogue.wav');
```

### Audiobook Generator (NEW 2026)

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

class AudiobookGenerator {
  constructor() {
    this.zai = null;
  }

  async initialize() {
    this.zai = await ZAI.create();
  }

  async generateFromText(text, outputPath, options = {}) {
    const chunks = this.splitIntoChunks(text, 4000);
    const audioBuffers = [];
    let chapterIndex = 0;

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      
      // Detect chapter headers
      const isChapter = /^chapter\s+\d+/i.test(chunk.trim());
      
      const response = await this.zai.audio.tts.create({
        input: chunk,
        voice: options.voice || 'nova',
        emotion: isChapter ? 'excited' : 'neutral',
        long_form: true,
        response_format: 'mp3'
      });

      const arrayBuffer = await response.arrayBuffer();
      audioBuffers.push(Buffer.from(new Uint8Array(arrayBuffer)));

      // Progress callback
      if (options.onProgress) {
        options.onProgress({
          chunk: i + 1,
          total: chunks.length,
          percentage: ((i + 1) / chunks.length * 100).toFixed(1)
        });
      }
    }

    // Merge audio files
    const merged = this.mergeAudioBuffers(audioBuffers);
    fs.writeFileSync(outputPath, merged);

    return {
      path: outputPath,
      totalChunks: chunks.length,
      estimatedDuration: merged.length / 24000 / 2
    };
  }

  splitIntoChunks(text, maxLength) {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const chunks = [];
    let current = '';

    for (const sentence of sentences) {
      if ((current + sentence).length <= maxLength) {
        current += sentence;
      } else {
        if (current) chunks.push(current);
        current = sentence;
      }
    }
    if (current) chunks.push(current);

    return chunks;
  }

  mergeAudioBuffers(buffers) {
    // Simple concatenation for MP3
    return Buffer.concat(buffers);
  }
}

// Usage
const generator = new AudiobookGenerator();
await generator.initialize();

const bookText = fs.readFileSync('./book.txt', 'utf8');
await generator.generateFromText(bookText, './audiobook.mp3', {
  voice: 'nova',
  onProgress: (p) => console.log(`Progress: ${p.percentage}%`)
});
```

## Best Practices (2026)

### 1. Voice Selection Guidelines

```javascript
function selectBestVoice(content) {
  const voiceRecommendations = {
    // Content type -> voice mapping
    'news': { voice: 'xiaochen', emotion: 'neutral' },
    'storytelling': { voice: 'luodo', emotion: 'calm' },
    'marketing': { voice: 'tongtong', emotion: 'excited' },
    'education': { voice: 'kazi', emotion: 'neutral' },
    'meditation': { voice: 'yunxi', emotion: 'calm' },
    'entertainment': { voice: 'chuichui', emotion: 'happy' },
    'business': { voice: 'alloy', emotion: 'professional' },
    'children': { voice: 'fable', emotion: 'happy' }
  };

  // Auto-detect content type
  const detected = detectContentType(content);
  return voiceRecommendations[detected] || { voice: 'nova', emotion: 'neutral' };
}
```

### 2. Text Preprocessing

```javascript
function preprocessForTTS(text) {
  // Expand abbreviations
  const expansions = {
    'Dr.': 'Doctor',
    'Mr.': 'Mister',
    'Mrs.': 'Misses',
    'vs.': 'versus',
    'e.g.': 'for example',
    'i.e.': 'that is',
    'etc.': 'etcetera'
  };

  for (const [abbr, full] of Object.entries(expansions)) {
    text = text.replace(new RegExp(`\\b${abbr}\\b`, 'g'), full);
  }

  // Handle numbers
  text = text.replace(/(\d+),(\d+)/g, '$1 thousand $2'); // 1,000 -> 1 thousand
  text = text.replace(/\$(\d+)/g, '$1 dollars');

  // Handle special characters
  text = text.replace(/[•·]/g, ' '); // Bullet points
  text = text.replace(/…/g, '...'); // Ellipsis

  return text;
}
```

### 3. Caching Implementation

```javascript
import crypto from 'crypto';
import fs from 'fs';

class CachedTTS {
  constructor(cacheDir = './tts_cache') {
    this.cacheDir = cacheDir;
    this.zai = null;
    
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
  }

  async initialize() {
    this.zai = await ZAI.create();
  }

  getCacheKey(text, options) {
    return crypto
      .createHash('md5')
      .update(text + JSON.stringify(options))
      .digest('hex');
  }

  async synthesize(text, options = {}) {
    const key = this.getCacheKey(text, options);
    const cacheFile = `${this.cacheDir}/${key}.wav`;

    // Return cached result
    if (fs.existsSync(cacheFile)) {
      return {
        path: cacheFile,
        cached: true
      };
    }

    // Generate new audio
    const response = await this.zai.audio.tts.create({
      input: text,
      voice: options.voice || 'nova',
      speed: options.speed || 1.0,
      pitch: options.pitch || 0,
      emotion: options.emotion || 'neutral',
      response_format: 'wav'
    });

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(new Uint8Array(arrayBuffer));

    fs.writeFileSync(cacheFile, buffer);

    return {
      path: cacheFile,
      cached: false
    };
  }
}
```

## Common Use Cases

| Use Case | Recommended Settings |
|----------|---------------------|
| Audiobooks | `voice: nova, long_form: true, format: mp3` |
| Podcasts | `voice: alloy, emotion: neutral, format: mp3` |
| IVR Systems | `voice: xiaochen, speed: 0.9, format: wav` |
| E-learning | `voice: kazi, speed: 0.85, format: mp3` |
| Announcements | `voice: tongtong, emotion: excited, speed: 1.1` |
| Meditation | `voice: yunxi, emotion: calm, speed: 0.8` |
| Navigation | `voice: nova, speed: 1.2, format: mp3` |
| Games | `voice: chuichui, emotion: varies, format: ogg` |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Audio too fast/slow | Adjust `speed` parameter (0.25-4.0) |
| Voice sounds unnatural | Try different `emotion` setting |
| Long text truncation | Enable `long_form: true` |
| Poor audio quality | Use higher sample rate (44100Hz) |
| Memory errors | Process in chunks with streaming |
| Pitch too high/low | Use `pitch` parameter (-12 to +12) |

## Remember

- Always use z-ai-web-dev-sdk in backend code only
- Input text: 4,000 chars standard, 10,000 chars long-form
- Speed range: 0.25 - 4.0 (default: 1.0)
- Pitch range: -12 to +12 semitones
- Streaming mode only supports PCM format
- Use emotions for more natural speech
- SSML provides fine-grained control
- Implement caching for repeated phrases
- Long-form mode for audiobooks and podcasts
