import dynamic from 'next/dynamic'
import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header/header-01";
import Footer from "@layout/footer/footer-01";
import Breadcrumb from "@components/breadcrumb";
// import CreateNewArea from "@containers/create-new";

const CreateNewArea = dynamic(() => import("@containers/create-new"), {
    ssr: false
});

export async function getStaticProps() {
    return { props: { className: "template-color-1" } };
}

const Home = () => (
    <Wrapper>
        <SEO pageTitle="Create New" />
        <Header />
        <main id="main-content">
            <Breadcrumb pageTitle="Create New NFT" />
            <CreateNewArea />
        </main>
        <Footer />
    </Wrapper>
);

export default Home;
