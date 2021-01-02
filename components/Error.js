import React from 'react';
import { Button, Icon } from 'native-base';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../layouts/colors';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const Error = (props) => {
  const { setError, message } = props;

  return (
    <View style={error_styles.card}>
      <Text style={error_styles.text_msg}>{message}</Text>

      <Icon name="warning" style={error_styles.icon} />
      <Button full style={error_styles.btn} onPress={() => setError(null)}>
        <Text style={error_styles.btn_text}>CLOSE</Text>
      </Button>
    </View>
  );
};

const error_styles = StyleSheet.create({
  card: {
    height: hp('40%'),
    marginVertical: hp('30%'),
    marginHorizontal: wp(5),
    elevation: 10,
    backgroundColor: '#fff',
    borderRadius: wp(4),
    justifyContent: 'center',
    alignItems: 'center',
  },
  text_msg: {
    fontWeight: 'bold',
    marginVertical: hp(6),
    alignSelf: 'center',
  },
  icon: {
    alignSelf: 'center',
    color: colors.secondary,
    fontSize: 50,
  },
  btn: {
    marginVertical: hp(6),
    marginHorizontal: wp(5),
    backgroundColor: colors.secondary,
  },
  btn_text: {
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default Error;
