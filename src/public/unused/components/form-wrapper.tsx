import Button from './button-generic'
import * as React from 'react';

class FormWrapper extends React.Component {
  state:{
    errorMessage:string;
    error:boolean;
    submitted:boolean;
    submitable:boolean;
    data:{}
  }
  
  props: {
    url:string;
    method:string;
    buttonText:string;
    noValidation?:boolean;
    children?:FormItem;
  }

  formItems:any;
  testObj:any;
  action:any;
  buttonText:string;
  noValidation:boolean;

  constructor(props) {
    super(props)
    this.state = {
      errorMessage:'',
      error:false,
      submitted: false,
      submitable: false,
      data: {}
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getValidation = this.getValidation.bind(this);
    this.testObj = {}
  }

  getValidation(arr) {
    for (let k in this.testObj) {
      if (k === arr[0]) {
        console.log(arr[0], 'is already in array')
      }
    }
    let obj = this.testObj;
    obj[arr[0]] = arr[1]
    let bool = this.submitCheck()
    this.setState({
      submitable:bool
    })
  }
  // CHANGE DATA SENDING TO OBJ RATHER THAN ARRAY
  getData = (dataFromChild) => {
    let data = this.state.data
    let title = dataFromChild[0]
    let value = dataFromChild[2]
    data[title] = value
    this.setState({
      data:data
    })
    this.getValidation(dataFromChild)
  }

  submitCheck() {
    for (let k in this.testObj) {
      if (this.testObj[k] === false) {
        return false
      }
    }
    return true
  }

  handleSubmit(event) {
    event.preventDefault()
    if (this.state.submitable && this.props.method === 'post') {
      return fetch(this.props.url, {
          body: JSON.stringify(this.state.data),
          method: "post",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        })
        .then(res => res.json())
        .then(body => {
          if (body.status === 'failed') {throw body.error}
          if (typeof body.redirect === 'string') {window.location = body.redirect}
          return null
        })
        .then(() => {
          this.setState({
            submitted:true
          })
          return null
        })
        .catch(err => {
          this.setState({
            errorMessage:err,
            error:true,
            submitted:false,
            submitable:false
          })
        })
    } else if (this.state.submitable && this.props.method === 'get') {
      fetch(this.props.url, {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        })
        .then(res => res.json())
        .then(body => {
          if (body.status === 'failed') { throw body.error }
          if (typeof body.redirect === 'string') { window.location = body.redirect }
          return null
        })
        .then(() => {
          this.setState({
            submitted: true
          })
          return null
        })
        .catch(err => {
          this.setState({
            errorMessage: err,
            error: true,
            submitted: false,
            submitable: false,
            data: {}
          })
        })
    } else {
      console.log('some validation required before sending!')
    }
    this.props.noValidation ? console.log('no validation req') : event.preventDefault();
  }

  skipValidation() {
    this.setState({
      submitable:true
    })
  }

  componentDidMount() {
    this.props.noValidation ? this.skipValidation() : console.log('validation required');
  }

  render() {
    console.log('CHILDREN', this.props.children)
    const childWithProp = React.Children.map(this.props.children, (child) => {
      console.log(child)
      return React.cloneElement(child, {
          sendData: this.getData,
          submitted: this.state.submitted
        });
    });

    return (
      <div className ='formWrapper'>
        <form
          onSubmit = {this.handleSubmit}
          action = {this.props.url}
          method = {this.props.method}
          >
          {childWithProp}
          <Button
            submitable = {this.state.submitable}
            submitted = {this.state.submitted}
            onClick = {this.handleSubmit}
            buttonText = {this.props.buttonText}
            // type = 'submit'
            // value = 'login'
            />
        </form>
        <div>
          <p className = {this.state.error ? "textError fadeIn" : 'fadeOut' }>
            {this.state.errorMessage}
          </p>
       </div>
      </div>
    )
  }
}


export default FormWrapper;
