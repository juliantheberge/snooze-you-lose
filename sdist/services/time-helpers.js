"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TimeHelpers = /** @class */ (function () {
    function TimeHelpers() {
        this.date = new Date();
        this.day = this.date.getDay();
        this.hour = this.date.getHours();
        this.min = this.date.getMinutes();
    }
    TimeHelpers.prototype.todayOrTomorrow = function (time) {
        var timeArr = time.split(':'); // Question out
        var timeH = parseInt(timeArr[0]);
        var timeM = parseInt(timeArr[1]);
        if (timeH < this.hour) {
            return "tomorrow";
        }
        else if (timeH > this.hour) {
            return "today";
        }
        else if (timeH === this.hour) {
            if (timeM < this.min) {
                return "tomorrow";
            }
            else if (timeM > this.min) {
                return "today";
            }
            else {
                return "tomorrow";
            }
        }
        else {
            throw new Error('Something was unaccounted for when determining the next time this alarm goes off!');
        }
    };
    TimeHelpers.isMilitaryTime = function (time) {
        return new Promise(function (resolve, reject) {
            var noLeadingZeros = /^(\d):?([0-5]\d):?([0-5]\d)?$/;
            var militaryRe = /^([01]\d|2[0-3]):?([0-5]\d):?([0-5]\d)?$/;
            if (noLeadingZeros.test(time)) {
                console.log('leading zeros case', time);
                var timeWithLeadingZeros = '0' + time;
                console.log('leading zeros case', timeWithLeadingZeros);
                resolve(timeWithLeadingZeros);
            }
            else if (militaryRe.test(time)) {
                console.log('time with leading zeros', time);
                resolve(time);
            }
            else {
                reject('Please use military time. Now you can have leading zeros!');
            }
        });
    };
    TimeHelpers.parseStringTime = function (time) {
        return time.split(':').reduce(function (acc, time) { return (60 * acc) + +time; });
    };
    TimeHelpers.orderTimes = function (a, b) {
        var timeA = TimeHelpers.parseStringTime(a.time);
        var timeB = TimeHelpers.parseStringTime(b.time);
        var comp = 0;
        if (timeA > timeB) {
            comp = 1;
        }
        else if (timeB > timeA) {
            comp = -1;
        }
        return comp;
    };
    // WHAT DAY OF THE WEEK IS COMING NEXT? CURRENTLY NOT IN USE, BUT MAY BE USEFUL LATER
    TimeHelpers.prototype.dayOfTheWeek = function (time) {
        var timeArr = time.split(':');
        var timeH = parseInt(timeArr[0]);
        var timeM = parseInt(timeArr[1]);
        var dayNum;
        if (timeH < this.hour) {
            dayNum = this.day + 1;
        }
        else if (timeH > this.hour) {
            dayNum = this.day;
        }
        else if (timeH === this.hour) {
            if (timeM < this.min) {
                dayNum = this.day + 1;
            }
            else if (timeM > this.min) {
                dayNum = this.day;
            }
            else {
                dayNum = this.day + 1;
            }
        }
        return TimeHelpers.dayNumToString(dayNum);
    };
    TimeHelpers.dayNumToString = function (dayNum) {
        switch (dayNum) {
            case 0:
                day = "Sunday";
                break;
            case 1:
                day = "Monday";
                break;
            case 2:
                day = "Tuesday";
                break;
            case 3:
                day = "Wednesday";
                break;
            case 4:
                day = "Thursday";
                break;
            case 5:
                day = "Friday";
                break;
            case 6:
                day = "Saturday";
            default:
                day = "not a day in the western calendar";
        }
        return day;
    };
    return TimeHelpers;
}());
exports.default = TimeHelpers;
var TimeConverter = /** @class */ (function () {
    function TimeConverter() {
        this.time = this.now();
        this.timeUTC = this.utc();
        this.timeTZ = this.tz();
    }
    TimeConverter.prototype.now = function () {
        return new Date();
    };
    TimeConverter.prototype.addZero = function (i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    };
    TimeConverter.prototype.utc = function () {
        var h = this.addZero(this.time.getUTCHours());
        var m = this.addZero(this.time.getUTCMinutes());
        var s = this.addZero(this.time.getUTCSeconds());
        return (h + ":" + m + ":" + s);
    };
    TimeConverter.prototype.tz = function () {
        var h = this.addZero(this.time.getHours());
        var m = this.addZero(this.time.getMinutes());
        var s = this.addZero(this.time.getSeconds());
        return (h + ":" + m + ":" + s);
    };
    TimeConverter.prototype.locale = function () {
        return this.time.toLocaleTimeString('en-US', { hour12: false });
    };
    TimeConverter.prototype.offset = function () {
        return this.time.getTimezoneOffset() * 60;
    };
    TimeConverter.prototype.convert = function (time, utc) {
        console.log('e', time);
        var offsetTime;
        utc ? offsetTime = this.parse(time) - (this.offset()) : offsetTime = this.parse(time) + (this.offset());
        console.log('f', offsetTime);
        if (offsetTime >= 86400) {
            console.log('g');
            return this.toString(offsetTime - 86400);
        }
        else if (offsetTime === 0 || offsetTime === 86400) {
            return this.toString(0);
        }
        else if (offsetTime <= 0) {
            console.log('h');
            return this.toString(86400 + offsetTime);
        }
        console.log('i', this.toString(offsetTime));
        return this.toString(offsetTime);
    };
    TimeConverter.prototype.parse = function (time) {
        return time.split(':').reduce(function (acc, time) { return (60 * acc) + +time; });
    };
    TimeConverter.prototype.toString = function (num) {
        var remainingMin = num % 3600;
        var roundHr = this.addZero(Math.floor(num / 3600));
        var remainingSec = num % 60;
        var roundMin = this.addZero(Math.floor(remainingMin / 60));
        var roundSec = this.addZero(Math.floor(remainingSec));
        return roundHr.toString() + ':' + roundMin.toString() + ':' + roundSec.toString();
    };
    TimeConverter.prototype.addTrailingZeros = function (string) {
        if (string.length === 5) {
            return string + ':00';
        }
        return string;
    };
    TimeConverter.prototype.colonEveryTwo = function (string) {
        var arr = string.split('');
        var nArr = [];
        var count = 0;
        for (var i = 0; i < arr.length; i++) {
            count++;
            if (count !== 2 || i === arr.length - 1) {
                nArr.push(arr[i]);
            }
            else {
                nArr.push(arr[i]);
                nArr.push(':');
                count = 0;
            }
        }
        return nArr.join('');
    };
    TimeConverter.prototype.fromUserInput = function (str) {
        var string = str.replace(/:/g, '');
        if (string.length === 3 || string.length === 5) {
            return this.addTrailingZeros(this.colonEveryTwo('0' + string));
        }
        else if (string.length === 4 || string.length === 6) {
            return this.addTrailingZeros(this.colonEveryTwo(string));
        }
        else {
            throw ('That time doesn\'t make sense');
        }
    };
    return TimeConverter;
}());
exports.TimeConverter = TimeConverter;
// a;losdfgjasfal;f
function convertAlarmsFromUTC(alarms) {
    console.log('a', alarms);
    var t = new TimeConverter();
    for (var i = 0; i < alarms.length; i++) {
        console.log('b', alarms[i].time);
        console.log('c', t.convert(alarms[i].time, true));
        alarms[i].time = t.convert(alarms[i].time, true);
        console.log('d', alarms);
    }
    return alarms;
}
exports.convertAlarmsFromUTC = convertAlarmsFromUTC;
//# sourceMappingURL=time-helpers.js.map