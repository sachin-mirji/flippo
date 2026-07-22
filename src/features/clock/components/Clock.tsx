import { StyleSheet, Text, View } from 'react-native';

import {
  formatDateLine,
  formatHours,
  formatMinutes,
  formatSeconds,
  getMeridiem,
} from '../../../shared/utils/time';

// --- Temporary display options -------------------------------------------
// These are hard-coded for now. In a later step they'll come from the Zustand
// `settingsStore` so the Settings sheet can toggle them. Keeping them as plain
// constants avoids pulling in state management before we need it.
const HOUR_24 = false; // false = 12-hour clock with an AM/PM label
const SHOW_SECONDS = true;

/**
 * The component's "props" are its inputs — like arguments to a function. We
 * describe their shape with a `type`. Here Clock needs exactly one prop, `date`,
 * which must be a Date. Passing `<Clock />` with no date, or `date="hi"`, becomes
 * a compile-time error.
 */
type ClockProps = {
  date: Date;
};

// `{ date }: ClockProps` destructures the single `date` prop out of the props
// object, and tells TypeScript the object matches ClockProps.
export function Clock({ date }: ClockProps) {
  const hours = formatHours(date, HOUR_24);
  const minutes = formatMinutes(date);
  const seconds = formatSeconds(date);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.dateLine}>{formatDateLine(date)}</Text>

      <View style={styles.timeRow}>
        <Text style={styles.time}>
          {hours}:{minutes}
          {SHOW_SECONDS ? `:${seconds}` : ''}
        </Text>
        {!HOUR_24 && <Text style={styles.meridiem}>{getMeridiem(date)}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  dateLine: {
    color: '#9aa0a6',
    fontSize: 16,
    letterSpacing: 1,
    marginBottom: 12,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  time: {
    color: '#f5f5f5',
    fontSize: 72,
    fontWeight: '700',
    // tabular-nums keeps every digit the SAME width, so the clock doesn't
    // shift left/right as the numbers change (ARCHITECTURE.md typography note).
    fontVariant: ['tabular-nums'],
  },
  meridiem: {
    color: '#9aa0a6',
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 8,
    marginTop: 8,
  },
});
