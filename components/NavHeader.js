import React from 'react';
import colors from '../layouts/colors';
import {
  Header,
  Left,
  Button,
  Icon,
  Body,
  Title,
  Text,
  Right,
} from 'native-base';
import { View } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const NavHeader = (props) => {
  return (
    <Header style={{ backgroundColor: colors.primary }}>
      <Left>
        <Button transparent onPress={() => props.navigation.openDrawer()}>
          <Icon name="menu" />
        </Button>
      </Left>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: wp(4),
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>{props.title}</Text>
      </View>

      <Right />
    </Header>
  );
};

export default NavHeader;
