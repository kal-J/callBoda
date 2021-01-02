import React, {useEffect} from 'react';
import {View, StyleSheet, Platform, StatusBar} from 'react-native';
import colors from '../layouts/colors';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;
const styles = StyleSheet.create({
  statusBar: {
    height: STATUSBAR_HEIGHT,
    backgroundColor: colors.primary,
  },
});

const GeneralStatusBar = props => {
  useEffect(() => {
    StatusBar.setBackgroundColor(colors.primary);
  }, []);

  return (
    <View style={styles.statusBar}>
      <StatusBar barStyle="light-content" translucent={true} {...props} />
    </View>
  );
};

export default GeneralStatusBar;