import PropTypes from "prop-types";
import TopSeller from "@components/top-seller/layout-01";
import { IDType, ImageType } from "@utils/types";
import { useState } from "react";

const DetailsTabContent = ({ owner, properties, description }) => {
    const [desc, SetDescription] = useState(false);
    return (
        <div className="rn-pd-bd-wrapper mt--20">
            <TopSeller
                name={`${owner?.firstname} ${owner?.lastname}`}
                // total_sale={owner.total_sale}
                slug={owner?._id}
                image={{ src: `/images/avatars/${owner?.avatar}`, width: 44, height: 44 }}
            />
            {properties && (
                <div className="rn-pd-sm-property-wrapper">
                    <h6 className="pd-property-title">Property</h6>
                    <div className="property-wrapper">
                        {properties.map((property) => (
                            <div key={property.type} className="pd-property-inner">
                                <span className="color-body type">
                                    {property.type}
                                </span>
                                <span className="color-white value">
                                    {property.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div className="rn-pd-sm-property-wrapper">
                <h6 className="pd-property-title">Description</h6>
                <div className="catagory-wrapper">
                    <p className={(!desc ? "description text-illapse-2" : "description")}>{description}</p>
                </div>
                <p className="detail-button" onClick={() => {
                    SetDescription(!desc);
                }}>{(!desc) ? "detail" : "less"}</p>
                <div className="clearfix"></div>
            </div>
        </div>
    )
}


DetailsTabContent.propTypes = {
    owner: PropTypes.shape({
        name: PropTypes.string,
        total_sale: PropTypes.number,
        slug: PropTypes.string,
        image: ImageType,
    }),
    properties: PropTypes.arrayOf(
        PropTypes.shape({
            id: IDType,
            type: PropTypes.string,
            // value: PropTypes.string,
        })
    ),
    description: PropTypes.string.isRequired
};

export default DetailsTabContent;
