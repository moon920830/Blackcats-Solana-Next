/* eslint-disable indent */
// import/no-unresolved
import nextConnect from "next-connect";
import mongoose from "mongoose";
import { Transaction } from "../../../../models/transaction";
import middleware from "../../../../middlewares";
// import auth from "../../../../middlewares/auth";
/**
 * @url /api/nft/getnftlist
 * @method GET
 * @description to get nft list
 * @param u_id user id
 * @param  minPrice
 * @param  maxPrice
 * @param  likeSort
 * @param  type
 */
// eslint-disable-next-line consistent-return

const app = nextConnect();
app.use(middleware);

// eslint-disable-next-line consistent-return
app.get(async (req, res) => {
    try {
        const { u_id, minPrice, maxPrice, likeSort, type, p_id } = req.query;
        let query = [
            {
                "$lookup": {
                    "from": "nfts",
                    "localField": "nftID",
                    "foreignField": "_id",
                    "as": "nftAs"
                },
            },
            {
                "$project": {
                    "nftAs": 1,
                    "type": 1,
                    "createByUser": 1,
                    "createdAt": 1
                }
            },
            {
                "$sort": {
                    "createdAt": 1
                }
            }
        ];

        if (u_id) {
            query.push({
                $match: {
                    "createByUser": mongoose.Types.ObjectId(u_id)
                }
            })
        }

        if (p_id) {
            query.push({
                $match: {
                    "nftAs._id": mongoose.Types.ObjectId(p_id)
                }
            })
        }


        if (parseInt(type) >= 0 && parseInt(type) < 3) {
            query.push({
                $match: {
                    "type": parseInt(type)
                }
            })
        }

        if (parseInt(likeSort) == -1 || parseInt(likeSort) == 1) {
            query.push({
                $sort: {
                    "nftAs.likes": parseInt(likeSort),
                }
            })
        }

        if (parseInt(minPrice) >= 0 && parseInt(maxPrice) >= 0) {
            query.push({
                $match: {
                    "nftAs.price": {
                        "$gte": parseInt(minPrice),
                        "$lte": parseInt(maxPrice),
                    }
                }

            });
        }

        query.push({
            "$lookup": {
                "from": "users",
                "localField": "createByUser",
                "foreignField": "_id",
                "as": "userAs"
            },
        })

        const result = await Transaction.aggregate(query).exec();
        if (result) {
            return res.status(200).json({
                success: true,
                result
            })
        }


    } catch (error) {
        return res.json({ error });
    }
});

export default app;
