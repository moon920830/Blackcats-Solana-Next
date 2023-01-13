import dynamic from 'next/dynamic'
import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header/header-01";
import Footer from "@layout/footer/footer-01";
import HeroArea from "@containers/hero/layout-01";

import ServiceArea from "@containers/services/layout-01";

import TopSellerArea from "@containers/top-seller/layout-01";

import CollectionArea from "@containers/collection/layout-01";
import { normalizedData } from "@utils/methods";


// Demo Data
import homepageData from "../data/homepages/home-01.json";
import productData from "../data/products.json";
import sellerData from "../data/sellers.json";
import collectionsData from "../data/collections.json";

// import NewestItmesArea from "@containers/product/layout-04";
// import ExploreProductArea from "@containers/explore-product/layout-01";
// import LiveExploreArea from "@containers/live-explore/layout-01";

import { ReactNotifications } from "react-notifications-component";

// add react notification component css
import "react-notifications-component/dist/theme.css";

const NewestItmesArea = dynamic(() => import("@containers/product/layout-04"), {
    ssr: false
});
const LiveExploreArea = dynamic(() => import("@containers/live-explore/layout-01"), {
    ssr: false
});

const ExploreProductArea = dynamic(() => import("@containers/explore-product/layout-01"), {
    ssr: false
});

export async function getStaticProps() {
    return { props: { className: "template-color-1" } };
}

const Home = () => {
    const content = normalizedData(homepageData?.content || []);
    const liveAuctionData = productData.filter(
        (prod) =>
            prod?.auction_date && new Date() <= new Date(prod?.auction_date)
    );
    const newestData = productData
        .sort(
            (a, b) =>
                Number(new Date(b.published_at)) -
                Number(new Date(a.published_at))
        )
        .slice(0, 5);

    return (
        <Wrapper>
            <SEO pageTitle="Home Default" />
            <Header />
            <ReactNotifications />
            <main id="main-content">
                <HeroArea data={content["hero-section"]} />
                <ServiceArea data={content["service-section"]} />
                {/* <LiveExploreArea
                    data={{
                        ...content["live-explore-section"],
                        products: liveAuctionData,
                    }}
                /> */}
                <NewestItmesArea
                    section_title={{
                        "title": "Newest Tracks",
                    }}
                />

                <TopSellerArea
                    data={{
                        ...content["top-sller-section"],
                        sellers: sellerData,
                    }}
                />
                <ExploreProductArea
                    section_title={{
                        "title": "Explore Tracks",
                    }}
                />
            </main>
            <Footer />
        </Wrapper>
    );
};

export default Home;
