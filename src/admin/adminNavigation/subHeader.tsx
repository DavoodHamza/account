import "./styles.scss";
import { IoArrowBackSharp } from "react-icons/io5";
import { Breadcrumb, Button, Col, Row, Tooltip } from "antd";
import { IoIosArrowForward } from "react-icons/io";
import { SiMicrosoftexcel } from "react-icons/si";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

function SubHeader(props: any) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const path = [
    { pathLink: props?.firstPathLink, pathText: props?.firstPathText },
  ];

  return (
    <div className="PageHeader-Box">
      <Row align={"middle"}>
        <Col md={14} className="d-flex">
          <div onClick={() => navigate(-1)} className="PageHeader-box2">
            <IoArrowBackSharp size={25} color="#000" cursor={"pointer"} />
          </div>
          <div className="px-3 pageHeader-breadcrumb">
            <div className="pageHeader-title">
              {props?.title ? props?.title : "Title"}
            </div>
            <Breadcrumb
              separator={
                <span>
                  <IoIosArrowForward color="rgba(54, 54, 54, 0.8)" />
                </span>
              }
            >
              <Breadcrumb.Item>
                <Link to="/admin/dashboard">Dashboard</Link>
              </Breadcrumb.Item>

              {path?.map((item, index) => {
                if (item?.pathLink && item?.pathText) {
                  const isLastItem = index === path.length - 1;
                  return (
                    <Breadcrumb.Item key={index}>
                      <Link
                        to={item?.pathLink}
                        className={isLastItem ? "last-breadcrumb-item" : ""}
                      >
                        {item?.pathText}
                      </Link>
                    </Breadcrumb.Item>
                  );
                }

                return null;
              })}
            </Breadcrumb>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default SubHeader;
