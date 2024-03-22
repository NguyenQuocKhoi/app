

import React from 'react';
import {View} from 'react-native';
import AppNavigator from './src/config/AppNavigator';
// import {ThemeContainer} from './src/config/theme';
import {LogBox} from 'react-native';
import {Provider} from 'react-redux';
import store from './src/redux/store';
LogBox.ignoreAllLogs();

const App = () => {
  return (
    <Provider store={store}>
      {/* <ThemeContainer> */}
        <View style={{flex: 1}}>
          <AppNavigator />
        </View>
      {/* </ThemeContainer> */}
    </Provider>
  );
};

export default App;
