import { Accordion, Col, Container, Row } from "react-bootstrap";
import WebsiteFooter from "../../components/websiteFooter";
import WebsiteHeader from "../../components/websiteHeader";
import Whatsapp from "../../components/whatsapp";

const HelpLink = () => {
  const column1 = [
    {
      id: 1,
      title: "Sign Up Tax GO Business Solution",
      description: "How to sign up on Tax GO Business Solution",
      iframe:
        '<iframe width="280" height="158" src="https://www.youtube.com/embed/lVoo_VUiiic?si=xBsAT9lHNHmr73Du" frameborder="0" allowfullscreen></iframe>',
      link: "https://youtu.be/lVoo_VUiiic?feature=shared",
    },
    {
      id: 3,
      title: "How to create a new company",
      description: "How to create a new company in Tax GO Business Solution",
      iframe:
        '<iframe width="280" height="158" src="https://www.youtube.com/embed/Htvx4D61WAs?si=vpLXpqZ5-RbsAj7k" frameborder="0" allowfullscreen></iframe>',
      link: "https://youtu.be/Htvx4D61WAs?feature=shared",
    },
    {
      id: 5,
      title: "Services",
      description: "How to add, edit or view services",
      iframe:
        '<iframe width="280" height="158" src="https://www.youtube.com/embed/eaejgH-Cs_Q?si=4iJx7IjrwHTzeFsr" frameborder="0" allowfullscreen></iframe>',
      link: "https://youtu.be/eaejgH-Cs_Q?si=LsBoqSy0BpuCJ9hG",
    },
    {
      id: 7,
      title: "Purchase Invoice Entry",
      description: "How to enter purchase invoice on Tax GO business solution",
      iframe:
        '<iframe width="280" height="158" src="https://www.youtube.com/embed/lWZwhyS4QcI?si=XfIJljrCKH7xPgWg" frameborder="0"  allowfullscreen></iframe>',
      link: "https://youtu.be/lWZwhyS4QcI?si=eu5gZ67XXPOXpC4m",
    },
    {
      id:9,
      title:"Add Cash Entry",
      description: "How to manage cash accounts, track cash flow, handle transactions, and generate financial reports.",
      iframe:'<iframe width="280" height="158" src="https://www.youtube.com/embed/cp754jZeaxo" "frameborder="0"  allowfullscreen></iframe>',
      link:"https://youtu.be/cp754jZeaxo?si=czM98dFymXaWHMWx"
    }
  ];

  const column2 = [
    {
      id: 2,
      title: "Updating Profile",
      description: "How to update your profile on Tax GO Business Solution",
      iframe:
        '<iframe width="280" height="158" src="https://www.youtube.com/embed/uRYCFAQudtQ?si=DlyAyxLMAS-awtmC" frameborder="0" allowfullscreen></iframe>',
      link: "https://youtu.be/uRYCFAQudtQ?feature=shared",
    },
    {
      id: 4,
      title: "Customer and Supplier",
      description:
        "How to add, update, delete or view statements of your customers and supplier",
      iframe:
        '<iframe width="280" height="158" src="https://www.youtube.com/embed/2A1X5ucuPWk?si=SmaWVyjbSGBzQkBZ" frameborder="0"  allowfullscreen></iframe>',
      link: "https://youtu.be/2A1X5ucuPWk?si=7DjfW2ZyOHozPzoa",
    },
    {
      id: 6,
      title: "Add Journal Entry",
      description: "How to add a journal entry on Tax GO business solution",
      iframe:
        '<iframe width="280" height="158" src="https://www.youtube.com/embed/Ufu5fa0tdIo?si=7lyQnaNP1vtuZH5R" frameborder="0"  allowfullscreen></iframe>',
      link: "https://youtu.be/Ufu5fa0tdIo?si=fiSC6udwijy8U2QB",
    },
    {
      id: 8,
      title: "Bank account Entry and management",
      description: "How to add or manage bank entries on Tax GO business solution",
      iframe:
        '<iframe width="280" height="158" src="https://www.youtube.com/embed/cfEyDumJAtI?si=OITGcPf32B3TrfC9" frameborder="0"  allowfullscreen></iframe>',
      link: "https://youtu.be/cfEyDumJAtI?feature=shared",
    },
  ];

  return (
    <div className="website-screens">
      <WebsiteHeader />
      <div style={{ backgroundColor: "#f5f5f5", padding: "50px 0px 50px" }}>
        <div className="secondsec-head1">
          Help : Video Guides for Tax GO Business Solution
        </div>
        <div className="secondsec-head2">
          Explore our collection of video guides to help you navigate and
          utilize the Tax GO Business Solution.
          <br />
          From signing up to updating your profile, find step-by-step
          instructions to make the most of our services.
        </div>
        <Container>
          <Row className="supportcards-parent">
            <Col md="6">
              {column1.map((item: any, index: number) => (
                <Accordion>
                  <Accordion.Item eventKey={index.toString()} key={index}>
                    <Accordion.Header>
                      {item.id}.{" "}{item.title}
                    </Accordion.Header>
                    <Accordion.Body>
                      <Row>
                        <Col md={6}>
                          <p>
                            {item.description}:{" "}
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Go to youtube
                            </a>
                          </p>
                        </Col>
                        <Col md={6}>
                          <div
                            dangerouslySetInnerHTML={{ __html: item.iframe }}
                          />
                        </Col>
                      </Row>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              ))}
            </Col>
            <Col md="6">
              {column2.map((item: any, index: number) => (
                <Accordion>
                  <Accordion.Item eventKey={index.toString()} key={index}>
                    <Accordion.Header>
                      {item.id}.{" "}{item.title}
                    </Accordion.Header>
                    <Accordion.Body>
                      <Row>
                        <Col md={6}>
                          <p>
                            {item.description}:{" "}
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Go to youtube
                            </a>
                          </p>
                        </Col>
                        <Col md={6}>
                          <div
                            dangerouslySetInnerHTML={{ __html: item.iframe }}
                          />
                        </Col>
                      </Row>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              ))}
            </Col>
          </Row>
        </Container>
      </div>
      <Whatsapp />
      <WebsiteFooter />
    </div>
  );
};

export default HelpLink;
