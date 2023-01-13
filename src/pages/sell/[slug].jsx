import PropTypes from "prop-types";
import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header/header-01";
import Footer from "@layout/footer/footer-01";
import Breadcrumb from "@components/breadcrumb";
// import WaitingArea from "@containers/waiting-progress";
import dynamic from 'next/dynamic';
const WaitingArea = dynamic(() => import("@containers/waiting-progress/sell"), {
    ssr: false
});


const SellDetails = ({ product }) => (
    <Wrapper>
        <SEO pageTitle="Waiting the selling transaction" />
        <Header />
        <main id="main-content">
            <Breadcrumb
                pageTitle="Waiting the selling transaction"
                currentPage="Waiting the selling transaction"
            />
            <WaitingArea product={product} type="sell" />
        </main>
        <Footer />
    </Wrapper>
);

export async function getStaticPaths() {
    return {
        paths: [],
        fallback: "blocking",
    };
}

export async function getStaticProps({ params }) {
    // const product = productData.find(({ slug }) => slug === params.slug);
    // const { categories } = product;
    // const recentViewProducts = shuffleArray(productData).slice(0, 5);
    // const relatedProducts = productData
    //     .filter((prod) => prod.categories?.some((r) => categories?.includes(r)))
    //     .slice(0, 5);
    return {
        props: {
            className: "template-color-1",
            product: params.slug
            // product,
        }, // will be passed to the page component as props
    };
}

SellDetails.propTypes = {
    product: PropTypes.any,
};

export default SellDetails;
