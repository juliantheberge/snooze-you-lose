import PasswordQuality from './password-quality'
import scorer from './helpers/password-strength'
import { textFormValidation } from './helpers/validation'

import * as React from 'react';

class FormItem extends React.Component {
  state:{
    firstClick: boolean;
    clicked: boolean;
    submitable: boolean;
    focused: boolean;
    error: boolean;
    submitted: boolean;
    errorMessage: string;
    input: string;
    value: string;
    entropy: number;
  };
  props:{
    title: string;
    imgSrc:string;
    type?:string;
    buttonText?: string;
    placeholder: string;
    submitted?: boolean;
    sendData?: Function;
    entropy?: number;
    newPass?: boolean;
    sumbitted?:boolean;
  }

  title:string;
  buttonText:string;

  constructor(props:FormItem) {
    super(props)
    this.state = {
      firstClick:false,
      clicked:false,
      submitable:false,
      focused: false,
      error: false,
      input:'',
      value:'',
      errorMessage:'',
      submitted:props.submitted,
      entropy:0
    };

    this.title =  props.title;
    this.buttonText = props.buttonText;
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.submitable = this.submitable.bind(this);
  }

  render() {
    return (
      <div className = 'textFormWrapper'>
        <FormTitle
          title = {this.title}
          firstClick = {this.state.firstClick}
          clicked = {this.state.clicked}
          submitted = {this.props.submitted} />
        <div>
          <FormIcon
            clicked = {this.state.clicked}
            imgSrc = {this.props.imgSrc}
            />
          <TextInput
            firstClick = {this.state.firstClick}
            clicked = {this.state.clicked}
            onClick = {this.handleClick}
            onFocus = {this.handleFocus}
            onChange = {this.handleChange}
            blurred = {this.handleBlur}

            placeholder = {this.props.placeholder}
            submitted = {this.props.submitted}
            error = {this.state.error}
            value = {this.state.value}
            type = {this.props.type}
            />
        </div>
        {this.props.type === 'password' ? <PasswordQuality
          entropy = {this.state.entropy}
          newPass = {this.props.newPass}
          type = {this.props.type}
          /> : <PasswordQuality/>}
        <FormError
          error = {this.state.error}
          errorMessage = {this.state.errorMessage}
          />
      </div>
    )
  }

  handleChange(event) {
    if (this.props.type === 'password') {
      this.setState({
        value: event.target.value
      })
      let entropy = scorer(event.target.value)
      let validationAns = textFormValidation(this.title, entropy.toString());
      if (!(validationAns === 'OK')) {
        this.setState({
          entropy:entropy,
          submitable:false
        }, function() {
          this.state.submitable ? this.submitable(true) : this.submitable(false);
        })
      } else {
        this.setState({
          submitable:true
        }, function() {
          this.state.submitable ? this.submitable(true) : this.submitable(false);
        })

      }
      this.setState({
        entropy:entropy,
        input:event.target.value,
        clicked:true
      })
    } else {
      let checkValue = event.target.value
      let entropy = scorer(this.state.value)
      console.log(this.title, event.target.value, entropy)
      if (this.props.type === 'password') { checkValue = entropy.toString() }

      this.setState({
        value: event.target.value,
        clicked:true
      }, function () {
        console.log(this.title, this.state.value);
      })

      let validationAns = textFormValidation(this.title, checkValue);
      if (validationAns === 'OK') {
        this.setState({
          error:false,
          errorMessage:'',
          submitable:true,
          entropy:entropy
        }, function () {
          this.state.submitable ? this.submitable(true) : this.submitable(false);
        })
      } else if (event.target.value === '') {
        this.setState({
          clicked:false,
          error:false,
          errorMessage:'',
          submitable:false,
          entropy:0
        }, function () {
          this.state.submitable ? this.submitable(true) : this.submitable(false);
        })
      } else {
        this.setState({
          error:true,
          submitable:false,
          entropy:entropy
        }, function () {
          this.state.submitable ? this.submitable(true) : this.submitable(false);
        })
      }
      this.setState({
        entropy:entropy,
        input:event.target.value,
        clicked:true
      })
    }
  }

  handleFocus() {
    if (!this.state.firstClick) {
      this.setState({
        firstClick: true,
      });
    }
  }

  handleBlur(event) {
    let checkValue = event.target.value
    let entropy = scorer(this.state.value)
    if (this.props.type === 'password') { checkValue = entropy.toString() }

    this.setState({clicked:false})
    let validationAns = textFormValidation(this.title, checkValue)
    if (validationAns === 'OK') {
      this.setState({
        error:false,
        errorMessage:'',
        submitable:true,
      }, function () {
        this.state.submitable ? this.submitable(true) : this.submitable(false);
      })
    } else if (event.target.value === '') {
      this.setState({
        clicked:false,
        error:false,
        errorMessage:'',
      })
    } else {
      this.setState({
        error:true,
        errorMessage:validationAns
      }, function () {
        this.state.submitable ? this.submitable(true) : this.submitable(false);
      })
    }
  }

  handleClick(event) {
    this.setState({
      firstClick:true,
      clicked:true,
      focused:true,
      submitted:false,
      placeholder:''
    })
  }

  submitable = (bool:boolean) => {
    let arr = [this.title, bool, this.state.value]
    this.props.sendData(arr)
  }

  componentDidMount() {
    this.submitable(false);
  }
}

class TextInput extends React.Component {
  props:{
    clicked:boolean;
    firstClick:boolean;
    placeholder:string;
    error:boolean;
    submitted:boolean;
    type:string;
    value:string;
  }

  state: {
    showPass: boolean;
    placeholder:string;
  }
  constructor(props) {
    super(props)
    this.state = {
      placeholder:this.props.placeholder,
      showPass: false
    }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(event) {
    if(this.state.showPass) {
      this.setState({
        showPass:false
      })
    } else {
      this.setState({
        showPass:true
      })
    }
    event.preventDefault()
  }

  render () {
    let currentClass = 'formInactive inputWrapper'
    let eye;
    let password;
    if (this.props.firstClick) {
      currentClass = ''
    } else if (this.props.error) {
      currentClass = 'formError inputWrapper'
    }
    if (this.props.submitted) {
      currentClass = 'formSuccess inputWrapper'
    }

    // if (this.props.type === 'password') {
    //   if (this.state.showPass) {
    //     eye = <img
    //       src = '/icons/eye-no.svg'
    //       className = 'icon fadeIn'
    //       onClick = {this.handleClick}
    //       />
    //     password = <p className = 'showPass marginPaddingFix'>{this.props.value}</p>

    //   } else {
    //     eye = <img
    //       src = '/icons/black/eye.svg'
    //       className = 'icon fadeIn'
    //       onClick = {this.handleClick}
    //       />
    //     password = <p className = 'hidePass marginPaddingFix'></p>
    //   }
    // }

    return (
      <div className = {currentClass}>
        <input
          placeholder = {this.state.placeholder}
          value = {this.props.value}
          onChange = {this.props.onChange}
          onClick = {this.props.onClick}
          onBlur = {this.props.blurred}
          onFocus = {this.props.onFocus}
          type = {this.props.type}
          className = 'big-form-item website-text-form'
          />
        {password}
        {eye}

      </div>
    )
  }

}

function FormError(props) {
  return (
    <div>
      <p className = {props.error ? "textError fadeIn" : 'fadeOut' }>
        {props.errorMessage}
      </p>
    </div>
  )
}


function FormTitle(props) {
  let currentStyle = '';
  props.firstClick ? currentStyle = "fadeInVert" : currentStyle = "fadeOutVert"
  if (props.submitted)  {currentStyle = 'titleSuccess'}

  return (<h5 className = {currentStyle}>{props.title}</h5>)
}


function FormIcon(props) {
  return (
    <img
      className = 'formIcon fadeIn'
      src = {props.imgSrc}
    />
  )
}

export default FormItem;
