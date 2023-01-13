/* eslint-disable indent */
// import/no-unresolved
import nextConnect from "next-connect";
import mongoose from "mongoose";
import { NFT } from "../../../../models/nft";
import middleware from "../../../../middlewares";
import auth from "../../../../middlewares/auth";

/**
 * @url /api/nft/likes
 * @description like the nft
 * @param nft_id //nft id
 * @param nft_user_id //nft user id
// eslint-disable-next-line consistent-return
 */

const app = nextConnect();
app.use(middleware);
app.use(auth);

// eslint-disable-next-line consistent-return
app.post(async (req, res) => {
    try {
        const { _id } = req.user;
        console.log("user id ", _id)
        const { nft_id, nft_user_id } = req.body;
        if (_id == nft_user_id) return res.status(400).json({
            error: "You can't follow yourself nft."
        })
        NFT.findLikes(nft_user_id, {
            _id: nft_id
        }, function (err, likes) {
            if (!err) {
                const hasliked = !!likes.length;
                if (hasliked) {
                    return res.status(400).json({
                        error: "already followed"
                    })
                } else {
                    NFT.like(nft_id, nft_user_id, async (err) => {
                        if (err) {
                            return res.status(500).json({
                                error: err
                            })
                        } else {
                            const likeCount = await NFT.findById(nft_id).select("likes").exec();
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
