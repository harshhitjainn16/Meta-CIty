# 🎨 MetaCity - Visual Guide

## 🌈 Color Palette

### Primary Colors

```css
--cyber-blue: #00d4ff      /* Electric Blue - Primary actions */
--cyber-purple: #b537ff    /* Neon Purple - Secondary elements */
--neon-green: #39ff14      /* Bright Green - Success/Sustainability */
--cyber-pink: #ff006e      /* Hot Pink - Highlights */
```

### Background Colors

```css
--dark-bg: #0a0e27        /* Deep Space Blue - Main background */
--dark-card: #151932      /* Dark Navy - Card backgrounds */
```

### Building Colors

- 🏠 Residential: `#4CAF50` (Green)
- 🏢 Commercial: `#2196F3` (Blue)
- 🏭 Industrial: `#FF9800` (Orange)
- 🌳 Park: `#8BC34A` (Light Green)
- ☀️ Solar Farm: `#FFC107` (Yellow)
- 🏥 Hospital: `#F44336` (Red)
- 🏫 School: `#9C27B0` (Purple)
- ♻️ Recycling: `#00BCD4` (Cyan)

## 🎭 UI Components

### Button Styles

**Primary Button**

```tsx
<button className="btn-primary">Action</button>
```

- Gradient background (blue → purple → pink)
- White text
- Hover: Scale up + glow effect

**Secondary Button**

```tsx
<button className="btn-secondary">Cancel</button>
```

- Dark background with border
- Colored text
- Hover: Background tint

### Card Styles

**Standard Card**

```tsx
<div className="card-gradient p-6 rounded-xl border border-cyber-blue/30">
  Content
</div>
```

**Glass Effect**

```tsx
<div className="glass-effect p-4 rounded-lg">Content</div>
```

## 🔤 Typography

### Fonts

- **Headings**: [Orbitron](https://fonts.google.com/specimen/Orbitron) - Futuristic, tech-inspired
- **Body Text**: [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) - Modern, readable

### Usage

```tsx
<h1 className="font-orbitron text-3xl font-bold">Title</h1>
<p className="font-space-grotesk text-base">Body text</p>
```

### Text Gradients

```tsx
<h1 className="text-gradient">Gradient Text</h1>
```

## 🎬 Animations

### Float Animation

```tsx
<div className="animate-float">Floating Element</div>
```

### Glow Effect

```tsx
<div className="animate-glow">Glowing Element</div>
```

### Framer Motion Patterns

**Fade In**

```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

**Slide Up**

```tsx
<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
  Content
</motion.div>
```

**Hover Scale**

```tsx
<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
  Interactive Element
</motion.div>
```

## 📱 Responsive Design

### Breakpoints

```tsx
sm: 640px   // Mobile landscape
md: 768px   // Tablet
lg: 1024px  // Desktop
xl: 1280px  // Large desktop
```

### Grid Patterns

```tsx
{/* Mobile: 1 col, Tablet: 2 cols, Desktop: 4 cols */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
```

## 🎨 Component Examples

### Stat Card

```tsx
<div className="card-gradient p-6 rounded-xl border border-cyber-blue/30">
  <div className="text-cyber-blue mb-3">
    <Icon className="w-8 h-8" />
  </div>
  <p className="text-gray-400 text-sm">Label</p>
  <p className="text-3xl font-orbitron font-bold text-cyber-blue">Value</p>
</div>
```

### Progress Bar

```tsx
<div className="w-full bg-dark-card rounded-full h-3">
  <div
    className="bg-gradient-to-r from-neon-green to-cyber-blue h-3 rounded-full"
    style={{ width: "75%" }}
  />
</div>
```

### Badge

```tsx
<span className="bg-cyber-blue/20 text-cyber-blue px-3 py-1 rounded-full text-xs font-orbitron">
  Badge
</span>
```

## 🌟 Special Effects

### Neon Glow

```css
box-shadow: 0 0 10px #00d4ff, 0 0 20px #00d4ff, 0 0 30px #00d4ff;
```

### Gradient Background

```css
background: linear-gradient(135deg, #00d4ff 0%, #b537ff 50%, #ff006e 100%);
```

### Backdrop Blur

```tsx
<div className="bg-dark-card/80 backdrop-blur-md">
  Content with blurred background
</div>
```

## 🎯 Best Practices

### 1. Consistency

- Use defined color palette
- Stick to font choices
- Maintain spacing rhythm (4px increments)

### 2. Accessibility

- Ensure sufficient contrast
- Add hover states
- Include focus indicators

### 3. Performance

- Use Tailwind utilities
- Lazy load heavy components
- Optimize images

### 4. Mobile-First

- Design for mobile first
- Test on multiple devices
- Use responsive utilities

## 🚀 Quick Customization

### Change Theme Colors

Edit `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      'cyber-blue': '#YOUR_COLOR',
      'cyber-purple': '#YOUR_COLOR',
      // ...
    }
  }
}
```

### Add Custom Animation

In `globals.css`:

```css
@keyframes yourAnimation {
  0% {
    /* start state */
  }
  100% {
    /* end state */
  }
}

.your-animation {
  animation: yourAnimation 2s ease-in-out infinite;
}
```

### Create Custom Component

```tsx
// components/YourComponent.tsx
import { motion } from "framer-motion";

export default function YourComponent() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="card-gradient p-6 rounded-xl"
    >
      Your Content
    </motion.div>
  );
}
```

## 📸 Screenshots Guide

For your hackathon submission, capture:

1. **Landing Page** - Full hero section
2. **3D City View** - Show interactive scene
3. **Dashboard** - Display all charts
4. **Proposal Creation** - Modal open
5. **Voting Interface** - Active proposal
6. **Staking Panel** - With numbers filled
7. **Buildings Gallery** - NFT collection
8. **Mobile View** - Responsive design

## 🎬 Demo Video Tips

1. **Start with Impact** - Show 3D city first
2. **Smooth Transitions** - Use tab navigation
3. **Highlight Interactions** - Click, hover, scroll
4. **Show Numbers** - Emphasize rewards, APY
5. **End Strong** - Display dashboard stats

---

_Remember: Consistency + Animation + Color = Winning UI!_ ✨
