import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header/header-01";
import Footer from "@layout/footer/footer-01";
import Breadcrumb from "@components/breadcrumb";
import SignUpArea from "@containers/signup";
import { ReactNotifications } from "react-notifications-component";

// add react notification component css
import "react-notifications-component/dist/theme.css";

export async function getStaticProps() {
    return { props: { className: "template-color-1" } };
}

const SignUp = () => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const router = useRouter();

    if (isAuthenticated) {
        router.push({
            pathname: "/",
        });
    }

    return (
        <Wrapper>
            <SEO pageTitle="Sign Up" />
            <Header />
            <ReactNotifications />
            <main id="main-content">
                <Breadcrumb
                    pageTitle="Sign Up"
                    currentPage="Blackcat Login"
                />
                <SignUpArea />
            </main>
            <Footer />
        </Wrapper>
    );
};

export default SignUp;
