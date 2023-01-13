import mongoose from "mongoose";

export default async function database(req, res, next) {
    mongoose
        .connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            res.isMongoConnected = "Connected to MongoDB";
            return next();
        })
        .catch((err) => {
            console.info("MongoDB Error:", err);
        });
}
