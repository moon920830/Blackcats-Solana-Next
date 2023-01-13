import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header/header-01";
import Footer from "@layout/footer/footer-01";
import Breadcrumb from "@components/breadcrumb";
// Demo Data
// import productData1 from "../data/products.json";

import { ReactNotifications } from "react-notifications-component";

// add react notification component css
import "react-notifications-component/dist/theme.css";

const ProductArea = dynamic(() => import("@containers/explore-product/layout-01"), {
    ssr: false
});

export async function getStaticProps() {
    return { props: { className: "template-color-1" } };
}

const Product = () => {
    return <Wrapper>
        <SEO pageTitle="Product" />
        <Header />
        <ReactNotifications />
        <main id="main-content">
            <Breadcrumb pageTitle="Our Product" currentPage="Our Product" />
            <ProductArea />
        </main>
        <Footer />
    </Wrapper>
}


export default Product;
