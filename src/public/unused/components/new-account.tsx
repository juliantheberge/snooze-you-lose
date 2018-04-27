import FormWrapper from './form-wrapper'
import FormItem from './form-item'
import Button from './button-generic'

import * as React from 'react';

class NewAccount extends React.Component {
  render() {
    return (
      <div className="flex column userWrapper">
          <FormWrapper
            buttonText = 'create new account'
            url = 'http://localhost:8000/accounts'
            method = 'post'
            >
            <FormItem
              title = 'name'
              placeholder = 'type in your username'
              imgSrc = {'/icons/black/user-fem.svg'}
              />
            <FormItem
              title = 'email'
              placeholder = 'type in your email'
              imgSrc = {'/icons/black/mail.svg'}
              />
            <FormItem
              title = 'phone'
              placeholder = 'type in your phone number'
              imgSrc = {'/icons/black/phone.svg'}
              />
            <FormItem
              title = 'password'
              placeholder = 'type in your password'
              imgSrc = {'/icons/black/key.svg'}
              type = 'password'
              newPass = {true}
              />
          </FormWrapper>
        </div>
    )
  }
}

export default NewAccount;
