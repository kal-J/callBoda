import React from 'react';
import { Spinner } from 'native-base';
import { View, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import colors from '../layouts/colors';

const IsLoading = (props) => {
  return (
    <View style={isLoading_styles.container}>
      <Spinner size="large" color={colors.primary} />
    </View>
  );
};

const isLoading_styles = StyleSheet.create({
  container: {
    height: hp('100%'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    position: 'absolute',
    zIndex: 10,
    opacity: 0.8,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});

export default IsLoading;