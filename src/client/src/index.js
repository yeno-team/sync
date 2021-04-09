import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Routes } from './core/routes';
import reportWebVitals from './reportWebVitals';

import { Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

import socketSubscriber from './api/socket/socketSubscriber';
socketSubscriber.init();

const options = {
  position: 'bottom right',
  timeout: 2500,
  offset: '30px',
  transition: 'scale',
  containerStyle: {
    zIndex: 100
  }
}

ReactDOM.render(
  <React.StrictMode>
      <AlertProvider template={AlertTemplate} {...options}>
        <Routes />
      </AlertProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();