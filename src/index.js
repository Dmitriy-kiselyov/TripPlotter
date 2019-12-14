import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { store } from './store/store';
import { Root } from './components/Root/Root';

ReactDOM.render(
    React.createElement(
        Provider,
        { store },
        React.createElement(Root, {}, null)
    ),
    document.querySelector('#app')
);


