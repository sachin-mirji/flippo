# Flippo — Roadmap

The phased build plan. Work top to bottom. Check items off as we go and mirror
the high-level status in `CLAUDE.md`. Don't jump ahead — each phase de-risks the
next. Ship a clean clock to the stores BEFORE adding the camera (a plain clock
gets trivial store review; face-analysis gets scrutiny).

## Phase 0 — Setup & tooling  ✅ DONE
- [x] Xcode, Android Studio + emulator, Node, Watchman, JDK 17, CocoaPods, EAS CLI
- [x] `create-expo-app` (blank-typescript)
- [x] `expo-doctor` 20/20
- [x] Smoke test blank app on emulator
- [ ] ESLint + Prettier (or Biome)
- [ ] Git repo + first commit
- [ ] Sentry (crash reporting) — can defer

## Phase 1 — Core flip clock MVP
- [ ] Install: reanimated v4, worklets, expo-font (Roboto Mono / JetBrains Mono)
- [x] Create `src/` feature-based folder structure
- [ ] `ClockSettings` type + a minimal `settingsStore` (Zustand) with defaults
- [x] `useClockTick` hook (one interval, aligned to the second)
- [x] Static (non-animated) clock — big HH:MM:SS on screen, ticking (as `Clock`)
- [ ] `TopBar` with date (date currently folded into `Clock`; extract with battery)
- [ ] `FlipDigit` split-flap animation (the hard part — build last in this phase)
- [ ] `FlipUnit` (pairs of digits), seconds in the corner
- [ ] Verify 60fps on a low-end Android

## Phase 2 — Settings + themes + persistence
- [ ] Install: react-native-mmkv, react-native-unistyles, @gorhom/bottom-sheet, expo-battery
- [ ] `storage.ts` MMKV wrapper; wire settingsStore to persist
- [ ] `SettingsSheet` with Clock / General tabs
- [ ] All toggles wired: battery, 24h, date, week, seconds, dividers, mute
- [ ] `ClockTheme` type + 2–3 starter skins via Unistyles
- [ ] `ThemeSelector` with visual previews; persist selected theme
- [ ] Battery indicator (expo-battery)

## Phase 3 — Polish
- [ ] Ticktock sound (expo-audio) + mute
- [ ] Keep-awake (expo-keep-awake) as a setting
- [ ] Flip animation styles (rebound / linear / ease)
- [ ] Burn-in pixel-shift + AOD / nightstand mode
- [ ] Haptics
- [ ] App icon + splash screen
- [ ] Accessibility: respect reduce-motion (skip flips)

## Phase 4 — Focus tracking
- [ ] Install: react-native-vision-camera + ML Kit face detector plugin
- [ ] Permission + prominent-disclosure flow (before any camera use)
- [ ] `focusStore` + `FocusSession` model
- [ ] Frame processor: presence / head-pose / eyes → debounced distraction events
- [ ] Live focus session UI
- [ ] Session history (MMKV → expo-sqlite if it grows)
- [ ] Optional cloud summary via a minimal backend proxy (never embed keys)
- [ ] Heavy real-device battery/thermal testing

## Phase 5 — Monetization + release
- [ ] RevenueCat integration
- [ ] Gate PRO features (all themes, launch-when-charging, burn-in, AOD,
      widgets, full history, cloud summaries)
- [ ] Paywall UI
- [ ] Privacy policy + App Privacy labels (Apple) + Data Safety form (Google)
- [ ] Store assets (screenshots, descriptions, icon)
- [ ] EAS Build (production) + EAS Submit
- [ ] Apple: TestFlight → review; camera purpose string must be specific
- [ ] Google: internal → closed → production track rollout

## Release checklist (Phase 5 detail)

**Apple App Store:**
- [ ] Privacy policy URL in App Store Connect + in-app (Guideline 5.1.1)
- [ ] App Privacy "nutrition label" filled (declare Camera; no tracking unless true)
- [ ] Specific `NSCameraUsageDescription` (vague strings get rejected)
- [ ] Screenshots for required device sizes
- [ ] Age rating, export-compliance answer
- [ ] TestFlight beta before submitting

**Google Play:**
- [ ] Data Safety form (declare camera data; on-device vs shared)
- [ ] Prominent Disclosure + affirmative consent before any collection
- [ ] Privacy policy URL in listing + in-app
- [ ] Content rating questionnaire
- [ ] Target API level compliance
- [ ] Staged rollout (internal → closed → production)
