import {BrowserRouter, Link, Redirect, Route, Switch} from "react-router-dom";
import FormItem from "./components/form-item";
import FormWrapper from "./components/form-wrapper";
import Button from './components/button-generic'
import * as React from 'react';
import * as ReactDOM from 'react-dom';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  public render() {
    return (
      <div className = 'login-wrapper'>
        <div className ="flex column userWrapper">
          <FormWrapper
            buttonText = 'login'
            url= '/authorized/api'
            noValidation = {false}
            method = 'post'
            >
            <FormItem
              title = 'email'
              placeholder = 'email'
              imgSrc = '/icons/black/mail.svg'
              />
            <FormItem
              title = 'password'
              placeholder = 'password'
              imgSrc = '/icons/black/key.svg'
              type = 'password'
              newPass = {false}
              />
          </FormWrapper>
          <div className="flex column userWrapper">
            {/* <form action="/forgot-password" method="get">
              <button className="no" type="submit">forgot password</button>
            </form> */}
          </div>
        </div>
      </div>
    );
  }
}

