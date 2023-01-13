import dynamic from 'next/dynamic'
import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header/header-01";
import Footer from "@layout/footer/footer-01";
import SellNFTArea from "@containers/sell-nft";

// Demo data
import productData from "../data/products.json";

export async function getStaticProps() {
    return { props: { className: "template-color-1" } };
}

const SellNFT = () => (
    <Wrapper>
        <SEO pageTitle="Sell NFT" />
        <Header />
        <main id="main-content">
            <SellNFTArea data={{ products: productData }} />
        </main>
        <Footer />
    </Wrapper>
);

export default SellNFT;
