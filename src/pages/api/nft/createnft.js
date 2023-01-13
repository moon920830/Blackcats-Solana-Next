/* eslint-disable indent */
// import/no-unresolved
import nextConnect from "next-connect";
import mongoose from "mongoose";
import { NFT } from "../../../../models/nft";
import { Transaction } from "../../../../models/transaction";
import middleware from "../../../../middlewares";
import auth from "../../../../middlewares/auth";

/**
 * @url /api/nft/createnft
 * @description Regarding to minted NFT Data, store data.
 * @param account //nft address
 * @param creator //wallet address
 * @param description //nft description
 * @param feeSol //whenever transaction fee Sol
 * @param feeUSD //whenever transaction fee USD
 * @param image //cover image url and image name
 * @param length //total music run length 
 * @param music //NFT music file url run name 
 * @param name //NFT name 
 * @param price //NFT price 
 * @param property //NFT property 
 * @param royality //NFT royality 
 * @param symbol //NFT symbol 
 * @param transactionId //solscan transaction id 
 * @param u_id //create By user id 
 */
// eslint-disable-next-line consistent-return

const app = nextConnect();
app.use(middleware);
app.use(auth);

// eslint-disable-next-line consistent-return
app.post(async (req, res) => {
    console.log("user: ", req.user);
    try {
        const u_id = req.user ? req.user._id : null;
        if (!u_id) {
            res.status(501).json({
                message: "Invalid user"
            })
        }
        const {
            account,
            creator,
            description,
            feeSol,
            feeUSD,
            image,
            length,
            music,
            name,
            price,
            property,
            royality,
            symbol,
            transactionId
        } = req.body;

        const transaction_id = new mongoose.Types.ObjectId();

        const isExistedNFTAddress = await NFT.findOne({ account });
        if (isExistedNFTAddress) {
            return res.json({
                error: "exist NFT address",
            });
        }

        const nft = new NFT({
            name,
            description,
            price,
            account,
            imageUrl: image.url,
            imageName: image.name,
            musicUrl: music.url,
            musicName: music.name,
            property,
            length,
            royality,
            symbol,
            transactions: [transaction_id]
        });

        await nft.save();
        const nftID = nft._id;

        const transaction = new Transaction({
            _id: transaction_id,
            createByUser: new mongoose.Types.ObjectId(u_id),
            creator,
            nftID: new mongoose.Types.ObjectId(nftID),
            feeSol,
            feeUSD,
            transactionId
        });
        await transaction.save();
        return res.status(200).json({
            success: true,
        });

    } catch (error) {
        return res.json({ error: error.message });
    }
});

export default app;
