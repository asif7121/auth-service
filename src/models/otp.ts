import { Schema, Document, model } from "mongoose";


interface IOtp extends Document {
    otpCode: string
    _user: Schema.Types.ObjectId
}

const otpSchema:Schema = new Schema({
    otpCode: {
        type:String
    },
    _user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
    versionKey:false
})



export const Otp = model<IOtp>('Otp', otpSchema)