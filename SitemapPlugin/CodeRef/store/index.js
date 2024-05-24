import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";
import rootReducer from "../reducers";
import rootSaga from "../sagas";
import { persistStore, persistReducer } from "redux-persist";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import storage from "redux-persist/lib/storage";

const sagaMiddleware = createSagaMiddleware();

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["user"],
    stateReconciler: autoMergeLevel2,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(
    persistedReducer,
    rootReducer,
    composeWithDevTools(
        applyMiddleware(sagaMiddleware),
    )
);

export const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);
