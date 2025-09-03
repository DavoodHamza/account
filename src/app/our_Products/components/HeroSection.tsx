import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from 'antd';
import '../styles.scss';

const { Title } = Typography;

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <div className="hero-section">
      <div className="hero-content">
        <Title level={1}>{t('our_products.hero.title', 'Our Products')}</Title>
        <p className="subtitle">
          {t('our_products.hero.subtitle', 'Discover our comprehensive suite of business solutions designed to streamline your operations')}
        </p>
      </div>
    </div>
  );
};

export default HeroSection; 