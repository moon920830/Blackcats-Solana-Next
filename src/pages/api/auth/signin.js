// import/no-unresolved
import nextConnect from "next-connect";
import axios from "axios";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../../../../models/user";
import middleware from "../../../../middlewares";
/**
 * @url /api/auth/signin
 */
// eslint-disable-next-line consistent-return

const app = nextConnect();
app.use(middleware);

// eslint-disable-next-line consistent-return
app.post(async (req, res) => {
    // Extract the email, password and captcha code from the request body
    const { token, email, password } = req.body;

    try {
        if (!token) {
            return res.status(422).json({
                message:
                    "Unproccesable request, please provide the required fields",
            });
        }
        // Ping the google recaptcha verify API to verify the captcha code you received
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
            {
                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded; charset=utf-8",
                },
            }
        );
        const captchaValidation = await response.data;
        /**
         * The structure of response from the verify API is
            *  {
            *  "success": true|false,
            *  "challenge_ts": timestamp,  // timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
            *  "hostname": string,         // the hostname of the site where the reCAPTCHA was solved
            *  "error-codes": [...]        // optional
            }
       */
        if (captchaValidation.success) {
            // Return 200 if everything is successful
            // return res.status(200).json({ message: "success" });
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(422).json({
                    message: "Incorrect email!",
                });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(422).json({
                    message: "Incorrect password!",
                });
            }
            const payload = {
                user: {
                    _id: user._id,
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    type: user.type,
                    avatar: user.avatar,
                    cover: user.cover,
                    bio: user.bio,
                },
            };
            jwt.sign(
                payload,
                "jwtSecret",
                { expiresIn: 36000 },
                (err, jwtToken) => {
                    if (err) throw err;
                    return res.status(200).json({
                        token: jwtToken,
                    });
                }
            );
        } else {
            return res.status(422).json({
                message: "Unproccesable request, Invalid captcha code",
            });
        }
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        return res.status(422).json({ message: "Something went wrong" });
    }
});

export default app;
