import dynamic from 'next/dynamic'
import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header/header-01";
import Footer from "@layout/footer/footer-01";
import Breadcrumb from "@components/breadcrumb";
import { ReactNotifications } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
// import MintNewArea from "@containers/mint";

export async function getStaticProps() {
    return { props: { className: "template-color-1" } };
}

const MintNewArea = dynamic(() => import("@containers/mint"), {
    ssr: false
});


const Home = () => (
    <Wrapper>
        <SEO pageTitle="Mint New NFT" />
        <Header />
        <ReactNotifications />
        <main id="main-content">
            <Breadcrumb pageTitle="Mint New NFT" />
            <MintNewArea />
        </main>
        <Footer />
    </Wrapper>
);

export default Home;
