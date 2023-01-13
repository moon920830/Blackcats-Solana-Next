import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Button from "@ui/button";
import { Store } from "react-notifications-component";
import NiceSelect from "@ui/nice-select";
import { useForm } from "react-hook-form";
import ErrorText from "@ui/error-text";
import { ProfileSaveAction } from "src/redux/actions/userAction";

const PersonalInformation = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm({
        mode: "onChange",
    });

    const dispatch = useDispatch();
    const u_id = useSelector((state) => state.auth.u_id);
    const firstname = useSelector((state) => state.auth.firstname);
    const lastname = useSelector((state) => state.auth.lastname);
    const email = useSelector((state) => state.auth.email);
    const bio = useSelector((state) => state.auth.bio);
    const typeValue = useSelector((state) => state.auth.type);
    const [type, setType] = useState(typeValue);

    useEffect(() => {
        setValue('firstname', firstname);
        setValue('lastname', lastname);
        setValue('email', email);
        setValue('bio', bio);
    }, []);

    const onSubmit = (data, e) => {
        const payload = {
            u_id,
            firstname: data.firstname,
            lastname: data.lastname,
            bio: data.bio,
            type
        };

        dispatch(ProfileSaveAction(payload, (message, type) => {
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
                },
                dismissable: { click: true },
            });
        }));
    }

    return (
        <div className="blackcat-information">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="profile-form-wrapper">
                    <div className="input-two-wrapper mb--15">
                        <div className="first-name half-wid">
                            <label htmlFor="firstname" className="form-label text-capitalize">
                                First Name
                            </label>
                            <input
                                id="firstname"
                                type="text"
                                {...register("firstname", {
                                    required: "First Name is required",
                                })}
                            />
                            {errors.firstname && (
                                <ErrorText>{errors.firstname?.message}</ErrorText>
                            )}
                        </div>
                        <div className="last-name half-wid">
                            <label htmlFor="lastname" className="form-label text-capitalize">
                                Last Name
                            </label>
                            <input
                                id="lastname"
                                type="text"
                                {...register("lastname", {
                                    required: "Last Name is required",
                                })}
                            />
                            {errors.lastname && (
                                <ErrorText>{errors.lastname?.message}</ErrorText>
                            )}
                        </div>
                    </div>
                    <div className="email-area">
                        <label htmlFor="email" className="form-label">
                            Edit Your Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            {...register("email")}
                            readOnly
                        />
                    </div>
                </div>
                <div className="edit-bio-area mt--30">
                    <label htmlFor="bio" className="form-label">
                        Edit Your Bio
                    </label>
                    <textarea
                        id="bio"
                        {...register("bio")}
                    >
                    </textarea>
                    {errors.bio && (
                        <ErrorText>{errors.bio?.message}</ErrorText>
                    )}
                </div>

                <div className="mt--15 type-area">
                    <label htmlFor="type" className="form-label mb--10">
                        Your Type
                    </label>
                    <NiceSelect
                        options={[
                            { value: "0", text: "Listener" },
                            { value: "1", text: "Artist" },
                        ]}
                        placeholder="Select Your type"
                        className="profile-edit-select"
                        defaultCurrent={typeValue}
                        onChange={(e) => {
                            setType(e.value);
                        }}
                    />
                    {errors.type && (
                        <ErrorText>{errors.type?.message}</ErrorText>
                    )}
                </div>

                <div className="button-area save-btn-edit">
                    {/* <Button className="mr--15" color="primary-alta" size="medium">
                        Cancel
                    </Button> */}
                    <Button size="medium" type="submit">Save</Button>
                </div>
            </form>
        </div>
    );
}

export default PersonalInformation;
