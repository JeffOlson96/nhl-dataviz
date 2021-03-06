import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import BaseApp from './BaseApp';
import * as serviceWorker from './serviceWorker';
import HeaderComp from './HeaderComp';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(<HeaderComp />, document.getElementById('head'));
ReactDOM.render(<BaseApp />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
