import React from 'react';
import { Row, Col, Card, Button, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import './styles.scss';

const { Title, Paragraph } = Typography;

const ProductCards = () => {
  const { t } = useTranslation();

  const products = [
    {
      title: 'Retail Xpress',
      description: 'Complete retail management solution that seamlessly integrates with Tax Go for comprehensive business operations. Perfect for businesses looking to streamline their retail processes while maintaining accurate financial records.',
      features: [
        'Centralized management with Tax Go integration',
        'Real-time analytics synced with financial data',
        'Multi-store support with unified accounting',
        'Integrated ecosystem for complete business control'
      ]
    },
    {
      title: 'POS System',
      description: 'Modern point of sale system that automatically syncs with Tax Go for real-time financial tracking. Ideal for businesses requiring immediate transaction recording and tax compliance.',
      features: [
        'Instant financial sync with Tax Go',
        'Automated inventory and accounting updates',
        'Integrated employee management and payroll',
        'Comprehensive sales and tax reporting'
      ]
    },
    {
      title: 'E-commerce Platform',
      description: 'Seamless online shopping platform that connects directly to Tax Go for automated financial management. Perfect for businesses expanding into online sales while maintaining accounting accuracy.',
      features: [
        'Automated financial record keeping',
        'Real-time inventory and accounting sync',
        'Integrated order and tax management',
        'Unified payment processing'
      ]
    },
    {
      title: 'Order Application',
      description: 'Smart order management system that works in harmony with Tax Go for streamlined financial tracking. Essential for businesses needing organized order processing with automatic accounting updates.',
      features: [
        'Direct integration with Tax Go financials',
        'Automated status and accounting updates',
        'Synchronized customer and payment data',
        'Comprehensive order history and reporting'
      ]
    },
    {
      title: 'Customer Display',
      description: 'Enhanced customer interface solution that connects with Tax Go for accurate pricing and tax calculations. Ideal for businesses wanting to provide transparent and accurate customer interactions.',
      features: [
        'Real-time price and tax display',
        'Integrated promotional management',
        'Synchronized order tracking',
        'Smart financial calculations'
      ]
    },
    {
      title: 'Kitchen Display',
      description: 'Efficient kitchen management system that integrates with Tax Go for cost tracking and inventory management. Perfect for food service businesses requiring detailed financial oversight.',
      features: [
        'Integrated cost management',
        'Real-time inventory valuation',
        'Automated financial tracking',
        'Comprehensive operations analysis'
      ]
    },
    {
      title: 'Delivery Application',
      description: 'Comprehensive delivery management solution that works seamlessly with Tax Go for accurate delivery cost accounting. Essential for businesses with delivery operations requiring precise financial tracking.',
      features: [
        'Automated delivery cost accounting',
        'Integrated route cost optimization',
        'Real-time financial tracking',
        'Complete delivery analytics'
      ]
    },
    {
      title: 'Zakka Integration API',
      description: 'Powerful integration platform that extends Tax Go\'s capabilities across all your business systems. Perfect for businesses requiring custom integrations while maintaining financial accuracy.',
      features: [
        'Seamless Tax GO data synchronization',
        'Automated cross-system workflows',
        'Real-time financial updates',
        'Custom integration capabilities'
      ]
    },
    {
      title: 'Van Sales Application',
      description: 'Mobile sales solution that maintains constant connection with Tax Go for real-time financial updates. Ideal for businesses with mobile sales operations requiring immediate financial tracking.',
      features: [
        'Real-time mobile financial sync',
        'Integrated route accounting',
        'Automated sales and inventory updates',
        'Complete mobile business management'
      ]
    }
  ];

  return (
    <div className="products-section border-2 border-red-500">
      <div className="products-intro">
        <Title level={2}>Expand Your Business Capabilities with Tax Go</Title>
        <Paragraph className="intro-text">
          Tax Go serves as your central business management hub, offering a suite of powerful integrated applications. 
          Each additional application seamlessly connects with Tax Go, allowing you to expand your business capabilities 
          while maintaining unified financial control and management.
        </Paragraph>
        {/* <Row className="integration-benefits">
          <Col xs={24} sm={12} md={8}>
            <div className="benefit-item">
              <h3>Seamless Integration</h3>
              <p>All applications automatically sync with Tax Go for unified business management</p>
            </div>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <div className="benefit-item">
              <h3>Flexible Expansion</h3>
              <p>Add applications as your business grows, with instant compatibility</p>
            </div>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <div className="benefit-item">
              <h3>Unified Control</h3>
              <p>Manage all aspects of your business from one central platform</p>
            </div>
          </Col>
        </Row> */}
      </div>

      <Row gutter={[24, 24]} className="products-grid">
        {products.map((product, index) => (
          <Col xs={24} sm={12} md={8} lg={8} key={index}>
            <Card className="product-card" title={product.title}>
              <p className="description">{product.description}</p>
              <ul className="features-list">
                {product.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
              <div className="card-actions">
                <Button type="primary" className="view-more-btn">
                  View More
                </Button>
                <Button className="visit-site-btn">
                  Visit Site
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ProductCards; 