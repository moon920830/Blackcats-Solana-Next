import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header/header-01";
import Footer from "@layout/footer/footer-01";
import Breadcrumb from "@components/breadcrumb";
import AirdropArea from "@containers/airdrop";

export async function getStaticProps() {
    return { props: { className: "template-color-1" } };
}

const AirDrop = () => (
    <Wrapper>
        <SEO pageTitle="Contact" />
        <Header />
        <main id="main-content">
            <Breadcrumb pageTitle="Airdrop the NFTs" />
            <AirdropArea />
        </main>
        <Footer />
    </Wrapper>
);

export default AirDrop;
