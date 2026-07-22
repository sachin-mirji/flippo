# Flippo — Product Spec

Read this when working on features, UI, or settings. It's the "what" and "why"
of the product.

## Vision

A minimalist, modern flip-clock app. The kind of clean ambient clock you leave
running on your desk while studying or doing focused work. Not busy, not
gimmicky — calm, legible, beautiful. Simplicity and efficiency are the guiding
values: if a feature or a pixel doesn't earn its place, it doesn't ship.

Primary users: students and knowledge workers who want (a) a nice big clock to
glance at, and (b) — via the focus feature — awareness of how focused they
actually were.

## The clock screen (MVP)

- Large split-flap flip digits showing **HH : MM**.
- **AM/PM** label (when not in 24-hour mode).
- **Seconds** shown as small flip digits in a corner (toggle-able).
- **Top bar**: date as `MM / DD / Weekday`, and a **battery indicator**.
- **Dividers**: the horizontal line across the middle of each flip card (toggle-able).
- Dark background by default; multiple visual themes/skins.

## Settings (a bottom sheet with two tabs)

### Clock tab
- **Show battery** — toggle the battery indicator in the top bar.
- **24 Hour** — 24h vs 12h (AM/PM) time.
- **Show date** — toggle the date in the top bar.
- **Show week** — toggle the weekday.
- **Show second** — toggle the small seconds digits.
- **Theme** — pick from multiple flip-clock skins (visual previews).

### General tab
- **Mute ticktock** — turn the per-second tick sound on/off.
- **Show dividers** — the center line on the flip cards.
- **Flip animation** — style of the flip (e.g. Rebound / Linear / Ease).
- **Launch when charging** (PRO) — auto-open the clock when the phone starts charging.
- **Screen burn-in protection** (PRO) — pixel-shift / dimming to protect OLED
  during long sessions.

## Focus tracking (later — the differentiator)

Opt-in. The user starts a "focus session." The **front camera** + **on-device
ML Kit face detection** watch (privacy-first, nothing leaves the device by
default) and infer:
- **Presence** — did they leave the desk?
- **Looking away** — head turned away beyond a threshold.
- **Drowsiness** — eyes closed over consecutive samples.
- **Distraction events** — debounced transitions from focused → not focused.

At session end: a summary — focus duration, number of distractions, longest
focus streak, presence ratio.

**Cloud LLM summaries (PRO, opt-in):** optionally, infrequently (every few
minutes or end-of-session), send derived metrics — or, only if the user
explicitly allows, a downsized frame — to a cloud model for a richer
natural-language summary. Default OFF. Prefer sending derived numbers, not
face images.

**Hard rules for the focus feature:**
- Camera only active during an explicitly started focus session.
- Explicit permission + prominent disclosure before any camera use.
- On-device by default. Cloud is opt-in and clearly labeled.
- Never persist raw frames. Let users delete session history.
- Market it as a focus *aid*, not a precise measurement device.

## Other feature ideas (prioritized, for later)

**Build early (high value, on-brand):**
- Pomodoro / focus timer integrated with the clock (pairs with focus tracking).
- Focus session stats & history with simple charts.
- Nightstand / AOD mode (dimmed, drifting clock — doubles as burn-in protection).
- Ambient sounds (rain, brown noise).

**Build later:**
- iOS Live Activities / Dynamic Island + home screen widgets.
- Alarm / bedtime.
- Themeable skins sold as PRO packs.

**Low priority:** world clock, multiple timers.

## Monetization

- **Free**: full clock, several themes, basic on-device focus tracking, Pomodoro.
- **One-time PRO unlock** (primary): all themes, launch-when-charging,
  burn-in protection, AOD mode, widgets, full session history.
- **Subscription** (only for cloud AI features, since their per-user cost is
  uncapped): cloud focus summaries.
- **No ads** — they break the minimalist aesthetic.
- Use **RevenueCat** to manage purchases across both stores.

## Design principles

- Minimalist: lots of negative space, one hero element (the clock).
- Legible: tabular/monospaced figures so digits don't jitter as they tick.
- Calm: subtle motion, no clutter, dark-friendly.
- Respect the OS: honor silent switch for sound, reduce-motion for animation.
