import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, View, Platform } from 'react-native';
import { usePedometer } from '@use-expo/sensors';
import { Pedometer } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";


export default function App() {

  const [data, isAvailable] = usePedometer();
  const [steps, setSteps] = useState<number>(0);

  useEffect(() => {
    if(isAvailable){
      subscribe();
    }
  }, [isAvailable]);

  const subscribe = async() => {
    if(Platform.Version >= 29){
      const permissionStatus = await check(PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION);

      if(permissionStatus !== RESULTS.GRANTED){
        const Result = await request(PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION);

        if(Result !== RESULTS.GRANTED) {
          Alert.alert("Destruction....");
          return;
        }
      }
    }
    else{
      const permissionStatus = (await Pedometer.getPermissionsAsync()).granted;

      if(!permissionStatus){
        await Pedometer.requestPermissionsAsync();
      }
    }

    Pedometer.watchStepCount(res => {
      setSteps(res.steps);
    })
  }

  return (
    <View style={styles.container}>
      <Text>Your Steps</Text>
      <Text>{steps}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
