import { prop, pre, Ref, arrayProp } from '@typegoose/typegoose'

export class Addressed {
  @prop() public address: string = ""
}

@pre<Modifiable>('save', function() { })
export class Logged { }

@pre<Modifiable>('save', function() { if (this.created) { this.modified = Date.now() } else this.created = Date.now() })
export class Modifiable extends Logged {
    @prop() public created!: number
    @prop() public modified!: number
}

export class File {
    @prop() public data!: Blob
    @prop() public name!: string
}

export class QualificationType {
    @prop({ required: true }) public type!: string
}

export class Qualification {
    @prop({ ref: QualificationType, required: true}) public qualificationType?: Ref<QualificationType>
    @prop() public expiry?: number
    @arrayProp({ itemRef: File }) public evidence!: Ref<File>[]
}

export class Person extends Modifiable {
    @prop({ required: true }) public name!: string
    @prop({ required: true }) public phone!: string
}

export class Worker extends Person {
    @prop({ required: true }) public email!: string
    @prop({ required: true }) public location!: string
    @arrayProp({ itemRef: Qualification }) public qualifications?: Ref<Qualification>[]
    @prop() public active!: boolean
}

export class Recipient extends Person {
    @prop({ required: true }) public address!: string
    @prop() public email!: string
}

export class JobTemplate extends Modifiable {
    @prop() public name!: string
    @prop() public description!: string
    @arrayProp({ itemsRef: QualificationType }) public qualificationsNeeded?: Ref<QualificationType>[]
    @arrayProp({ items: String }) public tags?: string[]
    @arrayProp({ items: String }) public jobActions!: string[]
}

export class JobAction {
    @prop({ required: true }) public description!: string
    @prop() public location!: string
}

export class Job extends Modifiable {
    @prop({ ref: Worker }) public worker?: Ref<Worker>
    @prop({ ref: Worker }) public dispatcher?: Ref<Worker>
    @prop({ ref: Recipient, required: true }) public recipient!: Ref<Recipient>
    @prop() public description!: string
    @prop() public status!: string 
    @arrayProp({ itemsRef: QualificationType}) public qualificationsNeeded?: Ref<QualificationType>[]
    @arrayProp({ items: String }) public tags?: string[]
    @arrayProp({ itemsRef: JobAction }) public jobActions!: Ref<JobAction>[]
}

export class Roles extends Modifiable {
    @prop({required: true}) public name! : string
}

export class Credentials extends Modifiable {
    @prop({ ref: Person, required: true}) public person?: Ref<Person> 
    @prop({ required: true }) public salt!: string
    @prop({ required: true }) public password!: string
    @arrayProp({ itemsRef: Roles }) public roles?: Ref<Roles>[]
}
