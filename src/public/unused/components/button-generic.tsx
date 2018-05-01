import * as React from 'react';

export default function Button(props) {

  let currentClass = 'button dark-button'
  if (!props.submitable) {
    currentClass = 'button un-button'
  }
  if (props.submitted) {
      currentClass = 'button success-button'
  }
  return (
      <button className = {currentClass}>
        {props.buttonText}
      </button>
    )
}
