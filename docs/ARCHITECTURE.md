# Flippo — Architecture

Read this before touching architecture, the clock render path, state, storage,
or the flip animation. It's the "how" and the "why we chose it."

## Stack decisions and rationale

**Expo (SDK 56+) with a development build, New Architecture.**
Why: Expo's Continuous Native Generation + config plugins let us use native
modules (camera, MMKV) without hand-maintaining `ios/`/`android/`. EAS Build
compiles in the cloud and EAS Submit pushes to both stores. We use a *dev build*
(not Expo Go) because vision-camera, MMKV v3, and Reanimated v4 need native code.

**TypeScript.** Typed data models and props make the architecture explicit and
catch mistakes for a solo dev with no code reviewer. Keep types simple.

**Zustand for state.** Tiny, no boilerplate, no provider tree, and — crucially —
state can be read/written outside React (handy from the tick loop and, later,
camera frame processors). Redux Toolkit is overkill; plain Context would cause
excessive re-renders on a clock that ticks every second.

**MMKV for persistence.** Synchronous (read settings at launch with no flash of
defaults), extremely fast, C++ TurboModule. Use it for settings/theme/toggles.
If focus-session history grows large, move that to `expo-sqlite` later — not now.

**Unistyles v3 for the design system.** StyleSheet-like API + a real theming
engine. Ideal for "many clock skins + light/dark" with runtime theme switching
and no per-render styling cost that could compete with the animation.

**Reanimated v4 for animation.** Runs animations on the UI thread via worklets,
so the JS thread only computes the new digit string. Essential for smooth flips.

## Folder structure (feature-based, not layer-based)

```
src/
  features/
    clock/
      components/  FlipDigit.tsx, FlipUnit.tsx, ClockDisplay.tsx, TopBar.tsx
      hooks/       useClockTick.ts
    settings/
      SettingsSheet.tsx, ClockTab.tsx, GeneralTab.tsx
      settingsStore.ts
    theming/
      themes/      (one file per skin)
      ClockTheme.ts (the theme type)
      ThemeSelector.tsx, themeStore.ts
    focus/         (later)
    system/
      battery.ts, keepAwake.ts, burnInGuard.ts, permissions.ts
  shared/
    tokens.ts      (design tokens)
    storage.ts     (mmkv wrapper)
    ui/            (small reusable primitives: Toggle, etc.)
    utils/         (time formatting, etc.)
  app/
    providers.tsx  (theme provider, bottom-sheet provider, etc.)
```

Feature-based keeps everything for one concern together, which is easier to
reason about and matches how we'll build it phase by phase.

## Data models (TypeScript)

```ts
// features/settings/settingsStore.ts
type ClockSettings = {
  showBattery: boolean;
  hour24: boolean;
  showDate: boolean;
  showWeek: boolean;
  showSeconds: boolean;
  themeName: string;
  muteTicktock: boolean;
  showDividers: boolean;
  flipAnimationStyle: 'rebound' | 'linear' | 'ease';
  launchWhenCharging: boolean; // PRO
  burnInProtection: boolean;   // PRO
  keepAwake: boolean;
};

// features/theming/ClockTheme.ts
type ClockTheme = {
  name: string;
  scheme: 'light' | 'dark';
  colors: {
    background: string;
    digitFace: string;
    digitText: string;
    divider: string;
    accent: string;
  };
  card: {
    radius: number;
    shadow: object;
    dividerStyle: 'line' | 'gap' | 'none';
  };
  font: string;
};

// features/focus/focusStore.ts (later)
type FocusSession = {
  id: string;
  startedAt: number;
  endedAt: number;
  distractionCount: number;
  lookedAwayMs: number;
  presenceRatio: number;    // fraction of samples focused & present
  cloudSummary?: string;    // optional LLM summary
};
```

## The clock ticking loop — PERFORMANCE RULES (important)

The clock updates every second. Done naively this re-renders the whole tree 60+
times a minute. Rules:

1. **One time source.** A single `useClockTick` hook holds the current time and
   updates once per second (align the interval to the top of each second).
2. **Push only changed values down.** Derive `hours`, `minutes`, `seconds` and
   pass each digit its own value. A digit only re-renders/flips when *its* value
   changes — so minute digits update once a minute, hour digits once an hour,
   only seconds tick every second.
3. **Memoize `FlipDigit`** with `React.memo`.
4. **Animate on the UI thread.** Drive the flip with Reanimated shared values;
   JS only computes the digit string. Never animate via `setState` in a loop.
5. Respect **reduce-motion**: if the OS setting is on, skip the flip and just
   swap the digit.

## The split-flap flip animation (LLD)

The realistic Solari effect is NOT a single card rotate. Each digit cell has
**four half-cards**:

- **Static top half** — shows the NEW digit's top (revealed as the flap falls).
- **Static bottom half** — shows the OLD digit's bottom (until the flap lands).
- **Animated upper flap** — OLD digit's top half; rotates `rotateX` 0° → -90°.
- **Animated lower flap** — NEW digit's bottom half; rotates `rotateX` 90° → 0°.

Two-phase sequence on one shared value `progress` 0→1:
- upper flap: `progress [0, 0.5]` → `rotateX [0deg, -90deg]`
- lower flap: `progress [0.5, 1]` → `rotateX [90deg, 0deg]`

Each half is a `View` with `overflow: 'hidden'` clipping a full-size `Text`
translated to show the correct half. Set `backfaceVisibility: 'hidden'` and add
`{ perspective: 400 }` as the first transform.

**Gotchas:**
- Flaps rotate about their top/bottom EDGE, not center → use the `transformOrigin`
  style prop (RN 0.74+/Reanimated v4). Ignore old 4x4-matrix workarounds.
- **Android**: `overflow: 'hidden'` does NOT clip absolutely-positioned children.
  Wrap each absolute flap in a non-absolute overflow container.
- Timing: ~250–300ms per flip, ease-out on the fall.
- Reference: `react-native-flip-timer` (structure only), Reanimated docs "Flip
  Card" example (the core primitive). Reimplement on Reanimated v4.

## Typography

Use tabular/monospaced figures so every digit is the same width (no jitter).
Options: Roboto Mono / JetBrains Mono, or a proportional font with
`fontVariant: ['tabular-nums']`. Each flip cell is a fixed box; glyphs center
identically.

## System behavior

- **Background/foreground**: pause the tick and (later) the camera when the app
  backgrounds via an `AppState` listener; resume on foreground.
- **Keep-awake**: `expo-keep-awake`, active only while the clock is foregrounded,
  and only if the user enabled it (it costs battery — expose as a setting).
- **Battery**: `expo-battery` for the indicator.
- **Burn-in protection (PRO)**: periodic few-pixel shift of the whole clock on a
  slow loop; optional dimming at night; AOD mode drifts the clock slowly.
- **Sound**: `expo-audio` (not the retired expo-av). Preload a short tick; play
  per second only when not muted; respect the iOS silent switch.

## Focus tracking architecture (later — see PRODUCT.md for rules)

- **On-device (default):** react-native-vision-camera frame processor +
  ML Kit face detection. Use ML Kit head Euler angles (Y = look left/right,
  X = up/down) and per-eye open probabilities. Note: Euler angles + eye/smile
  classification need ML Kit "accurate" mode, and are reliable mainly for
  near-frontal faces (Euler Y within ±18°). Throttle: process ~1 frame every
  1–2s, use `runAsync`, front camera at low resolution — continuous full-rate
  vision drains battery fast.
- **Cloud (opt-in PRO):** sample ~1 frame every few minutes at most; send through
  YOUR backend proxy (never ship API keys in the app); prefer sending derived
  metrics as text over sending face images; analyze and discard, never persist
  frames server-side.

## Testing strategy

- Unit (Jest): time math, distraction-detection logic, settings reducers.
- Component (React Native Testing Library): settings toggles, conditional render.
- E2E (Maestro — simple YAML, low flakiness, good for solo dev): launch → clock
  renders; open settings → toggle 24h; start focus session → permission prompt.
