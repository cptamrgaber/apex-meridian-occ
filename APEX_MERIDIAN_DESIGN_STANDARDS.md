# Apex-Meridian® Design Standards

## Typography

### Font Families
- **Primary**: Inter (sans-serif) - Clean, professional, highly readable
- **Monospace**: JetBrains Mono - For code and technical data
- **Fallback**: system-ui, -apple-system, sans-serif

### Font Sizes (Desktop)
- **Hero Heading (H1)**: 48px (3rem) - Bold
- **Page Heading (H2)**: 36px (2.25rem) - Bold
- **Section Heading (H3)**: 24px (1.5rem) - Semibold
- **Subsection (H4)**: 20px (1.25rem) - Semibold
- **Body Large**: 18px (1.125rem) - Regular
- **Body**: 16px (1rem) - Regular
- **Body Small**: 14px (0.875rem) - Regular
- **Caption**: 12px (0.75rem) - Regular

### Font Sizes (Mobile)
- **Hero Heading**: 32px (2rem)
- **Page Heading**: 28px (1.75rem)
- **Section Heading**: 20px (1.25rem)
- **Body**: 16px (1rem)

### Font Weights
- **Bold**: 700
- **Semibold**: 600
- **Medium**: 500
- **Regular**: 400

### Line Heights
- **Headings**: 1.2
- **Body**: 1.6
- **Tight**: 1.4

## Spacing System

### Base Unit: 4px

### Spacing Scale
- **xs**: 4px (0.25rem)
- **sm**: 8px (0.5rem)
- **md**: 16px (1rem)
- **lg**: 24px (1.5rem)
- **xl**: 32px (2rem)
- **2xl**: 48px (3rem)
- **3xl**: 64px (4rem)
- **4xl**: 96px (6rem)

### Component Spacing
- **Card Padding**: 24px (lg)
- **Section Margin**: 48px (2xl)
- **Element Gap**: 16px (md)
- **Button Padding**: 12px 24px
- **Input Padding**: 12px 16px

## Color Palette

### Brand Colors
- **Primary Blue**: #0066CC
- **Secondary Navy**: #003366
- **Accent Gold**: #FFB81C

### Functional Colors
- **Success Green**: #10B981
- **Warning Amber**: #F59E0B
- **Error Red**: #EF4444
- **Info Blue**: #3B82F6

### Neutral Colors (Light Theme)
- **Background**: #FFFFFF
- **Surface**: #F8FAFC
- **Border**: #E2E8F0
- **Text Primary**: #0F172A
- **Text Secondary**: #64748B
- **Text Tertiary**: #94A3B8

### Neutral Colors (Dark Theme)
- **Background**: #0F172A
- **Surface**: #1E293B
- **Border**: #334155
- **Text Primary**: #F8FAFC
- **Text Secondary**: #CBD5E1
- **Text Tertiary**: #94A3B8

## Layout

### Container Widths
- **Max Width**: 1440px
- **Content Width**: 1200px
- **Narrow Width**: 800px

### Grid System
- **Columns**: 12
- **Gutter**: 24px
- **Margin**: 24px (mobile), 48px (desktop)

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px
- **Wide**: > 1440px

## Components

### Cards
- **Border Radius**: 12px
- **Border**: 1px solid (border color)
- **Shadow**: 0 1px 3px rgba(0,0,0,0.1)
- **Padding**: 24px
- **Gap**: 16px

### Buttons
- **Height**: 44px (touch-friendly)
- **Border Radius**: 8px
- **Font Size**: 16px
- **Font Weight**: 600 (Semibold)
- **Padding**: 12px 24px

### Stat Cards
- **Min Height**: 160px
- **Icon Size**: 48px
- **Number Size**: 48px (3rem) Bold
- **Label Size**: 16px (1rem) Medium
- **Sublabel Size**: 14px (0.875rem) Regular

### Tables
- **Header Font Size**: 14px
- **Header Font Weight**: 600 (Semibold)
- **Body Font Size**: 14px
- **Row Height**: 56px
- **Cell Padding**: 16px

### Charts
- **Title Font Size**: 20px
- **Title Font Weight**: 600
- **Label Font Size**: 14px
- **Axis Font Size**: 12px
- **Legend Font Size**: 14px
- **Min Height**: 400px

## Visual Hierarchy

### Principles
1. **Size**: Larger = More important
2. **Weight**: Bolder = More important
3. **Color**: Darker = More important
4. **Spacing**: More space = More important

### Hierarchy Levels
1. **Primary**: Hero headings, key metrics
2. **Secondary**: Section headings, important data
3. **Tertiary**: Body text, supporting info
4. **Quaternary**: Captions, metadata

## Accessibility

### Contrast Ratios
- **Normal Text**: Minimum 4.5:1
- **Large Text**: Minimum 3:1
- **UI Components**: Minimum 3:1

### Touch Targets
- **Minimum Size**: 44x44px
- **Spacing**: 8px between targets

### Focus States
- **Outline**: 2px solid primary color
- **Offset**: 2px

## Brand Voice

### Tone
- **Professional**: Corporate, serious, trustworthy
- **Authoritative**: Expert, confident, reliable
- **Clear**: Direct, concise, unambiguous

### Writing Style
- Use active voice
- Be concise and direct
- Avoid jargon when possible
- Use technical terms when appropriate
- Always capitalize "Apex-Meridian®"

## Logo Usage

### Sizes
- **Large**: 200px width
- **Medium**: 120px width
- **Small**: 80px width
- **Favicon**: 32px

### Spacing
- **Clear Space**: Minimum logo height/2 around logo
- **Minimum Size**: 60px width

### Placement
- **Sidebar**: Top left, medium size
- **Header**: Left, medium size
- **Footer**: Center, small size

## Implementation Notes

### CSS Variables
```css
:root {
  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  /* Font Sizes */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
  --text-5xl: 3rem;
  
  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;
  --space-3xl: 4rem;
  
  /* Colors */
  --primary: #0066CC;
  --secondary: #003366;
  --accent: #FFB81C;
}
```

### Tailwind Classes
- Use consistent spacing: `p-6`, `mb-8`, `gap-4`
- Use semantic colors: `text-slate-900`, `bg-white`
- Use responsive prefixes: `md:text-2xl`, `lg:grid-cols-4`

## Quality Checklist

Before deployment, verify:
- [ ] All headings use correct sizes and weights
- [ ] Body text is at least 16px
- [ ] Spacing is generous and consistent
- [ ] Colors meet contrast requirements
- [ ] Touch targets are at least 44px
- [ ] Charts are readable and clear
- [ ] Mobile layout is tested
- [ ] Dark theme works properly
- [ ] Brand voice is consistent
- [ ] Logo is properly sized and placed

