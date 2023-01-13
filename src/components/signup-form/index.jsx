import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import Button from "@ui/button";
import ErrorText from "@ui/error-text";
import { useForm } from "react-hook-form";
import { Store } from "react-notifications-component";
import { useRouter } from "next/router";
import { Anchor } from "react-bootstrap";
import ReCAPTCHA from "react-google-recaptcha";
import { useDispatch, useSelector } from "react-redux";
import { SignupAction } from "../../redux/actions/authActions";

const SignupForm = ({ className }) => {
    const router = useRouter();
    const recaptchaRef = React.useRef(null);
    const dispatch = useDispatch();
    // const reducerData = useSelector((state) => state.authenticated);
    // const { authenticated } = reducerData;
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm({
        mode: "onChange",
    });
    const onSubmit = (data, e) => {
        e.preventDefault();
        console.log(errors)
        // eslint-disable-next-line no-console
        // console.log(data);
        // recaptchaRef.current.execute();
        const token = recaptchaRef.current.getValue();
        const payload = {
            email: data.email,
            password: data.password,
            firstname: data.firstname,
            lastname: data.lastname,
            type: data.isArtist ? 1 : 2,
            token,
        };
        dispatch(
            SignupAction(payload, (message, type) => {
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
                if (type === "success") {
                    router.push({
                        pathname: "/",
                    });
                }
            })
        );
    };

    return (
        <div className={clsx("form-wrapper-one", className)}>
            <h4>Sign Up</h4>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-5">
                    <label
                        htmlFor="firstname"
                        className="form-label text-uppercase"
                    >
                        First Name
                    </label>
                    <input
                        type="text"
                        id="firstname"
                        {...register("firstname", {
                            required: "First Name is required",
                        })}
                    />
                    {errors.firstname && (
                        <ErrorText>{errors.firstname?.message}</ErrorText>
                    )}
                </div>
                <div className="mb-5">
                    <label
                        htmlFor="lastname"
                        className="form-label text-uppercase"
                    >
                        Last Name
                    </label>
                    <input
                        type="text"
                        id="lastname"
                        {...register("lastname", {
                            required: "Last Name is required",
                        })}
                    />
                    {errors.lastname && (
                        <ErrorText>{errors.lastname?.message}</ErrorText>
                    )}
                </div>
                <div className="mb-5">
                    <label
                        htmlFor="email"
                        className="form-label text-uppercase"
                    >
                        Email address
                    </label>
                    <input
                        type="email"
                        id="email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                message: "invalid email address",
                            },
                        })}
                    />
                    {errors.email && (
                        <ErrorText>{errors.email?.message}</ErrorText>
                    )}
                </div>
                <div className="mb-5">
                    <label
                        htmlFor="password"
                        className="form-label text-uppercase"
                    >
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 8,
                                message: "must be 8 chars",
                            },
                            validate: (value) => {
                                return (
                                    [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/].every((pattern) =>
                                        pattern.test(value)
                                    ) || "must include lower, upper, number, and special chars"
                                );
                            },

                        })}
                    />
                    {errors.password && (
                        <ErrorText>{errors.password?.message}</ErrorText>
                    )}
                </div>
                <div className="mb-5">
                    <label
                        htmlFor="rePassword"
                        className="form-label text-uppercase"
                    >
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        id="rePassword"
                        {...register("rePassword", {
                            required: "Confirm Password is required",
                            validate: (value) =>
                                value === getValues("password") ||
                                "The passwords do not match",
                        })}
                    />
                    {errors.rePassword && (
                        <ErrorText>{errors.rePassword?.message}</ErrorText>
                    )}
                </div>
                <div className="mb-5 rn-check-box">
                    <input
                        type="checkbox"
                        className="rn-check-box-input"
                        id="isArtist"
                        {...register("isArtist")}
                    />
                    <label className="rn-check-box-label" htmlFor="isArtist">
                        I am an artist who wants to upload music
                    </label>
                    <br />
                    {errors.isArtist && (
                        <ErrorText>{errors.isArtist?.message}</ErrorText>
                    )}
                </div>
                <div className="mb-5 rn-check-box">
                    <input
                        type="checkbox"
                        className="rn-check-box-input"
                        id="termsCheck"
                        {...register("termsCheck", {
                            required: "Checkbox is required",
                        })}
                    />
                    <label className="rn-check-box-label" htmlFor="termsCheck">
                        I accept <Anchor path="/">Terms and Conditions</Anchor>
                    </label>
                    <br />
                    {errors.termsCheck && (
                        <ErrorText>{errors.termsCheck?.message}</ErrorText>
                    )}
                </div>
                <div className="mb-5 d-flex justify-content-center">
                    <ReCAPTCHA
                        size="normal"
                        ref={recaptchaRef}
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                    />
                </div>
                <Button type="submit" size="medium" className="mr--15">
                    Sign Up
                </Button>
                <Button path="/login" color="primary-alta" size="medium">
                    Log In
                </Button>
            </form>
        </div>
    );
};

SignupForm.propTypes = {
    className: PropTypes.string,
};
export default SignupForm;
