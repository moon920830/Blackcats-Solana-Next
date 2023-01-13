import React, { useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import Button from "@ui/button";
import ErrorText from "@ui/error-text";
import { Store } from "react-notifications-component";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import ReCAPTCHA from "react-google-recaptcha";
import { useDispatch, useSelector } from "react-redux";
import { SignInAction, CheckedRememberMeAction, UnCheckedRememberMeAction } from "../../redux/actions/authActions";
import { useClickAuthPage } from "@hooks";

const LoginForm = ({ className }) => {
    const recaptchaRef = React.useRef(null);
    const dispatch = useDispatch();
    const router = useRouter();
    const p_url = useSelector((state) => state.route.p_url);
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm({
        mode: "onChange",
    });

    useEffect(() => {
        // determine to fill in the check box 
        setValue('rememberme', localStorage.getItem("rememberme"));
    }, []);

    const onSubmit = (data, e) => {
        e.preventDefault();
        console.log("login validated form data: ", data);
        // handle remember me action
        if (data.rememberme) {
            dispatch(CheckedRememberMeAction());
        } else {
            dispatch(UnCheckedRememberMeAction());
        }
        // In front end side, get the token with verified Re-captch.
        const token = recaptchaRef.current.getValue();
        const payload = {
            email: data.email,  // email address in form login
            password: data.password,  //password in form login
            token,   // re-captch token
        };

        // handle sign in action and then launch the notification and If success, redirect page.
        dispatch(
            SignInAction(payload, (message, type, userType) => {

                //launch the notification
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

                // If success, redirect to '/'
                if (type === "success") {
                    router.push({
                        pathname: p_url ? p_url : "/",
                    });
                }
            })
        );
    };
    return (
        <div className={clsx("form-wrapper-one", className)}>
            <h4>Login</h4>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-5">
                    <label htmlFor="email" className="form-label">
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
                    <label htmlFor="password" className="form-label">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        {...register("password", {
                            required: "Password is required",
                        })}
                    />
                    {errors.password && (
                        <ErrorText>{errors.password?.message}</ErrorText>
                    )}
                </div>
                <div className="mb-5 rn-check-box">
                    <input
                        type="checkbox"
                        className="rn-check-box-input"
                        id="rememberme"
                        {...register("rememberme")}
                    />
                    <label className="rn-check-box-label" htmlFor="rememberme">
                        Remember me later
                    </label>
                </div>
                <div className="mb-5 d-flex justify-content-center">
                    <ReCAPTCHA
                        ref={recaptchaRef}
                        size="normal"
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                    />
                </div>
                <Button type="submit" size="medium" className="mr--15">
                    Log In
                </Button>
                <Button path="/sign-up" color="primary-alta" size="medium">
                    Sign Up
                </Button>
            </form>
        </div>
    );
};

LoginForm.propTypes = {
    className: PropTypes.string,
};
export default LoginForm;
