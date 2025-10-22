# Design Guidelines: Enhanced Proxy Browser

## Design Approach

**Selected Approach**: Design System (Chrome/Arc Browser Patterns)
**Rationale**: As a utility-focused browser application, users expect familiar, efficient patterns. Drawing from Chrome's clarity and Arc's modern aesthetics creates an interface that's immediately usable while feeling contemporary.

**Core Principles**:
- Familiar browser conventions for zero learning curve
- Performance-first design with minimal visual overhead
- Dark-first color scheme with clean light mode alternative
- Spatial efficiency maximizing browsing viewport

## Color Palette

### Dark Mode (Primary)
- **Background**: 220 15% 8% (deep slate)
- **Surface/Chrome**: 220 12% 12% (slightly lighter slate)
- **Tab Bar**: 220 13% 10% (between background and surface)
- **Active Tab**: 220 12% 15% (elevated surface)
- **Inactive Tab**: 220 12% 10% (recessed, subtle)
- **Tab Hover**: 220 12% 13% (gentle lift)
- **Primary Accent**: 220 85% 60% (vivid blue for active states)
- **Success/Connected**: 142 70% 50% (green for proxy status)
- **Warning**: 38 92% 50% (amber for mixed content)
- **Error**: 0 85% 60% (red for failures)
- **Border/Divider**: 220 15% 18% (subtle separation)
- **Text Primary**: 220 10% 95% (near white)
- **Text Secondary**: 220 8% 65% (muted for metadata)

### Light Mode
- **Background**: 0 0% 100% (pure white)
- **Surface/Chrome**: 220 10% 98% (soft off-white)
- **Tab Bar**: 220 10% 96%
- **Active Tab**: 0 0% 100% (crisp white)
- **Inactive Tab**: 220 10% 94%
- **Primary Accent**: 220 85% 55%
- **Border/Divider**: 220 10% 88%
- **Text Primary**: 220 15% 15%
- **Text Secondary**: 220 8% 45%

## Typography

**Interface Font**: Inter (400, 500, 600, 700)
- Tab labels: 500 weight, 13px (text-sm)
- Address bar: 400 weight, 14px
- Navigation controls: 500 weight
- Status indicators: 500 weight, 12px (text-xs)

**Monospace Font**: JetBrains Mono
- URL display: 400 weight, 14px
- Technical metadata: 400 weight, 12px

## Layout System

**Spacing Primitives**: Tailwind units 1, 2, 3, 4, 6, 8, 12, 16
- Tab padding: px-3 py-2
- Chrome padding: px-4
- Button gaps: gap-2
- Section spacing: space-x-2, space-y-4

**Browser Chrome Structure**:
```
┌─────────────────────────────────────────────┐
│ Tab Bar (h-10)                              │ ← 40px
│ [Tab 1] [Tab 2] [+]                         │
├─────────────────────────────────────────────┤
│ Navigation Bar (h-14)                       │ ← 56px
│ [←][→][↻][🏠] [🔒 URL Bar      ] [☀]       │
└─────────────────────────────────────────────┘
```

**Total Chrome Height**: 96px (24px tabs + 56px nav + 16px total padding)
**Viewport Area**: calc(100vh - 96px)

## Component Library

### Tab System
**Tab Bar**:
- Container: Full width, bg-[tab-bar], border-b with divider color
- Height: h-10 (40px)
- Horizontal scroll on overflow: overflow-x-auto, scrollbar-hide

**Individual Tabs**:
- Min width: min-w-[120px], Max width: max-w-[240px]
- Flexible width: flex-1
- Padding: px-3 py-2
- Rounded corners: rounded-t-lg (top only)
- Active state: bg-[active-tab], border-b-2 border-primary
- Inactive state: bg-[inactive-tab], opacity-80
- Hover: bg-[tab-hover], opacity-100
- Close button: ml-auto, hover:bg-destructive/10, w-4 h-4

**New Tab Button**:
- Position: After all tabs, sticky right
- Size: w-10 h-10 (square)
- Icon: Plus, 16px
- Hover: bg-accent/10

### Navigation Controls
**Back/Forward/Refresh/Home Buttons**:
- Size: h-9 w-9 (36px square)
- Spacing: gap-1 between buttons
- Icon size: 18px
- Disabled state: opacity-40, cursor-not-allowed
- Hover: bg-accent/10
- Active: bg-accent/20

**Address Bar**:
- Flex-1 to fill available space
- Height: h-10 (40px)
- Rounded: rounded-lg
- Padding: px-3 py-2
- Background: Slightly elevated surface
- Focus: ring-2 ring-primary/50
- Monospace font for entered URLs
- Left icon: Lock (🔒) 16px, text-muted-foreground
- Clear button (X) on right when populated

**Theme Toggle**:
- Position: Far right of nav bar
- Size: h-9 w-9
- Icons: Sun/Moon, 18px
- Smooth icon transition

### Status Indicators
**Loading State**:
- Linear progress bar beneath nav chrome
- Height: h-1
- Primary color with subtle animation
- Indeterminate style (sliding gradient)

**Connection Status** (small indicator in address bar):
- Dot before lock icon
- Green: Connected successfully
- Amber: Mixed content warning
- Red: Connection failed
- Size: w-2 h-2, rounded-full

### Content Display
**Iframe Container**:
- Full viewport minus chrome
- Border: none
- Background: bg-background (loading state)
- Sandbox attributes for security
- Seamless attribute

**Welcome Screen** (no tabs open):
- Centered content, max-w-2xl
- Hero text: text-4xl font-bold
- Feature cards: grid-cols-1 md:grid-cols-3, gap-6
- Card style: bg-card, rounded-xl, p-6, border

**Error Screen**:
- Centered content, max-w-md
- Icon: AlertCircle, 64px, text-destructive
- Heading: text-2xl font-semibold
- Retry button: Primary variant, with-icon

### Toast Notifications
**Position**: Bottom-right corner
**Style**: bg-card, border, rounded-lg, shadow-lg
**Duration**: 3s for success, 5s for errors
**Content**: Icon + message, max 2 lines

## Interactions & Animations

**Tab Animations**:
- Tab creation: Fade in + slide from right (200ms)
- Tab switching: Instant background change
- Tab close: Fade out + collapse width (150ms)
- Tab reordering: Smooth position transition (200ms) - future enhancement

**Navigation Feedback**:
- Button press: Scale 0.95 on active
- Address bar submit: Subtle pulse on Enter
- Loading progress: Smooth 0-100% with easing

**Hover States**:
- All interactive elements: 100ms transition
- Subtle background color change
- No transform effects (keeps interface stable)

## Keyboard Shortcuts

Display shortcuts in tooltips:
- **Cmd/Ctrl + T**: New tab
- **Cmd/Ctrl + W**: Close tab
- **Cmd/Ctrl + Tab**: Next tab
- **Cmd/Ctrl + Shift + Tab**: Previous tab
- **Cmd/Ctrl + L**: Focus address bar
- **Cmd/Ctrl + R**: Refresh
- **Cmd/Ctrl + [**: Back
- **Cmd/Ctrl + ]**: Forward

## Accessibility

- Tab elements: role="tab", aria-selected
- Address bar: aria-label="Enter URL or search"
- Loading state: aria-live="polite"
- All buttons: aria-label for screen readers
- Focus visible: ring-2 ring-primary on keyboard focus
- Color contrast: WCAG AA minimum on all text

## Responsive Behavior

**Desktop (>1024px)**: Full tab bar with all tabs visible
**Tablet (768-1024px)**: Scrollable tab bar, condensed spacing
**Mobile (<768px)**: 
- Tab bar: Horizontal scroll, shows 2-3 tabs
- Address bar: Full width, reduced padding
- Navigation buttons: Slightly smaller (h-8 w-8)
- New tab via menu instead of always-visible button