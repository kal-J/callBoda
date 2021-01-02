import AsyncStorage from '@react-native-async-storage/async-storage';
import { isArray } from 'lodash';
import firebase from '../firebase';

const getBodaStages = {
  localStorage: () => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          let stages = await AsyncStorage.getItem('stages');
          if (stages !== null) {
            stages = JSON.parse(stages);
            if (isArray(stages)) {
              if (stages.length) {
                return resolve(stages);
              } else {
                return reject();
              }
            } else {
              return reject();
            }
          } else {
            return reject();
          }
        } catch (e) {
          return reject();
        }
      })();
    });
  },

  cloudStorage: () => {
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection('stages')
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (doc.exists) {
              // check if doc has an object with stages array
              const { stages } = doc.data();

              if (isArray(stages)) {
                if (stages.length) {
                  return resolve(stages);
                }
              }
            }
            return resolve([]);
          });
        })
        .catch(() => {
          return reject();
        });
    });
  },
};

export default getBodaStages;
