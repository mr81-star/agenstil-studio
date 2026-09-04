# 🎬 Agenstil Avatar & Feedback Videos - Lego Edition

## Overview

Agenstil now generates **brand-focused Lego avatar and feedback videos** instead of human avatars. These dynamic, playful videos showcase brand products and services through Lego characters and scenes, creating engaging promotional content.

### Video URL Example
Reference: https://youtube.com/shorts/mcugfVT5RhY?si=C8qMUbmKKBTcd44c

---

## 🎯 Core Concept

**No human avatars or feedback photos.** Instead:
- **Lego characters** represent the brand
- **Lego scenes** showcase brand products/services
- **Brand-praising scripts** highlight benefits and features
- **Video engagement button** enables "Edit with Agent" for customization

---

## 📹 Video Types

### **Type 1: Lego Avatar Videos** (3 Variants)

Brand ambassador represented as Lego character giving positive reviews about brand products.

#### 1.1 Product Review Avatar
- **Duration**: 35 seconds to 2 minutes
- **Content**: Lego character holding/using brand product in hand
- **Script**: Praising product quality, features, benefits
- **Example Scene**: "Lego builder holding your product, explaining why it's amazing"
- **CTA**: "Like/Love it" sentiment

#### 1.2 Lifestyle Showcase Avatar
- **Duration**: 35 seconds to 2 minutes
- **Content**: Lego character using brand product/service in everyday scenario
- **Script**: Demonstrating how product enhances daily life
- **Example Scene**: "Lego character in house/office environment with brand product in use"
- **CTA**: Product benefit statement

#### 1.3 Feature Highlight Avatar
- **Duration**: 35 seconds to 2 minutes
- **Content**: Lego character highlighting specific product features
- **Script**: Technical benefits, unique selling points, value proposition
- **Example Scene**: "Lego builder pointing out/demonstrating key features"
- **CTA**: Comparison or recommendation

---

### **Type 2: Lego Feedback Videos** (3 Variants)

Customer feedback transformed into Lego testimonials and reviews.

#### 2.1 Product Appreciation Feedback
- **Duration**: 35 seconds to 2 minutes
- **Content**: Lego character expressing satisfaction with brand
- **Script**: Positive feedback, ratings, appreciation message
- **Example Scene**: "Lego figure giving thumbs up or holding brand product with happy expression"
- **CTA**: "Loved it!", "5-star rating", testimonial text

#### 2.2 Use Case Success Feedback
- **Duration**: 35 seconds to 2 minutes
- **Content**: Lego character demonstrating successful product usage
- **Script**: How product solved a problem or met customer need
- **Example Scene**: "Before/after Lego scenes showing product impact"
- **CTA**: Success story, transformation message

#### 2.3 Brand Loyalty Feedback
- **Duration**: 35 seconds to 2 minutes
- **Content**: Lego character as long-time brand fan
- **Script**: Recurring customer testimonial, brand trust, repeat purchase motivation
- **Example Scene**: "Lego figure with multiple brand products or brand timeline"
- **CTA**: "Recommend to everyone", loyalty statement

---

## 🎨 Content Guidelines

### Script Requirements
- ✅ **Promotional tone**: Praise, appreciate, recommend brand
- ✅ **Clear messaging**: 1-2 main benefits per video
- ✅ **Authentic testimonial feel**: Natural language, relatable
- ✅ **Call-to-action**: Clear next step or sentiment ("Like it", "Buy now", "Try this", etc.)
- ��� **Duration-optimized**: Content fills 35 seconds to 2 minutes naturally

### Visual Style
- ✅ **Lego characters only** - Never use human avatars or photos
- ✅ **Lego scenes** - Buildings, environments, product displays
- ✅ **Brand elements** - Product visuals, logos, colors integrated
- ✅ **Smooth animations** - Professional transitions between scenes
- ✅ **High quality** - 1080p minimum, optimized for mobile/shorts

### Audio Requirements
- ✅ **AI voice-over** using brand-appropriate tone
- ✅ **Background music** - Upbeat, brand-aligned
- ✅ **Sound effects** - Lego building/clicking sounds optional
- ✅ **Clear audio** - Professional mixing, proper levels

---

## 🎬 Video Generation Workflow

### Step 1: Scene Creation
```
Input: Brand product/service + Type (Avatar/Feedback)
↓
Generate Lego scene images/frames using ComfyUI
- Lego character(s)
- Environment/setting
- Brand product placement
- Multiple angles/frames for animation
```

### Step 2: Script Generation
```
Input: Brand details + Video type + Tone
↓
AI generates compelling promotional script
- 1-2 minutes of narration
- Natural language flow
- Clear benefits highlighted
```

### Step 3: Animation & Composition
```
Input: Scene images + Script
↓
Create video sequence:
- Frame-by-frame animation
- Transitions between scenes
- Text overlays (optional)
- Duration: 35 sec to 2 min
```

### Step 4: Audio Processing
```
Input: Script + Voice settings
↓
- Text-to-speech generation (XTTS)
- Background music selection
- Sound effect integration
- Audio mixing
```

### Step 5: Final Video Assembly
```
Input: All components
↓
Produce final video with:
- Merged audio + video
- Proper color grading
- Brand watermark (optional)
- "Edit with Agent" button overlay
```

---

## 🎮 Agent Features

### Video Customization Options
Users can click **"Edit with Agent"** button to:

1. **Regenerate with Different Tone**
   - Formal → Casual
   - Technical → Simple
   - Intense → Playful

2. **Change Video Style**
   - Different Lego scene aesthetic
   - Animation speed/style
   - Product placement variation

3. **Modify Duration**
   - Shorten to 35 seconds
   - Extend to 2 minutes
   - Custom duration

4. **Update Script/Message**
   - Different benefits highlighted
   - Alternative CTA
   - Language/regional adaptation

5. **Regenerate Entirely**
   - New Lego characters
   - Different scenes
   - Alternative video type

---

## 🔧 Technical Implementation

### Models & Services Required
- **Image Generation**: ComfyUI + Stable Diffusion
- **Voice-over**: XTTS (Coqui) or similar TTS
- **Video Assembly**: FFmpeg
- **LLM for Scripts**: Ollama (Llama 3.1) or Groq
- **Animation**: Custom pipeline or Motion graphics

### Database Schema
```sql
-- Avatar/Feedback Videos
CREATE TABLE brand_videos (
  id UUID PRIMARY KEY,
  brand_id UUID REFERENCES brands(id),
  video_type ENUM('avatar', 'feedback'),
  variant INT (1-3),
  title VARCHAR(255),
  description TEXT,
  script TEXT,
  duration_seconds INT,
  status ENUM('pending', 'generating', 'completed', 'failed'),
  video_url VARCHAR(255),
  thumbnail_url VARCHAR(255),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  edited_count INT DEFAULT 0
);

-- Generation History
CREATE TABLE video_generations (
  id UUID PRIMARY KEY,
  video_id UUID REFERENCES brand_videos(id),
  generation_number INT,
  changes JSONB,
  created_at TIMESTAMP
);
```

---

## 📊 Content Examples

### Avatar Example: Product Review
```
Title: "Love This Product!"
Duration: 1 minute
Type: Product Review Avatar (Type 1.1)

Script: 
"Hey everyone! I'm absolutely loving this [Product Name]! 
The quality is incredible, and it's perfect for [use case]. 
If you haven't tried it yet, you're missing out. 
Seriously, go check it out - you'll love it!"

Visual: Lego character holding product, pointing out features, giving thumbs up
Audio: Upbeat voice-over with background music
CTA: "Get yours today!"
```

### Feedback Example: Use Case Success
```
Title: "Changed My Life!"
Duration: 45 seconds
Type: Use Case Success Feedback (Type 2.2)

Script:
"This [Product] has been a game-changer for me. 
I struggled with [problem] until I found this. 
Now I can [benefit] so much easier. 
Couldn't imagine going back!"

Visual: Before Lego scene (struggling) → After Lego scene (happy with product)
Audio: Testimonial-style voice-over
CTA: "Try it yourself!"
```

---

## 🚀 Integration Points

### In Dashboard
- **Library Tab**: View all generated avatar/feedback videos
- **Avatar/Feedback Generator**: Dedicated UI for creating videos
- **Edit with Agent**: Button on each video card
- **Regeneration History**: Track all versions

### In Campaign Builder
- Automatically suggest avatar/feedback videos for campaigns
- One-click insertion into email/social sequences
- Video analytics (views, engagement, CTR)

### In Library
- Filter by video type (Avatar/Feedback)
- Filter by variant (1/2/3)
- Sort by creation date/engagement
- Bulk edit with agent

---

## ✅ Quality Checklist

Before publishing video:
- [ ] Lego characters visible and well-rendered
- [ ] Brand product clearly shown
- [ ] Script matches video content
- [ ] Audio clear and professional
- [ ] Duration within 35 sec - 2 min
- [ ] "Edit with Agent" button visible
- [ ] Video optimized for mobile/shorts
- [ ] No human avatars or photos present
- [ ] Brand message clear and positive
- [ ] CTA compelling and actionable

---

## 🎯 KPIs to Track

- **Generation Time**: Average time to create single video
- **Edit Frequency**: How often "Edit with Agent" is used
- **Video Performance**: Views, engagement, click-through rate
- **Script Variety**: Unique scripts generated per brand
- **User Satisfaction**: Video rating/feedback

---

## 📚 Related Documentation

- [Avatar System](./features/avatar-system.md)
- [Video Generation Pipeline](./architecture.md#video-generation)
- [Agent System](./features/agents.md)
- [Library Management](./features/library.md)

---

**Last Updated**: September 2026
**Version**: 1.0 - Lego Avatar & Feedback Video System
