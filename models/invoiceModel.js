import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
    
    invoiceNumber: {
        type: String,
        required: true,
        unique: true,
    },
    invoiceDate: {
        type: String,
        required: true,
    },
    items: [
        {
            name: {
                type: String,
                required: true,
            },
            quantity: {
                type: String,
                required: true,
            },
            price: {
                type: String,
                required: true,
            },
            total: {
                type: String,
                required: true,
            },
        },
    ],
    subtotal: {
        type: String,
        required: true,
    },
    grandTotal: {
        type: String,
        required: true,
    },
    discount: {
        type: String,
        default: '0',
    },
    cgst: {
        type: String,
        default: '0',
    },
    sgst: {
        type: String,
        default: '0',
    },
    amountPaid: {
        type: String,
        default: '0',
    },
    amountDue: {
        type: String, // Corrected typo from "amuountDue" to "amountDue"
        default: '0',
    },
    paymentMode: {
        type: String,
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ["paid", "pending"],
        default: "pending",
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
        required: true,
    },
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store",
        required: true,
    },
}, { timestamps: true });

const Invoice = mongoose.model("Invoice", invoiceSchema);
export default Invoice;
