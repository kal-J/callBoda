import React, { useContext } from 'react';
import { StoreContext } from '../context';
import NetInfo from '@react-native-community/netinfo';
import {
  Alert,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import NavHeader from '../components/NavHeader';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
  Container,
  Card,
  CardItem,
  Content,
  Right,
  Icon,
  Button,
} from 'native-base';
import colors from '../layouts/colors';
import { isArray } from 'lodash';
import call from 'react-native-phone-call';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import deleteBoda from '../api/deleteBoda';

const Tab = createMaterialTopTabNavigator();

const BottomActionBtn = (props) => {
  return (
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
  );
};

const DisplayBodas = (props) => {
  const { bodas, stages, app_state, setAppState } = props;

  if (!bodas.length) {
    return (
      <>
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text>You have not added any Boda.</Text>
          <Text>To add a boda, click the '+' button</Text>
        </View>

        <BottomActionBtn navigation={props.navigation} />
      </>
    );
  }

  return (
    <>
      <View style={{ flex: 1 }}>
        {bodas.map((boda, index) => {
          return (
            <View key={`${index}`} style={{ flex: 1 }}>
              <Card style={{}}>
                <CardItem>
                  <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View
                      style={{
                        justifyContent: 'center',
                      }}
                    >
                      <Image
                        style={{
                          width: wp(14),
                          height: wp(14),
                          borderRadius: wp(7),
                        }}
                        source={
                          boda.photo_url
                            ? { uri: boda.photo_url }
                            : require('../assets/avatar-placeholder.png')
                        }
                      />
                    </View>

                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        marginHorizontal: wp(4),
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: 16,
                        }}
                      >
                        {boda.name}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.place_center,
                        {
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginHorizontal: wp(4),
                        },
                      ]}
                    >
                      <TouchableOpacity
                        onPress={() =>
                          call({
                            number: boda.mobileNo,
                            prompt: true,
                          }).catch(console.error)
                        }
                      >
                        <Icon name="call" style={{ color: 'green' }} />
                      </TouchableOpacity>
                    </View>

                    <View
                      style={[
                        styles.place_center,
                        {
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginHorizontal: wp(4),
                        },
                      ]}
                    >
                      <TouchableOpacity
                        style={{
                          borderWidth: 0.5,
                          borderColor: colors.primary,
                          padding: wp(0.5),
                        }}
                        onPress={() => {
                          props.navigation.navigate({
                            routeName: 'EditBoda',
                            params: {
                              boda: boda,
                            },
                          });
                        }}
                      >
                        <Text style={{ color: colors.primary }}>EDIT</Text>
                      </TouchableOpacity>
                    </View>

                    <View
                      style={[
                        styles.place_center,
                        {
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginHorizontal: wp(4),
                        },
                      ]}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          NetInfo.fetch()
                            .then((state) => {
                              if (state.isConnected) {
                                deleteBoda(boda)
                                  .then(() => {})
                                  .catch((error) => {
                                    Alert.alert(null, error, {
                                      cancelable: true,
                                    });
                                  });
                              } else {
                                Alert.alert(
                                  null,
                                  'Error, No internet connection',
                                  null,
                                  {
                                    cancelable: true,
                                  }
                                );
                              }
                            })
                            .catch(() => {
                              Alert.alert(
                                null,
                                'Error, No internet connection',
                                null,
                                {
                                  cancelable: true,
                                }
                              );
                            });
                        }}
                      >
                        <Icon
                          name="md-trash"
                          style={{ color: colors.primary }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </CardItem>
              </Card>
            </View>
          );
        })}
      </View>

      <BottomActionBtn navigation={props.navigation} />
    </>
  );
};

const Dashboard = (props) => {
  const { app_state, setAppState } = useContext(StoreContext);
  const { userID, stages } = app_state;

  let userBodas = [];
  let userStages = [];

  // get bodas created by this app user
  stages.forEach((stage) => {
    if (!stage.bodas) {
      return;
    }

    if (!isArray(stage.bodas)) {
      return;
    }

    stage.bodas.forEach((boda) => {
      if (boda.createdBy === userID) {
        userBodas.push(boda);
      }
    });
  });

  // get stages created by this app user
  stages.forEach((stage) => {
    if (stage.createdBy === userID) {
      userStages.push(stage);
    }
  });

  return (
    <Container>
      <NavHeader navigation={props.navigation} title="DASHBOARD" />

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
            name="MY BODAS"
            children={() => (
              <DisplayBodas
                bodas={userBodas}
                stages={stages}
                app_state={app_state}
                setAppState={setAppState}
                navigation={props.navigation}
              />
            )}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </Container>
  );
};

const styles = StyleSheet.create({
  place_center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Dashboard;
