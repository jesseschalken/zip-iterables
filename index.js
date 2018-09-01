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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
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
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
exports.__esModule = true;
function asyncIterToArray(xs) {
    var xs_1, xs_1_1;
    return __awaiter(this, void 0, void 0, function () {
        var e_1, _a, ret, x, e_1_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    ret = new Array();
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 12]);
                    xs_1 = __asyncValues(xs);
                    _b.label = 2;
                case 2: return [4 /*yield*/, xs_1.next()];
                case 3:
                    if (!(xs_1_1 = _b.sent(), !xs_1_1.done)) return [3 /*break*/, 5];
                    x = xs_1_1.value;
                    ret.push(x);
                    _b.label = 4;
                case 4: return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 12];
                case 6:
                    e_1_1 = _b.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 12];
                case 7:
                    _b.trys.push([7, , 10, 11]);
                    if (!(xs_1_1 && !xs_1_1.done && (_a = xs_1["return"]))) return [3 /*break*/, 9];
                    return [4 /*yield*/, _a.call(xs_1)];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 11: return [7 /*endfinally*/];
                case 12: return [2 /*return*/, ret];
            }
        });
    });
}
exports.asyncIterToArray = asyncIterToArray;
function iterToAsync(iterable) {
    var _a;
    return _a = {},
        _a[Symbol.asyncIterator] = function () {
            var iter = Promise.resolve(iterable).then(function (x) { return x[Symbol.iterator](); });
            return {
                next: function (value) {
                    return iter.then(function (x) {
                        return x.next(value);
                    });
                },
                "return": function (value) {
                    return iter.then(function (x) {
                        if (x["return"]) {
                            return x["return"](value);
                        }
                        return { done: true, value: value };
                    });
                },
                "throw": function (e) {
                    return iter.then(function (x) {
                        if (x["throw"]) {
                            return x["throw"](e);
                        }
                        throw e;
                    });
                }
            };
        },
        _a;
}
exports.iterToAsync = iterToAsync;
var mapEager = function (xs, fn) {
    return xs.map(fn);
};
var mapEagerAsync = function (xs, fn) {
    return iterToAsync(asyncIterToArray(mapLazyAsync(xs, fn)));
};
var mapLazy = function (xs, fn) {
    var _a;
    return _a = {},
        _a[Symbol.iterator] = function () {
            var e_2, _a, xs_2, xs_2_1, x, e_2_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, 6, 7]);
                        xs_2 = __values(xs), xs_2_1 = xs_2.next();
                        _b.label = 1;
                    case 1:
                        if (!!xs_2_1.done) return [3 /*break*/, 4];
                        x = xs_2_1.value;
                        return [4 /*yield*/, fn(x)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        xs_2_1 = xs_2.next();
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        e_2_1 = _b.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 7];
                    case 6:
                        try {
                            if (xs_2_1 && !xs_2_1.done && (_a = xs_2["return"])) _a.call(xs_2);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        },
        _a;
};
var mapLazyAsync = function (xs, fn) {
    var _a;
    return _a = {},
        _a[Symbol.asyncIterator] = function () {
            return __asyncGenerator(this, arguments, function _a() {
                var e_3, _a, xs_3, xs_3_1, x, e_3_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 6, 7, 8]);
                            xs_3 = __values(xs), xs_3_1 = xs_3.next();
                            _b.label = 1;
                        case 1:
                            if (!!xs_3_1.done) return [3 /*break*/, 5];
                            x = xs_3_1.value;
                            return [4 /*yield*/, __await(fn(x))];
                        case 2: return [4 /*yield*/, _b.sent()];
                        case 3:
                            _b.sent();
                            _b.label = 4;
                        case 4:
                            xs_3_1 = xs_3.next();
                            return [3 /*break*/, 1];
                        case 5: return [3 /*break*/, 8];
                        case 6:
                            e_3_1 = _b.sent();
                            e_3 = { error: e_3_1 };
                            return [3 /*break*/, 8];
                        case 7:
                            try {
                                if (xs_3_1 && !xs_3_1.done && (_a = xs_3["return"])) _a.call(xs_3);
                            }
                            finally { if (e_3) throw e_3.error; }
                            return [7 /*endfinally*/];
                        case 8: return [2 /*return*/];
                    }
                });
            });
        },
        _a;
};
var mapParallelAsync = function (xs, fn) {
    return iterToAsync(Promise.all(xs.map(fn)));
};
var IteratorState = /** @class */ (function () {
    function IteratorState(iter) {
        this.running = false;
        this.iterator = iter[Symbol.iterator]();
    }
    IteratorState.prototype.next = function (input) {
        try {
            var result = this.iterator.next(input);
            this.running = !result.done;
            return result;
        }
        catch (e) {
            this.running = false;
            throw e;
        }
    };
    IteratorState.prototype.finish = function () {
        if (this.iterator["return"] && this.running) {
            this.iterator["return"]();
        }
    };
    return IteratorState;
}());
var AsyncIteratorState = /** @class */ (function () {
    function AsyncIteratorState(iter) {
        this.running = false;
        this.iterator = iter[Symbol.asyncIterator]();
    }
    AsyncIteratorState.prototype.next = function (input) {
        var result = this.iterator.next(input);
        this.running = result.then(function (x) { return !x.done; }, function () { return false; });
        return result;
    };
    AsyncIteratorState.prototype.finish = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.iterator["return"];
                        if (!_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.running];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2:
                        if (!_a) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.iterator["return"]()];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return AsyncIteratorState;
}());
function mkZip(map) {
    function zip() {
        var iterables = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            iterables[_i] = arguments[_i];
        }
        var _a;
        return _a = {},
            _a[Symbol.iterator] = function () {
                var e_4, _a, e_5, _b, iters, error, input_1, ret, _c, _d, _e, value, done, e_6, iters_1, iters_1_1, iter;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            iters = iterables.map(function (x) { return new IteratorState(x); });
                            error = null;
                            _f.label = 1;
                        case 1:
                            _f.trys.push([1, 5, 6, 7]);
                            input_1 = undefined;
                            _f.label = 2;
                        case 2:
                            if (!true) return [3 /*break*/, 4];
                            ret = new Array();
                            try {
                                for (_c = __values(map(iters, function (x) { return x.next(input_1); })), _d = _c.next(); !_d.done; _d = _c.next()) {
                                    _e = _d.value, value = _e.value, done = _e.done;
                                    if (done) {
                                        return [2 /*return*/];
                                    }
                                    ret.push(value);
                                }
                            }
                            catch (e_4_1) { e_4 = { error: e_4_1 }; }
                            finally {
                                try {
                                    if (_d && !_d.done && (_a = _c["return"])) _a.call(_c);
                                }
                                finally { if (e_4) throw e_4.error; }
                            }
                            return [4 /*yield*/, ret];
                        case 3:
                            input_1 = _f.sent();
                            return [3 /*break*/, 2];
                        case 4: return [3 /*break*/, 7];
                        case 5:
                            e_6 = _f.sent();
                            error = { e: e_6 };
                            return [3 /*break*/, 7];
                        case 6:
                            try {
                                try {
                                    for (iters_1 = __values(iters), iters_1_1 = iters_1.next(); !iters_1_1.done; iters_1_1 = iters_1.next()) {
                                        iter = iters_1_1.value;
                                        try {
                                            iter.finish();
                                        }
                                        catch (e) {
                                            if (!error) {
                                                error = { e: e };
                                            }
                                        }
                                    }
                                }
                                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                                finally {
                                    try {
                                        if (iters_1_1 && !iters_1_1.done && (_b = iters_1["return"])) _b.call(iters_1);
                                    }
                                    finally { if (e_5) throw e_5.error; }
                                }
                            }
                            finally {
                                if (error) {
                                    throw error.e;
                                }
                            }
                            return [7 /*endfinally*/];
                        case 7: return [2 /*return*/];
                    }
                });
            },
            _a;
    }
    return zip;
}
function makeZipAsync(map) {
    function zip() {
        var iterables = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            iterables[_i] = arguments[_i];
        }
        var _a;
        return _a = {},
            _a[Symbol.asyncIterator] = function () {
                return __asyncGenerator(this, arguments, function _a() {
                    var e_7, _a, e_8, _b, iters, error, input_2, ret, _c, _d, _e, done, value, e_7_1, e_9, _f, _g, _, e_8_1;
                    var _this = this;
                    return __generator(this, function (_h) {
                        switch (_h.label) {
                            case 0:
                                iters = iterables.map(function (x) { return new AsyncIteratorState(x); });
                                error = null;
                                _h.label = 1;
                            case 1:
                                _h.trys.push([1, 20, 21, 36]);
                                input_2 = undefined;
                                _h.label = 2;
                            case 2:
                                if (!true) return [3 /*break*/, 19];
                                ret = new Array();
                                _h.label = 3;
                            case 3:
                                _h.trys.push([3, 10, 11, 16]);
                                _c = __asyncValues(map(iters, function (x) { return x.next(input_2); }));
                                _h.label = 4;
                            case 4: return [4 /*yield*/, __await(_c.next())];
                            case 5:
                                if (!(_d = _h.sent(), !_d.done)) return [3 /*break*/, 9];
                                _e = _d.value, done = _e.done, value = _e.value;
                                if (!done) return [3 /*break*/, 7];
                                return [4 /*yield*/, __await(void 0)];
                            case 6: return [2 /*return*/, _h.sent()];
                            case 7:
                                ret.push(value);
                                _h.label = 8;
                            case 8: return [3 /*break*/, 4];
                            case 9: return [3 /*break*/, 16];
                            case 10:
                                e_7_1 = _h.sent();
                                e_7 = { error: e_7_1 };
                                return [3 /*break*/, 16];
                            case 11:
                                _h.trys.push([11, , 14, 15]);
                                if (!(_d && !_d.done && (_a = _c["return"]))) return [3 /*break*/, 13];
                                return [4 /*yield*/, __await(_a.call(_c))];
                            case 12:
                                _h.sent();
                                _h.label = 13;
                            case 13: return [3 /*break*/, 15];
                            case 14:
                                if (e_7) throw e_7.error;
                                return [7 /*endfinally*/];
                            case 15: return [7 /*endfinally*/];
                            case 16: return [4 /*yield*/, __await(ret)];
                            case 17: return [4 /*yield*/, _h.sent()];
                            case 18:
                                input_2 = _h.sent();
                                return [3 /*break*/, 2];
                            case 19: return [3 /*break*/, 36];
                            case 20:
                                e_9 = _h.sent();
                                error = { e: e_9 };
                                return [3 /*break*/, 36];
                            case 21:
                                _h.trys.push([21, , 34, 35]);
                                _h.label = 22;
                            case 22:
                                _h.trys.push([22, 27, 28, 33]);
                                _f = __asyncValues(map(iters, function (iter) { return __awaiter(_this, void 0, void 0, function () {
                                    var e_10;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                _a.trys.push([0, 2, , 3]);
                                                return [4 /*yield*/, iter.finish()];
                                            case 1:
                                                _a.sent();
                                                return [3 /*break*/, 3];
                                            case 2:
                                                e_10 = _a.sent();
                                                if (!error) {
                                                    error = { e: e_10 };
                                                }
                                                return [3 /*break*/, 3];
                                            case 3: return [2 /*return*/];
                                        }
                                    });
                                }); }));
                                _h.label = 23;
                            case 23: return [4 /*yield*/, __await(_f.next())];
                            case 24:
                                if (!(_g = _h.sent(), !_g.done)) return [3 /*break*/, 26];
                                _ = _g.value;
                                _h.label = 25;
                            case 25: return [3 /*break*/, 23];
                            case 26: return [3 /*break*/, 33];
                            case 27:
                                e_8_1 = _h.sent();
                                e_8 = { error: e_8_1 };
                                return [3 /*break*/, 33];
                            case 28:
                                _h.trys.push([28, , 31, 32]);
                                if (!(_g && !_g.done && (_b = _f["return"]))) return [3 /*break*/, 30];
                                return [4 /*yield*/, __await(_b.call(_f))];
                            case 29:
                                _h.sent();
                                _h.label = 30;
                            case 30: return [3 /*break*/, 32];
                            case 31:
                                if (e_8) throw e_8.error;
                                return [7 /*endfinally*/];
                            case 32: return [7 /*endfinally*/];
                            case 33: return [3 /*break*/, 35];
                            case 34:
                                if (error) {
                                    throw error.e;
                                }
                                return [7 /*endfinally*/];
                            case 35: return [7 /*endfinally*/];
                            case 36: return [2 /*return*/];
                        }
                    });
                });
            },
            _a;
    }
    return zip;
}
exports.zip = mkZip(mapLazy);
exports.zipAsync = makeZipAsync(mapParallelAsync);
exports.zipAsyncSequential = makeZipAsync(mapLazyAsync);
//# sourceMappingURL=index.js.map