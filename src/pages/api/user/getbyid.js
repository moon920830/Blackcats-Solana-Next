/* eslint-disable indent */
// import/no-unresolved
import nextConnect from "next-connect";
import { User } from "../../../../models/user";
import middleware from "../../../../middlewares";
/**
 * @url /api/user/getbyid
 * @description get find by id
 * @method GET
 */

const app = nextConnect();
app.use(middleware);

// eslint-disable-next-line consistent-return
app.get(async (req, res) => {
    try {
        const { u_id } = req.query;
        const userData = await User.findById(u_id, 'firstname lastname avatar cover likes').exec();
        if (userData) {
            res.status(200).json({
                success: true,
                result: userData
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
