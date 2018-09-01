"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
exports.__esModule = true;
var assert_1 = require("assert");
var index_1 = require("./index");
var mkIter = function (gen) {
    var _a;
    return (_a = {}, _a[Symbol.iterator] = gen, _a);
};
var mkIterAsync = function (gen) {
    var _a;
    return (_a = {}, _a[Symbol.asyncIterator] = gen, _a);
};
function cleanMonitorResult(r) {
    var err = r.err, ret = r.ret, _a = r.log, log = _a === void 0 ? [] : _a;
    return { log: log, err: err, ret: ret };
}
function assertMonitorAsync(params) {
    return __awaiter(this, void 0, void 0, function () {
        var log, ret, err, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log = new Array();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, params.fn(function (s) { return void log.push(s); })];
                case 2:
                    ret = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    err = e_1;
                    return [3 /*break*/, 4];
                case 4:
                    assert_1.strict.deepStrictEqual({ log: log, err: err, ret: ret }, cleanMonitorResult(params));
                    return [2 /*return*/];
            }
        });
    });
}
function basic(zip) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = assert_1.strict).deepStrictEqual;
                    return [4 /*yield*/, index_1.asyncIterToArray(zip([1, 2, 3], ["a", "b", "c"]))];
                case 1:
                    _b.apply(_a, [_c.sent(), [
                            [1, "a"],
                            [2, "b"],
                            [3, "c"]
                        ]]);
                    return [2 /*return*/];
            }
        });
    });
}
function lengthIsShortest(zip) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = assert_1.strict).deepStrictEqual;
                    return [4 /*yield*/, index_1.asyncIterToArray(zip(["a"], ["b", "c"]))];
                case 1:
                    _b.apply(_a, [_c.sent(), [["a", "b"]]]);
                    return [2 /*return*/];
            }
        });
    });
}
function loopMultipleTimes(zip) {
    return __awaiter(this, void 0, void 0, function () {
        var list, ret, _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    list = zip(mkIter(function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, "a"];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, "x"];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }), mkIter(function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, "b"];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, "y"];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }), mkIter(function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, "c"];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, "z"];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }));
                    ret = [["a", "b", "c"], ["x", "y", "z"]];
                    _b = (_a = assert_1.strict).deepStrictEqual;
                    return [4 /*yield*/, index_1.asyncIterToArray(list)];
                case 1:
                    _b.apply(_a, [_e.sent(), ret]);
                    _d = (_c = assert_1.strict).deepStrictEqual;
                    return [4 /*yield*/, index_1.asyncIterToArray(list)];
                case 2:
                    _d.apply(_c, [_e.sent(), ret]);
                    return [2 /*return*/];
            }
        });
    });
}
function finallyCalled(zip) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, assertMonitorAsync({
                        fn: function (log) {
                            return index_1.asyncIterToArray(zip(mkIter(function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, , 3, 4]);
                                            return [4 /*yield*/, "a"];
                                        case 1:
                                            _a.sent();
                                            return [4 /*yield*/, "b"];
                                        case 2:
                                            _a.sent();
                                            log("finished 1");
                                            return [3 /*break*/, 4];
                                        case 3:
                                            log("finally 1");
                                            return [7 /*endfinally*/];
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }), mkIter(function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, , 5, 6]);
                                            return [4 /*yield*/, "c"];
                                        case 1:
                                            _a.sent();
                                            return [4 /*yield*/, "d"];
                                        case 2:
                                            _a.sent();
                                            return [4 /*yield*/, "e"];
                                        case 3:
                                            _a.sent();
                                            return [4 /*yield*/, "f"];
                                        case 4:
                                            _a.sent();
                                            log("finished 2");
                                            return [3 /*break*/, 6];
                                        case 5:
                                            log("finally 2");
                                            return [7 /*endfinally*/];
                                        case 6: return [2 /*return*/];
                                    }
                                });
                            })));
                        },
                        ret: [["a", "c"], ["b", "d"]],
                        log: ["finished 1", "finally 1", "finally 2"]
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function throwInNext(zip) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, assertMonitorAsync({
                        fn: function (log) {
                            return index_1.asyncIterToArray(zip(mkIter(function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, , 3, 4]);
                                            return [4 /*yield*/, "a"];
                                        case 1:
                                            _a.sent();
                                            return [4 /*yield*/, "b"];
                                        case 2:
                                            _a.sent();
                                            log("finish 1");
                                            return [3 /*break*/, 4];
                                        case 3:
                                            log("finally 1");
                                            return [7 /*endfinally*/];
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }), mkIter(function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, , 2, 3]);
                                            return [4 /*yield*/, "c"];
                                        case 1:
                                            _a.sent();
                                            throw "error 2";
                                        case 2:
                                            log("finally 2");
                                            return [7 /*endfinally*/];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }), mkIter(function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, , 3, 4]);
                                            return [4 /*yield*/, "d"];
                                        case 1:
                                            _a.sent();
                                            return [4 /*yield*/, "e"];
                                        case 2:
                                            _a.sent();
                                            log("finish 3");
                                            return [3 /*break*/, 4];
                                        case 3:
                                            log("finally 3");
                                            return [7 /*endfinally*/];
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            })));
                        },
                        err: "error 2",
                        log: ["finally 2", "finally 1", "finally 3"]
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function throwInFinally(zip) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, assertMonitorAsync({
                        fn: function (log) {
                            return index_1.asyncIterToArray(zip(mkIter(function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, , 3, 4]);
                                            return [4 /*yield*/, "a"];
                                        case 1:
                                            _a.sent();
                                            return [4 /*yield*/, "b"];
                                        case 2:
                                            _a.sent();
                                            log("finish 1");
                                            return [3 /*break*/, 4];
                                        case 3:
                                            log("finally 1");
                                            return [7 /*endfinally*/];
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }), mkIter(function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, , 3, 4]);
                                            return [4 /*yield*/, "c"];
                                        case 1:
                                            _a.sent();
                                            return [4 /*yield*/, "d"];
                                        case 2:
                                            _a.sent();
                                            log("finish 2");
                                            return [3 /*break*/, 4];
                                        case 3:
                                            log("finally 2");
                                            throw "finally error 2";
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }), mkIter(function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, , 2, 3]);
                                            return [4 /*yield*/, "e"];
                                        case 1:
                                            _a.sent();
                                            // yield "f";
                                            log("finish 3");
                                            return [3 /*break*/, 3];
                                        case 2:
                                            log("finally 3");
                                            return [7 /*endfinally*/];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }), mkIter(function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, , 3, 4]);
                                            return [4 /*yield*/, "g"];
                                        case 1:
                                            _a.sent();
                                            return [4 /*yield*/, "h"];
                                        case 2:
                                            _a.sent();
                                            log("finish 4");
                                            return [3 /*break*/, 4];
                                        case 3:
                                            log("finally 4");
                                            return [7 /*endfinally*/];
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            })));
                        },
                        err: "finally error 2",
                        log: ["finish 3", "finally 3", "finally 1", "finally 2", "finally 4"]
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function rethrowOriginalError(zip) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, assertMonitorAsync({
                        fn: function (log) {
                            return index_1.asyncIterToArray(zip(mkIter(function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, , 2, 3]);
                                            log("yield 1");
                                            return [4 /*yield*/, "a"];
                                        case 1:
                                            _a.sent();
                                            throw "error 1";
                                        case 2:
                                            log("finally 1");
                                            return [7 /*endfinally*/];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }), mkIter(function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, , 3, 4]);
                                            log("yield 2a");
                                            return [4 /*yield*/, "a"];
                                        case 1:
                                            _a.sent();
                                            log("yield 2b");
                                            return [4 /*yield*/, "b"];
                                        case 2:
                                            _a.sent();
                                            log("finish 2");
                                            return [3 /*break*/, 4];
                                        case 3:
                                            log("finally 2");
                                            throw "error 2";
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            })));
                        },
                        err: "error 1",
                        log: ["yield 1", "yield 2a", "finally 1", "finally 2"]
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function throwInReturnDoesntBlockOtherReturns(zip) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            assertMonitorAsync({
                fn: function (log) {
                    return index_1.asyncIterToArray(zip(mkIter(function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, , 3, 4]);
                                    return [4 /*yield*/, "a"];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, "b"];
                                case 2:
                                    _a.sent();
                                    log("finish 1");
                                    return [3 /*break*/, 4];
                                case 3:
                                    log("finally 1");
                                    throw "error 1";
                                case 4: return [2 /*return*/];
                            }
                        });
                    }), mkIter(function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, , 2, 3]);
                                    return [4 /*yield*/, "c"];
                                case 1:
                                    _a.sent();
                                    log("finish 2");
                                    return [3 /*break*/, 3];
                                case 2:
                                    log("finally 2");
                                    return [7 /*endfinally*/];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }), mkIter(function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, , 3, 4]);
                                    return [4 /*yield*/, "d"];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, "e"];
                                case 2:
                                    _a.sent();
                                    log("finish 3");
                                    return [3 /*break*/, 4];
                                case 3:
                                    log("finally 3");
                                    throw "error 3";
                                case 4: return [2 /*return*/];
                            }
                        });
                    })));
                },
                err: "error 1",
                log: ["finish 2", "finally 2", "finally 1", "finally 3"]
            });
            return [2 /*return*/];
        });
    });
}
function inputIsForwarded(zip) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            assertMonitorAsync({
                fn: function (log) {
                    return __awaiter(this, void 0, void 0, function () {
                        var it;
                        return __generator(this, function (_a) {
                            it = zip(mkIter(function () {
                                var _a, _b, _c;
                                return __generator(this, function (_d) {
                                    switch (_d.label) {
                                        case 0:
                                            _a = log;
                                            return [4 /*yield*/, "a"];
                                        case 1:
                                            _a.apply(void 0, [_d.sent()]);
                                            _b = log;
                                            return [4 /*yield*/, "b"];
                                        case 2:
                                            _b.apply(void 0, [_d.sent()]);
                                            _c = log;
                                            return [4 /*yield*/, "c"];
                                        case 3:
                                            _c.apply(void 0, [_d.sent()]);
                                            log("finish 1");
                                            return [2 /*return*/];
                                    }
                                });
                            }), mkIter(function () {
                                var _a, _b, _c;
                                return __generator(this, function (_d) {
                                    switch (_d.label) {
                                        case 0:
                                            _a = log;
                                            return [4 /*yield*/, "d"];
                                        case 1:
                                            _a.apply(void 0, [_d.sent()]);
                                            _b = log;
                                            return [4 /*yield*/, "e"];
                                        case 2:
                                            _b.apply(void 0, [_d.sent()]);
                                            _c = log;
                                            return [4 /*yield*/, "f"];
                                        case 3:
                                            _c.apply(void 0, [_d.sent()]);
                                            log("finish 2");
                                            return [2 /*return*/];
                                    }
                                });
                            }), mkIter(function () {
                                var _a, _b, _c;
                                return __generator(this, function (_d) {
                                    switch (_d.label) {
                                        case 0:
                                            _a = log;
                                            return [4 /*yield*/, "g"];
                                        case 1:
                                            _a.apply(void 0, [_d.sent()]);
                                            _b = log;
                                            return [4 /*yield*/, "h"];
                                        case 2:
                                            _b.apply(void 0, [_d.sent()]);
                                            _c = log;
                                            return [4 /*yield*/, "i"];
                                        case 3:
                                            _c.apply(void 0, [_d.sent()]);
                                            log("finish 3");
                                            return [2 /*return*/];
                                    }
                                });
                            }))[Symbol.asyncIterator]();
                            return [2 /*return*/, index_1.asyncIterToArray(mkIterAsync(function () {
                                    return __asyncGenerator(this, arguments, function () {
                                        var i, _a, done, value;
                                        return __generator(this, function (_b) {
                                            switch (_b.label) {
                                                case 0:
                                                    i = 0;
                                                    _b.label = 1;
                                                case 1:
                                                    if (!true) return [3 /*break*/, 7];
                                                    return [4 /*yield*/, __await(it.next(i++))];
                                                case 2:
                                                    _a = _b.sent(), done = _a.done, value = _a.value;
                                                    if (!done) return [3 /*break*/, 4];
                                                    return [4 /*yield*/, __await(void 0)];
                                                case 3: return [2 /*return*/, _b.sent()];
                                                case 4: return [4 /*yield*/, __await(value)];
                                                case 5: return [4 /*yield*/, _b.sent()];
                                                case 6:
                                                    _b.sent();
                                                    return [3 /*break*/, 1];
                                                case 7: return [2 /*return*/];
                                            }
                                        });
                                    });
                                }))];
                        });
                    });
                },
                log: [1, 1, 1, 2, 2, 2, 3, "finish 1"],
                ret: [["a", "d", "g"], ["b", "e", "h"], ["c", "f", "i"]]
            });
            return [2 /*return*/];
        });
    });
}
function delay(t) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve();
        }, t);
    });
}
function waitABit() {
    return delay(10);
}
function asyncIsParallel() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, assertMonitorAsync({
                        fn: function (log) {
                            return __awaiter(this, void 0, void 0, function () {
                                var e_2, _a, it, ret, it_1, it_1_1, x, e_2_1;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            it = index_1.zipAsync(mkIterAsync(function () {
                                                return __asyncGenerator(this, arguments, function () {
                                                    return __generator(this, function (_a) {
                                                        switch (_a.label) {
                                                            case 0:
                                                                _a.trys.push([0, , 8, 11]);
                                                                log("1.1");
                                                                return [4 /*yield*/, __await(waitABit())];
                                                            case 1:
                                                                _a.sent();
                                                                log("1.2");
                                                                return [4 /*yield*/, __await("a")];
                                                            case 2: return [4 /*yield*/, _a.sent()];
                                                            case 3:
                                                                _a.sent();
                                                                log("1.3");
                                                                return [4 /*yield*/, __await(waitABit())];
                                                            case 4:
                                                                _a.sent();
                                                                log("1.4");
                                                                return [4 /*yield*/, __await("b")];
                                                            case 5: return [4 /*yield*/, _a.sent()];
                                                            case 6:
                                                                _a.sent();
                                                                log("1.5");
                                                                return [4 /*yield*/, __await(waitABit())];
                                                            case 7:
                                                                _a.sent();
                                                                log("1.6");
                                                                return [3 /*break*/, 11];
                                                            case 8:
                                                                log("1.7");
                                                                return [4 /*yield*/, __await(waitABit())];
                                                            case 9:
                                                                _a.sent();
                                                                log("1.8");
                                                                return [4 /*yield*/, __await(waitABit())];
                                                            case 10:
                                                                _a.sent();
                                                                log("1.9");
                                                                return [7 /*endfinally*/];
                                                            case 11: return [2 /*return*/];
                                                        }
                                                    });
                                                });
                                            }), mkIterAsync(function () {
                                                return __asyncGenerator(this, arguments, function () {
                                                    return __generator(this, function (_a) {
                                                        switch (_a.label) {
                                                            case 0:
                                                                _a.trys.push([0, , 8, 11]);
                                                                log("2.1");
                                                                return [4 /*yield*/, __await(waitABit())];
                                                            case 1:
                                                                _a.sent();
                                                                log("2.2");
                                                                return [4 /*yield*/, __await("c")];
                                                            case 2: return [4 /*yield*/, _a.sent()];
                                                            case 3:
                                                                _a.sent();
                                                                log("2.3");
                                                                return [4 /*yield*/, __await(waitABit())];
                                                            case 4:
                                                                _a.sent();
                                                                log("2.4");
                                                                return [4 /*yield*/, __await("d")];
                                                            case 5: return [4 /*yield*/, _a.sent()];
                                                            case 6:
                                                                _a.sent();
                                                                log("2.5");
                                                                return [4 /*yield*/, __await(waitABit())];
                                                            case 7:
                                                                _a.sent();
                                                                log("2.6");
                                                                return [3 /*break*/, 11];
                                                            case 8:
                                                                log("2.7");
                                                                return [4 /*yield*/, __await(waitABit())];
                                                            case 9:
                                                                _a.sent();
                                                                log("2.8");
                                                                return [4 /*yield*/, __await(waitABit())];
                                                            case 10:
                                                                _a.sent();
                                                                log("2.9");
                                                                return [7 /*endfinally*/];
                                                            case 11: return [2 /*return*/];
                                                        }
                                                    });
                                                });
                                            }));
                                            ret = new Array();
                                            _b.label = 1;
                                        case 1:
                                            _b.trys.push([1, 6, 7, 12]);
                                            it_1 = __asyncValues(it);
                                            _b.label = 2;
                                        case 2: return [4 /*yield*/, it_1.next()];
                                        case 3:
                                            if (!(it_1_1 = _b.sent(), !it_1_1.done)) return [3 /*break*/, 5];
                                            x = it_1_1.value;
                                            ret.push(x);
                                            _b.label = 4;
                                        case 4: return [3 /*break*/, 2];
                                        case 5: return [3 /*break*/, 12];
                                        case 6:
                                            e_2_1 = _b.sent();
                                            e_2 = { error: e_2_1 };
                                            return [3 /*break*/, 12];
                                        case 7:
                                            _b.trys.push([7, , 10, 11]);
                                            if (!(it_1_1 && !it_1_1.done && (_a = it_1["return"]))) return [3 /*break*/, 9];
                                            return [4 /*yield*/, _a.call(it_1)];
                                        case 8:
                                            _b.sent();
                                            _b.label = 9;
                                        case 9: return [3 /*break*/, 11];
                                        case 10:
                                            if (e_2) throw e_2.error;
                                            return [7 /*endfinally*/];
                                        case 11: return [7 /*endfinally*/];
                                        case 12: return [2 /*return*/, ret];
                                    }
                                });
                            });
                        },
                        ret: [["a", "c"], ["b", "d"]],
                        log: [
                            "1.1",
                            "2.1",
                            "1.2",
                            "2.2",
                            "1.3",
                            "2.3",
                            "1.4",
                            "2.4",
                            "1.5",
                            "2.5",
                            "1.6",
                            "1.7",
                            "2.6",
                            "2.7",
                            "1.8",
                            "2.8",
                            "1.9",
                            "2.9"
                        ]
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function standardTests(zip) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, basic(zip)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, lengthIsShortest(zip)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, loopMultipleTimes(zip)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, finallyCalled(zip)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, throwInNext(zip)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, throwInFinally(zip)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, rethrowOriginalError(zip)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, throwInReturnDoesntBlockOtherReturns(zip)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, inputIsForwarded(zip)];
                case 9:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, standardTests(function () {
                        var its = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            its[_i] = arguments[_i];
                        }
                        return index_1.iterToAsync(index_1.zip.apply(void 0, __spread(its)));
                    })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, standardTests(function () {
                            var its = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                its[_i] = arguments[_i];
                            }
                            return index_1.zipAsyncSequential.apply(void 0, __spread(its.map(index_1.iterToAsync)));
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, asyncIsParallel()];
                case 3:
                    _a.sent();
                    console.log("tests finished");
                    return [2 /*return*/];
            }
        });
    });
}
main();
//# sourceMappingURL=test.js.map