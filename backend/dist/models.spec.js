"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("./models");
const typegoose_1 = require("@typegoose/typegoose");
const mongoose_1 = __importDefault(require("mongoose"));
const sinon_1 = __importDefault(require("sinon"));
sinon_1.default.stub({ setTimeout: function () {
        // @ts-ignore
        return global.setTimeout.apply(global, arguments);
    } });
describe("models", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connect("mongodb://localhost:27017/advocat_test", { useNewUrlParser: true });
    }));
    afterAll(() => {
        mongoose_1.default.disconnect();
    });
    describe("Modifiable", () => {
        it("gets a created timestamp when created", () => __awaiter(void 0, void 0, void 0, function* () {
            const ModifiableModel = typegoose_1.getModelForClass(models_1.Modifiable);
            const result = yield ModifiableModel.create({});
            expect(result.created).toBeGreaterThan(0);
            expect(result.modified).toBeUndefined();
        }));
        it("gets a modified timestamp when modified", () => __awaiter(void 0, void 0, void 0, function* () {
            const ModifiableModel = typegoose_1.getModelForClass(models_1.Modifiable);
            const result = yield ModifiableModel.create({});
            yield result.save();
            expect(result.modified).toBeGreaterThan(0);
        }));
    });
});
