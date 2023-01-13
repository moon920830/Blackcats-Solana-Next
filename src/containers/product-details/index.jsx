import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import Image from "next/image";
import Sticky from "@ui/sticky";
import Button from "@ui/button";
import Anchor from "@ui/anchor";
import ProductTitle from "@components/product-details/title";
import ProductCategory from "@components/product-details/category";
// import ProductCollection from "@components/product-details/collection";
import BidTab from "@components/product-details/bid-tab";
import { useSelector } from "react-redux";
// import PlaceBet from "@components/product-details/place-bet";
import { ImageType } from "@utils/types";
import DetailsTabContent from "../../components/product-details/bid-tab/details-tab-content";
import { useRouter } from "next/router";
import ConfirmModal from "@components/modals/confirm-modal";

// Demo Image

const ProductDetailsArea = ({ space, className, product }) => {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const productData = product?.nftAs[0];
    const userData = product?.userAs[0];
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const u_id = useSelector((state) => state.auth.u_id);
    const router = useRouter();
    // const [productData, SetProductData] = useState([]);
    // const productList = useSelector((state) => state.product.productList);

    const handleConfirmModal = () => {
        // send the data to mint page //  
        console.log('handleConfirmModal')
        setShowConfirmModal(false);

        router.push({
            pathname: `/sell/${productData._id}`,
        });
    };

    const handleCancelModal = () => {
        setShowConfirmModal(false);
    };

    const onSellHandler = (e) => {
        e.preventDefault();
        console.log('onSellHandler');

        // show the confirm dialog //
        setShowConfirmModal(true);
    }

    const onBuyHandler = (e) => {
        e.preventDefault();
        console.log('onBuyHandler');
    }

    const onBigHandler = (e) => {
        e.preventDefault();
        console.log('onBigHandler');
    }

    const buttonRendered = () => {
        if (isAuthenticated) {
            console.log("isAuthenticated: ", isAuthenticated);
            console.log("u_id: ", u_id);
            console.log("userData: ", userData?._id);
            console.log("productData: ", product?.type);
            if (u_id == userData?._id) {
                if (product?.type == 0) {
                    console.log("minted Sell, auction");
                    return (<div className="text-center ">
                        <Button path="#" className="mr--15" onClick={onSellHandler}>
                            Sell
                        </Button>
                        {/* <Button color="primary-alta" path="#">
                            Auction
                        </Button> */}
                    </div>);
                }
            } else {
                if (product?.type == 1) {
                    console.log("Sell Buy");
                    return (<div className="text-center"><Button path="#" onClick={onBuyHandler} className="mr--15">
                        Buy
                    </Button></div>);
                } else if (product?.type == 2) {
                    console.log("auction Bid");
                    return (<div className="text-center"><Button path="#" onClick={onBigHandler} className="mr--15">
                        Bid
                    </Button></div>);
                }
            }
        }
        console.log("nothing");
        return <></>;
    }

    return (
        <div
            className={clsx(
                "product-details-area",
                space === 1 && "rn-section-gapTop",
                className
            )}
        >
            <div className="container">
                <div className="row g-5">
                    <div className="col-lg-7 col-md-12 col-sm-12">
                        <Sticky>
                            <div className="d-flex">
                                <div className="rn-pd-thumbnail-image-box">
                                    <Image
                                        src={productData?.imageUrl}
                                        alt={productData?.imageName || "Product"}
                                        width={560}
                                        height={560}
                                    />
                                </div>
                            </div>
                        </Sticky>
                    </div>
                    <div className="col-lg-5 col-md-12 col-sm-12 mt_md--50 mt_sm--60">
                        <div className="rn-pd-content-area">
                            <ProductTitle
                                title={productData?.name}
                                likeCount={productData?.likes}
                            />
                            {/* <span className="bid">
                                Price:{" "}
                                <span className="price">
                                    {productData?.price}
                                    {"sol"}
                                </span>
                            </span> */}
                            {/* <h6 className="title-name">{`#${productData?.symbol}`}</h6> */}
                            {/* <div className="catagory-collection">
                                {
                                    (userData) ? <ProductCategory owner={userData} /> : null
                                }
                            </div> */}

                            <div className="rn-bid-details">
                                {/* <BidTab
                                    bids={productData?.bids}
                                    owner={userData}
                                    properties={productData}
                                    tags={productData?.tags}
                                    history={productData?.history}
                                /> */}
                                <DetailsTabContent
                                    owner={userData}
                                    properties={[{
                                        "type": "NFT NAME",
                                        "value": productData?.name,
                                    },
                                    {
                                        "type": "PRICE",
                                        "value": productData?.price,
                                    },
                                    {
                                        "type": "SYMBOL",
                                        "value": productData?.symbol,
                                    },
                                    {
                                        "type": "LENGTH",
                                        "value": productData?.length,
                                    },
                                    {
                                        "type": "PROPERTIES",
                                        "value": productData?.property,
                                    },
                                    {
                                        "type": "ROYALITY",
                                        "value": productData?.royality,
                                    },
                                    ]}
                                    description={productData?.description}
                                />
                                {/* <PlaceBet
                                    highest_bid={product.highest_bid}
                                    auction_date={product?.auction_date}
                                /> */}
                            </div>
                            {buttonRendered()}

                        </div>
                    </div>
                    {showConfirmModal && (
                        <ConfirmModal
                            show={showConfirmModal}
                            OkHandleModal={handleConfirmModal}
                            CancelHandleModal={handleCancelModal}
                            title="Confirm"
                            content={`<p>Do you want to continue to sell your NFT ?`}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

ProductDetailsArea.propTypes = {
    space: PropTypes.oneOf([1, 2]),
    className: PropTypes.string,
    // product: PropTypes.shape({
    //     name: PropTypes.string.isRequired,
    //     likes: PropTypes.number,
    //     price: PropTypes.shape({
    //         amount: PropTypes.number.isRequired,
    //         currency: PropTypes.string.isRequired,
    //     }).isRequired,
    //     owner: PropTypes.shape({}),
    //     collection: PropTypes.shape({}),
    //     bids: PropTypes.arrayOf(PropTypes.shape({})),
    //     properties: PropTypes.arrayOf(PropTypes.shape({})),
    //     tags: PropTypes.arrayOf(PropTypes.shape({})),
    //     history: PropTypes.arrayOf(PropTypes.shape({})),
    //     highest_bid: PropTypes.shape({}),
    //     auction_date: PropTypes.string,
    //     images: PropTypes.arrayOf(ImageType),
    // }),
};

ProductDetailsArea.defaultProps = {
    space: 1,
};

export default ProductDetailsArea;
