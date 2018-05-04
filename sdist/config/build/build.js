"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var obj = require("./build-objects");
var func = require("./build-functions");
var fs = require("fs");
var build_strings_1 = require("./build-strings");
var command = " --command=";
var informationSchema = '"SELECT * FROM information_schema.tables WHERE table_schema = \'public\'"';
var tablesExists = command + informationSchema;
function build(dbConnect, result, cb) {
    var jsonConfig = result;
    func.childProcess(dbConnect + tablesExists, function (err, stdout, stderr) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("do tables exist?: " + stdout);
            console.log(stdout);
            if (build_strings_1.noTable.test(stdout)) {
                fs.readdir('./database-builds/up', function (err, files) {
                    if (err) {
                        return err;
                    }
                    else {
                        obj.whatVersion.properties.version.default = files.length;
                        func.prompter(obj.whatVersion, function (err, result) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                func.filesInDir('./database-builds/up', function (err, files) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    else {
                                        var fileString = func.stringOfFiles('./database-builds/up', files, result.version, false);
                                        console.log(fileString);
                                        func.childProcess(dbConnect + fileString, function (err, stdout, stderr) {
                                            if (err) {
                                                console.error("exec error: " + err);
                                                cb(err);
                                            }
                                            else {
                                                console.log("stdout: " + stdout);
                                                console.log("stderr: " + stderr);
                                                console.log('tables added');
                                                func.makeJSONfromObj('./sdist/config/connect-config.json', jsonConfig, function (err) {
                                                    if (err) {
                                                        console.log(err);
                                                        cb(err);
                                                    }
                                                    else {
                                                        console.log('successfuly made config JSON');
                                                        cb();
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
            else {
                console.log('this indicates that there are already tables in the database');
                console.log('successfuly made config JSON');
                func.prompter(obj.deleteTables, function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        func.filesInDir('./database-builds/down', function (err, files) {
                            git;
                            if (err) {
                                console.log(err);
                                cb(err);
                            }
                            else {
                                var fileString = func.stringOfFiles('./database-builds/down', files, result.versionDown, true);
                                console.log(fileString);
                                func.childProcess(dbConnect + fileString, function (err, stdout, stderr) {
                                    if (err) {
                                        console.error("exec error: " + err);
                                        cb(err);
                                    }
                                    else {
                                        console.log("stdout: " + stdout);
                                        console.log("stderr: " + stderr);
                                        cb();
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }
    });
}
console.log(func.fileChecker('../connect-config.json'));
if (func.fileChecker('../connect-config.json')) {
    // build with connect string made by passing other prompt obj through
    func.prompter(obj.prevConn, function (err, result) {
        if (err) {
            console.log(err);
        }
        else if (result.prevConn || result.prevConn === '') {
            var connConfig = require('../connect-config.json');
            var dbConnect = func.connectCommand(connConfig.user, connConfig.host, connConfig.database, connConfig.password);
            build(dbConnect, connConfig, function (err) {
                if (err) {
                    console.log('something went wrong with the build script. This is likely a bug, try again/contact developer here is the error: ' + err);
                }
                else {
                    console.log('build script complete');
                }
            });
        }
        else {
            func.removeConfig('./sdist/config/connect-config.json', function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log('successfully deleted');
                }
            });
        }
    });
}
else {
    // build to connect prompt string // make sign in object
    func.prompter(obj.connectPrompt, function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            result = func.applyDefaults(result);
            var dbConnect = func.connectCommand(result.user, result.host, result.database, result.password);
            build(dbConnect, result, function (err) {
                if (err) {
                    console.log('something went wrong with the build script. This is likely a bug, try again/contact developer here is the error: ' + err);
                }
                else {
                    console.log('build script complete');
                }
            });
        }
    });
}
//# sourceMappingURL=build.js.map