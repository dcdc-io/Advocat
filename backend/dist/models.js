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
Object.defineProperty(exports, "__esModule", { value: true });
const typegoose_1 = require("@typegoose/typegoose");
class Addressed {
    constructor() {
        this.address = "";
    }
}
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], Addressed.prototype, "address", void 0);
exports.Addressed = Addressed;
let Logged = class Logged {
};
Logged = __decorate([
    typegoose_1.pre('save', function () { })
], Logged);
exports.Logged = Logged;
let Modifiable = class Modifiable extends Logged {
};
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", Number)
], Modifiable.prototype, "created", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", Number)
], Modifiable.prototype, "modified", void 0);
Modifiable = __decorate([
    typegoose_1.pre('save', function () { if (this.created) {
        this.modified = Date.now();
    }
    else
        this.created = Date.now(); })
], Modifiable);
exports.Modifiable = Modifiable;
class File {
}
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", Buffer)
], File.prototype, "data", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], File.prototype, "name", void 0);
exports.File = File;
class QualificationType {
}
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], QualificationType.prototype, "type", void 0);
exports.QualificationType = QualificationType;
class Qualification {
}
__decorate([
    typegoose_1.prop({ ref: QualificationType, required: true }),
    __metadata("design:type", Object)
], Qualification.prototype, "qualificationType", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", Number)
], Qualification.prototype, "expiry", void 0);
__decorate([
    typegoose_1.arrayProp({ itemRef: File }),
    __metadata("design:type", Array)
], Qualification.prototype, "evidence", void 0);
exports.Qualification = Qualification;
class Person extends Modifiable {
}
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], Person.prototype, "name", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], Person.prototype, "phone", void 0);
exports.Person = Person;
class Worker extends Person {
}
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], Worker.prototype, "email", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], Worker.prototype, "location", void 0);
__decorate([
    typegoose_1.arrayProp({ itemRef: Qualification }),
    __metadata("design:type", Array)
], Worker.prototype, "qualifications", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", Boolean)
], Worker.prototype, "active", void 0);
exports.Worker = Worker;
class Recipient extends Person {
}
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], Recipient.prototype, "address", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], Recipient.prototype, "email", void 0);
exports.Recipient = Recipient;
class JobTemplate extends Modifiable {
}
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], JobTemplate.prototype, "name", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], JobTemplate.prototype, "description", void 0);
__decorate([
    typegoose_1.arrayProp({ itemsRef: QualificationType }),
    __metadata("design:type", Array)
], JobTemplate.prototype, "qualificationsNeeded", void 0);
__decorate([
    typegoose_1.arrayProp({ items: String }),
    __metadata("design:type", Array)
], JobTemplate.prototype, "tags", void 0);
__decorate([
    typegoose_1.arrayProp({ items: String }),
    __metadata("design:type", Array)
], JobTemplate.prototype, "jobActions", void 0);
exports.JobTemplate = JobTemplate;
class JobAction {
}
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], JobAction.prototype, "description", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], JobAction.prototype, "location", void 0);
exports.JobAction = JobAction;
class Job extends Modifiable {
}
__decorate([
    typegoose_1.prop({ ref: Worker }),
    __metadata("design:type", Object)
], Job.prototype, "worker", void 0);
__decorate([
    typegoose_1.prop({ ref: Worker }),
    __metadata("design:type", Object)
], Job.prototype, "dispatcher", void 0);
__decorate([
    typegoose_1.prop({ ref: Recipient, required: true }),
    __metadata("design:type", Object)
], Job.prototype, "recipient", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], Job.prototype, "description", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", String)
], Job.prototype, "status", void 0);
__decorate([
    typegoose_1.arrayProp({ itemsRef: QualificationType }),
    __metadata("design:type", Array)
], Job.prototype, "qualificationsNeeded", void 0);
__decorate([
    typegoose_1.arrayProp({ items: String }),
    __metadata("design:type", Array)
], Job.prototype, "tags", void 0);
__decorate([
    typegoose_1.arrayProp({ itemsRef: JobAction }),
    __metadata("design:type", Array)
], Job.prototype, "jobActions", void 0);
exports.Job = Job;
class Roles extends Modifiable {
}
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], Roles.prototype, "name", void 0);
exports.Roles = Roles;
class Credentials extends Modifiable {
}
__decorate([
    typegoose_1.prop({ ref: Person, required: true }),
    __metadata("design:type", Object)
], Credentials.prototype, "person", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], Credentials.prototype, "salt", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], Credentials.prototype, "password", void 0);
__decorate([
    typegoose_1.arrayProp({ itemsRef: Roles }),
    __metadata("design:type", Array)
], Credentials.prototype, "roles", void 0);
exports.Credentials = Credentials;
