import React from 'react';
import { withTranslation } from 'react-i18next';
import WebsiteHeader from '../../components/websiteHeader';
import WebsiteFooter from '../../components/websiteFooter';
import HeroSection from './components/HeroSection';
import ProductCards from './components/ProductCards';
import './styles.scss';

const OurProducts = () => {
  return (
    <div className="our-products-page">
      <WebsiteHeader />
      <HeroSection />
      <main >
        <ProductCards />
      </main>
      
      <WebsiteFooter />
    </div>
  );
};

export default withTranslation()(OurProducts);

