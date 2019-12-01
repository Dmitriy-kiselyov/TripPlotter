import React from 'react';
import ReactDOM from 'react-dom';

import { Root } from './components/Root/Root.jsx';

ReactDOM.render(
    React.createElement(Root, {}, null),
    document.querySelector('body')
);


