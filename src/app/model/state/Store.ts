import {applyMiddleware, combineReducers, createStore} from "redux";

import {enableBatching} from "redux-batched-actions";

import {createHashHistory} from "history";

import {createLogger} from "redux-logger";
import thunk from "redux-thunk";
import rootReducer from "./Reducers";

declare let process;

const middleware = [thunk];
/*
 if (process.env.NODE_ENV !== 'production') {
 middleware.push(createLogger());
 }
 */

export const store = createStore(
    enableBatching(combineReducers({...rootReducer})),
    applyMiddleware(...middleware));

export const hashHistory = createHashHistory();

