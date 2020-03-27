"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pouchdb_1 = __importDefault(require("pouchdb"));
var assert_1 = __importDefault(require("assert"));
var wrapped = {};
function wrap(target, propertyKey, descriptor) {
    // @ts-ignore
    var unwrapped = pouchdb_1.default.prototype[propertyKey];
    // @ts-ignore
    wrapped[propertyKey] = function () {
        var _this = this;
        var pinArguments = arguments;
        return target[propertyKey].apply(this, pinArguments)
            .then(function () {
            return unwrapped.apply(_this, pinArguments);
        })
            .catch(function (error) {
            throw error;
        });
    };
}
var SecurePouchDB = /** @class */ (function () {
    function SecurePouchDB() {
    }
    SecurePouchDB.wouldAlterDoc = function (db, doc) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = doc._id;
                        if (!_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, db.get(doc._id).catch(function () { return null; })];
                    case 1:
                        _a = ((_b.sent()) !== null);
                        _b.label = 2;
                    case 2: return [2 /*return*/, _a];
                }
            });
        });
    };
    SecurePouchDB.wouldCreateDoc = function (db, doc) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = doc._id;
                        if (!_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, db.get(doc._id).catch(function () { return null; })];
                    case 1:
                        _a = ((_b.sent()) === null);
                        _b.label = 2;
                    case 2: return [2 /*return*/, _a];
                }
            });
        });
    };
    SecurePouchDB.canAlterDoc = function (_a, _b) {
        var roles = _a.roles, name = _a.name;
        var admins = _b.admins, members = _b.members;
        return __awaiter(this, void 0, void 0, function () {
            var userCan, roleCan, publicRoleCan;
            return __generator(this, function (_c) {
                userCan = name && __spreadArrays((admins === null || admins === void 0 ? void 0 : admins.users) || [], (members === null || members === void 0 ? void 0 : members.users) || []).includes(name);
                roleCan = (roles === null || roles === void 0 ? void 0 : roles.some(function (role) { return __spreadArrays((admins === null || admins === void 0 ? void 0 : admins.roles) || [], (members === null || members === void 0 ? void 0 : members.roles) || []).includes(role); })) || false;
                publicRoleCan = __spreadArrays((members === null || members === void 0 ? void 0 : members.roles) || []).includes("_public");
                return [2 /*return*/, userCan || roleCan || publicRoleCan];
            });
        });
    };
    SecurePouchDB.canCreateDoc = function (_a, _b) {
        var roles = _a.roles, name = _a.name;
        var admins = _b.admins, members = _b.members, writers = _b.writers;
        return __awaiter(this, void 0, void 0, function () {
            var userCan, roleCan, publicRoleCan;
            return __generator(this, function (_c) {
                userCan = name && __spreadArrays((admins === null || admins === void 0 ? void 0 : admins.users) || [], (members === null || members === void 0 ? void 0 : members.users) || [], (writers === null || writers === void 0 ? void 0 : writers.users) || []).includes(name);
                roleCan = (roles === null || roles === void 0 ? void 0 : roles.some(function (role) { return __spreadArrays((admins === null || admins === void 0 ? void 0 : admins.roles) || [], (members === null || members === void 0 ? void 0 : members.roles) || [], (writers === null || writers === void 0 ? void 0 : writers.roles) || []).includes(role); })) || false;
                publicRoleCan = __spreadArrays((members === null || members === void 0 ? void 0 : members.roles) || [], (writers === null || writers === void 0 ? void 0 : writers.roles) || []).includes("_public");
                return [2 /*return*/, userCan || roleCan || publicRoleCan];
            });
        });
    };
    SecurePouchDB.isAdminUser = function (userCtx, secObj) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_c) {
                return [2 /*return*/, __spreadArrays((userCtx === null || userCtx === void 0 ? void 0 : userCtx.roles) || []).includes("_admin") ||
                        __spreadArrays((userCtx === null || userCtx === void 0 ? void 0 : userCtx.roles) || []).includes("admin") ||
                        ((userCtx === null || userCtx === void 0 ? void 0 : userCtx.name) && __spreadArrays(((_a = secObj === null || secObj === void 0 ? void 0 : secObj.admins) === null || _a === void 0 ? void 0 : _a.users) || []).includes(userCtx === null || userCtx === void 0 ? void 0 : userCtx.name)) || ((_b = userCtx === null || userCtx === void 0 ? void 0 : userCtx.roles) === null || _b === void 0 ? void 0 : _b.some(function (role) { var _a; return __spreadArrays(((_a = secObj === null || secObj === void 0 ? void 0 : secObj.admins) === null || _a === void 0 ? void 0 : _a.roles) || []).includes(role); })) || false];
            });
        });
    };
    SecurePouchDB.bulkDocs = function (docs, args) {
        if (args === void 0) { args = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var docArray, _i, docArray_1, doc, _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        args.userCtx = args.userCtx || { name: null, roles: ["_admin"] };
                        if (SecurePouchDB.isAdminUser(args.userCtx, args.secObj)) {
                            return [2 /*return*/];
                        }
                        if (!(args.userCtx && args.secObj)) return [3 /*break*/, 7];
                        docArray = docs.docs || docs;
                        _i = 0, docArray_1 = docArray;
                        _e.label = 1;
                    case 1:
                        if (!(_i < docArray_1.length)) return [3 /*break*/, 7];
                        doc = docArray_1[_i];
                        _a = assert_1.default;
                        return [4 /*yield*/, SecurePouchDB.wouldCreateDoc(this, doc)];
                    case 2:
                        _b = (_e.sent());
                        return [4 /*yield*/, SecurePouchDB.canCreateDoc(args.userCtx, args.secObj)];
                    case 3:
                        _a.apply(void 0, [_b <= (_e.sent()), "cannot create doc"]);
                        _c = assert_1.default;
                        return [4 /*yield*/, SecurePouchDB.wouldAlterDoc(this, doc)];
                    case 4:
                        _d = (_e.sent());
                        return [4 /*yield*/, SecurePouchDB.canAlterDoc(args.userCtx, args.secObj)];
                    case 5:
                        _c.apply(void 0, [_d <= (_e.sent()), "cannot alter doc"]);
                        _e.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 1];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        wrap,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], SecurePouchDB, "bulkDocs", null);
    return SecurePouchDB;
}());
// @ts-ignore
wrapped.__impl = SecurePouchDB;
module.exports = wrapped;
