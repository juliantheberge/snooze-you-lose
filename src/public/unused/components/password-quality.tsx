import * as React from 'react';


class PasswordQuality extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showPass: false
    }
  }

  render() {
    let proportion = convertToProportion(this.props.entropy, 128)
    let entropyReport;
    let passIndicator = {
      width: proportion + '%',
      height: '4px',
      background: '#9f2121',
      transition: '300ms',
      maxWidth:'100%'
    }
    if (this.props.entropy > 0 ) {
      entropyReport = <p className = 'fadeIn textError marginPaddingFix'> {"Not strong enough. Entropy: " + this.props.entropy} </p>
    }
    if (this.props.entropy > 59) {
      passIndicator.background = '#068721'
      entropyReport = <p className = 'fadeIn textSuccess marginPaddingFix'> {"This should be strong enough. Entropy: " + this.props.entropy} </p>
    }

    if (this.props.newPass) {
      return (
        <div>
          <div className = 'passwordQualityWrapper' id = 'passwordQualityRightFix'>
            <div style = {passIndicator}></div>
            {entropyReport}
          </div>
        </div>
      )
    } else {
      return null
    }
  }
}


// HELPER
function convertToProportion(number, max) {
  if (number !== 0) {
    return ((number/max)*100);
  } else {
    return 0;
  }
}


export default PasswordQuality;
