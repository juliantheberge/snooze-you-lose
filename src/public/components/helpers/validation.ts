import scorer from './password';

function emailTest(val:string) {
  var emailCheck = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (emailCheck.test(val) === true) {
      return "OK";
  }
  else {
      return "That's not a valid email. Try again";
  }
}

function phoneTest(val:string) {
    var phoneCheck = /^[0-9]+$/;
    if (phoneCheck.test(val) === true) {
        return "OK";
    }
    else {
        return "Somehow you used something other than numbers. It's a phone number, so stick to numbers.";
    }
}

function nameTest(val:string) {
  var check = /^[a-zA-Z -]+$/;
  if (check.test(val) === true) {
      return "OK";
  }
  else {
      return "Honestly, if this is your name, sorry. This is a very weak regex right now.";
  }
}

function usernameTest(val:string) {
  var check = /^[a-zA-Z -.]+$/;
  if (check.test(val) === true) {
      return "OK";
  }
  else {
      return "Stick to letters dashes and periods.";
  }
}

function passwordTest(val:string) {
  let entropy = parseInt(val)
  if (entropy >= 60) {
    return "OK"
  } else {
    return "Password is too weak, try adding some length."
  }
}

function passwordduplicateTest(val:string) {
  var check = /^[a-zA-Z -.]+$/;
  if (check.test(val) === true) {
      return "OK";
  }
  else {
      return "Must match the password above.";
  }
}

function textFormValidation(type:string, val:string) {
  if (type === 'email') {
    return emailTest(val)
  } else if (type === 'phone') {
    return phoneTest(val)
  } else if (type === 'name' ) {
    return nameTest(val)
  } else if (type === 'username') {
    return usernameTest(val)
  } else if (type === 'password') {
    return passwordTest(val)
  }  else if (type === 'passwordduplicate') {
    return passwordduplicateTest(val)
  }  else if (type === 'noValidation') {
    console.log('def only')
    return "OK"
  }  else {
    return 'this code is broken'
  }
}


export { textFormValidation };
