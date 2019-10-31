import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
// this file is where i should handle client side stuff that doesn't deal with react
// Like if i want a right click menu to show up in the main window


ReactDOM.render(<App />, document.getElementById('root'));
// ReactDOM.render(<Fyles />, document.getElementById('files'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
