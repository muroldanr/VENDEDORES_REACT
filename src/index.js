import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-image-gallery/styles/css/image-gallery.css";
//import * as serviceWorker from "./register-sw";
//import {Provider} from 'react-redux';
//import store from './redux/store';

ReactDOM.render(<App />, document.getElementById('root'));
//serviceWorker.unregister();
//serviceWorker.register();
//serviceWorker.listen();