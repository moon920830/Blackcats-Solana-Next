/* eslint-disable indent */
// import/no-unresolved
import nextConnect from "next-connect";
import { User } from "../../../../models/user";
import middleware from "../../../../middlewares";
import auth from "../../../../middlewares/auth";
/**
 * @url /api/user/dofollow
 * @description get all user id
 * @method POST
 */

console.log("api/user/dofollow");

const app = nextConnect();
app.use(middleware);
app.use(auth);

// eslint-disable-next-line consistent-return
app.post(async (req, res) => {
    try {
        const { _id } = req.user;
        const { like_uid } = req.body;
        if (_id == like_uid) return res.status(400).json({
            error: "You can't follow yourself."
        })
        User.findLikes(_id, {
            _id: like_uid
        }, function (err, likes) {
            if (!err) {
                const hasliked = !!likes.length;
                if (hasliked) {
                    return res.status(400).json({
                        error: "already followed"
                    })
                } else {
                    User.like(like_uid, _id, async (err) => {
                        if (err) {
                            return res.status(500).json({
                                error: err
                            })
                        } else {
                            const likeCount = await User.findById(like_uid).select("likes").exec();
                            console.log("likeCount: ", likeCount)
                            return res.status(200).json({
                                success: true,
                                result: likeCount
                            })
                        }
                    });
                }
            }
        });
    } catch (error) {
        return res.json({ error: error.message });
    }
});

export default app;
