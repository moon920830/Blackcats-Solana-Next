import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import Image from "next/image";
import { ImageType } from "@utils/types";
import { Store } from "react-notifications-component";
import ShareDropdown from "@components/share-dropdown";
import ShareModal from "@components/modals/share-modal";
import Anchor from "@ui/anchor";
import axios from "axios";
import { useSelector } from 'react-redux';

const AuthorIntroArea = ({ className, space, data, paramId }) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const u_id = useSelector((state) => state.auth.u_id);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const shareModalHandler = () => setIsShareModalOpen((prev) => !prev);
    const [followers, SetFollowers] = useState(0);
    const FollowClick = async () => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        const payload = {
            like_uid: paramId
        };
        try {
            const response = await axios.post("/api/user/dofollow", payload, config);
            const result = response.data.result.likes;
            console.log("result: ", result);
            SetFollowers(parseInt(result));
        } catch (error) {
            Store.addNotification({
                title: "Notification",
                message: error.response.data.error,
                type: "danger",
                insert: "top",
                container: "top-right",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                    duration: 2000,
                },
                dismissable: { click: true },
            });
        }
    }

    useEffect(() => {
        if (data.followers) {
            SetFollowers(data.followers);
        }
    }, [data.followers]);

    return (
        <>
            <ShareModal
                show={isShareModalOpen}
                handleModal={shareModalHandler}
            />
            <div className="rn-author-bg-area position-relative ptb--200">
                <Image
                    src={"/images/profile/" + data.image.cover}
                    alt="Slider BG"
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                    priority
                />
            </div>
            <div
                className={clsx(
                    "rn-author-area",
                    space === 1 && "mb--30 mt_dec--120",
                    className
                )}
            >
                <div className="container">
                    <div className="row padding-tb-50 align-items-center d-flex">
                        <div className="col-lg-12">
                            <div className="author-wrapper">
                                <div className="author-inner">
                                    {data?.image?.avatar && (
                                        <div className="user-thumbnail">
                                            <Image
                                                src={"/images/avatars/" + data.image.avatar}
                                                alt={
                                                    data.image?.alt || data.name
                                                }
                                                width={140}
                                                height={140}
                                                layout="fixed"
                                            />
                                        </div>
                                    )}

                                    <div className="rn-author-info-content">
                                        <h4 className="title">{data.name}</h4>
                                        <div className="follow-area">
                                            {
                                                (followers > 0 || (u_id == paramId)) ? <div className="follow followers">
                                                    <span>
                                                        {followers}{" "}
                                                        <a
                                                            href="#!"
                                                            rel="noreferrer"
                                                            className="color-body"
                                                        >
                                                            followers
                                                        </a>
                                                    </span>
                                                </div> : <></>
                                            }

                                        </div>
                                        <div className="author-button-area">
                                            {(isAuthenticated && (u_id !== paramId)) ? <span className="btn at-follw follow-button" onClick={(e) => FollowClick()}>
                                                <i className="feather-user-plus" />
                                                Follow
                                            </span> : null}
                                            {/* <button
                                                type="button"
                                                className="btn at-follw share-button"
                                                onClick={shareModalHandler}
                                            >
                                                <i className="feather-share-2" />
                                            </button> */}

                                            {/* <div className="count at-follw">
                                                <ShareDropdown />
                                            </div> */}
                                            {(isAuthenticated && (u_id == paramId)) ? <Anchor
                                                path="/edit-profile"
                                                className="btn at-follw follow-button edit-btn"
                                            >
                                                <i className="feather feather-edit" />
                                                edit
                                            </Anchor> : null}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

AuthorIntroArea.propTypes = {
    className: PropTypes.string,
    space: PropTypes.oneOf([1]),
    data: PropTypes.shape({
        name: PropTypes.string,
        twitter: PropTypes.string,
        followers: PropTypes.number,
        following: PropTypes.string,
    }),
    paramId: PropTypes.string
};
AuthorIntroArea.defaultProps = {
    space: 1,
};

export default AuthorIntroArea;
