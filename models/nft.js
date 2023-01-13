import mongoose, { Schema, model, models } from "mongoose";
import likesPlugin from "mongoose-likes";

const NFTSchema = new Schema({
  //
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    default: 0
  },
  account: {
    type: String,
    required: true,
    unique: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  imageName: {
    type: String,
    required: true
  },
  musicUrl: {
    type: String,
    required: true
  },
  musicName: {
    type: String,
    required: true
  },
  property: {
    type: String,
    required: true
  },
  length: {
    type: Number,
    default: 0
  },
  royality: {
    type: Number,
    default: 0
  },
  symbol: {
    type: String,
    required: true
  },
  //

  transactions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Transaction"
    }
  ],
});

NFTSchema.plugin(likesPlugin);

export const NFT = models.NFT || model("NFT", NFTSchema);
