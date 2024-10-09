import mongoose, { Schema } from 'mongoose';

const clientSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,

    },
    address: {
        type: String,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,  // ObjectId reference to the User model
        required: true,
        ref: 'User',  // Ensure you're referencing the correct User model name
    }
}, { timestamps: true });

const Client = mongoose.model('Client', clientSchema);

export default Client;
