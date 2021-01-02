import React, { useState, createContext, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import getBodaStages from '../api/getBodaStages';
import getUserUniqueID from '../api/getUserUniqueID';
import { isArray, isEqual } from 'lodash';

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [app_state, setAppState] = useState({
    stages: [],
    userID: null,
  });

  // get userID
  useEffect(() => {
    getUserUniqueID()
      .then((userID) => {
        setAppState({ ...app_state, userID });
      })
      .catch(() => {
        // handle missing userID error
      });
  }, []);

  // fetch stages from cloud or local storage depending on internet connection
  useEffect(() => {
    // #1. get stages from local storage
    let local_store_stages = null;
    let cloud_store_stages = null;

    getBodaStages
      .localStorage()
      .then((stages) => (local_store_stages = stages))
      .catch(() => {
        // do something ;)
      });

    // #2 if internet conn, get cloud stages

    NetInfo.fetch()
      .then((state) => {
        if (state.isConnected) {
          getBodaStages
            .cloudStorage()
            .then((stages) => (cloud_store_stages = stages))
            .catch(() => {
              // display error messege
            });
        }
      })
      .catch(() => {
        // do spmething ;)
      });

    if (!cloud_store_stages) {
      setAppState({ ...app_state, stages: local_store_stages });
    } else {
      setAppState({ ...app_state, stages: cloud_store_stages });
    }
  }, []);

  return (
    <StoreContext.Provider value={{ app_state, setAppState }}>
      {children}
    </StoreContext.Provider>
  );
};
