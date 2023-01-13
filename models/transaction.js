import mongoose, { Schema, model, models } from "mongoose";

const TransactionSchema = new Schema({
    createByUser: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    nftID: {
        type: Schema.Types.ObjectId,
        ref: "NFT"
    },
    feeSol: {
        type: String,
        required: true
    },
    feeUSD: {
        type: String,
        required: true
    },
    creator: {
        type: String,
        required: true
    },
    type: {
        type: Number,
        default: 0
    },
    transactionId: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }
});

export const Transaction = models.Transaction || model("Transaction", TransactionSchema);
