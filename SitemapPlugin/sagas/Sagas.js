import { all } from "redux-saga/effects";

import CloudSitemapSagas from "./cloudSitemapSagas";
export default function* rootSaga() {

    const sagas = [
        ...CloudSitemapSagas,
    ];

    yield all( sagas );

}
