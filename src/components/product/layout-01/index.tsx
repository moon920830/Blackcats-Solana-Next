import { useState } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import clsx from "clsx";
import Anchor from "@ui/anchor";
import CountdownTimer from "@ui/countdown/layout-01";
import ClientAvatar from "@ui/client-avatar";
import { Store } from "react-notifications-component";
import ShareDropdown from "@components/share-dropdown";
import ProductBid from "@components/product-bid";
import Button from "@ui/button";
import { ImageType } from "@utils/types";
import PlaceBidModal from "@components/modals/placebid-modal";
import axios from "axios";
import { useRouter } from "next/router";

const Product = ({
    overlay,
    name,
    // description,
    symbol,
    slug,
    // latestBid,
    price,
    length,
    royality,
    likeCount,
    dislikeCount,
    nft_id,
    nft_user_id,
    // auction_date,
    image,
    bitCount,
    authors,
    placeBid,
    buttongroupHdn
}) => {
    const [showBidModal, setShowBidModal] = useState(false);
    const [isShownPlayIcon, setIsShownPlayIcon] = useState(true);
    const [likes, SetLikes] = useState(likeCount);
    const router = useRouter();
    const sellButtonHandler = async (slug) => {
        router.push({
            pathname: `/sell/${slug}`
        })
    }

    const likeHandler = async (nft_id, nft_user_id) => {
        const payload = {
            nft_id,
            nft_user_id
        }
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        try {
            const response = await axios.post("/api/nft/likes", payload, config);
            const result = response.data.result.likes;
            console.log("result: ", result);
            SetLikes(parseInt(result));

        } catch (error: any) {
            Store.addNotification({
                title: "Notification",
                message: error?.response?.data?.msg ? error.response.data.msg : error?.response?.data?.error,
                type: "danger",
                insert: "top",
                container: "top-right",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                    duration: 2000,
                },
                dismissable: { click: true }
            } as any);
        }

    }

    return (
        <>
            <div
                className={clsx(
                    "product-style-one",
                    !overlay && "no-overlay",
                    placeBid > 0 && "with-placeBid"
                )}
            >
                <div className="card-thumbnail">
                    {image?.src && (
                        <Anchor path={`/product/${slug}`}
                            className={undefined}
                            rel={undefined}
                            label={undefined}
                            target={undefined}
                            onClick={undefined}>
                            <Image
                                src={image.src}
                                alt={image?.alt || "NFT_portfolio"}
                                width={533}
                                height={533}
                            />
                        </Anchor>
                    )}
                    {isShownPlayIcon && (
                        <div className="card-playicon">
                            <Image
                                src="/images/icons/play-dark-outline.svg"
                                alt="card-playicon"
                                width={80}
                                height={80}
                            />
                        </div>
                    )}
                </div>
                <Anchor
                    path={`/product/${slug}`}
                    className={undefined}
                    rel={undefined}
                    label={undefined}
                    target={undefined}
                    onClick={undefined}>
                    <span className="product-name">{name}</span>
                </Anchor>
                {/* <p className="product-description">{description}</p> */}
                <div className="sol-price-box">
                    <p className="sol-price-label">SOL PRICE</p>
                    <p className="sol-price">{price.amount}(sol)</p>
                </div>
                <div className="symbol-box">
                    <p className="symbol-label">SYMBOL</p>
                    <p className="symbol-value">{symbol}</p>
                </div>
                <div className="music-length-box">
                    <p className="music-length-label">LENGTH</p>
                    <p className="music-length-value">{length}(s)</p>
                </div>
                <div className="royality-box">
                    <p className="royality-label">ROYALITY</p>
                    <p className="royality-value">{royality}(%)</p>
                </div>

                <div className="like-box">
                    <div className="like" onClick={(e) => {
                        likeHandler(nft_id, nft_user_id);
                    }}>
                        <span className="like-icon">
                            <svg
                                viewBox="0 0 17 16"
                                fill="none"
                                width="16"
                                height="16"
                                className="sc-bdnxRM sc-hKFxyN kBvkOu"
                            >
                                <path
                                    d="M8.2112 14L12.1056 9.69231L14.1853 7.39185C15.2497 6.21455 15.3683 4.46116 14.4723 3.15121V3.15121C13.3207 1.46757 10.9637 1.15351 9.41139 2.47685L8.2112 3.5L6.95566 2.42966C5.40738 1.10976 3.06841 1.3603 1.83482 2.97819V2.97819C0.777858 4.36443 0.885104 6.31329 2.08779 7.57518L8.2112 14Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                />
                            </svg>
                        </span>
                        <span className="count">{likes}</span>
                    </div>
                    {/* <div className="dislike" onClick={disLikeHandler}>
                        <span className="dislike-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-thumbs-down"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path></svg>
                        </span>
                        <span className="count">{dislikeCount}</span>
                    </div> */}
                </div>
                {(buttongroupHdn) ? <div className="row product-action-button-group mt-2">
                    <div className="col-md-6">
                        <Button
                            className="btn-block p-0"
                            onClick={(e) => sellButtonHandler(slug)}
                            type={undefined}
                            label={undefined}
                            path={undefined}
                            size={undefined}
                            color={undefined}
                            shape={undefined}
                            fullwidth={undefined}>
                            Sell
                        </Button>
                    </div>
                    <div className="col-md-6">
                        <Button
                            color="primary-alta"
                            className="btn btn-block p-0"
                            type={undefined}
                            label={undefined}
                            onClick={undefined}
                            path={undefined}
                            size={undefined}
                            shape={undefined}
                            fullwidth={undefined}>
                            Auction
                        </Button>
                    </div>
                </div> : <></>}



                {/* <ProductBid price={price} likeCount={likeCount} /> */}
            </div>
        </>
    );
};

Product.propTypes = {
    overlay: PropTypes.bool,
    name: PropTypes.string.isRequired,
    // description: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    length: PropTypes.number.isRequired,
    royality: PropTypes.number.isRequired,
    // latestBid: PropTypes.string.isRequired,
    price: PropTypes.shape({
        amount: PropTypes.number.isRequired,
        currency: PropTypes.string.isRequired,
    }).isRequired,
    likeCount: PropTypes.number.isRequired,
    dislikeCount: PropTypes.number.isRequired,
    // auction_date: PropTypes.string,
    image: ImageType.isRequired,
    // authors: PropTypes.arrayOf(
    //     PropTypes.shape({
    //         name: PropTypes.string.isRequired,
    //         slug: PropTypes.string.isRequired,
    //         image: ImageType.isRequired,
    //     })
    // ),
    bitCount: PropTypes.number,
    placeBid: PropTypes.number,
    disableShareDropdown: PropTypes.bool,
    buttongroupHdn: PropTypes.bool
};

Product.defaultProps = {
    overlay: false,
};

export default Product;
