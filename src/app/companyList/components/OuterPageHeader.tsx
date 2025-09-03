import { Breadcrumb, Button, Col, Row } from "antd";
import { FaPlus } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import { IoArrowBackSharp } from "react-icons/io5";
import { Link } from "react-router-dom";

function OuterPageHeader(props: any) {
  const path = [
    { pathLink: props?.firstPathLink, pathText: props?.firstPathText },
    { pathLink: props?.secondPathLink, pathText: props?.secondPathText },
    { pathLink: props?.thirdPathLink, pathText: props?.thirdPathText },
  ];
  return (
    <div
      className="PageHeader-Box"
      style={{ borderRadius: "6px", background: "#fff5e5" }}
    >
      <Row align={"middle"}>
        <Col md={14} className="d-flex">
          {props?.isBack ? (
            <div
              onClick={props?.isBack}
              className="PageHeader-box2"
              style={{ marginLeft: 15 }}
            >
              <IoArrowBackSharp size={25} color="#000" cursor={"pointer"} />
            </div>
          ) : null}

          <div className="px-3 pageHeader-breadcrumb" style={{ border: 0 }}>
            <div className="pageHeader-title">
              {props?.title && props?.title}
            </div>
            <Breadcrumb
              separator={
                <span>
                  <IoIosArrowForward color="rgba(54, 54, 54, 0.8)" />
                </span>
              }
            >
              <Breadcrumb.Item>
                <Link to="/company">Home</Link>
              </Breadcrumb.Item>

              {path?.map((item, index) => {
                if (item?.pathLink && item?.pathText) {
                  const isLastItem = index === path.length - 1;
                  return (
                    <Breadcrumb.Item key={index}>
                      <Link
                        to={item.pathLink}
                        className={isLastItem ? "last-breadcrumb-item" : ""}
                      >
                        {item.pathText}
                      </Link>
                    </Breadcrumb.Item>
                  );
                }

                return null;
              })}
            </Breadcrumb>
          </div>
        </Col>
        {props?.buttonTxt ? (
          <Col md={8}>
            <Col md={{ span: 8, offset: 16 }}>
              <Button
                className="primary-Button"
                size="large"
                onClick={() => props?.onSubmit()}
              >
                <FaPlus />
                <span style={{ paddingLeft: "2px" }}>{props?.buttonTxt}</span>
              </Button>
            </Col>
          </Col>
        ) : null}
      </Row>
    </div>
  );
}

export default OuterPageHeader;
