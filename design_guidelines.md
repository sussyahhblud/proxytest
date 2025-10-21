# Design Guidelines: Unblocked Proxy Browser

## Design Approach

**Selected Approach**: Reference-Based with Chrome/Arc Browser inspiration combined with Material Design system principles

**Justification**: This is a utility-focused productivity tool where efficiency, clarity, and familiarity are paramount. Users need to immediately understand how to navigate and use the proxy browser without learning curve. Drawing from established browser patterns (Chrome's clean interface, Arc's modern aesthetics) ensures instant usability while Material Design provides robust component guidelines for functionality.

**Key Design Principles**:
1. Familiarity First: Leverage universal browser UI patterns
2. Functional Clarity: Every element serves a clear purpose
3. Performance Indicators: Visual feedback for proxy status and loading
4. Minimal Distraction: Content (proxied websites) is the hero, not the UI
5. Dark Mode Native: Designed primarily for dark mode with optional light theme

---

## Core Design Elements

### A. Color Palette

**Dark Mode (Primary)**:
- Background Base: 220 15% 8%
- Surface Elevated: 220 12% 12%
- Surface Secondary: 220 10% 16%
- Border Subtle: 220 8% 24%
- Text Primary: 220 8% 95%
- Text Secondary: 220 5% 70%
- Text Tertiary: 220 5% 50%
- Primary Accent: 220 85% 60% (blue for interactive elements)
- Success Indicator: 142 70% 50% (proxy active status)
- Warning: 38 95% 55% (connection issues)
- Error: 0 85% 60% (blocked/failed requests)

**Light Mode (Secondary)**:
- Background Base: 220 15% 98%
- Surface Elevated: 0 0% 100%
- Surface Secondary: 220 10% 95%
- Border Subtle: 220 8% 80%
- Text Primary: 220 15% 15%
- Text Secondary: 220 10% 35%
- Primary Accent: 220 90% 55%

### B. Typography

**Font Families**:
- Primary Interface: 'Inter' from Google Fonts (weights: 400, 500, 600, 700)
- URL Display/Input: 'JetBrains Mono' from Google Fonts (weight: 400, 500) for monospace clarity
- Fallback: system-ui, -apple-system, sans-serif

**Type Scale**:
- Page Title/Large Headers: text-2xl (24px) font-semibold
- Section Headers: text-lg (18px) font-medium
- Body/Controls: text-base (16px) font-normal
- URL Bar Text: text-sm (14px) font-normal (JetBrains Mono)
- Metadata/Labels: text-xs (12px) font-medium
- Button Text: text-sm (14px) font-medium

### C. Layout System

**Spacing Primitives**: Use Tailwind units of 1, 2, 3, 4, 6, 8, 12, 16 for consistent rhythm
- Component padding: p-3, p-4
- Section spacing: gap-4, gap-6
- Tight spacing: gap-2, space-x-2
- Large separations: gap-8, gap-12

**Browser Layout Structure**:
- Fixed browser chrome height: h-16 (64px) for top navigation bar
- Full viewport layout with no scroll on chrome
- Content area: Remaining viewport height minus chrome
- Sidebar (if bookmarks/history): Fixed w-64 collapsible panel

**Grid System**:
- Container: max-w-none (full width for browser)
- Content iframe: w-full h-full absolute positioning
- Settings panels: max-w-2xl centered

### D. Component Library

**Browser Chrome Components**:

1. **Top Navigation Bar**
   - Fixed top bar with subtle border-b
   - Background: Surface Elevated with backdrop blur
   - Contains: Back/Forward buttons, URL bar, refresh, home, settings
   - Height: h-16 with px-4 padding
   - Subtle shadow: shadow-sm

2. **Navigation Buttons**
   - Icon-only buttons (Heroicons)
   - Size: w-9 h-9 rounded squares
   - Hover state: background Surface Secondary
   - Disabled state: 40% opacity, no interaction
   - Icons: ChevronLeft, ChevronRight, ArrowPath, Home

3. **URL Address Bar**
   - Flex-1 to fill available space
   - Background: Surface Secondary
   - Border: 1px Border Subtle, focus: 2px Primary Accent
   - Height: h-10
   - Rounded: rounded-lg
   - Padding: px-4
   - Left icon: Lock (secure) or GlobeAlt (proxy status)
   - Right actions: Clear URL (X), Copy URL

4. **Action Buttons** (Settings, Theme Toggle)
   - Icon buttons: w-9 h-9
   - Positioned at far right of nav bar
   - Tooltip on hover
   - Icons: Cog6Tooth, Sun/Moon

**Content Display**:

5. **Proxy Iframe Container**
   - Full remaining viewport height
   - Background: Background Base
   - Border: none
   - Position: relative for loading overlays
   - Sandbox attributes for security

6. **Loading State Overlay**
   - Centered spinner with backdrop
   - Semi-transparent background: rgba(0,0,0,0.5)
   - Spinner: Primary Accent color
   - Loading text: Text Secondary

7. **Error State Screen**
   - Centered content with icon
   - Large error icon (ShieldExclamation)
   - Error message: Text Primary, text-xl
   - Suggested actions: Retry button (Primary Accent)
   - Technical details: Collapsible section with Text Tertiary

**Settings & Modal Components**:

8. **Settings Drawer/Modal**
   - Slide-in from right: w-96
   - Background: Surface Elevated
   - Sections: Proxy Settings, Privacy, Appearance
   - Toggle switches for features
   - Input fields for custom proxy servers
   - Save/Cancel buttons at bottom

9. **Bookmarks/History Sidebar**
   - Collapsible left panel: w-64
   - List items with favicon + title
   - Hover state: Surface Secondary background
   - Search/filter input at top
   - Grouped by: Today, Yesterday, Last 7 Days

10. **Status Indicators**
    - Fixed bottom-right corner toast
    - Shows: Proxy Status (Connected/Disconnected)
    - Color-coded background: Success/Error
    - Auto-dismiss after 3 seconds
    - Small, rounded-lg, px-4 py-2

**Form Components**:

11. **Input Fields**
    - Background: Surface Secondary
    - Border: 1px Border Subtle, focus: Primary Accent
    - Rounded: rounded-lg
    - Height: h-10 for standard, h-12 for prominent
    - Padding: px-4
    - Placeholder: Text Tertiary

12. **Buttons**
    - Primary: bg-Primary Accent, text-white, hover: brightness increase
    - Secondary: border-2 Border Subtle, hover: Surface Secondary
    - Ghost: no background, hover: Surface Secondary
    - Height: h-10
    - Padding: px-6
    - Rounded: rounded-lg
    - Font: font-medium

**Data Display**:

13. **URL Suggestions Dropdown**
    - Appears below URL bar when typing
    - Background: Surface Elevated with shadow-lg
    - Max height: max-h-96 with overflow-y-auto
    - List items: px-4 py-2.5, hover: Surface Secondary
    - Displays: Favicon, Page Title, URL (Text Tertiary)
    - Keyboard navigation support

14. **Context Menus**
    - Right-click menus for iframe content
    - Background: Surface Elevated, border: Border Subtle
    - Rounded: rounded-md
    - Shadow: shadow-xl
    - Items: px-3 py-2, hover: Surface Secondary
    - Dividers: 1px Border Subtle

### E. Animations

Use animations extremely sparingly:
- Page transitions: None (instant for performance)
- URL bar focus: transition-all duration-200 for border color
- Button hovers: transition-colors duration-150
- Drawer/sidebar: slide-in with transition-transform duration-300
- Loading spinner: Simple rotate animation only
- NO complex page animations, parallax, or decorative effects

---

## Layout Specifications

**Browser Window Structure**:
```
┌─────────────────────────────────────────────────┐
│ [←][→][⟳][🏠]  [🔒 URL Bar............] [⚙][☾]│ ← h-16 chrome
├─────────────────────────────────────────────────┤
│                                                 │
│                                                 │
│          PROXIED WEBSITE CONTENT                │
│          (iframe full height)                   │
│                                                 │
│                                                 │
└─────────────────────────────────────────────────┘
                                    [Status Toast]
```

**Settings Panel Layout**:
- Full height overlay or slide-in drawer
- Header with close button
- Scrollable content with sections
- Fixed footer with action buttons

**Visual Hierarchy**:
- Chrome navigation: Always visible, prominent but not distracting
- URL bar: Most prominent element (larger, centered)
- Action buttons: Secondary, icon-only to save space
- Content iframe: Takes absolute priority in visual weight

**Responsive Behavior**:
- Desktop: Full layout as described
- Tablet: Collapse sidebar by default, reduce spacing
- Mobile: Hide back/forward buttons, single column settings

---

## Images

This application does NOT require hero images or decorative imagery. The focus is entirely functional:

**Required Icons Only**:
- Use Heroicons (via CDN) for all interface icons
- Navigation: ChevronLeft, ChevronRight, ArrowPath, HomeIcon
- Security: LockClosedIcon, GlobeAltIcon, ShieldExclamationIcon
- Actions: Cog6ToothIcon, MoonIcon, SunIcon, XMarkIcon
- Status: CheckCircleIcon, XCircleIcon

**Favicon Display**:
- Show favicons for bookmarks and URL suggestions
- Fallback to Globe icon when unavailable
- Size: w-4 h-4 or w-5 h-5

**No decorative images, backgrounds, or hero sections needed** - this is a pure utility application where the proxied website content IS the visual content.