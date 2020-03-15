import { Modifiable } from "./models"
import { getModelForClass, isRefType } from "@typegoose/typegoose"
import mongoose from "mongoose"
import sinon from "sinon"

sinon.stub({setTimeout: function() {
    // @ts-ignore
    return global.setTimeout.apply(global, arguments)
}})

describe("models", () => {
    beforeAll(async () => {
        await mongoose.connect("mongodb://localhost:27017/advocat_test", { useNewUrlParser: true })
    })
    afterAll(() => {
        mongoose.disconnect()
    })
    describe("Modifiable", () => {
        it("gets a created timestamp when created", async () => {
            const ModifiableModel = getModelForClass(Modifiable)
            const result = await ModifiableModel.create({})
            expect(result.created).toBeGreaterThan(0)
            expect(result.modified).toBeUndefined()
        })
        it("gets a modified timestamp when modified", async () => {         
            const ModifiableModel = getModelForClass(Modifiable)
            const result = await ModifiableModel.create({})
            await result.save()
            expect(result.modified).toBeGreaterThan(0)
        })
    })
})