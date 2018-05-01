"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
function UserAlarms(props) {
    console.log(props);
    var alarmContent = props.alarms;
    var printableAlarms = JSON.stringify(alarmContent);
    console.log(printableAlarms);
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("h1", null, "sorted alarm data"),
        react_1.default.createElement("div", null,
            react_1.default.createElement("pre", null, JSON.stringify(props.alarms, null, 2)))));
}
exports.default = UserAlarms;
//# sourceMappingURL=user-alarms.js.map