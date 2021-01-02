import AsyncStorage from '@react-native-async-storage/async-storage';

const getUserUniqueID = () => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        let uId = await AsyncStorage.getItem('userID');
        if (uId !== null) {
          console.log('userID not null :', uId);
          return resolve(uId);
        } else {
          uId = `${Date.now()}-${Math.random() * 8}`;

          AsyncStorage.setItem('userID', uId)
            .then(() => {
              // console.log('userID set to : ', uId);
              return resolve(uId);
            })
            .catch(() => {
              return reject();
            });
        }
      } catch (error) {
        return reject();
      }
    })();
  });
};

export default getUserUniqueID;
