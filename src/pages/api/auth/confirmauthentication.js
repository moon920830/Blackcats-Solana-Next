// import/no-unresolved
import nextConnect from "next-connect";
import { User } from "../../../../models/user";
import middleware from "../../../../middlewares";
import auth from "../../../../middlewares/auth";
/**
 * @url /api/auth/confirmauthentication
 * @description change password
 * @method POST
 */
// eslint-disable-next-line consistent-return

const app = nextConnect();
app.use(middleware);
app.use(auth);

// eslint-disable-next-line consistent-return
app.post(async (req, res) => {
    // Extract the oldPass, NewPass and user id from the request body
    try {
        return res.status(200).json({
            success: true
        });
    } catch (error) {
        return res.json({
            error: error.message
        })
    }
});

export default app;
