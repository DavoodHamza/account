import { Tabs } from "antd";
import { Col, Row } from "react-bootstrap";

const BlogTab = ({ handleChange }: any) => {
  const tabItems: any["items"] = [
    {
      key: "1",
      label: "ALL",
      children: "",
    },
    {
      key: "2",
      label: "BUSINESS",
      children: "",
    },
    {
      key: "3",
      label: "ACCOUNTING",
      children: "",
    },
    {
      key: "4",
      label: "FINANCE",
      children: "",
    },
    {
      key: "5",
      label: "UPDATES",
      children: "",
    },
    {
      key: "6",
      label: "WORLD",
      children: "",
    },
  ];

  const today = new Date();
  const dayOfWeek = today.toLocaleString("en-us", { weekday: "long" });
  const options: any = { month: "short", day: "numeric", year: "numeric" };
  const dateParts = today.toLocaleDateString("en-us", options);

  return (
    <Row className="g-0">
      <Col md={2}>
        <div className="blogTab_box1">
          {dayOfWeek}
          <br />
          {dateParts}
        </div>
      </Col>
      <Col>
        <Tabs
          defaultActiveKey="0"
          size="small"
          items={tabItems}
          onChange={handleChange}
        />
      </Col>
    </Row>
  );
};

export default BlogTab;
