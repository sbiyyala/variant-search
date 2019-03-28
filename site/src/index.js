import React from 'react';
import ReactDOM from 'react-dom';

import 'whatwg-fetch';
import 'rxjs';

import 'material-design-icons/iconfont/material-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-bootstrap.css';
import 'ag-grid-community/dist/styles/compiled-icons.css';

import './index.css';

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