/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Image} from 'react-native';
import {Text, List, ListItem, Card, CardItem, Body} from 'native-base';
import {View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const SideBar = (props) => {
  return (
    <View style={{flex: 1}}>
      <Card>
        <CardItem>
          <Body>
            <Image
              source={require('../assets/icon.png')}
              style={{width: wp(30), height: wp(30)}}
            />
          </Body>
        </CardItem>
      </Card>

      <List>
        <ListItem button onPress={() => props.navigation.navigate('Home')}>
          <Text>Home</Text>
        </ListItem>
        <ListItem button onPress={() => props.navigation.navigate('Bodas')}>
          <Text>Bodas</Text>
        </ListItem>
        <ListItem button onPress={() => props.navigation.navigate('Dashboard')}>
          <Text>Dashboard</Text>
        </ListItem>
        <ListItem
          style={{
            marginTop: hp(5),
          }}
          button
          onPress={() => {}}>
          <Text>About callBoda</Text>
        </ListItem>
        <ListItem button onPress={() => {}}>
          <Text>Request a stage to be added</Text>
        </ListItem>
      </List>

      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginBottom: hp(1),
        }}>
        <Text
          style={{
            width: '100%',
            borderTopWidth: 1,
            paddingVertical: hp(1),
            paddingHorizontal: wp('20%'),
          }}>
          Version 1.0.0
        </Text>
      </View>
    </View>
  );
};

export default SideBar;
