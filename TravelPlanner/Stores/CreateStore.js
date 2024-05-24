import { applyMiddleware, compose, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import { persistReducer, persistStore } from "redux-persist";
import { composeWithDevTools } from "redux-devtools-extension";
import FilesystemStorage from "redux-persist-filesystem-storage";
import RNFetchBlob from "rn-fetch-blob";
// import { createTransform } from 'redux-persist';
// import JSOG from 'jsog'
/**
 * This import defaults to localStorage for web and AsyncStorage for react-native.
 */
// export const transformCircular = createTransform(
//   (inboundState, key) => JSOG.encode(inboundState),
//     (outboundState, key) => JSOG.decode(outboundState),
// )
FilesystemStorage.config({
  storagePath: `${RNFetchBlob.fs.dirs.DocumentDir}/persistStore`
});

const persistConfig = {
  key: "root",
  storage: FilesystemStorage,
  /**
   * Blacklist state that we do not need/want to persist
   */
  blacklist: [
    // 'auth',
  ],
  // transforms: [transformCircular]
};

export default (rootReducer, rootSaga) => {
  const middleware = [];
  const enhancers = [];

  // Connect the sagas to the redux store
  const sagaMiddleware = createSagaMiddleware();
  middleware.push(sagaMiddleware);

  enhancers.push(composeWithDevTools(applyMiddleware(...middleware)));

  // Redux persist
  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = createStore(persistedReducer, compose(...enhancers));
  const persistor = persistStore(store);

  // Kick off the root saga
  sagaMiddleware.run(rootSaga);

  return { store, persistor };
};
