import mongoose, { Schema } from 'mongoose';

const storeSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    gst: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
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

const Store = mongoose.model('Store', storeSchema);

export default Store;
