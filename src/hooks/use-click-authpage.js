import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { SetProductTabKeyAction } from "../redux/actions/productAction";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Store } from "react-notifications-component";

function useClickAuthPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const user_auth_data = useSelector((state) => state.auth);

    const [userAuthData, setUserAuthData] = useState(null);
    const onClickAuthHandler = (auth, type, path) => {
        // check if page is required to log in, this page is required to sign in but there is no auth  //
        if (auth && !user_auth_data.isAuthenticated) {
            Store.addNotification({
                title: "Warning",
                message: 'You have to sign in to have authorization',
                type: 'danger',
                insert: "top",
                container: "top-right",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                onRemoval: (id, removedBy) => {
                    router.push({
                        pathname: '/login'
                    })
                },
                dismiss: {
                    duration: 3000,
                }
            });
            return;
        }
        else if (auth && user_auth_data.isAuthenticated) {
            // check if user has authorization //
            if ((type & user_auth_data.type) == 0) {
                console.log('helloworld')
                Store.addNotification({
                    title: "Warning",
                    message: 'You have no right to look into this page.',
                    type: 'danger',
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                        duration: 3000,
                    }
                });
                return;
            }

            // if router path contains 'author', load the u_id on to payload 
            if (path.includes('/author')) {
                dispatch(SetProductTabKeyAction('nav-profile', () => {
                    router.push({
                        pathname: "/author/[u_id]",
                        query: {
                            u_id: user_auth_data.u_id
                        }
                    })
                }));
            }
            else if (path.includes('/create')) {
                router.push({
                    pathname: path
                })
            }
            else if (path.includes('/airdrop')) {
                router.push({
                    pathname: path
                })
            }

        }
        // go to page directly if page is not required to log in //
        else if (!auth) {
            router.push({
                pathname: path
            })
        }
    };
    useEffect(() => {
        setUserAuthData(user_auth_data);
    }, [user_auth_data]);

    return { userAuthData, onClickAuthHandler };
}

export default useClickAuthPage;
