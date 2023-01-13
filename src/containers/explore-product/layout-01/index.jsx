import { useReducer, useRef, useEffect, useCallback, useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import SectionTitle from "@components/section-title/layout-02";
import Product from "@components/product/layout-01";
// import dynamic from 'next/dynamic';
// const Product = dynamic(() => import("@components/product/layout-01"), {
//     ssr: false
// });
import ProductFilter from "@components/product-filter/layout-01";
import FilterButton from "@ui/filter-button";
import { slideToggle } from "@utils/methods";
import { SectionTitleType, ProductType } from "@utils/types";
import { useSelector, useDispatch } from "react-redux";
import { GetProductListAction } from "../../../redux/actions/productAction"
import sal from "sal.js";


function reducer(state, action) {
    switch (action.type) {
        case "FILTER_TOGGLE":
            return { ...state, filterToggle: !state.filterToggle };
        case "SET_INPUTS":
            return { ...state, inputs: { ...state.inputs, ...action.payload } };
        case "SET_PRODUCTS":
            return { ...state, products: action.payload };
        default:
            return state;
    }
}

const ExploreProductArea = ({ className, space, section_title }) => {
    // const itemsToFilter = [...data.products];
    const productList = useSelector((state) => state.product.productList);
    const [likeSort, SetLikeSort] = useState(0);
    const [salType, SetSalType] = useState("all");
    const [priceRange, SetPriceRange] = useState([0, 1000]);
    const globalDispatch = useDispatch();

    useEffect(() => {
        globalDispatch(GetProductListAction({}));
    }, []);

    useEffect(() => {
        if (productList && productList.length > 0) {
            dispatch({ type: "SET_PRODUCTS", payload: productList });
        } else {
            dispatch({ type: "SET_PRODUCTS", payload: [] });
        }
    }, [productList]);

    useEffect(() => {
        sal();
    })

    const [state, dispatch] = useReducer(reducer, {
        filterToggle: false,
        products: productList ? productList : [],
        inputs: { price: [0, 1000] },
    });

    const filterRef = useRef(null);

    const filterHandler = () => {
        dispatch({ type: "FILTER_TOGGLE" });
        if (!filterRef.current) return;
        slideToggle(filterRef.current);
    };

    const slectHandler = ({ value }, name) => {
        console.log("state.inputs:", state.inputs);
        SetSalType(value);
        dispatch({ type: "SET_INPUTS", payload: { [name]: value } });
        if (value == "all") {
            globalDispatch(GetProductListAction());
        } else {
            const payload = {
                type: value,
                minPrice: priceRange[0],
                maxPrice: priceRange[1],
                likeSort: likeSort
            };
            globalDispatch(GetProductListAction(payload));
        }
    };

    const priceHandler = (value) => {
        dispatch({ type: "SET_INPUTS", payload: { price: value } });
        const payload = {
            minPrice: value[0],
            maxPrice: value[1],
            likeSort: likeSort,
            type: salType
        };
        SetPriceRange(value);

        globalDispatch(GetProductListAction(payload));
    };

    const sortHandler = ({ value }) => {
        console.log(value)
        const payload = {
            likeSort: value,
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
            type: salType
        }
        SetLikeSort(value);
        globalDispatch(GetProductListAction(payload));

    };

    return (
        <div
            className={clsx(
                "rn-product-area",
                space === 1 && "rn-section-gapTop",
                className
            )}
        >
            <div className="container">
                <div className="row mb--50 align-items-center">
                    <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                        {section_title && (
                            <SectionTitle
                                className="mb--0"
                                {...section_title}
                            />
                        )}
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-6 col-12 mt_mobile--15">
                        <FilterButton
                            open={state.filterToggle}
                            onClick={filterHandler}
                        />
                    </div>
                </div>

                <ProductFilter
                    ref={filterRef}
                    slectHandler={slectHandler}
                    sortHandler={sortHandler}
                    priceHandler={priceHandler}
                    inputs={state.inputs}
                />
                <div className="row g-5">
                    {state.products.length > 0 ? (
                        <>
                            {state.products.slice(0, 10).map((prod) => (
                                <div
                                    key={prod._id}
                                    className="col-5 col-lg-4 col-md-6 col-sm-6 col-12"
                                    data-sal="slide-up"
                                    data-sal-delay="150"
                                    data-sal-duration="800"
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
                                        nft_id={prod.nftAs[0]?._id}
                                        nft_user_id={prod.userAs[0]?._id}
                                        buttongroupHdn={false}
                                    />
                                </div>
                            ))}
                        </>
                    ) : (
                        <p>No item to show</p>
                    )}
                </div>
            </div>
        </div>
    );
};

ExploreProductArea.propTypes = {
    className: PropTypes.string,
    space: PropTypes.oneOf([1, 2]),
    section_title: SectionTitleType,
};

ExploreProductArea.defaultProps = {
    space: 1,
};

export default ExploreProductArea;
