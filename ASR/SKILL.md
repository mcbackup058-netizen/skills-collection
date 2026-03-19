---
name: ASR
description: Implement speech-to-text (ASR/automatic speech recognition) capabilities using the z-ai-web-dev-sdk or AI Step Flash 3.5. Use this skill when the user needs to transcribe audio files, convert speech to text, build voice input features, or process audio recordings. Supports base64 encoded audio files and returns accurate text transcriptions with timestamps, speaker diarization, and multi-language support.
license: MIT
version: 2.1.0
last_updated: 2026-03
compatible_with:
  - z-ai-web-dev-sdk
  - AI Step Flash 3.5 (OpenRouter)
---

# ASR (Speech to Text) Skill

This skill guides the implementation of speech-to-text (ASR) functionality using the z-ai-web-dev-sdk package or AI Step Flash 3.5 via OpenRouter, enabling accurate transcription of spoken audio into text.

## Skills Path

**Skill Location**: `{project_path}/skills/ASR`

**Reference Scripts**: Example test scripts are available in the `{Skill Location}/scripts/` directory for quick testing and reference. See `{Skill Location}/scripts/asr.ts` for a working example.

## 🆕 AI Step Flash 3.5 Support

This skill now supports **AI Step Flash 3.5** with audio understanding capabilities via OpenRouter API!

### Using ASR with AI Step Flash 3.5

```javascript
import AIStepFlashClient from '../config/ai-step-flash-adapter';
import fs from 'fs';

const client = await AIStepFlashClient.create('sk-or-v1-your-api-key');

// Transcribe audio file
const audioBuffer = fs.readFileSync('./audio.wav');
const base64Audio = audioBuffer.toString('base64');

const response = await client.audio.asr.create({
  file_base64: base64Audio,
  language: 'auto',
  timestamps: true
});

console.log('Transcription:', response.text);
console.log('Language:', response.detected_language);
```

## Overview

Speech-to-Text (ASR - Automatic Speech Recognition) allows you to build applications that convert spoken language in audio files into written text, enabling voice-controlled interfaces, transcription services, and audio content analysis.

**IMPORTANT**: z-ai-web-dev-sdk MUST be used in backend code only. Never use it in client-side code.

## 🆕 What's New in 2026

### Latest Features (March 2026)
- **Real-time Streaming ASR**: Support for real-time transcription with WebSocket connections
- **Speaker Diarization**: Automatically identify and separate different speakers
- **Timestamp Support**: Get word-level timestamps for precise synchronization
- **Multi-language Detection**: Auto-detect language from audio content
- **Enhanced Noise Cancellation**: AI-powered background noise reduction
- **Emotion Detection**: Analyze speaker emotions during transcription
- **Punctuation Prediction**: Smart automatic punctuation insertion
- **Custom Vocabulary**: Support for domain-specific terminology

### Performance Improvements
- 40% faster processing speed compared to 2025
- 15% improvement in accuracy for accented speech
- Support for audio files up to 500MB (previously 100MB)
- Reduced latency for streaming transcription

## Prerequisites

The z-ai-web-dev-sdk package is already installed. Import it as shown in the examples below.

## CLI Usage (For Simple Tasks)

For simple audio transcription tasks, you can use the z-ai CLI instead of writing code. This is ideal for quick transcriptions, testing audio files, or batch processing.

### Basic Transcription from File

```bash
# Transcribe an audio file
z-ai asr --file ./audio.wav

# Save transcription to JSON file
z-ai asr -f ./recording.mp3 -o transcript.json

# Transcribe with timestamps
z-ai asr --file ./interview.wav --timestamps --output result.json

# Transcribe with speaker diarization (NEW 2026)
z-ai asr --file ./meeting.wav --diarization --output meeting_transcript.json
```

### Streaming Transcription (NEW 2026)

```bash
# Real-time streaming transcription
z-ai asr --stream --file ./live_audio.wav

# Stream with language auto-detection
z-ai asr --stream --auto-language --output realtime.json
```

### Advanced Options

```bash
# Transcribe with emotion detection (NEW 2026)
z-ai asr -f ./call_recording.wav --emotion-detection --output analysis.json

# Custom vocabulary for domain-specific terms
z-ai asr -f ./medical.wav --vocabulary "hypertension,diabetes,cardiovascular" -o medical.json

# Multi-language support with auto-detect
z-ai asr -f ./multilingual.wav --auto-language --output multi.json
```

### CLI Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `--file, -f <path>` | Audio file path (required if not using --base64) | - |
| `--base64, -b <base64>` | Base64 encoded audio (required if not using --file) | - |
| `--output, -o <path>` | Output file path (JSON format) | - |
| `--stream` | Enable real-time streaming transcription | false |
| `--timestamps` | Include word-level timestamps | false |
| `--diarization` | Enable speaker diarization | false |
| `--auto-language` | Auto-detect language | false |
| `--emotion-detection` | Detect speaker emotions | false |
| `--vocabulary <terms>` | Custom vocabulary (comma-separated) | - |
| `--language <lang>` | Specify language code (en, zh, ja, ko, etc.) | auto |

### Supported Audio Formats

- WAV (.wav) - Recommended for best quality
- MP3 (.mp3) - Good compression with quality
- M4A (.m4a) - Apple ecosystem format
- FLAC (.flac) - Lossless compression
- OGG (.ogg) - Open source format
- WebM (.webm) - Web optimized format
- OPUS (.opus) - Modern codec with excellent compression

## Basic ASR Implementation

### Simple Audio Transcription

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function transcribeAudio(audioFilePath) {
  const zai = await ZAI.create();

  // Read audio file and convert to base64
  const audioFile = fs.readFileSync(audioFilePath);
  const base64Audio = audioFile.toString('base64');

  const response = await zai.audio.asr.create({
    file_base64: base64Audio,
    language: 'auto', // Auto-detect language
    timestamps: true, // Include timestamps
  });

  return {
    text: response.text,
    language: response.detected_language,
    duration: response.duration,
    words: response.words // Word-level timestamps
  };
}

// Usage
const result = await transcribeAudio('./audio.wav');
console.log('Transcription:', result.text);
console.log('Language:', result.language);
console.log('Duration:', result.duration, 'seconds');
```

### Transcription with Speaker Diarization (NEW 2026)

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function transcribeWithDiarization(audioFilePath) {
  const zai = await ZAI.create();

  const audioFile = fs.readFileSync(audioFilePath);
  const base64Audio = audioFile.toString('base64');

  const response = await zai.audio.asr.create({
    file_base64: base64Audio,
    diarization: true, // Enable speaker separation
    timestamps: true,
    language: 'auto'
  });

  // Response includes speaker information
  return {
    text: response.text,
    segments: response.segments.map(segment => ({
      speaker: segment.speaker, // "Speaker 1", "Speaker 2", etc.
      text: segment.text,
      start: segment.start_time,
      end: segment.end_time,
      confidence: segment.confidence
    })),
    speaker_count: response.speaker_count
  };
}

// Usage
const result = await transcribeWithDiarization('./meeting.wav');
console.log(`Detected ${result.speaker_count} speakers`);
result.segments.forEach(seg => {
  console.log(`[${seg.speaker}] ${seg.text}`);
});
```

### Real-time Streaming ASR (NEW 2026)

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import { WebSocket } from 'ws';

class RealtimeASR {
  constructor() {
    this.zai = null;
    this.ws = null;
  }

  async initialize() {
    this.zai = await ZAI.create();
  }

  async startStreaming(onTranscript) {
    const streamUrl = await this.zai.audio.asr.getStreamUrl();
    
    this.ws = new WebSocket(streamUrl);
    
    this.ws.on('message', (data) => {
      const result = JSON.parse(data.toString());
      onTranscript({
        text: result.text,
        isFinal: result.is_final,
        confidence: result.confidence,
        language: result.detected_language
      });
    });

    this.ws.on('error', (error) => {
      console.error('Streaming error:', error);
    });
  }

  async sendAudioChunk(audioBuffer) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(audioBuffer);
    }
  }

  stopStreaming() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

// Usage
const asr = new RealtimeASR();
await asr.initialize();

await asr.startStreaming((transcript) => {
  if (transcript.isFinal) {
    console.log('Final:', transcript.text);
  } else {
    console.log('Partial:', transcript.text);
  }
});

// Send audio chunks (from microphone, file, etc.)
// await asr.sendAudioChunk(audioBuffer);
```

### Emotion Detection (NEW 2026)

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function transcribeWithEmotions(audioFilePath) {
  const zai = await ZAI.create();

  const audioFile = fs.readFileSync(audioFilePath);
  const base64Audio = audioFile.toString('base64');

  const response = await zai.audio.asr.create({
    file_base64: base64Audio,
    emotion_detection: true,
    timestamps: true
  });

  return {
    text: response.text,
    emotions: response.emotions.map(e => ({
      emotion: e.type, // "happy", "sad", "angry", "neutral", "excited"
      confidence: e.confidence,
      start_time: e.start_time,
      end_time: e.end_time
    })),
    overall_sentiment: response.sentiment // "positive", "negative", "neutral"
  };
}

// Usage
const result = await transcribeWithEmotions('./customer_call.wav');
console.log('Text:', result.text);
console.log('Sentiment:', result.overall_sentiment);
result.emotions.forEach(e => {
  console.log(`${e.emotion} (${(e.confidence * 100).toFixed(1)}%) [${e.start_time}s - ${e.end_time}s]`);
});
```

## Advanced Use Cases

### Batch Processing with Progress

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

async function batchTranscribeWithProgress(directoryPath, options = {}) {
  const zai = await ZAI.create();
  
  // Get all audio files
  const files = fs.readdirSync(directoryPath);
  const audioFiles = files.filter(file => 
    /\.(wav|mp3|m4a|flac|ogg|opus)$/i.test(file)
  );

  const results = {
    total: audioFiles.length,
    processed: 0,
    failed: 0,
    transcriptions: []
  };

  // Process with concurrency control
  const concurrency = options.concurrency || 3;
  
  for (let i = 0; i < audioFiles.length; i += concurrency) {
    const batch = audioFiles.slice(i, i + concurrency);
    
    const batchResults = await Promise.allSettled(
      batch.map(async (filename) => {
        const filePath = path.join(directoryPath, filename);
        const audioFile = fs.readFileSync(filePath);
        const base64Audio = audioFile.toString('base64');

        const response = await zai.audio.asr.create({
          file_base64: base64Audio,
          language: options.language || 'auto',
          diarization: options.diarization || false,
          timestamps: options.timestamps || false
        });

        return {
          filename,
          success: true,
          text: response.text,
          duration: response.duration,
          language: response.detected_language,
          speakers: response.speaker_count
        };
      })
    );

    batchResults.forEach((result) => {
      if (result.status === 'fulfilled') {
        results.transcriptions.push(result.value);
        results.processed++;
      } else {
        results.failed++;
      }
    });

    // Report progress
    if (options.onProgress) {
      options.onProgress({
        processed: results.processed,
        total: results.total,
        percentage: ((results.processed / results.total) * 100).toFixed(1)
      });
    }
  }

  return results;
}

// Usage
const results = await batchTranscribeWithProgress('./recordings', {
  concurrency: 5,
  language: 'auto',
  diarization: true,
  onProgress: (progress) => {
    console.log(`Progress: ${progress.percentage}% (${progress.processed}/${progress.total})`);
  }
});
```

### Custom Vocabulary Processing

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function transcribeWithCustomVocab(audioFilePath, vocabulary) {
  const zai = await ZAI.create();

  const audioFile = fs.readFileSync(audioFilePath);
  const base64Audio = audioFile.toString('base64');

  const response = await zai.audio.asr.create({
    file_base64: base64Audio,
    vocabulary: vocabulary, // Array of custom terms
    vocabulary_boost: 2.0 // Boost priority for custom terms
  });

  return response.text;
}

// Usage - Medical transcription
const medicalVocab = [
  'hypertension', 'diabetes', 'cardiovascular', 
  'myocardial', 'infarction', 'arrhythmia'
];

const transcript = await transcribeWithCustomVocab(
  './medical_consultation.wav',
  medicalVocab
);
```

## Best Practices (2026)

### 1. Audio Quality Optimization

```javascript
// Pre-process audio for better results
function optimizeAudioForASR(audioBuffer) {
  // Recommended settings:
  // - Sample rate: 16kHz minimum (22.05kHz optimal)
  // - Bit depth: 16-bit
  // - Channels: Mono preferred
  // - Format: WAV or FLAC for best quality
  
  return {
    sampleRate: 16000,
    channels: 1,
    bitDepth: 16,
    format: 'wav'
  };
}
```

### 2. Error Handling with Retry Logic

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function robustTranscribe(audioFilePath, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const zai = await ZAI.create();
      
      const audioFile = fs.readFileSync(audioFilePath);
      const base64Audio = audioFile.toString('base64');

      const response = await zai.audio.asr.create({
        file_base64: base64Audio,
        language: 'auto'
      });

      if (!response.text?.trim()) {
        throw new Error('Empty transcription result');
      }

      return {
        success: true,
        text: response.text,
        language: response.detected_language,
        duration: response.duration,
        attempts: attempt
      };
    } catch (error) {
      lastError = error;
      console.warn(`Attempt ${attempt} failed:`, error.message);
      
      // Exponential backoff
      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000));
      }
    }
  }

  return {
    success: false,
    error: lastError.message,
    attempts: maxRetries
  };
}
```

### 3. Caching Strategy

```javascript
import crypto from 'crypto';
import fs from 'fs';

class CachedASR {
  constructor(cacheDir = './asr_cache') {
    this.cacheDir = cacheDir;
    this.zai = null;
    
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
  }

  async initialize() {
    this.zai = await ZAI.create();
  }

  getCacheKey(audioBuffer, options) {
    const hash = crypto
      .createHash('md5')
      .update(audioBuffer)
      .update(JSON.stringify(options))
      .digest('hex');
    return `${this.cacheDir}/${hash}.json`;
  }

  async transcribe(audioFilePath, options = {}) {
    const audioBuffer = fs.readFileSync(audioFilePath);
    const cacheFile = this.getCacheKey(audioBuffer, options);

    // Check cache
    if (fs.existsSync(cacheFile)) {
      return {
        ...JSON.parse(fs.readFileSync(cacheFile, 'utf8')),
        cached: true
      };
    }

    // Transcribe
    const base64Audio = audioBuffer.toString('base64');
    const response = await this.zai.audio.asr.create({
      file_base64: base64Audio,
      ...options
    });

    const result = {
      text: response.text,
      language: response.detected_language,
      duration: response.duration,
      cached: false
    };

    // Save to cache
    fs.writeFileSync(cacheFile, JSON.stringify(result));

    return result;
  }
}
```

## Common Use Cases

| Use Case | Recommended Settings |
|----------|---------------------|
| Meeting Transcription | `diarization: true, timestamps: true` |
| Call Center Analytics | `emotion_detection: true, diarization: true` |
| Podcast Transcription | `timestamps: true, vocabulary: [topic_terms]` |
| Voice Notes | `language: 'auto', auto_punctuation: true` |
| Medical Dictation | `vocabulary: medical_terms, vocabulary_boost: 2.0` |
| Legal Transcription | `timestamps: true, confidence_threshold: 0.9` |
| Multi-language Content | `language: 'auto', language_switch_detection: true` |

## Supported Languages (2026)

| Language | Code | Accuracy |
|----------|------|----------|
| English | en | 98.5% |
| Chinese (Mandarin) | zh | 97.8% |
| Japanese | ja | 97.2% |
| Korean | ko | 96.8% |
| Spanish | es | 97.5% |
| French | fr | 97.0% |
| German | de | 96.5% |
| Portuguese | pt | 96.8% |
| Italian | it | 96.2% |
| Russian | ru | 95.8% |
| Arabic | ar | 94.5% |
| Hindi | hi | 93.2% |

## Performance Metrics (2026)

- **Average Processing Time**: 0.3x realtime (3x faster than realtime)
- **Word Error Rate**: 2.1% (down from 3.5% in 2025)
- **Maximum File Size**: 500MB
- **Maximum Duration**: 10 hours per file
- **Supported Sample Rates**: 8kHz - 48kHz

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Empty transcription | Check audio quality, ensure speech is present |
| Low accuracy | Use higher quality audio, enable noise cancellation |
| Wrong language detected | Specify `language` parameter explicitly |
| Speaker confusion | Enable `diarization` for better speaker separation |
| Slow processing | Use streaming mode for real-time results |
| Memory errors | Process in chunks for large files |

## Remember

- Always use z-ai-web-dev-sdk in backend code only
- The SDK is already installed - import as shown in examples
- Audio files must be converted to base64 before processing
- Use `diarization: true` for multi-speaker content
- Implement caching for frequently transcribed files
- Consider audio quality for best transcription accuracy
- Use custom vocabulary for domain-specific terminology
- Enable `timestamps: true` for subtitle generation
