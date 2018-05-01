"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function cardinalityGuess(password) {
    var cardinality = 0;
    var lowerCase = /[a-z]/, upperCase = /[A-Z]/, numbers = /\d/, symbols = /[`~!@#$%^&*()\-_=+\[\]\\\{\};"':,<\.>\/?|]/;
    if (password.match(lowerCase)) {
        cardinality = cardinality + 26;
        console.log('positive lowercase search', 'cardinality', cardinality);
    }
    if (password.match(upperCase)) {
        cardinality = cardinality + 26;
        console.log('positive uppercase search', 'cardinality', cardinality);
    }
    if (password.match(numbers)) {
        cardinality = cardinality + 10;
        console.log('positive number search', 'cardinality', cardinality);
    }
    if (password.match(symbols)) {
        cardinality = cardinality + 33;
        console.log('positive symbol search', 'cardinality', cardinality, password.search(symbols));
    }
    return cardinality;
}
// entropy
function entropy(password) {
    var length = password.length;
    console.log(length);
    var cardinality = cardinalityGuess(password);
    console.log(cardinality);
    return length * (Math.log2(cardinality));
}
;
function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}
//simple brute-force scorer
function scorer(password) {
    if (password.length === 0) {
        return 0;
    }
    var cardinality = cardinalityGuess(password);
    var symbolOptions = Math.pow(cardinality, password.length);
    var entropy = password.length * (Math.log2(cardinality));
    return round(entropy, 2);
}
// password strength checker
// https://www.bennish.net/password-strength-checker/
// < 28 bits = Very Weak; might keep out family members
// 28 - 35 bits = Weak; should keep out most people, often good for desktop login passwords
// 36 - 59 bits = Reasonable; fairly secure passwords for network and company passwords
// 60 - 127 bits = Strong; can be good for guarding financial information
// 128+ bits = Very Strong; often overkill
exports.default = scorer;
//# sourceMappingURL=password-strength.js.map