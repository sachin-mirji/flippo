import { useEffect, useState } from 'react';

/**
 * The single "heartbeat" of the app: returns the current time and causes the
 * component using it to re-render once per second.
 *
 * Why ONE hook (ARCHITECTURE.md performance rule #1): the clock updates every
 * second. If lots of components each ran their own timer, they'd drift apart and
 * waste work. We keep one time source and pass its value down.
 *
 * Return type: `(): Date` says "this hook takes no arguments and hands back a
 * Date". We could rely on TypeScript inferring it, but writing it out documents
 * the hook's contract at a glance.
 */
export function useClockTick(): Date {
  // useState<Date> = a piece of state that holds a Date. The `() => new Date()`
  // is a "lazy initializer": it runs only on the first render to set the start
  // value, instead of creating a new Date on every render.
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    // `ReturnType<typeof setTimeout>` = "whatever type setTimeout returns on this
    // platform". On React Native that's a number-like handle; this avoids
    // hard-coding a type that differs between Node and browsers.
    let timeoutId: ReturnType<typeof setTimeout>;

    // Align each tick to the top of the next whole second, so the clock stays in
    // sync with real time instead of drifting a few milliseconds each interval.
    const scheduleNext = () => {
      const current = new Date();
      const msUntilNextSecond = 1000 - current.getMilliseconds();
      timeoutId = setTimeout(() => {
        setNow(new Date());
        scheduleNext(); // re-arm for the following second
      }, msUntilNextSecond);
    };

    scheduleNext();

    // Cleanup: React runs this when the component unmounts. Clearing the pending
    // timer stops it firing after the component is gone — avoiding a leak and the
    // classic "state update on an unmounted component" bug.
    return () => clearTimeout(timeoutId);
  }, []); // [] = set up once on mount, tear down on unmount.

  return now;
}
