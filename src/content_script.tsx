import React from 'react';
import { render } from 'react-dom';
import CountDownBox from './Component/CountDownBox';

const root = document.createElement('div');
document.body.appendChild(root);

render(<CountDownBox />, root);