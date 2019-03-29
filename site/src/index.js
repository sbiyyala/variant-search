import React from 'react';
import ReactDOM from 'react-dom';

import 'whatwg-fetch';
import 'rxjs';

import './style/index';

import * as serviceWorker from './serviceWorker';
import {store} from "./redux";
import {Provider} from "react-redux";
import App from "./App";

const Bootstrap = ({children}) => {
    return <Provider store={store}>
        {children}
    </Provider>;
};

ReactDOM.render(
    <Bootstrap>
        <App/>
    </Bootstrap>,
    document.getElementById('root'));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();