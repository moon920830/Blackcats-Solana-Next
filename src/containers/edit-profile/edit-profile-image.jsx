/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import Button from "@ui/button";
import { Store } from "react-notifications-component";
import { useForm } from "react-hook-form";
import { AvatarOrCoverUploadAction } from "../../redux/actions/userAction";

const EditProfileImage = () => {
    const { register, handleSubmit } = useForm();
    const avatar = useSelector((state) => state.auth.avatar);
    const cover = useSelector((state) => state.auth.cover);
    const u_id = useSelector((state) => state.auth.u_id);
    const dispatch = useDispatch();
    const [selectedImage, setSelectedImage] = useState({
        avatar: "",
        cover: "",
    });
    const imageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedImage((prev) => ({
                ...prev,
                [e.target.name]: e.target.files[0],
            }));
        }
    };

    const onAvatarSubmit = async (data) => {
        const formData = new FormData();
        formData.append("file", data.avatar[0]);
        formData.append("type", "avatar");
        formData.append("u_id", u_id);
        formData.append("avatar", avatar);
        dispatch(
            AvatarOrCoverUploadAction(formData, (message, type) => {
                // recaptchaRef.current.reset();
                Store.addNotification({
                    title: "Notification",
                    message,
                    type,
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                        duration: 2000,
                        // onScreen: true,
                    },
                    dismissable: { click: true },
                });
            })
        );
    };

    const onCoverSubmit = async (data) => {
        const formData = new FormData();
        formData.append("file", data.cover[0]);
        formData.append("type", "cover");
        formData.append("u_id", u_id);
        formData.append("cover", cover);
        dispatch(
            AvatarOrCoverUploadAction(formData, (message, type) => {
                // recaptchaRef.current.reset();
                Store.addNotification({
                    title: "Notification",
                    message,
                    type,
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                        duration: 2000,
                        // onScreen: true,
                    },
                    dismissable: { click: true },
                });
            })
        );
    }

    return (
        <div className="blackcat-information">
            <div className="profile-change row g-5">
                <div className="profile-left col-lg-4">
                    <form onSubmit={handleSubmit(onAvatarSubmit)}>
                        <div className="profile-image mb--30">
                            <h6 className="title">
                                Change Your Profile Picture
                            </h6>
                            <div className="img-wrap">
                                {selectedImage?.avatar ? (
                                    <img
                                        src={URL.createObjectURL(
                                            selectedImage.avatar
                                        )}
                                        alt=""
                                        data-black-overlay="6"
                                    />
                                ) : (
                                    <Image
                                        id="rbtinput1"
                                        src={`/images/avatars/${avatar || "default.png"
                                            // eslint-disable-next-line indent
                                            }`}
                                        alt="Profile-NFT"
                                        layout="fill"
                                    />
                                )}
                                <div className="button-area uploadbtn-profile">
                                    <div className="brows-file-wrapper">
                                        <input
                                            name="avatar"
                                            id="fatima"
                                            type="file"
                                            {...register("avatar", {
                                                onChange: (e) => {
                                                    imageChange(e);
                                                }
                                            })}
                                        // onChange={imageChange}
                                        />
                                        <label
                                            htmlFor="fatima"
                                            title="No File Choosen"
                                        >
                                            <span className="text-center color-white">
                                                Upload Profile
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="button-area">
                            <Button
                                className="mr--15"
                                color="primary-alta"
                                size="medium"
                                type="submit"
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </div>

                <div className="profile-left right col-lg-8">
                    <form onSubmit={handleSubmit(onCoverSubmit)}>
                        <div className="profile-image mb--30">
                            <h6 className="title">Change Your Cover Photo</h6>
                            <div className="img-wrap">
                                {selectedImage?.cover ? (
                                    <img
                                        src={URL.createObjectURL(
                                            selectedImage.cover
                                        )}
                                        alt=""
                                        data-black-overlay="6"
                                    />
                                ) : (
                                    <Image
                                        id="rbtinput2"
                                        src={`/images/profile/${cover || "default.jpg"
                                            }`}
                                        alt="Profile-NFT"
                                        layout="fill"
                                    />
                                )}
                                <div className="button-area uploadbtn-cover">
                                    <div className="brows-file-wrapper">
                                        <input
                                            name="cover"
                                            id="nipa"
                                            type="file"
                                            onChange={imageChange}
                                            {...register("cover", {
                                                onChange: (e) => {
                                                    imageChange(e);
                                                }
                                            })}
                                        />
                                        <label
                                            htmlFor="nipa"
                                            title="No File Choosen"
                                        >
                                            <span className="text-center color-white">
                                                Upload Cover
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="button-area">
                            <Button
                                className="mr--15"
                                color="primary-alta"
                                size="medium"
                                type="submit"
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProfileImage;
