import PropTypes from "prop-types";
import Image from "next/image";
import Button from "@ui/button";
import { HeadingType, TextType, ButtonType, ImageType } from "@utils/types";
import { useEffect } from "react";
import sal from "sal.js";
import { useClickAuthPage } from "@hooks";

const HeroArea = ({ data }) => {
    const { userAuthData, onClickAuthHandler } = useClickAuthPage();
    const onClickHandler = (e, path, auth, type) => {
        e.preventDefault();
        console.log('onClickHandler.path.auth.type', path, auth, type);
        onClickAuthHandler(auth, type, path)
    }
    useEffect(() => {
        sal();
    }, []);

    return (
        <div className="slider-one rn-section-gapTop">
            <div className="container">
                <div className="row row-reverce-sm align-items-center">
                    <div className="col-lg-5 col-md-6 col-sm-12 mt_sm--50">
                        {data?.headings[0]?.content && (
                            <h2
                                className="title"
                                data-sal-delay="200"
                                data-sal="slide-up"
                                data-sal-duration="800"
                            >
                                {data.headings[0].content}
                            </h2>
                        )}
                        {data?.texts?.map((text) => (
                            <p
                                className="slide-disc"
                                data-sal-delay="300"
                                data-sal="slide-up"
                                data-sal-duration="800"
                                key={text.id}
                            >
                                {text.content}
                            </p>
                        ))}
                        {data?.buttons && (
                            <div className="button-group">
                                {data.buttons.map(({ content, id, auth, type, path, ...btn }, i) => (
                                    <Button
                                        {...btn}
                                        data-sal-delay={400 + i * 100}
                                        data-sal="slide-up"
                                        data-sal-duration="800"
                                        key={id}
                                        onClick={(e) => onClickHandler(e, path, auth, type)}
                                    >
                                        {content}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="col-lg-5 col-md-6 col-sm-12 offset-lg-1">
                        {data?.images?.[0]?.src && (
                            <div className="slider-thumbnail">
                                <Image
                                    src={data.images[0].src}
                                    alt={data.images[0]?.alt || "Slider Images"}
                                    width={585}
                                    height={593}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}


HeroArea.propTypes = {
    data: PropTypes.shape({
        headings: PropTypes.arrayOf(HeadingType),
        texts: PropTypes.arrayOf(TextType),
        buttons: PropTypes.arrayOf(ButtonType),
        images: PropTypes.arrayOf(ImageType),
        buttons: PropTypes.array
    }),
};

export default HeroArea;
