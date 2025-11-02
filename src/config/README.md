# Theme Configuration Guide

## Đồng bộ với Flutter AppColors

Theme này được đồng bộ hoàn toàn với `AppColors` và `AppColorsDark` từ Flutter app để đảm bảo consistency giữa mobile và web.

## Cách sử dụng trong Tailwind CSS

### Core Backgrounds

```tsx
// Background colors
<div className="bg-background">        {/* Auto light/dark */}
<div className="bg-background-light"> {/* Force light */}
<div className="bg-background-dark">  {/* Force dark */}

// Surface colors
<div className="bg-surface">          {/* Auto light/dark */}
<div className="bg-surface-light">    {/* Force light */}
<div className="bg-surface-dark">     {/* Force dark */}
```

### Brand & Status Colors

```tsx
// Primary (Brand green)
<div className="bg-primary">            {/* #21BC5A */}
<div className="bg-primary-base">        {/* #21BC5A */}
<div className="text-primary-base">     {/* Text color */}

// Gradient colors
<div className="bg-primary-gradient-start">
<div className="bg-primary-gradient-end">

// Warning
<div className="bg-warning-base">       {/* #FFD83D */}
<div className="bg-warning-update">    {/* #F96E38 */}

// Danger/Error
<div className="bg-danger-base">       {/* #C72323 */}
<div className="text-danger-base">
```

### Text Colors

```tsx
// Auto (theo light/dark mode)
<div className="text-text-primary">     {/* Auto primary text */}
<div className="text-text-secondary">   {/* Auto secondary text */}

// Force light mode colors
<div className="text-text-primary-light">    {/* #000000 */}
<div className="text-text-secondary-light"> {/* #738C80 */}

// Force dark mode colors
<div className="text-text-primary-dark">     {/* #EFEFEF */}
<div className="text-text-secondary-dark">  {/* #9FBBAF */}
<div className="text-text-hint-dark">      {/* #7A8B80 */}
```

### Borders & Inputs

```tsx
// Borders
<div className="border border-border">      {/* Auto light/dark */}
<div className="border border-border-light">
<div className="border border-border-dark">

// Input backgrounds
<div className="bg-input">                  {/* Auto */}
<div className="bg-input-light">           {/* #F5F5F5 */}
<div className="bg-input-dark">           {/* #2C2C2C */}
```

### Gradients

Có 3 cách sử dụng:

**1. Utility Classes (Dễ nhất):**
```tsx
<div className="bg-gradient-primary">              {/* Horizontal */}
<div className="bg-gradient-primary-vertical">    {/* Vertical */}
<div className="bg-gradient-secondary">          {/* Secondary horizontal */}
```

**2. Tailwind với arbitrary values:**
```tsx
<div className="bg-gradient-to-r from-primary-gradient-start to-primary-gradient-end">
```

**3. TypeScript helper:**
```tsx
import { createGradient } from '@/utils/gradient';

<div style={{ background: createGradient('primary', 'to-right') }}>
```

### Neutral Colors

Giữ nguyên để dùng cho UI consistency:

```tsx
<div className="bg-neutral-50">   {/* Lightest */}
<div className="bg-neutral-500">  {/* Medium */}
<div className="bg-neutral-900"> {/* Darkest */}
```

## Sử dụng trong TypeScript

```typescript
import { colors } from '@/config/colors';
import { theme } from '@/config/theme';

// Lấy màu trực tiếp
const primaryColor = colors.primary.base; // '#21BC5A'
const backgroundLight = colors.background.light; // '#F5F5F5'

// Hoặc từ theme config
const primaryFromTheme = theme.colors.primary.base;
```

## CSS Variables

Bạn cũng có thể dùng trực tiếp CSS variables:

```css
.my-element {
  background-color: var(--primary-base);
  color: var(--text-primary);
  border: 1px solid var(--border);
}
```

## Dark Mode

Dark mode tự động hoạt động dựa trên `prefers-color-scheme`. Các biến `--background`, `--surface`, `--text-primary`, etc. sẽ tự động chuyển đổi.

## Lưu ý

- Sử dụng `bg-background` và `bg-surface` thay vì hardcode màu
- Sử dụng `text-text-primary` và `text-text-secondary` cho text
- Sử dụng `border-border` cho borders
- Gradient cần dùng CSS hoặc Tailwind arbitrary values vì không có class mặc định
