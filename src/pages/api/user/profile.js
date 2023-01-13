/* eslint-disable indent */
// import/no-unresolved
import nextConnect from "next-connect";
import jwt from "jsonwebtoken";
import { User } from "../../../../models/user";
import middleware from "../../../../middlewares";
/**
 * @url /api/user/profile
 * @description save profile options
 */
// eslint-disable-next-line consistent-return

const app = nextConnect();
app.use(middleware);

// eslint-disable-next-line consistent-return
app.post(async (req, res) => {
    try {
        const { firstname, lastname, u_id, bio, type } = req.body;
        User.findByIdAndUpdate(
            u_id,
            { firstname, lastname, bio, type },
            { new: true }, (err, result) => {
                if (err) {
                    return res.status(500).json({
                        message: "Database Error!",
                    });
                }

                const payload = {
                    user: {
                        _id: result._id,
                        email: result.email,
                        firstname: result.firstname,
                        lastname: result.lastname,
                        type: result.type,
                        avatar: result.avatar,
                        cover: result.cover,
                        bio: result.bio,
                    },
                };
                jwt.sign(
                    payload,
                    "jwtSecret",
                    { expiresIn: 36000 },
                    (err1, jwtToken) => {
                        if (err1) throw err1;
                        return res.status(200).json({
                            token: jwtToken,
                        });
                    }
                );
            });
    } catch (error) {
        return res.status(422).json({ message: "Something went wrong" });
    }
});

export default app;
