"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var merge = require("./merge");
// REMOVE OR REWORK THESE FUNCTIONS---------------------------------
// want to remove req, but session.regenerate doesn't return promise
function regenerateSession(req) {
    return new Promise(function (resolve, reject) {
        req.session.regenerate(function (err) {
            if (err)
                reject(err);
            else
                resolve();
        });
    });
}
exports.regenerateSession = regenerateSession;
// these error functions will be removed entirely with new structure, no res being passed in
// could latch on to the error event
function dbError(res, thisPage, err) {
    res.render(thisPage, { dbError: dbErrTranslator(err) });
}
exports.dbError = dbError;
function genError(res, thisPage, param) {
    res.render(thisPage, { dbError: param });
}
exports.genError = genError;
// REMOVE OR REWORK THESE FUNCTIONS---------------------------------
// BUSINESS LOGIC TIER
function dbErrTranslator(error) {
    var emailChecker = /(email)/g;
    var phoneChecker = /(phone)/g;
    var keyChecker = /(key)/g;
    var checkChecker = /(check)/g;
    var passChecker = /(password)/g;
    var lengthChecker = /(value too long)/g;
    var alarms = /(alarms)/g;
    var awake = /(awake)/g;
    var title = /(title)/g;
    if (emailChecker.test(error)) {
        if (keyChecker.test(error)) {
            return "The email you put in has already been used. Try again.";
        }
        else {
            return "You did not submit a valid email. Try again.";
        }
    }
    else if (phoneChecker.test(error)) {
        if (keyChecker.test(error)) {
            return "The phone number you put in has already been used. Try again.";
        }
        else {
            return "You did not submit a valid phone number. Try again.";
        }
    }
    else if (passChecker.test(error)) {
        return "There was an error with your password. Contact the administrator.";
    }
    else if (lengthChecker.test(error)) {
        return "You typed in something over 100 characters. Keep things a shorter and try again.";
    }
    else if (alarms.test(error)) {
        if (awake.test(error)) {
            return "You need to use military time. If the it is before 10:00, use leading zeros like this 06:00.";
        }
        else if (title.test(error)) {
            return "Keep your title withing 15 characters. Other than that, you should be able to do whatever you want.";
        }
    }
    else {
        console.log("ERROR", error);
        return "There was an error. Try again.";
    }
}
exports.dbErrTranslator = dbErrTranslator;
function compare(a, b) {
    var awakeA = parseInt(a.awake);
    var awakeB = parseInt(b.awake);
    var comp = 0;
    if (awakeA > awakeB) {
        comp = 1;
    }
    else if (awakeB > awakeA) {
        comp = -1;
    }
    return comp;
}
exports.compare = compare;
var randomString = new Promise(function (resolve, reject) {
    var string = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_+-=`,.<>/?;:'{}[]|";
    for (var i = 0; i <= 40; i++) {
        string += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    if (typeof string === "undefined") {
        reject("randomString failed to create anything ");
    }
    resolve(string);
});
exports.randomString = randomString;
var isSessionValid = function (token, outputs) {
    return new Promise(function (resolve, reject) {
        var nonce = outputs.nonce;
        var oldDate = new Date(outputs.thetime);
        var oldTime = oldDate.getTime();
        var currentDate = new Date();
        var currentTime = currentDate.getTime();
        if (token === nonce && currentTime < oldTime + 120000) {
            resolve(true);
        }
        else {
            var failure = new Error("Token has expired, please try again.");
            reject(failure);
        }
    });
};
exports.isSessionValid = isSessionValid;
var merger = function (objectOne, objectTwo) {
    return new Promise(function (resolve, reject) {
        var ans = merge.deepMerge(objectOne, objectTwo);
        if (ans === "circular object") {
            var failure = new Error("Circular object");
            reject(failure);
        }
        else {
            resolve(ans);
        }
    });
};
exports.merger = merger;
function lastFourOnly(cardNumber) {
    var arr = [];
    cardNumber = cardNumber.split("");
    for (var i = cardNumber.length; arr.length < 5; i--) {
        arr.push(cardNumber[i]);
    }
    arr.reverse();
    return arr.join("");
}
exports.lastFourOnly = lastFourOnly;
// COULD GENERALIZE THIS FUNCTION: ADD KEY/VALUE(S) PAIR TO OBJCT
function addOrderUUIDItemNumber(queryResult, order_uuid) {
    for (var i = 0; i < queryResult.length; i++) {
        queryResult[i].order_uuid = order_uuid;
        queryResult[i].item_number = i + 1;
    }
    return queryResult;
}
exports.addOrderUUIDItemNumber = addOrderUUIDItemNumber;
var orgName = "United Nations Childrens Fund";
function idMaker(name) {
    name = name.toLowerCase();
    var arrName = name.split("");
    for (var i = 0; i < arrName.length; i++) {
        if (arrName[i] === " ") {
            arrName[i] = "-";
        }
    }
    return arrName.join("");
}
exports.idMaker = idMaker;
//# sourceMappingURL=helpers.js.map