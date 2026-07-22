// Pure time-formatting helpers.
//
// "Pure" means: given the same input, each function always returns the same
// output, and it touches nothing outside itself (no state, no side effects).
// That makes these trivial to reuse (the static clock now, FlipUnit later) and
// trivial to test.

/**
 * A "union type": a value that must be EXACTLY one of these two strings.
 * If you try to assign 'am' or 'PM ' (with a space), TypeScript rejects it at
 * compile time — so typos become errors instead of bugs.
 */
export type Meridiem = 'AM' | 'PM';

/**
 * Pad a number to two digits: 9 -> "09", 12 -> "12".
 * `n: number` types the parameter; `: string` after the ()s types what we return.
 */
export function pad2(n: number): string {
  return n.toString().padStart(2, '0');
}

/**
 * The hour portion for display.
 * - 24h mode: 0..23 as-is ("00".."23").
 * - 12h mode: 1..12 (midnight and noon both show as "12").
 */
export function formatHours(date: Date, hour24: boolean): string {
  const h = date.getHours(); // 0..23
  if (hour24) return pad2(h);
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return pad2(h12);
}

export function formatMinutes(date: Date): string {
  return pad2(date.getMinutes());
}

export function formatSeconds(date: Date): string {
  return pad2(date.getSeconds());
}

/** Which half of the day, for the AM/PM label. Returns our union type. */
export function getMeridiem(date: Date): Meridiem {
  return date.getHours() < 12 ? 'AM' : 'PM';
}

// `as const` freezes this into a readonly tuple of exact string literals, so the
// values can't be reassigned by accident.
const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

export function getWeekday(date: Date): string {
  return WEEKDAYS[date.getDay()]; // getDay() is 0 (Sun) .. 6 (Sat)
}

/** Top-bar date string: "MM / DD / Weekday", e.g. "07 / 23 / Thursday". */
export function formatDateLine(date: Date): string {
  const month = pad2(date.getMonth() + 1); // getMonth() is 0-based (Jan = 0)
  const day = pad2(date.getDate());
  return `${month} / ${day} / ${getWeekday(date)}`;
}
