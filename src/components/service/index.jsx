import Anchor from "@ui/anchor";
import PropTypes from "prop-types";
import { ImageType } from "@utils/types";
import { useSelector } from "react-redux";
import { useClickAuthPage } from "@hooks";

const Service = ({ title, subtitle, path, description, image, auth, type }) => {
    const { userAuthData, onClickAuthHandler } = useClickAuthPage();
    const buttonClickHandler = (e, path) => {
        e.preventDefault();
        console.log('onClickHandler.path.auth.type.userAuthData', path, auth, type, userAuthData);

        onClickAuthHandler(auth, type, path)
    }

    return (
        <div
            data-sal="slide-up"
            data-sal-delay="150"
            data-sal-duration="800"
            className="rn-service-one color-shape-7"
        >
            <div className="inner">
                <div className="icon">
                    {image?.src && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={image.src} alt={image?.alt || title} />
                    )}
                </div>
                <div className="subtitle">{subtitle}</div>
                <div className="content">
                    <h4 className="title">
                        <Anchor path="#!" onClick={(e) => { buttonClickHandler(e, path) }}>{title}</Anchor>
                    </h4>
                    <p className="description">{description}</p>
                    <Anchor className="read-more-button" path={path}>
                        <i className="feather-book" />
                    </Anchor>
                </div>
            </div>
            <Anchor className="over-link" path="#!" onClick={(e) => { buttonClickHandler(e, path) }}>
                <span className="visually-hidden">Click here to read more</span>
            </Anchor>
        </div>
    );
}

Service.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: ImageType,
};

export default Service;
