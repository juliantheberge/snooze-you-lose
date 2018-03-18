import TextForm from './form-item-text';
import Button from './button-generic'
import * as React from 'react';

interface FormWrapperStates {
  submitable:any;
  submitted:boolean;
  clicked:boolean;
}

class FormWrapper extends React.Component {
  states:FormWrapperStates;
  formItems:any;
  testObj:any;
  action:any;
  buttonText:string;
  noValidation:boolean;

  constructor(props:FormWrapper) {
    super(props)
    this.state = {
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
    if (this.state.submitable && this.props.method === 'post') {
      fetch(this.props.url, {
          body:JSON.stringify(this.state.data),
          method: "post",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        })
        .then(res => res.json())
        .then(body => console.log(body))
        .then(
          this.setState({
            submitted:true
          })
        )
        .catch((error) => {
          console.log(error.stack)
        })
    } else if (this.state.submitable && this.props.method === 'get') { // this is not in use
      fetch(this.props.url, {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
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
    const childWithProp = React.Children.map(this.props.children, (child) => {
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
            type = 'submit'
            />
        </form>
      </div>
    )
  }
}




export default FormWrapper;
