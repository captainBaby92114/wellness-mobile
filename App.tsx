import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {PipelineNavigator} from './src/navigation/PipelineNavigator';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F12" />
      <PipelineNavigator />
    </SafeAreaProvider>
  );
}

export default App;
