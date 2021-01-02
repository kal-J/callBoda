import firebase from '../firebase';
import NetInfo from '@react-native-community/netinfo';

const editBoda = (boda) => {
  return new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then((state) => {
        if (state.isConnected) {
          firebase
            .firestore()
            .collection('stages')
            .doc('stages')
            .get()
            .then((doc) => {
              if (!doc.exists) {
                return reject('sorry, something went wrong, please try again');
              }

              if (!isArray(doc.data().stages)) {
                return reject('sorry, something went wrong, please try again');
              }

              let cloud_boda_stages = doc.data().stages;

              // check if boda's stage exists in cloud data

              const isStageSavedToCloud = cloud_boda_stages.filter(
                (stage) => stage.id === boda.stage.id
              ).length;
              if (!isStageSavedToCloud) {
                return reject('sorry, something went wrong, please try again');
              }

              // check if cloud stages have this boda
              const stagesHaveBoda = cloud_boda_stages.filter((stage) => {
                if (stage.id === boda.stage.id) {
                  if (stage.bodas) {
                    const bodaExists = stage.bodas.filter(
                      (c_boda) => boda.id === c_boda.id
                    ).length;
                    bodaExists ? true : false;
                  } else {
                    return false;
                  }
                }
              }).length;

              if (!stagesHaveBoda) {
                return reject('sorry, something went wrong, please try again');
              }

              // mutate selected cloud_boda_stage
              let mutatedStages = [...cloud_boda_stages];
              cloud_boda_stages.forEach((stage, index) => {
                if (stage.id === boda.stage.id) {
                  const oldStage = stage;
                  mutatedStages[index] = {
                    ...oldStage,
                    get bodas() {
                      if (oldStage.bodas) {
                        // mutate old boda
                        let o_stage_bodas = [...oldStage.bodas];

                        oldStage.bodas.forEach((oldBoda, index) => {
                          if (oldBoda.id === boda.id) {
                            o_stage_bodas[index] = {
                              ...boda,
                              local_photo: null,
                            };
                          }
                        });
                        return [...o_stage_bodas];
                      }
                      return [{ ...boda, local_photo: null }];
                    },
                  };
                }
              });

              firebase
                .firestore()
                .collection('stages')
                .doc('stages')
                .set({
                  stages: [...mutatedStages],
                })
                .then(() => {
                  return resolve(boda);
                })
                .catch(() => {
                  return reject(
                    'sorry, something went wrong, please try again'
                  );
                });
            })
            .catch((error) => {
              // if error , save to local storage
              return reject('sorry, something went wrong, please try again');
            });
        } else {
          // save to local storage
          return reject(
            'No internet connection. You need an internet connection to edit boda info'
          );
        }
      })
      .catch(() => {
        return reject('sorry, something went wrong, please try again');
      });
  });
};

export default editBoda;
