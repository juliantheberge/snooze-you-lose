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
            url = '/accounts/api'
            method = 'post'
            >
            <FormItem
              title = 'name'
              placeholder = 'name'
              imgSrc = {'/icons/black/user-fem.svg'}
              />
            <FormItem
              title = 'email'
              placeholder = 'email'
              imgSrc = {'/icons/black/mail.svg'}
              />
            <FormItem
              title = 'phone'
              placeholder = 'phone'
              imgSrc = {'/icons/black/phone.svg'}
              />
            <FormItem
              title = 'password'
              placeholder = 'password'
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
