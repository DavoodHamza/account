import { Col, Container, Row } from "react-bootstrap";
import LoadingBox from "../../../components/loadingBox";
import UpdateMobileNumber from "./updateMobile";
import UpdateEmail from "./emailUpdate";

function EmailMobile(props: any) {
  return props.isLoading ? (
    <>
      <LoadingBox />
    </>
  ) : (
    <Container>
      <Row>
        <Col md={6}>
          <UpdateEmail emailverified={props?.details?.emailverified === 1} onChange={() => props.onChange()}/>
        </Col>
        <Col md={6}>
          <UpdateMobileNumber
            phoneVerified={props?.details?.phoneverified === 1}
            onChange={() => props.onChange()}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default EmailMobile;
