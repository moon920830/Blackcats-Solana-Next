import { useRouter } from "next/router";
import PropTypes from "prop-types";
import clsx from "clsx";
import TabContent from "react-bootstrap/TabContent";
import TabContainer from "react-bootstrap/TabContainer";
import TabPane from "react-bootstrap/TabPane";
import Nav from "react-bootstrap/Nav";
import Product from "@components/product/layout-01";
// import dynamic from 'next/dynamic';
// const Product = dynamic(() => import("@components/product/layout-01"), {
//     ssr: false
// });
import { ProductType } from "@utils/types";
import { shuffleArray } from "@utils/methods";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GetProductListAction } from "../../redux/actions/productAction";



const AuthorProfileArea = ({ className, userID }) => {
    // const onSaleProducts = shuffleArray(data.products).slice(0, 10);
    // const ownedProducts = shuffleArray(data.products).slice(0, 10);
    // const createdProducts = shuffleArray(data.products).slice(0, 10);
    // const likedProducts = shuffleArray(data.products).slice(0, 10);
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const productList = useSelector((state) => state.product.productList);
    const selectTabkey = useSelector((state) => state.product.tabKey);
    const [productData, SetProductData] = useState([]);
    const u_id = useSelector((state) => state.auth.u_id);
    const router = useRouter();

    const handleTabSelect = (key) => {
        switch (key) {
            case "nav-home":

                break;
            case "nav-profile":

                break;
            case "nav-contact":

                break;
            case "nav-liked":

                break;

            default:
                break;
        }
    }

    useEffect(() => {

        if (userID) {
            const payload = {
                u_id: userID
            };
            console.log("userID: ", userID);
            if (userID) {
                dispatch(GetProductListAction(payload));
            }
        } else {
            console.log("u_id: ", u_id)
            const payload = {
                u_id: u_id
            };

            if (u_id) {
                dispatch(GetProductListAction(payload));
            }
        }

    }, []);

    useEffect(() => {
        if (productList && productList.length > 0) {
            SetProductData(productList);
        }
    }, [productList]);

    const DisplayProductData = (type) => {
        console.log("productData: ", productData);
        return productData?.map((prod) => {
            if (prod.type == type) {
                return <div
                    key={prod._id}
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
                        likeCount={prod.nftAs[0].likes}
                        dislikeCount={prod.nftAs[0].dislikes}
                        image={{
                            src: prod.nftAs[0].imageUrl,
                            alt: prod.nftAs[0].imageName,
                        }}
                    />
                </div>
            }
        })
    }

    return (
        <div className={clsx("rn-authore-profile-area", className)}>
            <TabContainer defaultActiveKey={selectTabkey}
            //  onSelect={(key) => handleTabSelect(key)}
            >
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="tab-wrapper-one">
                                <nav className="tab-button-one">
                                    <Nav
                                        className="nav nav-tabs"
                                        id="nav-tab"
                                        role="tablist"
                                    >
                                        <Nav.Link
                                            as="button"
                                            eventKey="nav-home"
                                        >
                                            On Sale
                                        </Nav.Link>
                                        <Nav.Link
                                            as="button"
                                            eventKey="nav-profile"
                                        >
                                            Owned
                                        </Nav.Link>
                                        <Nav.Link
                                            as="button"
                                            eventKey="nav-contact"
                                        >
                                            Created
                                        </Nav.Link>
                                        <Nav.Link
                                            as="button"
                                            eventKey="nav-liked"
                                        >
                                            Liked
                                        </Nav.Link>
                                    </Nav>
                                </nav>
                            </div>
                        </div>
                    </div>

                    <TabContent className="tab-content rn-bid-content">
                        <TabPane className="row d-flex g-5" eventKey="nav-home">
                            {/* {onSaleProducts?.map((prod) => (
                                <div
                                    key={prod.id}
                                    className="col-5 col-lg-4 col-md-6 col-sm-6 col-12"
                                >
                                    <Product
                                        overlay
                                        placeBid={1}
                                        title={prod.title}
                                        slug={prod.slug}
                                        latestBid={prod.latestBid}
                                        price={prod.price}
                                        likeCount={prod.likeCount}
                                        auction_date={prod.auction_date}
                                        image={prod.images?.[0]}
                                        authors={prod.authors}
                                        bitCount={prod.bitCount}
                                    />
                                </div>
                            ))} */}
                        </TabPane>
                        <TabPane
                            className="row g-5 d-flex"
                            eventKey="nav-profile"
                        >
                            {DisplayProductData(1)}
                        </TabPane>
                        <TabPane
                            className="row g-5 d-flex"
                            eventKey="nav-contact"
                        >
                            {DisplayProductData(0)}
                        </TabPane>
                        <TabPane
                            className="row g-5 d-flex"
                            eventKey="nav-liked"
                        >
                            {/* {likedProducts?.map((prod) => (
                                <div
                                    key={prod.id}
                                    className="col-5 col-lg-4 col-md-6 col-sm-6 col-12"
                                >
                                    <Product
                                        overlay
                                        placeBid={3}
                                        title={prod.title}
                                        slug={prod.slug}
                                        latestBid={prod.latestBid}
                                        price={prod.price}
                                        likeCount={prod.likeCount}
                                        auction_date={prod.auction_date}
                                        image={prod.images?.[0]}
                                        authors={prod.authors}
                                        bitCount={prod.bitCount}
                                    />
                                </div>
                            ))} */}
                        </TabPane>
                    </TabContent>
                </div>
            </TabContainer>
        </div>
    );
};

AuthorProfileArea.propTypes = {
    className: PropTypes.string,
};
export default AuthorProfileArea;
