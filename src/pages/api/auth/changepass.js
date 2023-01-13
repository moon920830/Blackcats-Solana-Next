// import/no-unresolved
import nextConnect from "next-connect";
import { User } from "../../../../models/user";
import bcrypt from "bcryptjs";
import middleware from "../../../../middlewares";
/**
 * @url /api/auth/changepass
 * @description change password
 */
// eslint-disable-next-line consistent-return

const app = nextConnect();
app.use(middleware);

// eslint-disable-next-line consistent-return
app.post(async (req, res) => {
    // Extract the oldPass, NewPass and user id from the request body
    try {
        const { u_id, oldPass, NewPass } = req.body;
        const user = await User.findOne({ _id: u_id });
        console.log(user)
        if (!user) {
            return res.status(422).json({
                message: "user not found!",
            });
        }
        const isMatch = await bcrypt.compare(oldPass, user.password);
        if (!isMatch) {
            return res.status(422).json({
                message: "Incorrect password!",
            });
        }
        user.password = NewPass;
        await user.save();
        return res.status(200).json({
            message: "Your password has changed"
        });     
        
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        return res.status(422).json({ message: "Something went wrong" });
    }
});

export default app;
