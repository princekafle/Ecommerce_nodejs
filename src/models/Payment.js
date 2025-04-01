import mongoose, { Types } from "mongoose";

const paymentSchema = new mongoose.Schema({

    amount: {type: Number, required: true },
    paymentMethod: {
        type: String,
        required: true,
        enum: ["cash", "card", "online"],
    },
    status:{
        type: String,
        default: "pending",
        enum:["pending", "completed", "failed"],
    },
        createdAt: {
            type: Date,
            default: Date.now(),
        },
    order: {
        type: mongoose.Types.ObjectId,
        ref: "Order",
        required: true,
    },
    transactionId: String,

});

const model = mongoose.model("Payment", paymentSchema);

export default model