import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header/header-01";
import Footer from "@layout/footer/footer-01";
import Breadcrumb from "@components/breadcrumb";
import EditProfileArea from "@containers/edit-profile";
import { ReactNotifications } from "react-notifications-component";

// add react notification component css
import "react-notifications-component/dist/theme.css";

export async function getStaticProps() {
    return { props: { className: "template-color-1" } };
}

const EditProfile = () => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push({
                pathname: "/login",
            });
        }
    }, [isAuthenticated]);

    return (
        <Wrapper>
            <SEO pageTitle="Edit Profile" />
            <Header />
            <ReactNotifications />
            {
                (isAuthenticated) ? <main id="main-content">
                    <Breadcrumb
                        pageTitle="Edit Profile"
                        currentPage="Edit Profile"
                    />
                    <EditProfileArea />
                </main> : null
            }


            <Footer />
        </Wrapper>
    );
};

export default EditProfile;
