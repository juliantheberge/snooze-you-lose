import TextForm from './text-form';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

ReactDOM.render(
  <TextForm
    title = 'email'
    placeholder = 'type in your email address'
    buttonText = 'submit email'
    />,
  document.getElementById('email')
);

ReactDOM.render(
  <TextForm
    title = 'phone'
    placeholder = 'type in your phone number'
    buttonText = 'submit phone'
    />,
  document.getElementById('phone')
);

ReactDOM.render(
  <TextForm
    title = 'name'
    placeholder = 'type in your phone name'
    buttonText = 'submit name'
    />,
  document.getElementById('name')
);
