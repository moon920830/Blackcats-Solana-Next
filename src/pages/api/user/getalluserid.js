/* eslint-disable indent */
// import/no-unresolved
import nextConnect from "next-connect";
import { User } from "../../../../models/user";
import middleware from "../../../../middlewares";
/**
 * @url /api/user/getalluserid
 * @description get all user id
 * @method GET
 */

const app = nextConnect();
app.use(middleware);

// eslint-disable-next-line consistent-return
app.get(async (req, res) => {
    try {
        const userAllData = await User.find().select("_id").exec();
        if (userAllData) {
            res.status(200).json({
                success: true,
                uids: userAllData
            })
        } else {
            res.status(404).json({
                error: "user is not found",
            })
        }
    } catch (error) {
        return res.json({ error: error.message });
    }
});

export default app;
