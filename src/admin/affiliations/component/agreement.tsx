import { Button, Modal } from "antd";
import { Col, Container } from "react-bootstrap";

const Agreement = (props: any) => {
  return (
    <Modal
      open={props?.openModal}
      closable={true}
      centered
      width={600}
      footer={false}
      maskClosable={false}
      onCancel={props?.closeModal}
    >
      <div style={{ height: "90vh", overflow: "scroll" }}>
        <Container>
          <div className="affiliation_title ">
            Tax GO Affiliate Program Agreement
          </div>
          <p className="affiliation_description">
            This Affiliate Program Agreement ("Agreement") is made and entered
            into by and between Tax GO, located at Unit 3 Damastown Way D15 XW7K
            Dublin, Ireland, and the Affiliate ("Affiliate"), identified as
            [Affiliate's Name and Address]. This Agreement outlines the terms
            and conditions for participating in the Tax GO Affiliate Program.
          </p>
          <div className="affiliation_sub">1. Purpose</div>
          <p className="affiliation_description">
            The purpose of this Agreement is to set forth the terms and
            conditions under which Affiliate will promote Tax GO's products and
            services in exchange for commissions on sales generated through
            their unique affiliate code.
          </p>
          <div className="affiliation_sub">2. Affiliate Responsibilities</div>-
          <p className="affiliation_description">
            Promotion: Affiliate agrees to actively promote Tax GO's products
            and services using their unique affiliate code provided by Tax GO. -
            Compliance: Affiliate must ensure all promotional activities comply
            with applicable laws and regulations. - Accuracy: Affiliate shall
            provide accurate and truthful information in their promotions.
          </p>
          <div className="affiliation_sub">3. Tracking and Commissions</div>
          <p className="affiliation_description">
            {" "}
            Affiliate Code: Affiliate will be provided with a unique affiliate
            code. It is the Affiliate's responsibility to ensure that this code
            is used by Subscribers when completing the purchase of any Tax GO
            product or service. - Tracking: Tax GO will track the sales
            generated through the use of the affiliate code. - Commissions:
            Commissions will be calculated based on the sales successfully
            completed using the Affiliate’s unique code.
          </p>
          <div className="affiliation_sub">4. Payments</div>
          <p className="affiliation_description">
            Payment Schedule: Tax GO agrees to pay the Affiliate their earned
            commissions at the end of each month. - Payment Method: Payments
            will be made via [specified payment method, e.g., bank transfer,
            PayPal] to the payment details provided by the Affiliate. - Minimum
            Payout Threshold: [Specify if there is a minimum payout threshold,
            e.g., "A minimum payout threshold of $50 must be reached before a
            payment is issued."]
          </p>
          <div className="affiliation_sub">5. Affiliate Code Usage</div>
          <p className="affiliation_description">
            Affiliate must ensure that Subscribers use the provided affiliate
            code when completing their purchase. Tax GO is not responsible for
            tracking errors or omissions resulting from the incorrect use or
            omission of the affiliate code by the Subscriber.
          </p>
          <div className="affiliation_sub">6. Term and Termination</div>{" "}
          <p className="affiliation_description">
            Term: This Agreement will commence on the Effective Date and will
            continue until terminated by either party. - Termination: Either
            party may terminate this Agreement at any time, with or without
            cause, by providing written notice to the other party. - Effect of
            Termination: Upon termination, Affiliate will no longer promote Tax
            GO products and will cease use of any materials provided by Tax GO.
            Any earned but unpaid commissions will be paid in the next scheduled
            payment cycle.
          </p>
          <div className="affiliation_sub">7. Confidentiality</div>
          <p className="affiliation_description">
            Affiliate agrees not to disclose any confidential information
            provided by Tax GO, including but not limited to business practices,
            customer information, and marketing strategies.
          </p>
          <div className="affiliation_sub">8. Limitation of Liability</div>
          <p className="affiliation_description">
            Tax GO will not be liable for any indirect, incidental, special,
            consequential, or punitive damages arising out of this Agreement,
            even if advised of the possibility of such damages.
          </p>
          <div className="affiliation_sub">9. Governing Law</div>
          <p className="affiliation_description">
            This Agreement shall be governed by and construed in accordance with
            the laws of Republic of Ireland.
          </p>
          <div className="affiliation_sub">10. Entire Agreement</div>
          <p className="affiliation_description">
            This Agreement constitutes the entire agreement between Tax GO and
            Affiliate and supersedes all prior agreements and understandings,
            whether written or oral.
          </p>
          <div className="affiliation_sub">11. Modification</div>
          <p className="affiliation_description">
            Any modification to this Agreement must be in writing and signed by
            both parties.
          </p>
          <div className="affiliation_sub">12. Severability</div>
          <p className="affiliation_description">
            If any provision of this Agreement is found to be invalid or
            unenforceable, the remaining provisions will continue to be valid
            and enforceable.
          </p>
          <div className="affiliation_sub">13. Signatures</div>
          <p className="affiliation_description">
            By signing below, both parties agree to the terms and conditions of
            this Agreement.
          </p>
          <Col xs={12} md={{ offset: 9, span: 3 }}>
            <Button type="primary" block onClick={props?.closeModal}>
              Ok, I accept
            </Button>
          </Col>
        </Container>
      </div>
    </Modal>
  );
};
export default Agreement;
