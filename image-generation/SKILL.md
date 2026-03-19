---
name: image-generation
description: Implement AI image generation capabilities using the z-ai-web-dev-sdk. Use this skill when the user needs to create images from text descriptions, generate visual content, create artwork, design assets, or build applications with AI-powered image creation. Supports 7 image sizes, style transfer, image editing, inpainting, outpainting, and upscaling up to 4K resolution.
license: MIT
version: 2.0.0
last_updated: 2026-03
---

# Image Generation Skill

This skill guides the implementation of image generation functionality using the z-ai-web-dev-sdk package and CLI tool, enabling creation of high-quality images from text descriptions.

## Skills Path

**Skill Location**: `{project_path}/skills/image-generation`

**Reference Scripts**: Example test scripts are available in the `{Skill Location}/scripts/` directory for quick testing and reference.

## Overview

Image Generation allows you to build applications that create visual content from text prompts using AI models, enabling creative workflows, design automation, and visual content production.

**IMPORTANT**: z-ai-web-dev-sdk MUST be used in backend code only. Never use it in client-side code.

## 🆕 What's New in 2026

### Latest Features (March 2026)
- **Ultra-HD Generation**: Create images up to 4K resolution (4096x4096)
- **Style Transfer**: Apply artistic styles to generated images
- **Image Editing**: Modify existing images with AI
- **Inpainting**: Edit specific regions of images
- **Outpainting**: Extend images beyond original boundaries
- **Upscaling**: Enhance image resolution with AI
- **Negative Prompts**: Exclude unwanted elements
- **Seed Control**: Reproducible image generation
- **Multi-Image Generation**: Generate multiple variations at once

### Quality Improvements
- 50% improvement in prompt adherence
- Better text rendering in images
- Enhanced photorealism
- Improved artistic style accuracy
- Faster generation (2x speed)

## CLI Usage

### Basic Generation

```bash
# Simple image generation
z-ai image -p "A serene mountain landscape at sunset" -o ./landscape.png

# Specify size
z-ai image -p "Modern office interior" -o ./office.png -s 1440x720

# High resolution (NEW 2026)
z-ai image -p "Detailed cityscape" -o ./city.png -s 2048x2048
```

### Advanced Options (NEW 2026)

```bash
# With style preset
z-ai image -p "Portrait of a person" -o ./portrait.png --style photorealistic

# Negative prompt
z-ai image -p "Beautiful garden" -o ./garden.png --negative "people, buildings"

# With seed for reproducibility
z-ai image -p "Abstract art" -o ./art.png --seed 12345

# Multiple variations
z-ai image -p "Logo design" -o ./logo.png --variations 4

# Ultra-HD with upscaling
z-ai image -p "Detailed illustration" -o ./illustration.png --upscale 2x
```

### Image Editing (NEW 2026)

```bash
# Inpainting - edit specific region
z-ai image edit -i ./photo.png --mask ./mask.png -p "Add a red apple" -o ./edited.png

# Outpainting - extend image
z-ai image outpaint -i ./photo.png -p "Extend the scene" -o ./extended.png

# Style transfer
z-ai image style -i ./photo.png --style "Van Gogh" -o ./styled.png
```

### CLI Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `--prompt, -p` | Text description | Required |
| `--output, -o` | Output file path | Required |
| `--size, -s` | Image dimensions | 1024x1024 |
| `--style` | Style preset | - |
| `--negative` | Negative prompt | - |
| `--seed` | Random seed | random |
| `--variations` | Number of variations | 1 |
| `--upscale` | Upscale factor (2x, 4x) | - |
| `--quality` | Quality: standard/hd | standard |

## Supported Sizes (2026)

| Size | Aspect Ratio | Best For |
|------|--------------|----------|
| 1024x1024 | 1:1 | Social media, icons |
| 768x1344 | 9:16 | Stories, reels |
| 864x1152 | 3:4 | Portraits |
| 1344x768 | 16:9 | Banners, headers |
| 1152x864 | 4:3 | Presentations |
| 1440x720 | 2:1 | Wide banners |
| 720x1440 | 1:2 | Tall posters |
| 2048x2048 | 1:1 | High detail (NEW) |
| 4096x4096 | 1:1 | Ultra-HD (NEW) |

## Style Presets (NEW 2026)

```javascript
const stylePresets = {
  // Photographic
  photorealistic: 'photorealistic, highly detailed, professional photography',
  cinematic: 'cinematic, dramatic lighting, movie still',
  portrait: 'professional portrait photography, studio lighting',
  
  // Artistic
  anime: 'anime style, vibrant colors, detailed',
  oil_painting: 'oil painting style, textured brushstrokes',
  watercolor: 'watercolor painting, soft colors, artistic',
  sketch: 'pencil sketch, detailed linework',
  
  // Digital Art
  digital_art: 'digital art, trending on artstation',
  concept_art: 'concept art, detailed, atmospheric',
  3d_render: '3D render, octane render, highly detailed',
  
  // Design
  minimal: 'minimalist design, clean, simple',
  vintage: 'vintage style, retro aesthetic',
  futuristic: 'futuristic, sci-fi, cyberpunk'
};
```

## Basic Implementation

### Simple Image Generation

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function generateImage(prompt, outputPath) {
  const zai = await ZAI.create();

  const response = await zai.images.generations.create({
    prompt: prompt,
    size: '1024x1024',
    quality: 'standard'
  });

  const imageBase64 = response.data[0].base64;
  const buffer = Buffer.from(imageBase64, 'base64');
  
  fs.writeFileSync(outputPath, buffer);
  
  return {
    path: outputPath,
    size: buffer.length,
    width: 1024,
    height: 1024
  };
}

// Usage
const result = await generateImage(
  'A serene Japanese garden with cherry blossoms',
  './garden.png'
);
```

### High-Resolution Generation (NEW 2026)

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function generateUltraHD(prompt, outputPath) {
  const zai = await ZAI.create();

  const response = await zai.images.generations.create({
    prompt: prompt,
    size: '2048x2048', // or 4096x4096 for ultra-HD
    quality: 'hd',
    style: 'photorealistic'
  });

  const imageBase64 = response.data[0].base64;
  const buffer = Buffer.from(imageBase64, 'base64');
  
  fs.writeFileSync(outputPath, buffer);
  
  return { path: outputPath, resolution: '2048x2048' };
}
```

### With Advanced Options (NEW 2026)

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function generateWithOptions(prompt, options = {}) {
  const zai = await ZAI.create();

  const response = await zai.images.generations.create({
    prompt: prompt,
    negative_prompt: options.negative || '',
    size: options.size || '1024x1024',
    style: options.style,
    seed: options.seed,
    quality: options.quality || 'standard',
    n: options.variations || 1
  });

  const images = response.data.map((img, index) => {
    const buffer = Buffer.from(img.base64, 'base64');
    const path = `${options.outputDir}/image_${index}.png`;
    fs.writeFileSync(path, buffer);
    return { path, size: buffer.length };
  });

  return images;
}

// Usage
const images = await generateWithOptions(
  'A futuristic city skyline at night',
  {
    size: '1344x768',
    style: 'cinematic',
    negative: 'blurry, low quality, text',
    seed: 12345,
    variations: 4,
    outputDir: './generated'
  }
);
```

## Advanced Use Cases

### Image Inpainting (NEW 2026)

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function inpaintImage(imagePath, maskPath, prompt, outputPath) {
  const zai = await ZAI.create();

  const imageBase64 = fs.readFileSync(imagePath).toString('base64');
  const maskBase64 = fs.readFileSync(maskPath).toString('base64');

  const response = await zai.images.edits.create({
    image: imageBase64,
    mask: maskBase64,
    prompt: prompt,
    size: '1024x1024'
  });

  const resultBase64 = response.data[0].base64;
  const buffer = Buffer.from(resultBase64, 'base64');
  
  fs.writeFileSync(outputPath, buffer);
  return outputPath;
}

// Usage
await inpaintImage(
  './original.png',
  './mask.png', // White areas will be edited
  'Add a red sports car',
  './edited.png'
);
```

### Image Upscaling (NEW 2026)

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function upscaleImage(imagePath, scale, outputPath) {
  const zai = await ZAI.create();

  const imageBase64 = fs.readFileSync(imagePath).toString('base64');

  const response = await zai.images.upscale.create({
    image: imageBase64,
    scale: scale // 2 or 4
  });

  const resultBase64 = response.data[0].base64;
  const buffer = Buffer.from(resultBase64, 'base64');
  
  fs.writeFileSync(outputPath, buffer);
  
  return {
    path: outputPath,
    originalSize: fs.statSync(imagePath).size,
    newSize: buffer.length
  };
}

// Usage - Upscale 2x
await upscaleImage('./low_res.png', 2, './high_res.png');

// Usage - Upscale 4x for ultra-HD
await upscaleImage('./photo.png', 4, './ultra_hd.png');
```

### Style Transfer (NEW 2026)

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function transferStyle(imagePath, style, outputPath) {
  const zai = await ZAI.create();

  const imageBase64 = fs.readFileSync(imagePath).toString('base64');

  const response = await zai.images.style.transfer({
    image: imageBase64,
    style: style, // 'van_gogh', 'monet', 'picasso', etc.
    strength: 0.8 // Style intensity 0-1
  });

  const resultBase64 = response.data[0].base64;
  const buffer = Buffer.from(resultBase64, 'base64');
  
  fs.writeFileSync(outputPath, buffer);
  return outputPath;
}

// Usage
await transferStyle('./photo.png', 'van_gogh', './styled.png');
```

### Batch Generation with Caching

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

class ImageGenerator {
  constructor(cacheDir = './image_cache') {
    this.cacheDir = cacheDir;
    this.zai = null;
    
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
  }

  async initialize() {
    this.zai = await ZAI.create();
  }

  getCacheKey(prompt, options) {
    return crypto
      .createHash('md5')
      .update(prompt + JSON.stringify(options))
      .digest('hex');
  }

  async generate(prompt, options = {}) {
    const cacheKey = this.getCacheKey(prompt, options);
    const cacheFile = path.join(this.cacheDir, `${cacheKey}.png`);

    // Check cache
    if (fs.existsSync(cacheFile)) {
      return { path: cacheFile, cached: true };
    }

    // Generate
    const response = await this.zai.images.generations.create({
      prompt,
      size: options.size || '1024x1024',
      style: options.style,
      negative_prompt: options.negative,
      seed: options.seed
    });

    const buffer = Buffer.from(response.data[0].base64, 'base64');
    fs.writeFileSync(cacheFile, buffer);

    return { path: cacheFile, cached: false };
  }
}

// Usage
const generator = new ImageGenerator();
await generator.initialize();

const img1 = await generator.generate('Sunset over ocean');
const img2 = await generator.generate('Sunset over ocean'); // Cached
```

## Prompt Engineering Tips

### Effective Prompt Structure

```javascript
const buildPrompt = (subject, style, details = [], quality = 'high quality') => {
  const parts = [
    subject,
    style,
    ...details,
    quality,
    'detailed'
  ];
  
  return parts.filter(Boolean).join(', ');
};

// Usage
const prompt = buildPrompt(
  'mountain landscape',
  'oil painting style',
  ['sunset lighting', 'dramatic clouds', 'reflection in lake'],
  'professional quality'
);
// Result: "mountain landscape, oil painting style, sunset lighting, dramatic clouds, reflection in lake, professional quality, detailed"
```

### Prompt Examples

```javascript
const promptExamples = {
  // Photorealistic
  product: 'Product photography of wireless headphones, white background, studio lighting, professional, high detail',
  portrait: 'Professional portrait photography, natural lighting, sharp focus, bokeh background',
  architecture: 'Modern architecture photography, golden hour, clean composition, professional',
  
  // Artistic
  illustration: 'Digital illustration, vibrant colors, detailed, trending on artstation',
  anime: 'Anime style illustration, expressive, detailed, beautiful lighting',
  concept: 'Concept art, atmospheric, detailed, professional matte painting',
  
  // Design
  logo: 'Minimalist logo design, clean lines, professional, memorable',
  banner: 'Website hero banner, modern design, corporate style, clean'
};
```

## Common Use Cases

| Use Case | Recommended Settings |
|----------|---------------------|
| Social Media | size: 1024x1024, style: vibrant |
| Website Hero | size: 1440x720, style: professional |
| Product Images | size: 1024x1024, quality: hd |
| Blog Headers | size: 1344x768, style: editorial |
| Thumbnails | size: 1024x1024 |
| Logo Drafts | size: 1024x1024, style: minimal |
| Art Prints | size: 2048x2048, quality: hd |

## Remember

- Always use z-ai-web-dev-sdk in backend code only
- Support sizes up to 4096x4096 (Ultra-HD)
- Use negative prompts to exclude unwanted elements
- Seed control for reproducible results
- Implement caching for repeated prompts
- Style presets for consistent aesthetics
- Upscaling available up to 4x
- Inpainting and outpainting supported
