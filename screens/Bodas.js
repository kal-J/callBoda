import React from 'react';
import NavHeader from '../components/NavHeader';
import FiveStarRating from '../components/FiveStarRating';
import { View, Button, Image, Alert, StyleSheet } from 'react-native';
import { Text, Icon, Card, CardItem } from 'native-base';
import colors from '../layouts/colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import call from 'react-native-phone-call';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FlatList } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { isArray } from 'lodash';

const Tab = createMaterialTopTabNavigator();

const DisplayBodas = (props) => {
  const { bodas } = props;

  if (isArray(bodas)) {
    if (!bodas.length) {
      return (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text style={{ textAlign: 'center' }}>
            Bodas not available for this category.
          </Text>
        </View>
      );
    }
  }

  if (!bodas || !isArray(bodas)) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ textAlign: 'center' }}>
          Bodas not available for this stage.
        </Text>
        <Text style={{ textAlign: 'center' }}>
          Click '+' to add a boda to this stage
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {bodas ? (
        <FlatList
          data={bodas}
          keyExtractor={(item) => `${item.id}`}
          renderItem={({ item }) => {
            const boda = item;
            return (
              <Card style={{ paddingVertical: 15 }}>
                <CardItem>
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: 20,
                          paddingVertical: 5,
                        }}
                      >
                        {boda.name}
                      </Text>
                    </View>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Image
                        style={{
                          width: 150,
                          height: 150,
                          borderRadius: 75,
                        }}
                        source={
                          boda.photo_url
                            ? { uri: boda.photo_url }
                            : require('../assets/avatar-placeholder.png')
                        }
                      />
                    </View>
                    <View style={styles.place_center}>
                      <Text
                        style={{
                          color:
                            boda.status === 'notVerified'
                              ? colors.primary
                              : 'blue',
                          fontSize: 12,
                          marginTop: hp(1),
                        }}
                      >
                        {boda.status}
                      </Text>
                    </View>
                    <View style={styles.place_center}>
                      <FiveStarRating rating={boda.rating} />
                    </View>
                    <View
                      style={[
                        styles.place_center,
                        {
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginHorizontal: 40,
                        },
                      ]}
                    >
                      <Button color={colors.primary} title="rate" />
                      <TouchableOpacity onPress={() => {}}>
                        <Icon name="alert" style={{ color: colors.primary }} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          call({
                            number: boda.mobileNo,
                            prompt: true,
                          }).catch(console.error)
                        }
                      >
                        <Icon name="call" style={{ color: colors.primary }} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </CardItem>
              </Card>
            );
          }}
        />
      ) : stageName ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text>Bodas not available for this stage.</Text>
          <Text>click the '+' button to add a Boda</Text>
        </View>
      ) : (
        Alert.alert('No stage selected, first select a stage')
      )}
    </View>
  );
};

const Bodas = (props) => {
  const stageName = props.navigation.getParam('stageName');
  const bodas = props.navigation.getParam('bodas');

  const getVerifiedBodas = (bodas) => {
    if (!bodas) {
      return null;
    }

    if (!isArray(bodas)) {
      return null;
    }

    const verifiedBodas = bodas.filter((boda) => boda.status === 'verified');

    return verifiedBodas;
  };

  const getNotVerifiedBodas = (bodas) => {
    if (!bodas) {
      return null;
    }

    if (!isArray(bodas)) {
      return null;
    }

    const notVerifiedBodas = bodas.filter((boda) => boda.status !== 'verified');

    return notVerifiedBodas;
  };

  return (
    <>
      <View style={{ flex: 1 }}>
        <NavHeader
          navigation={props.navigation}
          title={stageName || 'NO STAGE SELECTED'}
        />
        <View
          style={{
            flex: 1,
            marginHorizontal: wp(5),
          }}
        >
          <NavigationContainer>
            <Tab.Navigator
              tabBarOptions={{
                // showIcon: true,
                activeTintColor: colors.primary,
                inactiveTintColor: 'gray',
                style: {},
                indicatorStyle: {
                  backgroundColor: colors.primary,
                },
                labelStyle: {
                  fontSize: 11,
                },
              }}
            >
              <Tab.Screen
                name="ALL BODAS"
                children={() => <DisplayBodas bodas={bodas} />}
              />
              <Tab.Screen
                name="VERIFIED"
                children={() => (
                  <DisplayBodas bodas={getVerifiedBodas(bodas)} />
                )}
              />
              <Tab.Screen
                name="NOT VERIFIED"
                children={() => (
                  <DisplayBodas bodas={getNotVerifiedBodas(bodas)} />
                )}
              />
            </Tab.Navigator>
          </NavigationContainer>
        </View>
      </View>

      <View
        style={{
          paddingVertical: hp(2),
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
          elevation: 5,
        }}
      >
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.primary,
            width: wp(14),
            height: wp(14),
            borderRadius: wp(7),
            elevation: 5,
          }}
          onPress={() => {
            Alert.alert(
              null,
              "Click 'New Boda' to create and save a new Boda",
              [
                {
                  text: 'New Boda',
                  onPress: () => {
                    props.navigation.navigate('AddBoda');
                  },
                },
                null,
              ],
              { cancelable: true }
            );
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>+</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  place_center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Bodas;
