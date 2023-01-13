import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header/header-01";
import Footer from "@layout/footer/footer-01";
import { GetByIDAction } from "../../redux/actions/userAction"
import { ReactNotifications } from "react-notifications-component";

// add react notification component css
import "react-notifications-component/dist/theme.css";

const AuthorIntroArea = dynamic(() => import("@containers/author-intro"), {
    ssr: false
});

const AuthorProfileArea = dynamic(() => import("@containers/author-profile"), {
    ssr: false
});

// Demo data
import { useEffect, useState } from "react";
import axios from "axios";

export async function getStaticProps({ params }) {
    return {
        props: {
            className: "template-color-1",
            u_id: params.u_id
            // product,
        }, // will be passed to the page component as props
    };
}

export async function getStaticPaths() {
    return {
        paths: [],
        fallback: "blocking",
    };

}

const Author = ({ u_id }) => {
    const [authorData, SetAuthorData] = useState();
    const userData = useSelector((state) => state.user.userData);
    const router = useRouter();
    // const { u_id } = router.query;
    const dispatch = useDispatch();

    useEffect(() => {
        const payload = {
            u_id
        }
        dispatch(GetByIDAction(payload));
    }, []);

    useEffect(() => {
        if (userData) {
            SetAuthorData({
                "name": `${userData.firstname} ${userData.lastname}`,
                "twitter": "it0bsession",
                "followers": userData.likes ? userData.likes : 0,
                "image": {
                    "avatar": userData.avatar,
                    "cover": userData.cover,
                }
            });
        }
    }, [userData]);

    return (
        <Wrapper>
            <SEO pageTitle="Author" />
            <Header />
            <ReactNotifications />
            {
                <main id="main-content">
                    {
                        (authorData) ? <AuthorIntroArea data={authorData} paramId={u_id} /> : null
                    }
                    <AuthorProfileArea userID={u_id} /> : <></>
                </main>
            }
            <Footer />
        </Wrapper>
    );
};

export default Author;
