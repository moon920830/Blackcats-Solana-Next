import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header/header-01";
import Footer from "@layout/footer/footer-01";
import Breadcrumb from "@components/breadcrumb";
import LoginArea from "@containers/login";
// import { ReactNotifications } from "react-notifications-component";

// add react notification component css
// import "react-notifications-component/dist/theme.css";

export async function getStaticProps() {
    return { props: { className: "template-color-1" } };
}

const Login = () => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    return (
        <Wrapper>
            <SEO pageTitle="Log In" />
            <Header />
            {/* <ReactNotifications /> */}
            {
                (!isAuthenticated) ? <main id="main-content">
                    <Breadcrumb
                        pageTitle="Blackcat Login"
                        currentPage="Blackcat Login"
                    />
                    <LoginArea />
                </main> : null
            }


            <Footer />
        </Wrapper>
    );
};

export default Login;
