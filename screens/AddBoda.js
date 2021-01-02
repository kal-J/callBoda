import React, { useState, useContext } from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  Container,
  Header,
  Item,
  Icon,
  Input,
  Button,
  Form,
  Label,
  Textarea,
  Picker,
} from 'native-base';
import NavHeader from '../components/NavHeader';
import { View, StyleSheet, Alert } from 'react-native';
import colors from '../layouts/colors';
import { Text } from 'react-native';
import { StoreContext } from '../context';
import { TouchableOpacity } from 'react-native';
import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';
import { ScrollView } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import firebase from '../firebase';
import { isArray } from 'lodash';
const AddBoda = (props) => {
  const { app_state, setAppState } = useContext(StoreContext);
  const [newBoda, setNewBoda] = useState({
    stage: null,
    rating: 1,
    status: 'notVerified',
    createdBy: app_state.userID,
    get id() {
      if (this.mobileNo) {
        return this.mobileNo;
      }
      return Math.random() * 9;
    },
  });
  const [error, setError] = useState(null);

  const { stages } = app_state;

  const selectPhoto = async () => {
    (async () => {
      if (Platform.OS !== 'web') {
        const {
          status,
        } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== 'granted') {
          return alert(
            'Sorry, we need camera roll permissions to make this work!'
          );
        }
      }
    })();

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      // allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setNewBoda({ ...newBoda, local_photo: result });
    }
  };

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

  const Select = () => {
    return (
      <View style={styles.container}>
        <Picker
          placeholder="SELECT STAGE"
          selectedValue={newBoda.stage}
          style={{ width: wp(70), marginLeft: wp(10) }}
          onValueChange={(itemValue) =>
            setNewBoda({
              ...newBoda,
              stage: itemValue,
            })
          }
        >
          <Picker.Item
            key={`${Math.random * 2}`}
            label="SELECT STAGE"
            value={null}
          />
          {stages.map((stage, index) => {
            return (
              <Picker.Item
                key={`${index}`}
                color={colors.primary}
                label={stage.name}
                value={stage}
              />
            );
          })}
        </Picker>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });

  return (
    <>
      <ScrollView style={{ flex: 1 }}>
        <NavHeader navigation={props.navigation} title="ADD BODA" />
        <View style={{ flex: 1, paddingHorizontal: wp(10) }}>
          <Form>
            <Item floatingLabel>
              <Label>Enter name</Label>
              <Input
                value={newBoda.name || ''}
                onChangeText={(name) => setNewBoda({ ...newBoda, name })}
              />
            </Item>

            <Item floatingLabel>
              <Label>Telephone Number</Label>
              <Input
                value={newBoda.mobileNo || ''}
                onChangeText={(mobileNo) =>
                  setNewBoda({ ...newBoda, mobileNo })
                }
              />
            </Item>

            <View style={{ flex: 1, paddingTop: hp(3) }}>
              <Label>Select stage the Boda belongs to : </Label>

              <Select
                selectedValue={newBoda.stage}
                setSelectedValue={setNewBoda}
                items={stages}
                previous_state={newBoda}
                newValue={'stage'}
              />
            </View>
          </Form>
        </View>

        <View
          style={{ flex: 1, paddingHorizontal: wp(10), flexDirection: 'row' }}
        >
          {newBoda.local_photo ? (
            <View
              style={{
                height: hp(16),
                width: hp(16),
                borderRadius: hp(8),
                backgroundColor: '#000',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                source={{ uri: newBoda.local_photo.uri }}
                style={{ width: hp(16), height: hp(16), borderRadius: hp(8) }}
              />
            </View>
          ) : (
            <View
              style={{
                height: hp(16),
                width: hp(16),
                borderRadius: hp(8),
                backgroundColor: '#000',
              }}
            ></View>
          )}

          <View
            style={{
              height: hp(16),
              justifyContent: 'center',
              paddingHorizontal: wp(4),
            }}
          >
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: colors.primary,
                padding: wp(4),
              }}
              onPress={() => selectPhoto()}
            >
              <Text>Select Photo</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ marginHorizontal: wp(10), marginTop: hp(2) }}>
          <Label>Boda's Bio (optional) </Label>
          <Textarea
            rowSpan={4}
            bordered
            placeholder="About this Boda Guy..."
            value={newBoda.bio || ''}
            onChangeText={(bio) => setNewBoda({ ...newBoda, bio })}
          />
        </View>
      </ScrollView>
      <View
        style={{
          justifyContent: 'flex-end',
          marginHorizontal: wp(10),
          marginVertical: hp(5),
        }}
      >
        <Button
          full
          style={{ backgroundColor: colors.primary }}
          onPress={() => {
            if (newBoda.name === '' || !newBoda.name) {
              setError('Name is a required field');
              return;
            }
            if (newBoda.mobileNo === '' || !newBoda.mobileNo) {
              setError('Telephone number is a required field');
              return;
            }

            //  ==== newBoda stage id is undefined

            if (!newBoda.stage.id) {
              setError('Boda stage is not selected');
              return;
            }

            // check if boda already exists in selected stage
            if (newBoda.stage.bodas) {
              const exists = newBoda.stage.bodas.filter(
                (boda) => boda.mobileNo === newBoda.mobileNo
              ).length;
              if (exists) {
                setError('Boda with this telephone number already exists');
                return;
              }
            }

            // save newBoda to cloud if there is an internet connection

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
                        let cloud_boda_stages = doc.data().stages;

                        // check if new boda's stage exists in cloud data

                        const isStageSavedToCloud = cloud_boda_stages.filter(
                          (stage) => stage.id === newBoda.stage.id
                        ).length;
                        if (!isStageSavedToCloud) {
                          setError(
                            'There has been an error with saving your boda -1'
                          );
                          return;
                        }

                        // check if cloud stages have this boda
                        const stagesHaveBoda = cloud_boda_stages.filter(
                          (stage) => {
                            if (stage.id === newBoda.stage.id) {
                              if (stage.bodas) {
                                const bodaExists = stage.bodas.filter(
                                  (boda) => boda.mobileNo === newBoda.mobileNo
                                ).length;
                                bodaExists ? true : false;
                              } else {
                                return false;
                              }
                            }
                          }
                        ).length;

                        if (stagesHaveBoda) {
                          setError(
                            'Boda with this telephone number already exists'
                          );
                          return;
                        }

                        // mutate selected cloud_boda_stage
                        let mutatedStages = [...cloud_boda_stages];
                        mutatedStages.forEach((stage, index) => {
                          if (stage.id === newBoda.stage.id) {
                            const oldStage = stage;
                            mutatedStages[index] = {
                              ...oldStage,
                              get bodas() {
                                if (oldStage.bodas) {
                                  return [
                                    ...oldStage.bodas,
                                    {
                                      ...newBoda,
                                      local_photo: null,
                                    },
                                  ];
                                }
                                return [{ ...newBoda, local_photo: null }];
                              },
                            };
                          }
                        });

                        // upload image if selected
                        const uploadPhoto = () => {
                          return new Promise((resolve, reject) => {
                            if (!newBoda.local_photo) {
                              return reject();
                            }
                            (() => {
                              try {
                                const storageRef = firebase
                                  .storage()
                                  .ref(`bodaPhotos/${newBoda.id}`);
                                storageRef
                                  .put(newBoda.local_photo)
                                  .then((uploadedFile) => {
                                    storageRef.getDownloadURL().then((url) => {
                                      setNewBoda({
                                        ...newBoda,
                                        photo_url: url,
                                      });
                                      return resolve(true);
                                    });
                                  })
                                  .catch((error) => reject());
                              } catch (error) {
                                return reject(error);
                              }
                            })();
                          });
                        };

                        // first upload photo before proceeding
                        (async () => {
                          await uploadPhoto();
                        })();

                        firebase
                          .firestore()
                          .collection('stages')
                          .doc('stages')
                          .set({
                            stages: [...mutatedStages],
                          })
                          .then(() => {
                            setNewBoda({
                              stage: null,
                              rating: 1,
                              status: 'notVerified',
                              createdBy: app_state.userID,
                              get id() {
                                if (this.mobileNo) {
                                  return this.mobileNo;
                                }
                                return Math.random() * 9;
                              },
                            });
                            props.navigation.navigate('Home');
                          });
                      }
                    }
                  })
                  .catch((error) => {
                    // if error , save to local storage
                    return setError(error.message);
                  });
              } else {
                setError('No internet connection');
              }
            });
          }}
        >
          <Text style={{ color: '#fff' }}>ADD BODA</Text>
        </Button>
      </View>
    </>
  );
};

export default AddBoda;
