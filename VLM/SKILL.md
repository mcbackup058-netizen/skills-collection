---
name: VLM
description: Implement vision-based AI chat capabilities using the z-ai-web-dev-sdk. Use this skill when the user needs to analyze images, describe visual content, or create applications that combine image understanding with conversational AI. Supports image URLs and base64 encoded images, video analysis, document understanding, and multi-modal interactions with extended thinking.
license: MIT
version: 2.0.0
last_updated: 2026-03
---

# VLM (Vision Language Model) Skill

This skill guides the implementation of vision chat functionality using the z-ai-web-dev-sdk package, enabling AI models to understand and respond to images, videos, and documents combined with text prompts.

## Skills Path

**Skill Location**: `{project_path}/skills/VLM`

**Reference Scripts**: Example test scripts are available in the `{Skill Location}/scripts/` directory for quick testing and reference. See `{Skill Location}/scripts/vlm.ts` for a working example.

## Overview

Vision Chat allows you to build applications that can analyze images, videos, and documents, extract information from visual content, and answer questions through natural language conversation.

**IMPORTANT**: z-ai-web-dev-sdk MUST be used in backend code only. Never use it in client-side code.

## 🆕 What's New in 2026

### Latest Features (March 2026)
- **Video Understanding**: Full video analysis with temporal reasoning
- **Document AI**: Parse PDFs, DOCX, and scanned documents
- **Multi-Image Analysis**: Compare and analyze multiple images simultaneously
- **OCR Enhancement**: 99.5% accuracy text extraction with layout preservation
- **Chart & Graph Understanding**: Extract data from visualizations
- **Real-time Streaming**: Stream analysis of large files
- **Extended Thinking**: Deep visual reasoning capabilities
- **Spatial Reasoning**: Understand object positions and relationships

### Performance Improvements
- 3x faster image processing
- 40% improvement in complex scene understanding
- Support for images up to 50MP resolution
- Video analysis up to 10 minutes
- Multi-page document support

## Prerequisites

The z-ai-web-dev-sdk package is already installed. Import it as shown in the examples below.

## CLI Usage (For Simple Tasks)

### Basic Image Analysis

```bash
# Describe an image
z-ai vision -p "What's in this image?" -i "https://example.com/photo.jpg"

# Detailed analysis with thinking
z-ai vision -p "Analyze this image in detail" -i "./photo.jpg" --thinking

# Save analysis to file
z-ai vision -p "Describe the scene" -i "./landscape.png" -o analysis.json
```

### Video Analysis (NEW 2026)

```bash
# Analyze a video
z-ai vision -p "What happens in this video?" -i "./video.mp4" --type video

# Video with timeline
z-ai vision -p "Create a timeline of events" -i "./movie.mp4" --type video --timeline

# Analyze specific timestamps
z-ai vision -p "What happens at 1:30?" -i "./recording.mp4" --type video
```

### Document Analysis (NEW 2026)

```bash
# Analyze PDF document
z-ai vision -p "Summarize this document" -i "./report.pdf" --type document

# Extract tables from document
z-ai vision -p "Extract all tables as JSON" -i "./spreadsheet.pdf" --type document

# OCR on scanned document
z-ai vision -p "Extract all text preserving layout" -i "./scan.jpg" --ocr
```

### Multi-Image Analysis (NEW 2026)

```bash
# Compare images
z-ai vision -p "Compare these images" -i "./before.jpg" -i "./after.jpg"

# Find differences
z-ai vision -p "What changed between these photos?" \
  -i "./photo1.jpg" -i "./photo2.jpg" --thinking
```

### CLI Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `--prompt, -p` | Question or instruction | Required |
| `--image, -i` | Image/video/document URL or path | Required |
| `--type` | Content type: image/video/document | auto |
| `--thinking, -t` | Enable extended reasoning | false |
| `--output, -o` | Output file path | - |
| `--stream` | Stream response | false |
| `--ocr` | Enable OCR mode | false |
| `--timeline` | Generate timeline (video) | false |

## Supported Content Types

### 1. Images
- PNG, JPEG, GIF, WebP, BMP, TIFF
- Up to 50MP resolution
- Base64 or URL

### 2. Videos (NEW 2026)
- MP4, AVI, MOV, WebM, MKV
- Up to 10 minutes
- Automatic keyframe extraction

### 3. Documents (NEW 2026)
- PDF, DOCX, XLSX, PPTX
- Images of documents (scanned)
- Multi-page support

## Basic Vision Chat Implementation

### Single Image Analysis

```javascript
import ZAI from 'z-ai-web-dev-sdk';

async function analyzeImage(imageUrl, question) {
  const zai = await ZAI.create();

  const response = await zai.chat.completions.createVision({
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: question },
          { type: 'image_url', image_url: { url: imageUrl } }
        ]
      }
    ]
  });

  return response.choices[0]?.message?.content;
}

// Usage
const result = await analyzeImage(
  'https://example.com/product.jpg',
  'Describe this product in detail'
);
```

### Video Analysis (NEW 2026)

```javascript
import ZAI from 'z-ai-web-dev-sdk';

async function analyzeVideo(videoUrl, question) {
  const zai = await ZAI.create();

  const response = await zai.chat.completions.createVision({
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: question },
          { type: 'video_url', video_url: { url: videoUrl } }
        ]
      }
    ],
    thinking: { type: 'extended' } // Enable for complex video analysis
  });

  return response.choices[0]?.message?.content;
}

// Usage
const summary = await analyzeVideo(
  './presentation.mp4',
  'Summarize the key points from this video'
);
```

### Document Analysis (NEW 2026)

```javascript
import ZAI from 'zai-web-dev-sdk';
import fs from 'fs';

async function analyzeDocument(documentPath, question) {
  const zai = await ZAI.create();

  // Read and encode document
  const docBuffer = fs.readFileSync(documentPath);
  const base64Doc = docBuffer.toString('base64');
  const mimeType = documentPath.endsWith('.pdf') ? 'application/pdf' : 
                   documentPath.endsWith('.docx') ? 'application/docx' : 
                   'application/octet-stream';

  const response = await zai.chat.completions.createVision({
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: question },
          { 
            type: 'file_url', 
            file_url: { 
              url: `data:${mimeType};base64,${base64Doc}` 
            } 
          }
        ]
      }
    ]
  });

  return response.choices[0]?.message?.content;
}

// Usage
const summary = await analyzeDocument(
  './report.pdf',
  'Summarize the main findings of this report'
);
```

### Multi-Image Comparison (NEW 2026)

```javascript
import ZAI from 'z-ai-web-dev-sdk';

async function compareImages(imageUrls, question) {
  const zai = await ZAI.create();

  const content = [
    { type: 'text', text: question },
    ...imageUrls.map((url, index) => ({
      type: 'image_url',
      image_url: { 
        url,
        detail: 'high' // Request high detail analysis
      }
    }))
  ];

  const response = await zai.chat.completions.createVision({
    messages: [{ role: 'user', content }],
    thinking: { type: 'extended' }
  });

  return response.choices[0]?.message?.content;
}

// Usage
const comparison = await compareImages(
  ['https://example.com/before.jpg', 'https://example.com/after.jpg'],
  'Compare these two images and describe all differences'
);
```

## Advanced Use Cases

### OCR with Layout Preservation (NEW 2026)

```javascript
import ZAI from 'z-ai-web-dev-sdk';

async function extractTextWithLayout(imageUrl) {
  const zai = await ZAI.create();

  const response = await zai.chat.completions.createVision({
    messages: [
      {
        role: 'user',
        content: [
          { 
            type: 'text', 
            text: `Extract all text from this image. 
                   Preserve the layout and structure.
                   Return in markdown format with:
                   - Headers as ##
                   - Lists as bullet points
                   - Tables as markdown tables
                   - Preserve line breaks` 
          },
          { type: 'image_url', image_url: { url: imageUrl } }
        ]
      }
    ]
  });

  return response.choices[0]?.message?.content;
}
```

### Chart & Graph Data Extraction (NEW 2026)

```javascript
import ZAI from 'z-ai-web-dev-sdk';

async function extractChartData(imageUrl) {
  const zai = await ZAI.create();

  const response = await zai.chat.completions.createVision({
    messages: [
      {
        role: 'user',
        content: [
          { 
            type: 'text', 
            text: `Extract all data from this chart/graph.
                   Return as JSON with:
                   {
                     "chartType": "bar|line|pie|scatter|...",
                     "title": "...",
                     "xAxis": { "label": "...", "data": [...] },
                     "yAxis": { "label": "...", "data": [...] },
                     "series": [{ "name": "...", "data": [...] }],
                     "legend": [...]
                   }` 
          },
          { type: 'image_url', image_url: { url: imageUrl } }
        ]
      }
    ],
    response_format: { type: 'json_object' }
  });

  return JSON.parse(response.choices[0]?.message?.content);
}
```

### Video Timeline Generation (NEW 2026)

```javascript
import ZAI from 'z-ai-web-dev-sdk';

async function generateVideoTimeline(videoUrl) {
  const zai = await ZAI.create();

  const response = await zai.chat.completions.createVision({
    messages: [
      {
        role: 'user',
        content: [
          { 
            type: 'text', 
            text: `Create a detailed timeline of this video.
                   For each significant moment, provide:
                   - Timestamp (MM:SS format)
                   - Description
                   - Key objects/people visible
                   - Actions occurring
                   
                   Format as JSON array.` 
          },
          { type: 'video_url', video_url: { url: videoUrl } }
        ]
      }
    ],
    thinking: { type: 'extended' }
  });

  return JSON.parse(response.choices[0]?.message?.content);
}
```

### Spatial Reasoning (NEW 2026)

```javascript
import ZAI from 'z-ai-web-dev-sdk';

async function analyzeSpatialRelationships(imageUrl) {
  const zai = await ZAI.create();

  const response = await zai.chat.completions.createVision({
    messages: [
      {
        role: 'user',
        content: [
          { 
            type: 'text', 
            text: `Analyze the spatial relationships in this image:
                   1. List all objects detected
                   2. Describe positions (left/right/center, top/bottom)
                   3. Describe relationships (on top of, next to, behind, in front of)
                   4. Estimate distances between objects
                   5. Describe depth perception` 
          },
          { type: 'image_url', image_url: { url: imageUrl } }
        ]
      }
    ],
    thinking: { type: 'extended' }
  });

  return response.choices[0]?.message?.content;
}
```

### Multi-turn Vision Conversation

```javascript
import ZAI from 'z-ai-web-dev-sdk';

class VisionConversation {
  constructor() {
    this.messages = [];
  }

  async initialize() {
    this.zai = await ZAI.create();
  }

  async addImage(imageUrl, question) {
    this.messages.push({
      role: 'user',
      content: [
        { type: 'text', text: question },
        { type: 'image_url', image_url: { url: imageUrl } }
      ]
    });

    return this.getResponse();
  }

  async addVideo(videoUrl, question) {
    this.messages.push({
      role: 'user',
      content: [
        { type: 'text', text: question },
        { type: 'video_url', video_url: { url: videoUrl } }
      ]
    });

    return this.getResponse();
  }

  async ask(question) {
    this.messages.push({
      role: 'user',
      content: [{ type: 'text', text: question }]
    });

    return this.getResponse();
  }

  async getResponse() {
    const response = await this.zai.chat.completions.createVision({
      messages: this.messages
    });

    const content = response.choices[0]?.message?.content;

    this.messages.push({
      role: 'assistant',
      content
    });

    return content;
  }
}

// Usage
const chat = new VisionConversation();
await chat.initialize();

const initial = await chat.addImage(
  './diagram.png',
  'What does this diagram show?'
);

const followup = await chat.ask('Can you explain the flow in more detail?');

const details = await chat.ask('What are the key components?');
```

## Best Practices (2026)

### 1. Image Quality Guidelines

| Resolution | Use Case | Recommended Format |
|------------|----------|-------------------|
| < 1MP | Thumbnails, icons | JPEG (small) |
| 1-5MP | Standard photos | JPEG/PNG |
| 5-20MP | Detailed analysis | PNG |
| > 20MP | Document OCR | PNG/TIFF |

### 2. Video Analysis Tips

```javascript
// For long videos, analyze in segments
async function analyzeLongVideo(videoUrl, duration) {
  const segments = [];
  const segmentLength = 60; // 1 minute segments

  for (let start = 0; start < duration; start += segmentLength) {
    const analysis = await analyzeVideoSegment(
      videoUrl, 
      start, 
      start + segmentLength
    );
    segments.push(analysis);
  }

  return combineAnalyses(segments);
}
```

### 3. Error Handling

```javascript
async function safeVisionAnalysis(content, question) {
  try {
    const zai = await ZAI.create();

    const response = await zai.chat.completions.createVision({
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: question },
            ...content
          ]
        }
      ]
    });

    return {
      success: true,
      content: response.choices[0]?.message?.content
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}
```

## Common Use Cases

| Use Case | Input Type | Recommended Prompt |
|----------|-----------|-------------------|
| Product Description | Image | "Describe product features and benefits" |
| Document OCR | Document/Image | "Extract all text preserving layout" |
| Chart Analysis | Image | "Extract data and explain trends" |
| Video Summary | Video | "Summarize key events chronologically" |
| Comparison | Multi-Image | "Compare and highlight differences" |
| Accessibility | Image | "Generate detailed alt text" |
| Quality Control | Image | "Identify defects or anomalies" |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Image not loading | Verify URL accessibility and format |
| Video too long | Split into segments < 10 minutes |
| Poor OCR quality | Use higher resolution image |
| Slow processing | Enable streaming mode |
| Inaccurate analysis | Use extended thinking mode |
| Content type mismatch | Explicitly set `type` parameter |

## Remember

- Always use z-ai-web-dev-sdk in backend code only
- Use `thinking: { type: 'extended' }` for complex analysis
- Videos up to 10 minutes supported
- Documents: PDF, DOCX, XLSX supported
- Multi-image comparison available
- OCR with layout preservation
- Chart data extraction available
- Implement proper error handling
