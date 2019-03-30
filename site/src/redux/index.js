import {applyMiddleware, combineReducers, createStore} from "redux";
import {variantSearch, variantSearchRootEpic} from "./variantSearch";
import {combineEpics, createEpicMiddleware} from "redux-observable";
import {composeWithDevTools} from "remote-redux-devtools";
import {notifications} from "./notifications";

const reducers = {variantSearch, notifications};
const epics = [variantSearchRootEpic];

const epicMiddleware = createEpicMiddleware(combineEpics(...epics));
const rootReducer = combineReducers(reducers);
const composeEnhancers = composeWithDevTools({realTime: true});

const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(epicMiddleware)));

export {store};