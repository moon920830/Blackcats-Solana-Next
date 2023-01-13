import { useForm } from "react-hook-form";
import Button from "@ui/button";
import ErrorText from "@ui/error-text";
import { toast } from "react-toastify";
import { Store } from "react-notifications-component";
import { useDispatch, useSelector } from "react-redux";
import { ChangePasswordAction } from "../../redux/actions/authActions";

const ChangePassword = () => {
    const dispatch = useDispatch();
    const u_id = useSelector((state) => state.auth.u_id);
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        reset,
    } = useForm({
        mode: "onChange",
    });
    const notify = () => toast("Your password has changed");
    const onSubmit = (data, e) => {
        e.preventDefault();
        const payload = {
            u_id,
            oldPass: data.oldPass,
            NewPass: data.NewPass
        };
        dispatch(ChangePasswordAction(payload, (message, type) => {
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
            reset();
        }));
        // notify();
        // reset();

    };
    return (
        <div className="blackcat-information">
            <div className="condition">
                <h5 className="title">Create Your Password</h5>
                <p className="condition">
                    Passwords are a critical part of information and network
                    security. Passwords serve to protect user accounts but a
                    poorly chosen password, if compromised, could put the entire
                    network at risk.
                </p>
                <hr />
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="input-two-wrapper mt--15">
                    <div className="old-password half-wid">
                        <label htmlFor="oldPass" className="form-label">
                            Enter Old Password
                        </label>
                        <input
                            name="pass"
                            id="oldPass"
                            type="password"
                            {...register("oldPass", {
                                required: "Old Password is required",
                            })}
                        />
                        {errors.oldPass && (
                            <ErrorText>{errors.oldPass?.message}</ErrorText>
                        )}
                    </div>
                    <div className="new-password half-wid">
                        <label htmlFor="NewPass" className="form-label">
                            Create New Password
                        </label>
                        <input
                            name="password"
                            id="NewPass"
                            type="password"
                            {...register("NewPass", {
                                required: "New Password is required",
                            })}
                        />
                        {errors.NewPass && (
                            <ErrorText>{errors.NewPass?.message}</ErrorText>
                        )}
                    </div>
                </div>
                <div className="email-area mt--15">
                    <label htmlFor="rePass" className="form-label">
                        Confirm Password
                    </label>
                    <input
                        name="Password"
                        id="rePass"
                        type="password"
                        {...register("rePass", {
                            required: "Confirm Password is required",
                            validate: (value) =>
                                value === getValues("NewPass") ||
                                "The passwords do not match",
                        })}
                    />
                    {errors.rePass && (
                        <ErrorText>{errors.rePass?.message}</ErrorText>
                    )}
                </div>
                <Button className="save-btn-edit" size="medium" type="submit">
                    Save
                </Button>
            </form>
        </div>
    );
};

export default ChangePassword;
