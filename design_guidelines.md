# Design Guidelines: Google Proxy Service

## Design Approach: Material Design System

**Justification:** This is a utility-focused technical application where function, clarity, and efficiency are paramount. Material Design provides excellent patterns for status indicators, configuration forms, and clear visual feedback—essential for a proxy service.

**Key Design Principles:**
- Clarity over decoration
- Immediate status visibility
- Straightforward configuration
- Trust through professionalism

---

## Core Design Elements

### A. Color Palette

**Light Mode:**
- Primary: 220 85% 45% (Deep Blue - trust and technology)
- Background: 0 0% 98%
- Surface: 0 0% 100%
- Text Primary: 220 20% 15%
- Text Secondary: 220 15% 45%
- Success: 142 76% 36%
- Warning: 38 92% 50%
- Error: 0 84% 60%

**Dark Mode:**
- Primary: 220 85% 60%
- Background: 220 20% 10%
- Surface: 220 15% 15%
- Text Primary: 0 0% 95%
- Text Secondary: 220 10% 70%
- Success: 142 70% 45%
- Warning: 38 85% 55%
- Error: 0 72% 65%

### B. Typography

**Fonts:** 
- Primary: Inter (via Google Fonts) - clean, technical
- Monospace: JetBrains Mono (for URLs, codes)

**Hierarchy:**
- H1: text-3xl font-semibold (Main heading)
- H2: text-xl font-semibold (Section headers)
- Body: text-base (Configuration labels, descriptions)
- Small: text-sm (Helper text, status messages)
- Code: text-sm font-mono (URLs, endpoints)

### C. Layout System

**Spacing Primitives:** Use Tailwind units of **2, 4, 6, and 8** consistently
- Component padding: p-4 to p-6
- Section spacing: gap-6, space-y-8
- Form elements: space-y-4
- Tight groupings: gap-2

**Container Strategy:**
- Max width: max-w-4xl (optimal for forms and configuration)
- Centered: mx-auto
- Side padding: px-4 md:px-6

### D. Component Library

**1. Connection Status Dashboard**
- Large status indicator card at top
- Real-time connection status badge (Connected/Disconnected/Connecting)
- Color-coded: green for active, red for failed, yellow for connecting
- Current proxy endpoint display (monospace font)
- Last successful connection timestamp

**2. Configuration Panel**
- Clean form layout with labeled inputs
- Proxy server URL input (full-width)
- Port number input (numeric)
- Authentication fields (username/password if needed)
- Protocol selection dropdown (HTTP/HTTPS/SOCKS5)
- Clear validation feedback inline
- Primary action button: "Connect" (full-width on mobile, auto on desktop)

**3. Activity Log**
- Scrollable list of recent proxy requests
- Timestamp, endpoint, status code display
- Compact card design with subtle borders
- Max height with overflow-y-auto
- Monospace font for technical details

**4. Quick Actions**
- Test connection button
- Clear cache/cookies button
- Reset settings button
- Copy proxy settings button (with clipboard feedback)

**5. Header**
- Logo/title: "Google Proxy Service"
- Connection status badge (top-right)
- Settings icon button

**6. Information Cards**
- Usage instructions
- Security notice
- Network restrictions bypass info
- Subtle background: surface color
- Rounded corners: rounded-lg
- Padding: p-6

### E. Layout Structure

**Single-page application layout:**
- Header: Fixed top bar with branding and status
- Main content: Centered container with max-w-4xl
- Three primary sections vertically stacked:
  1. Status Dashboard (prominent, top)
  2. Configuration Panel (center, primary interaction)
  3. Activity Log (bottom, collapsible)

**Responsive Behavior:**
- Mobile: Single column, full-width cards
- Desktop: Maintain single column for clarity, generous spacing

### F. Interaction Patterns

**Buttons:**
- Primary: Solid background, prominent for "Connect"
- Secondary: Outline style for auxiliary actions
- Danger: Red for "Disconnect" or "Reset"
- Disabled states clearly indicated with reduced opacity

**Form Inputs:**
- Consistent height: h-10 to h-12
- Clear focus states with primary color ring
- Inline validation icons (checkmark/error)
- Helper text below inputs in text-sm

**Status Indicators:**
- Pulsing dot animation for "Connecting" state
- Static dot for Connected/Disconnected
- Size: w-3 h-3 for status dots

### G. Animations

**Minimal, functional only:**
- Status dot pulse (connecting state): subtle 2s ease-in-out
- Connection state transitions: 200ms fade
- Button hover: 150ms subtle scale (1.02)
- Form validation feedback: slide-in from top

---

## Images

**No hero image required** - This is a utility application where immediate access to functionality is critical. Replace traditional hero with prominent status dashboard.

**Optional Icons:**
- Connection status icon (checkmark/x/loading spinner)
- Lock icon for authentication fields
- Activity log icons for different request types

Use Heroicons (outline style) via CDN for all interface icons.

---

## Accessibility Notes

- Maintain consistent dark mode across all inputs and text fields
- High contrast ratios for text (WCAG AA minimum)
- Clear focus indicators on all interactive elements
- Status communicated through text and color (not color alone)
- Keyboard navigation support for all primary actions