import PropTypes from "prop-types";
import clsx from "clsx";
import { useSelector, useDispatch } from "react-redux";
import Product from "@components/product/layout-01";
// import dynamic from 'next/dynamic';
// const Product = dynamic(() => import("@components/product/layout-01"), {
//     ssr: false
// });
import SectionTitle from "@components/section-title/layout-02";
import Anchor from "@ui/anchor";
import { SectionTitleType } from "@utils/types";
import { useState, useEffect } from "react";
import axios from "axios";
import sal from "sal.js";

const ProductArea = ({ space, className, section_title }) => {
    // const productList = useSelector((state) => state.product.productList);
    const [productData, SetProductData] = useState([]);

    const GetProductListAction = async () => {
        try {

            const response = await axios.get("/api/nft/getnftlist", {
                params: {
                    limit: 5,
                    creatAt: 1
                }
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = response.data.result;
            console.log("result: ", data);
            SetProductData(data);
            sal();
        } catch (error) {
            console.log(error);
        }



    }

    useEffect(() => {
        GetProductListAction();
    }, []);

    return <div
        className={clsx(
            "rn-new-items",
            space === 1 && "rn-section-gapTop",
            className
        )}
    >
        <div className="container">
            <div className="row mb--50 align-items-center">
                {section_title && (
                    <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                        <SectionTitle
                            {...section_title}
                            className="mb-0"
                        />
                    </div>
                )}

                <div className="col-lg-6 col-md-6 col-sm-6 col-12 mt_mobile--15">
                    <div
                        className="view-more-btn text-start text-sm-end"
                        data-sal-delay="150"
                        data-sal="slide-up"
                        data-sal-duration="800"
                    >
                        <Anchor className="btn-transparent" path="/product">
                            VIEW ALL
                            <i className="feather feather-arrow-right" />
                        </Anchor>
                    </div>
                </div>
            </div>
            {productData && (
                <div className="row g-5">
                    {productData.map((prod, index) => {
                        console.log("prod: ", prod)
                        return (index <= 4) ? <div
                            key={index}
                            data-sal="slide-up"
                            data-sal-delay="150"
                            data-sal-duration="800"
                            className="col-5 col-lg-4 col-md-6 col-sm-6 col-12"
                        >
                            <Product
                                name={prod.nftAs[0].name}
                                slug={prod.nftAs[0]._id}
                                description={prod.nftAs[0].description}
                                symbol={prod.nftAs[0].symbol}
                                length={prod.nftAs[0].length}
                                royality={prod.nftAs[0].royality}
                                price={{
                                    amount: prod.nftAs[0].price,
                                    currency: " sol",
                                }}
                                likeCount={prod.nftAs[0].likes ? prod.nftAs[0].likes : 0}
                                dislikeCount={prod.nftAs[0].dislikes}
                                image={{
                                    src: prod.nftAs[0].imageUrl,
                                    alt: prod.nftAs[0].imageName,
                                }}
                                nft_id={prod.nftAs[0]?._id}
                                nft_user_id={prod.userAs[0]?._id}
                            // disLikeHandler={disLikeHandler}
                            />
                        </div> : null
                    }

                    )}
                </div>
            )}
        </div>
    </div>
}

ProductArea.propTypes = {
    space: PropTypes.oneOf([1, 2]),
    className: PropTypes.string,
    section_title: SectionTitleType,
};

ProductArea.defaultProps = {
    space: 1,
};

export default ProductArea;
