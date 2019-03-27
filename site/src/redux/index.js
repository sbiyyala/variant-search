import {applyMiddleware, combineReducers, createStore} from "redux";
import {variantSearch, rootEpic} from "./variantSearch";
import {combineEpics, createEpicMiddleware} from "redux-observable";
import {composeWithDevTools} from "remote-redux-devtools";

const reducers = {variantSearch};
const epics = [rootEpic];

const epicMiddleware = createEpicMiddleware(combineEpics(...epics));
const rootReducer = combineReducers(reducers);
const composeEnhancers = composeWithDevTools({realTime: true});

const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(epicMiddleware)));

export {store};