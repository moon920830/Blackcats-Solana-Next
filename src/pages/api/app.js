import nextConnect from "next-connect";
import middleware from "../../../middlewares";

const app = nextConnect();
app.use(middleware);

// app.get(async (req, res) => {
//     res.status(200).json({ name: res.isMongoConnected });
// });

export default app;
