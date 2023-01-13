import { forwardRef } from "react";
import PropTypes from "prop-types";
import NiceSelect from "@ui/nice-select";
import InputRange from "@ui/input-range";

const ProductFilter = forwardRef(
    ({ slectHandler, sortHandler, priceHandler, inputs }, ref) => (
        <div className="default-exp-wrapper default-exp-expand" ref={ref}>
            <div className="inner">
                <div className="filter-select-option like-option">
                    <h6 className="filter-leble">LIKES</h6>
                    <NiceSelect
                        options={[
                            { value: 1, text: "Most liked" },
                            { value: -1, text: "Least liked" },
                        ]}
                        placeholder="Sort by likes"
                        onChange={sortHandler}
                        name="like"
                    />
                </div>
                {/* <div className="filter-select-option">
                    <h6 className="filter-leble">Category</h6>
                    <NiceSelect
                        options={[
                            { value: "all", text: "All Category" },
                            { value: "art", text: "Art" },
                            { value: "music", text: "Music" },
                            { value: "video", text: "Video" },
                            { value: "Collectionable", text: "Collectionable" },
                        ]}
                        placeholder="Category"
                        onChange={slectHandler}
                        name="category"
                    />
                </div> */}
                {/* <div className="filter-select-option">
                    <h6 className="filter-leble">Collections</h6>
                    <NiceSelect
                        options={[
                            { value: "all", text: "All Collection" },
                            { value: "Art Decco", text: "Art Decco" },
                            {
                                value: "BoredApeYachtClub",
                                text: "BoredApeYachtClub",
                            },
                            {
                                value: "MutantApeYachtClub",
                                text: "MutantApeYachtClub",
                            },
                            {
                                value: "Art Blocks Factory",
                                text: "Art Blocks Factory",
                            },
                        ]}
                        placeholder="Collections"
                        onChange={slectHandler}
                        name="collection"
                    />
                </div> */}

                <div className="filter-select-option sale-type-option">
                    <h6 className="filter-leble">Sale type</h6>
                    <NiceSelect
                        options={[
                            { value: "all", text: "All Type" },
                            { value: 0, text: "Minted" },
                            { value: 1, text: "Sell" },
                            { value: 2, text: "Auction" },

                        ]}
                        placeholder="Sale type"
                        onChange={slectHandler}
                        name="sale_type"
                    />
                </div>
                <div className="filter-select-option price-filter">
                    <h6 className="filter-leble">Price Range</h6>
                    <div className="price_filter s-filter clear">
                        <form action="#" method="GET">
                            <InputRange
                                values={inputs.price}
                                onChange={priceHandler}
                            />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
);

ProductFilter.displayName = "ProductFilter";

ProductFilter.propTypes = {
    slectHandler: PropTypes.func,
    sortHandler: PropTypes.func,
    priceHandler: PropTypes.func,
    inputs: PropTypes.shape({
        price: PropTypes.arrayOf(PropTypes.number),
    }),
};

export default ProductFilter;
