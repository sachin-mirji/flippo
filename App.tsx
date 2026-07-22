import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useClockTick } from './src/features/clock/hooks/useClockTick';
import { Clock } from './src/features/clock/components/Clock';

export default function App() {
  const now = useClockTick();

  return (
    <View style={styles.container}>

      <Clock date={now} />
      {/* style="light" = light-colored status bar icons, readable on our dark bg */}
      {/* <StatusBar style="light" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a', // dark by default (see docs/PRODUCT.md)
    alignItems: 'center',
    justifyContent: 'center',
  },
});
