# Flippo — Project Memory for Claude Code

> This file is read automatically every session. Keep it lean.
> Deep detail lives in `/docs` — read those files when a task needs them.

## What we're building

**Flippo** is a minimalist, modern flip-clock app for React Native (Expo).
Think a clean split-flap ("Solari board") clock a student or knowledge worker
keeps open on their desk. Core values: **simplicity and efficiency**. Every
decision favors the simplest thing that works.

The signature later feature is **focus tracking**: an opt-in mode that uses the
front camera + on-device ML to count how often the user gets distracted during
a focus session. Cloud LLM summaries are an optional, opt-in PRO extra.

Full product/feature detail: see `docs/PRODUCT.md`.

## Who I am (the developer)

- Solo developer. This is a **learning project** AND aimed at a real
  Play Store + App Store release.
- **New to TypeScript** — I know JavaScript. When you write or change types,
  briefly explain them in plain language. Don't assume TS fluency.
- I want to **deeply understand** the architecture, not just get working code.
  Explain the "why" behind patterns, not only the "what".

## How to work with me

- **Teach as you go.** Prefer clear explanations over cleverness.
- **Small steps.** Build in small, verifiable increments. After each meaningful
  change, tell me exactly how to run/verify it before moving on.
- **Explain before large changes.** For anything touching architecture, outline
  the plan first and let me confirm.
- **Simplicity first.** Don't add abstraction, libraries, or config we don't
  need yet. If you're tempted to add a dependency, say why it beats doing it
  by hand, and ask.
- **No premature optimization**, but do respect the performance rules in
  `docs/ARCHITECTURE.md` (the clock ticks every second — re-renders matter).
- When something is a genuine judgment call, give me the options and a
  recommendation, don't just silently pick.

## Tech stack (decided — see docs/ARCHITECTURE.md for rationale)

- **Expo** (SDK 56+, New Architecture) with a **development build** (not Expo Go —
  we need native modules).
- **TypeScript**.
- **react-native-reanimated v4** — animations (the flip effect) on the UI thread.
- **Zustand** — state management (small, no boilerplate).
- **react-native-mmkv** — fast synchronous storage for settings.
- **react-native-unistyles v3** — theming / design system (many clock skins + light/dark).
- **@gorhom/bottom-sheet** — the settings sheet.
- **expo-battery, expo-keep-awake, expo-audio** — system features.
- Later (focus feature): **react-native-vision-camera** + **ML Kit face detection**.
- Release/monetization: **EAS Build/Submit**, **RevenueCat**.

## Project structure (feature-based)

```
src/
  features/
    clock/      # FlipDigit, FlipUnit, ClockDisplay, TopBar, useClockTick
    settings/   # SettingsSheet, ClockTab, GeneralTab, settingsStore
    theming/    # themes/, ClockTheme type, ThemeSelector, themeStore
    focus/      # (later) camera + ML focus tracking
    system/     # battery, keepAwake, burnInGuard, permissions
  shared/       # design tokens, ui primitives, mmkv wrapper, utils
  app/          # entry, providers
```

Details + data models: `docs/ARCHITECTURE.md`.

## Current status

- [x] Dev environment set up (Xcode, Android Studio + emulator, Node, CLI tools)
- [x] Project scaffolded with `create-expo-app` (blank-typescript)
- [x] `expo-doctor` passes 20/20
- [x] Smoke test on emulator
- [ ] Core libs installed
- [x] Folder structure created
- [x] `useClockTick` + static clock on screen
- [ ] Split-flap FlipDigit animation
- [ ] Settings + themes + persistence
- [ ] Polish (sound, keep-awake, burn-in)
- [ ] Focus tracking feature
- [ ] Monetization + store release

**Keep this checklist updated as we complete work.**
See `docs/ROADMAP.md` for the full phased plan.

## Conventions

- Components: `.tsx`. Logic/hooks/stores: `.ts`.
- One component per file, named same as the file.
- Hooks start with `use`. Zustand stores end with `Store` (e.g. `settingsStore`).
- Keep the clock's render path clean — see the performance rules in
  `docs/ARCHITECTURE.md` before touching anything under `features/clock`.

## Commands

- Start dev server: `npx expo start`  (then `a` = Android, `i` = iOS)
- Health check: `npx expo-doctor`
- (Later) build dev client: `eas build --profile development --platform android`
