import { Button, Card, Popconfirm, Tooltip, notification } from "antd";
import { useEffect, useState } from "react";
import Barcode from "react-barcode";
import { Col, Container, Row, Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { HiPencil } from "react-icons/hi2";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import NoImg from "../../../assets/images/download.webp";
import LoadingBox from "../../../components/loadingBox";
import PageHeader from "../../../components/pageHeader";
import API from "../../../config/api";
import { useSelector } from "react-redux";
import { GET } from "../../../utils/apiCalls";
import UpdateStock from "./updateStock";
import { MdOutlineContentCopy } from "react-icons/md";
const View = (props: any) => {
  const { t } = useTranslation();
  const { type: path } = useParams();
  const [viewData, setformdata] = useState<any>([]);
  const { user } = useSelector((state: any) => state.User);
  const { type, id } = useParams();
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const data = props.data?.data;
  const showModal = () => {
    setModalVisible(true);
  };
  const handleOk = () => {
    setModalVisible(false);
  };
  const handleCancel = () => {
    setModalVisible(false);
  };
  const onEdit = () => {
    navigate(
      `/usr/create-product/${viewData?.itemtype}/update/${viewData?.id}`
    );
  };
  const Delete = async () => {
    let url = API.DELETE_PRODUCT + id;
    const res: any = await GET(url, null);
    if (res.status) {
      notification.success({
        message: "Success",
        description: "Successfully deleted",
      });
      navigate("/usr/productStock");
    }
  };

  const loadProductById = async () => {
    try {
      setIsLoading(true);
      let URL = API.GET_PRODUCT_MASTER_BY_ID + id;
      const { data }: any = await GET(URL, null);
      setformdata(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProductById();
  }, []);
  return (
    <div>
      <PageHeader
        firstPathText={
          path == "Service"
            ? t("home_page.homepage.Service_View")
            : t("home_page.homepage.Product_View")
        }
        firstPathLink={-1}
        secondPathText=""
        secondPathLink={location?.pathname}
        title={
          path == "Service"
            ? t("home_page.homepage.Service_Details")
            : t("home_page.homepage.Product_Details")
        }
      >
        <Tooltip
          title="copy service"
          mouseEnterDelay={0.5}
          arrow={false}
          color="white"
          overlayClassName="toolTip-Card"
          overlayInnerStyle={{
            color: "#000000",
            marginTop: 5,
            fontSize: "14px",
          }}
          placement={"bottom"}
        >
          <Button
            onClick={() =>
              navigate(`/usr/create-product/${path}/duplicate/${viewData?.id}`)
            }
          >
            <MdOutlineContentCopy size={20} />
          </Button>
        </Tooltip>
        &nbsp;
        {/* <div>
          <Button type="primary" onClick={showModal}>
            {t("home_page.homepage.Update_Stock")}
          </Button>
        </div> */}
      </PageHeader>
      <br />
      {isLoading ? (
        <LoadingBox />
      ) : (
        <Container>
          <Card>
            <Row>
              <Col md={4} xs={12}>
                <img
                  className="product-View-Img1"
                  src={viewData?.pimage ? viewData?.pimage : NoImg}
                  alt=""
                />
                <br /> <br />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  <Button onClick={onEdit} block>
                    <HiPencil
                      size={18}
                      color="#14839c"
                      style={{ paddingRight: "5px" }}
                    />
                    {t("home_page.homepage.Edit")}
                  </Button>
                  {/* <Popconfirm
                    title="Delete"
                    description="Are you sure to delete ?"
                    onConfirm={() => Delete()}
                    placement="bottom"
                  >
                    <Button block>
                      <RiDeleteBinLine
                        size={20}
                        color="#ed2828"
                        style={{ paddingRight: "5px" }}
                      />
                      {t("home_page.homepage.Delete")}
                    </Button>
                  </Popconfirm> */}
                </div>
                <br />
                {viewData?.barcode && (
                  <Card>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        padding: 10,
                      }}
                    >
                      <Barcode value={viewData?.barcode} />
                    </div>
                  </Card>
                )}
              </Col>
              <Col md={8} xs={12}>
                <center>
                  <h2>
                    <b>{viewData?.idescription}</b>
                  </h2>
                </center>
                <br />
                <Table responsive bordered size="small">
                  <tbody>
                    <tr>
                      <th>{t("home_page.homepage.Code")}</th>
                      <td>{viewData?.icode || "-"}</td>
                    </tr>
                    {path === "Stock" || path === "Nonstock" ? (
                      <tr>
                        <th>{t("home_page.homepage.Barcode")}</th>
                        <td>{viewData?.barcode || "-"}</td>
                      </tr>
                    ) : null}
                    <tr>
                      <th>{t("home_page.homepage.Sales_Price")}</th>
                      <td> {viewData?.sp_price || viewData?.rate}</td>
                    </tr>
                    <tr>
                      <th>{t("home_page.homepage.Item_Type")}</th>
                      <td>{viewData?.itemtype || "-"}</td>
                    </tr>
                    <tr>
                      <th>{t("home_page.homepage.Product_Category")}</th>
                      <td> {viewData?.productCategory?.category || "-"}</td>
                    </tr>
                    {/* {path === "Stock" || path === "Nonstock" ? (
                    <tr>
                      <th>{t("home_page.homepage.Wholesale")}</th>
                      <td> {viewData?.wholesale}</td>
                    </tr>
                    ): null} */}
                    {path === "Stock" ? (
                      <>
                        <tr>
                          <th>{t("home_page.homepage.Costprice")}</th>
                          <td> {viewData?.costprice || "-"}</td>
                        </tr>
                        <tr>
                          <th>{t("home_page.homepage.Reorder_Level")}</th>
                          <td> {viewData?.rlevel || "-"}</td>
                        </tr>
                        <tr>
                          <th>{t("home_page.homepage.Reorder_Quantity")}</th>
                          <td> {viewData?.rquantity || "-"}</td>
                        </tr>
                      </>
                    ) : null}
                    {user?.companyInfo?.tax === "gst" ? (
                      <tr>
                        <th>Gst%</th>
                        <td>{viewData?.vat || "-"}%</td>
                      </tr>
                    ) : (
                      <tr>
                        <th>{t("home_page.homepage.Vat%")}</th>
                        <td>{viewData?.vat || "-"}</td>
                      </tr>
                    )}
                    {user?.companyInfo?.tax === "gst" ? (
                      <tr>
                        <th>Gst Amount</th>
                        <td> {viewData?.vatamt || "-"}</td>
                      </tr>
                    ) : (
                      <tr>
                        <th>{t("home_page.homepage.Vatamt")}</th>
                        <td> {viewData?.vatamt || "-"}</td>
                      </tr>
                    )}
                    <tr>
                      <th>{t("home_page.homepage.Notes")}</th>
                      <td> {viewData?.notes || "-"}</td>
                    </tr>
                    {path === "Stock" ? (
                      <tr>
                        <th>{t("home_page.homepage.Opening_Quantity")}</th>
                        <td> {viewData?.stockquantity || "-"}</td>
                      </tr>
                    ) : null}
                  </tbody>
                </Table>

                {path !== "Service" && viewData?.productLocation?.length > 0 ? (
                  <Table responsive bordered size="small">
                    <tbody>
                      <tr>
                        <th>{t("home_page.homepage.Location")}</th>
                        <th>{t("home_page.homepage.Quantity")}</th>
                      </tr>
                      {viewData?.productLocation?.map((item: any) => (
                        <tr>
                          <td>{item?.locationName}</td>
                          <td>{item?.stock}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : null}
              </Col>
            </Row>
          </Card>
        </Container>
      )}
      <UpdateStock
        modalVisible={modalVisible}
        handleOk={handleOk}
        handleCancel={handleCancel}
        stock={viewData}
        loadProductById={loadProductById}
      />
      <br />
    </div>
  );
};

export default View;
