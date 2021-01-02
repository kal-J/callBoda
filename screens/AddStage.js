import React, { useContext, useState } from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  Item,
  Input,
  Button,
  Form,
  Label,
  Textarea,
  Container,
} from 'native-base';
import NavHeader from '../components/NavHeader';
import Stage from '../components/Stage';
import { View, FlatList } from 'react-native';
import colors from '../layouts/colors';
import { Text } from 'react-native';
import Select from '../components/Select';
import { ScrollView } from 'react-native';
import { StoreContext } from '../context';
import NetInfo from '@react-native-community/netinfo';
import firebase from '../firebase';
import { isArray } from 'lodash';
import Error from '../components/Error';
import AsyncStorage from '@react-native-async-storage/async-storage';

const locations = [{ name: 'Lira University' }];

const AddStage = (props) => {
  const { app_state, setAppState } = useContext(StoreContext);
  const [stageInfo, setStageInfo] = useState({
    location: { name: 'Lira University' },
    createdBy: app_state.userID,
    status: 'notVerified',
    get id() {
      if (this.name && this.location.name) {
        return `${this.name}-${this.location.name}`;
      }
      return `${Math.random() * 9}`;
    },
  });
  const [error, setError] = useState(null);

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
          }
        )}
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <NavHeader navigation={props.navigation} title="STAGE DETAILS" />
      <ScrollView style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingHorizontal: wp(10) }}>
          <Form>
            <Item floatingLabel>
              <Label>What's the name of the stage</Label>
              <Input
                value={stageInfo.name || ''}
                onChangeText={(name) => setStageInfo({ ...stageInfo, name })}
              />
            </Item>
          </Form>
        </View>

        <View
          style={{ flex: 1, marginHorizontal: wp(10), marginVertical: hp(2) }}
        >
          <Label>Select location of this stage</Label>
          <Select
            selectedValue={stageInfo.location}
            setSelectedValue={setStageInfo}
            items={locations}
            previous_state={stageInfo}
            newValue={'location'}
          />
        </View>

        <View style={{ flex: 1, paddingHorizontal: wp(10) }}>
          <Label>Short Description (optional)</Label>
          <Textarea
            rowSpan={5}
            bordered
            placeholder="About this stage"
            value={stageInfo.description || ''}
            onChangeText={(description) =>
              setStageInfo({ ...stageInfo, description })
            }
          />
        </View>
      </ScrollView>

      <View
        style={{
          justifyContent: 'flex-end',
          marginHorizontal: wp(10),
          marginVertical: hp(5),
          backgroundColor: '#000',
        }}
      >
        <Button
          full
          style={{ backgroundColor: colors.primary }}
          onPress={() => {
            if (!stageInfo.location) {
              setError('stage location is required');
              return;
            }
            if (!stageInfo.name || stageInfo.name === '') {
              setError('stage name is required');
              return;
            }

            // add stage id
            const newStage = {
              ...stageInfo,
              id: `${stageInfo.name}-${stageInfo.location.name}`,
            };

            const saveToLocalStorage = () => {
              try {
                const local_storage_boda_stages = app_state.stages || [];

                // check if stage exists
                const exists = local_storage_boda_stages.filter(
                  (boda_stage) => boda_stage.id === newStage.id
                ).length;
                if (exists) {
                  setError('stage already exists');
                  return;
                }

                const updated_boda_stages = [
                  ...local_storage_boda_stages,
                  newStage,
                ];
                const jsonValue = JSON.stringify(updated_boda_stages);
                AsyncStorage.setItem('stages', jsonValue)
                  .then(() => {
                    setStageInfo({
                      location: { name: 'Lira University' },
                      createdBy: app_state.userID,
                      status: 'notVerified',
                      get id() {
                        if (this.name && this.location.name) {
                          return `${this.name}-${this.location.name}`;
                        }
                        return `${Math.random() * 9}`;
                      },
                    });
                    setAppState({
                      ...app_state,
                      stages: updated_boda_stages,
                    });
                    props.navigation.navigate('Home');
                  })
                  .catch(() => setError('saving new stage failed, try again'));
              } catch (e) {
                setError('saving new stage failed, try again');
              }
            };

            // save new stage to cloud if there is an internet connection else save to local storage
            NetInfo.fetch().then((state) => {
              if (state.isConnected) {
                firebase
                  .firestore()
                  .collection('stages')
                  .doc('stages')
                  .get()
                  .then((doc) => {
                    if (doc.exists) {
                      if (isArray(doc.data().stages)) {
                        const cloud_boda_stages = doc.data().stages;

                        // check if stage exists
                        const exists = cloud_boda_stages.filter(
                          (boda_stage) => boda_stage.id === newStage.id
                        ).length;
                        if (exists) {
                          setError('This stage already exists');
                          return;
                        }

                        firebase
                          .firestore()
                          .collection('stages')
                          .doc('stages')
                          .set({
                            stages: [...cloud_boda_stages, newStage],
                          })
                          .then(() => {
                            setStageInfo({
                              location: { name: 'Lira University' },
                              createdBy: app_state.userID,
                              status: 'notVerified',
                              get id() {
                                if (this.name && this.location.name) {
                                  return `${this.name}-${this.location.name}`;
                                }
                                return `${Math.random() * 9}`;
                              },
                            });
                            props.navigation.navigate('Home');
                          });
                      }
                    }
                  })
                  .catch((error) => {
                    // if error , save to local storage
                    saveToLocalStorage();
                  });
              } else {
                // save to local storage
                saveToLocalStorage();
              }
            });
          }}
        >
          <Text style={{ color: '#fff' }}>SAVE STAGE</Text>
        </Button>
      </View>
    </View>
  );
};

export default AddStage;
