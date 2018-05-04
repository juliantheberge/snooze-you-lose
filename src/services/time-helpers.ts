export default class TimeHelpers {
    date: Date;
    day: number;
    hour: number;
    min: number;

    constructor() {
        this.date = new Date();
        this.day = this.date.getDay();
        this.hour = this.date.getHours();
        this.min = this.date.getMinutes();
    }

    todayOrTomorrow(time:V.MilitaryTime):string {
        let timeArr = time.split(':') // Question out
        let timeH = parseInt(timeArr[0])
        let timeM = parseInt(timeArr[1])

        if (timeH < this.hour) {
            return "tomorrow";
        } else if (timeH > this.hour) {
            return "today";
        } else if (timeH === this.hour) {
            if (timeM < this.min) {
                return "tomorrow";
            } else if (timeM > this.min) {
                return "today";
            } else {
                return "tomorrow";
            }
        } else {
            throw new Error('Something was unaccounted for when determining the next time this alarm goes off!')
        }
    }

    static isMilitaryTime(time) {
        return new Promise(
            (resolve, reject) => {
                let noLeadingZeros = /^(\d):?([0-5]\d):?([0-5]\d)?$/;
                let militaryRe = /^([01]\d|2[0-3]):?([0-5]\d):?([0-5]\d)?$/;
                if (noLeadingZeros.test(time)) {
                    console.log('leading zeros case', time)
                    let timeWithLeadingZeros = '0' + time
                    console.log('leading zeros case', timeWithLeadingZeros)
                    resolve(timeWithLeadingZeros)
                } else if (militaryRe.test(time)) {
                    console.log('time with leading zeros', time)
                    resolve(time)
                } else {
                    reject('Please use military time. Now you can have leading zeros!')
                }
            }
        )
    }

    static parseStringTime(time) {
        return time.split(':').reduce((acc, time) => (60 * acc) + +time)
    }
    static orderTimes(a, b) { // updated but haven't tested parse string time
        const timeA = TimeHelpers.parseStringTime(a.time);
        const timeB = TimeHelpers.parseStringTime(b.time);

        let comp = 0;
        if (timeA > timeB) {
            comp = 1;
        } else if (timeB > timeA) {
            comp = -1;
        }
        return comp;
    }

    // WHAT DAY OF THE WEEK IS COMING NEXT? CURRENTLY NOT IN USE, BUT MAY BE USEFUL LATER
    dayOfTheWeek(time) {
        let timeArr = time.split(':')
        let timeH = parseInt(timeArr[0])
        let timeM = parseInt(timeArr[1])

        let dayNum;

        if (timeH < this.hour) {
            dayNum = this.day + 1
        } else if (timeH > this.hour) {
            dayNum = this.day
        } else if (timeH === this.hour) {
            if (timeM < this.min) {
                dayNum = this.day + 1
            } else if (timeM > this.min) {
                dayNum = this.day
            } else {
                dayNum = this.day + 1
            }
        }

        return TimeHelpers.dayNumToString(dayNum)
    }

    static dayNumToString(dayNum) {
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
                day = "not a day in the western calendar"
        }
        return day;
    }
}

export class TimeConverter {
    time:Date;
    timeUTC:string;
    timeTZ:string;

    constructor() {
        this.time = this.now()
        this.timeUTC = this.utc()
        this.timeTZ = this.tz()
    }

    now() {
        return new Date()
    }


    addZero(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }

    utc() {
        let h = this.addZero(this.time.getUTCHours());
        let m = this.addZero(this.time.getUTCMinutes());
        let s = this.addZero(this.time.getUTCSeconds());
        return (h + ":" + m + ":" + s);
    }

    tz() {
        let h = this.addZero(this.time.getHours());
        let m = this.addZero(this.time.getMinutes());
        let s = this.addZero(this.time.getSeconds());
        return (h + ":" + m + ":" + s);
    }

    locale() {
        return this.time.toLocaleTimeString('en-US', { hour12: false })
    }

    offset() {
        return this.time.getTimezoneOffset() * 60
    }

    tzConvert(time, utc) {
        if (!utc) {
            return this.parse(time) + this.offset()
        } else {
            return this.parse(time) - this.offset()
        }
    }

    parse(time) {
        return time.split(':').reduce((acc, time) => (60 * acc) + +time)
    }

    toString(num) {
        let remainingMin = num % 3600
        let roundHr = Math.floor(num / 3600)
        let remainingSec = num % 60
        let roundMin = Math.floor(remainingMin / 60)
        let roundSec = Math.floor(remainingSec)
        return roundHr.toString() + ':' + roundMin.toString() + ':' + roundSec.toString()
    }
}