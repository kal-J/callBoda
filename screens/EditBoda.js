import React, { useState, useContext, useEffect } from 'react';
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
import Error from '../components/Error';
import editBoda from '../api/editBoda';
import IsLoading from '../components/IsLoading';

const EditBoda = (props) => {
  // get boda to edit
  const boda = props.navigation.getParam('boda');
  const { app_state } = useContext(StoreContext);
  const [newBoda, setNewBoda] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { stages } = app_state;

  useEffect(() => {
    if (boda) {
      setNewBoda({ ...boda });
    }
  }, []);

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
      {loading && <IsLoading />}
      <ScrollView style={{ flex: 1 }}>
        <NavHeader navigation={props.navigation} title="EDIT BODA" />
        <View style={{ flex: 1, paddingHorizontal: wp(10) }}>
          <Form>
            <Item floatingLabel>
              <Label>Enter name</Label>
              <Input
                value={newBoda.name || ''}
                onChangeText={(name) => setNewBoda({ ...newBoda, name })}
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

            //  ==== newBoda stage id is undefined

            if (!newBoda.stage.id) {
              setError('Boda stage is not selected');
              return;
            }

            // save photo if internet connection
            setLoading(true);
            NetInfo.fetch().then((state) => {
              if (state.isConnected) {
                // upload image if selected
                const uploadPhoto = () => {
                  return new Promise((resolve, reject) => {
                    if (!newBoda.local_photo) {
                      reject();
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
                          });
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
              } else {
                setLoading(false);
                return Alert.alert(
                  null,
                  'Error, No internet connection',
                  null,
                  {
                    cancelable: true,
                  }
                );
              }
            });

            editBoda(newBoda)
              .then(() => {
                // handle edit success
                setLoading(false);
                props.navigation.navigate('Dashboard');
              })
              .catch((error) => {
                setLoading(false);
                setError(error);
              });
          }}
        >
          <Text style={{ color: '#fff' }}>SAVE BODA</Text>
        </Button>
      </View>
    </>
  );
};

export default EditBoda;
