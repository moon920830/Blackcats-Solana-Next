import axios from "axios";
import PropTypes from "prop-types";
import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header/header-01";
import Footer from "@layout/footer/footer-01";
import Breadcrumb from "@components/breadcrumb";
import ProductDetailsArea from "@containers/product-details";
import { GetProductListAction } from "../../redux/actions/productAction"
import ProductArea from "@containers/product/layout-03";
import { shuffleArray } from "@utils/methods";
// demo data
import productData from "../../data/products.json";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";


const ProductDetails = ({ p_id, className }) => {
    const dispatch = useDispatch();
    const [productData, SetProductData] = useState([]);
    const productList = useSelector((state) => state.product.productList);

    useEffect(() => {
        const payload = {
            p_id
        }
        dispatch(GetProductListAction(payload));
    }, []);

    useEffect(() => {
        if (productList && productList.length > 0) {
            SetProductData(productList);
        }
    }, [productList]);


    return (
        <Wrapper>
            <SEO pageTitle="Product Details" />
            <Header />
            <main id="main-content">
                <Breadcrumb
                    pageTitle="Product Details"
                    currentPage="Product Details"
                />
                {(productData && productData.length > 0) ? <ProductDetailsArea product={productData[0]} /> : null}
                {/* <ProductArea
                data={{
                    section_title: { title: "Recent View" },
                    products: recentViewProducts,
                }}
                />
                <ProductArea
                    data={{
                        section_title: { title: "Related Item" },
                        products: relatedProducts,
                    }}
                /> */}
            </main>
            <Footer />
        </Wrapper>
    )
};

export async function getStaticPaths() {
    return {
        paths: [],
        fallback: "blocking",
    };
}

export async function getStaticProps({ params }) {
    return {
        props: {
            className: "template-color-1",
            p_id: params.p_id
        }, // will be passed to the page component as props
    };
}

ProductDetails.propTypes = {
    // product: PropTypes.shape({}),
    // recentViewProducts: PropTypes.arrayOf(PropTypes.shape({})),
    // relatedProducts: PropTypes.arrayOf(PropTypes.shape({})),
};

export default ProductDetails;
