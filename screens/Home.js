/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState, useEffect} from 'react';
import NetInfo from '@react-native-community/netinfo';
import firebase from '../firebase';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Container, Header, Item, Icon, Input} from 'native-base';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import NavHeader from '../components/NavHeader';
import Stage from '../components/Stage';
import {View, FlatList} from 'react-native';
import colors from '../layouts/colors';
import {TouchableOpacity} from 'react-native';
import {Text} from 'react-native';
import {StoreContext} from '../context';
import {Alert} from 'react-native';
import {isArray} from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createMaterialTopTabNavigator();

const Stages = (props) => {
  const {stages} = props;

  if (!stages.length) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{textAlign: 'center', marginHorizontal: wp(2)}}>
          No stages available. You either do not have an internet connection or
          no stages have been added yet.
        </Text>
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={stages}
        keyExtractor={(item) => `${item.id}}`}
        renderItem={({item}) => (
          <Stage navigation={props.navigation} stage={item} />
        )}
      />
    </View>
  );
};

const Map_stages = (props) => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Maps showing stages are not supported yet.</Text>
    </View>
  );
};

const Home = (props) => {
  const {app_state, setAppState} = useContext(StoreContext);
  const [error, setError] = useState(null);
  const [onload, setOnload] = useState(false);

  // listen for any updates to cloud storage and update local storage
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        firebase
          .firestore()
          .collection('stages')
          .doc('stages')
          .onSnapshot((doc) => {
            if (doc.exists) {
              const {stages} = doc.data();
              if (isArray(stages)) {
                if (stages.length) {
                  // get stages not yet uploaded
                  (async () => {
                    await AsyncStorage.setItem(
                      'stages',
                      JSON.stringify(stages),
                    );
                  })();

                  setAppState({
                    ...app_state,
                    stages: stages,
                  });
                }
              }
            }
          });
      }
    });

    return unsubscribe();
  }, []);

  useEffect(() => {
    setOnload(true);
  }, []);

  if (error) {
    return (
      <View>
        {Alert.alert(
          null,
          error,
          [
            null,
            null,
            {
              text: 'OK',
              onPress: () => {
                setError(null);
              },
            },
          ],
          {
            cancelable: true,
          },
        )}
      </View>
    );
  }

  return (
    <Container>
      {onload &&
        Alert.alert(
          null,
          'This is an alpha version of this App and so only Boda stages around Lira University are supported. More Areas will be supported in future releases',
          [
            null,
            null,
            {
              text: 'ok',
              onPress: () => {
                setOnload(false);
              },
            },
          ],
          {cancelable: true},
        )}

      <NavHeader navigation={props.navigation} title="SELECT STAGE" />
      <View style={{backgroundColor: colors.primary}}>
        <Header searchBar rounded style={{backgroundColor: colors.primary}}>
          <Item>
            <Icon name="search" />
            <Input placeholder="SEARCH BODA STAGES" />
          </Item>
        </Header>
      </View>

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
          }}>
          <Tab.Screen
            name="Stages"
            children={() => (
              <Stages {...props} stages={app_state.stages || []} />
            )}
          />
          <Tab.Screen name="Map" children={() => <Map_stages {...props} />} />
        </Tab.Navigator>
      </NavigationContainer>

      <View
        style={{
          paddingVertical: hp(2),
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
          elevation: 5,
        }}>
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
              'Add a New Boda ?',
              [
                null,
                null,
                {
                  text: 'CONTINUE',
                  onPress: () => {
                    props.navigation.navigate('AddBoda');
                  },
                },
              ],
              {cancelable: true},
            );
          }}>
          <Text style={{color: '#fff', fontWeight: 'bold'}}>+</Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
};

export default Home;
