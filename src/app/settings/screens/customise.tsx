import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Spin,
  Upload,
  message,
  notification,
} from "antd";
import DataGrid, { Column } from "devextreme-react/data-grid";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { CiEdit } from "react-icons/ci";
import { MdOutlinePhotoCamera } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import InvImage1 from "../../../assets/images/Invoicev1.webp";
import InvImage3 from "../../../assets/images/Invoicev3.webp";
import InvImage2 from "../../../assets/images/invoice2.webp";
import API from "../../../config/api";
import ImgPicker from "../../../components/LogoPicker/logoPicker";
import tem4 from "../../../assets/images/template4.webp";
import temp6 from "../../../assets/images/temp6.webp";
import tem5 from "../../../assets/images/template5.webp";
import temp7 from "../../../assets/images/templateimg.webp";
import { update } from "../../../redux/slices/userSlice";
import { GET, PUT } from "../../../utils/apiCalls";
import Avatar from "../../../assets/images/user.webp";
import "../styles.scss";
import useDebounce from "../../../utils/useDebounce";
function Customize() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { user } = useSelector((state: any) => state.User);
  const bankInfo = user?.companyInfo?.bankInfo;
  const [toggle, toggleModal] = useState(false);
  const dispatch = useDispatch();
  const adminid = user?.id;
  const [img, setImg] = useState(null);
  const [getData, SetGetData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [invEditModal, setInvEditModal] = useState(false);
  const [editData, setEditData] = useState<any>();
  const [updateLoading, setUpdateLoading] = useState(false);
  const [location, setLocation] = useState<any>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<any>();
  const [locationMeta, setLocationMeta] = useState<any>({});
  const [locationPageSize, setLocationPageSize] = useState<number>(10);
  const [locationPageNo, setLocationPageNo] = useState<number>(1);
  const [searchLocation, setSearchLocation] = useState<string>("");
  const GetCustimedData = async (val: any) => {
    try {
      let url =
        API.CUSTOMISE_DATA + adminid + "/" + user?.companyInfo?.id + "/" + val;
      const { value }: any = await GET(url, null);
      SetGetData(value);
    } catch (error) {
      console.log(error);
    }
  };
  // const onUpload = async (info: any) => {
  //   const { file } = info;
  //   if (file.status !== "uploading") {
  //     await uploadLogo(file.originFileObj);
  //   }
  // };
  // const uploadLogo = async (imagedata: any) => {
  //   try {
  //     setIsLoading(true);
  //     var formdata = new FormData();
  //     formdata.append("userid", user?.id);
  //     formdata.append("file", imagedata, imagedata.name);
  //     let graphData_url = API.UPDATE_LOGO + user?.companyInfo?.id;
  //     const { data, status }: any = await POST2(graphData_url, formdata);
  //     if (status) {
  //       let obj = {
  //         ...data?.updatedData,
  //         isStaff: user?.isStaff,
  //         staff: user?.staff,
  //         token: user?.token,
  //       };
  //       dispatch(update(obj));
  //       notification.success({
  //         message: " Logo Updated",
  //         description: "Your invoice logo has been updated successfully. ",
  //       });
  //       setIsLoading(false);
  //     } else {
  //       notification.error({
  //         message: "Failed to update Logo",
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const updateTemplate = async (selectedInvoice: any) => {
    let url = `${API.UPADATE_TEMPLATE}${adminid}/${user?.companyInfo?.id}/${selectedInvoice}`;
    let { data, status }: any = await GET(url, "");
    if (status) {
      notification.success({
        message: " Invoice Format Updated",
        description: "Your Invoice Format has been updated successfully.",
      });
      let obj = {
        ...data,
        isStaff: user?.isStaff,
        staff: user?.staff,
        token: user?.token,
      };
      dispatch(update(obj));
    }
  };

  const columns = [
    {
      dataField: "type",
      caption: t("home_page.homepage.Type"),

      cellRender: ({ data }: any) => (
        <div style={{ textAlign: "center" }}>
          {data?.type === "sales"
            ? "Sales"
            : data?.type === "scredit"
            ? "Credit Note"
            : data?.type === "purchase"
            ? "Purchase"
            : data?.type === "purchaseAsset"
            ? "Purchase Asset"
            : data?.type === "pcredit"
            ? "Debit Note"
            : data?.type === "proforma"
            ? "Proforma"
            : data?.type === "reccuring"
            ? "Reccuring"
            : data?.type === "order"
            ? "Purchase Order"
            : data?.type === "stockTransfer"
            ? "Stock Transfer"
            : ""}
        </div>
      ),
    },
    {
      dataField: "prefix",
      caption: t("home_page.homepage.Prefix"),
      cellRender: ({ data }: any) => (
        <div style={{ textAlign: "center" }}>{data?.prefix}</div>
      ),
    },
    {
      dataField: "startNumber",
      caption: t("home_page.homepage.Start_Number"),
      cellRender: ({ data }: any) => (
        <div style={{ textAlign: "center" }}>{data?.startNumber}</div>
      ),
    },
    {
      dataField: "currentInvNumber",
      caption: t("home_page.homepage.CurrentInvoice_Number"),
      cellRender: ({ data }: any) => (
        <div style={{ textAlign: "center" }}>{data?.currentInvNumber}</div>
      ),
    },
    {
      dataField: "",
      caption: t("home_page.homepage.Edit"),
      cellRender: (data: any) => (
        <CiEdit
          onClick={() => {
            setInvEditModal(true);
            setEditData(data?.data);
          }}
          size={23}
        />
      ),
    },
  ];

  // useEffect(() => {
  //   GetCustimedData();
  //   // GetUserDetals();
  // }, []);
  useEffect(() => {
    getLocation();
  }, [locationPageSize, locationPageNo, useDebounce(searchLocation, 1000)]);
  const getLocation = async () => {
    try {
      const response: any = await GET(
        API.LOCATION_GET_BY_COMPANY +
          `${user?.companyInfo?.id}?order=ASC&page=${locationPageNo}&take=${locationPageSize}&searchLocaton=${searchLocation}`,
        null
      );
      if (response?.status) {
        setLocation(response?.data?.data);
        setLocationMeta(response?.data?.meta);
      }
    } catch (error) {}
  };
  const updateInvoiceInfo = async (val: any) => {
    try {
      setUpdateLoading(true);
      let api =
        API.UPDATE_INVOICE_DETAILS +
        user?.id +
        "/" +
        user?.companyInfo?.id +
        "/" +
        selectedLocationId;
      let payload = {
        id: editData?.id,
        prefix: val?.prefix,
        startNumber: val?.startNumber,
        currentInvNumber: editData?.currentInvNumber,
        desc: editData?.desc,
        type: editData?.type,
      };
      let response: any = await PUT(api, payload);
      if (response?.id) {
        notification.success({
          message: "Success",
          description: "Invoice Configuration Updated successfully",
        });
        GetCustimedData(selectedLocationId);
      } else {
        notification.error({
          message: "Failed",
          description: "Failed to update invoice configuration",
        });
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Server Error",
        description: "Failed to update invoice configuration",
      });
    } finally {
      setEditData({});
      setUpdateLoading(false);
      setInvEditModal(false);
    }
  };
  const locationQueryReset = (open: boolean) => {
    setSearchLocation("");
    setLocationPageNo(1);
    setLocationPageSize(10);
  };
  const onSearchLocation = (val: any) => {
    setSearchLocation(val);
    setLocationPageNo(1);
    setLocationPageSize(10);
  };
  const onPopupScroll = (
    e: React.UIEvent<HTMLDivElement>,
    type: "product" | "location"
  ) => {
    e.persist();
    let target = e.target as HTMLDivElement;
    if (
      Math.round(target.scrollTop + target.offsetHeight) === target.scrollHeight
    ) {
      if (locationMeta?.hasNextPage) {
        setLocationPageSize((prev: number) => prev + 10);
      }
    }
  };

  return (
    <>
      <Container>
        <Card>
          <p className="heading-txt2">
            {t("home_page.homepage.INVOICE_FORMAT")}
          </p>
          <hr />
          <Radio.Group
            value={user?.companyInfo?.defaultinvoice}
            onChange={(e) => updateTemplate(e.target.value)}
          >
            <Row>
              <Col sm={3} md={3}>
                <div style={{ textAlign: "center" }} className="customize-Box3">
                  {t("home_page.homepage.Invoice_1")}
                </div>
                <Card
                  hoverable
                  style={{ width: 240, height: 400 }}
                  cover={<img src={InvImage1} />}
                >
                  <div className="settings-customize-Box1">
                    <Radio value="1"></Radio>
                  </div>
                </Card>
              </Col>
              <Col sm={3} md={3}>
                <div className="settings-customize-Box3">Invoice 2</div>
                <Card
                  hoverable
                  style={{ width: 240, height: 400 }}
                  cover={<img src={InvImage2} />}
                >
                  <br />
                  <div className="settings-customize-Box1">
                    <Radio value="2"></Radio>
                  </div>
                </Card>
              </Col>
              <Col sm={3} md={3}>
                <div className="settings-customize-Box3">
                  {t("home_page.homepage.Invoice_3")}
                </div>
                <Card
                  hoverable
                  style={{ width: 240, height: 400 }}
                  cover={<img src={InvImage3} />}
                >
                  <div className="settings-customize-Box1">
                    <Radio value="3"></Radio>
                  </div>
                </Card>
              </Col>
              <Col sm={3} md={3}>
                <div style={{ textAlign: "center" }} className="customize-Box3">
                  Invoice 4
                </div>
                <Card
                  hoverable
                  style={{ width: 240, height: 400 }}
                  cover={<img src={tem4} />}
                >
                  <div className="settings-customize-Box1">
                    <Radio value="4"></Radio>
                  </div>
                </Card>
              </Col>
              <Col sm={3} md={3}>
                <div style={{ textAlign: "center" }} className="customize-Box3">
                  Invoice 5
                </div>
                <Card
                  hoverable
                  style={{ width: 240, height: 400, marginTop: 17 }}
                  cover={<img src={tem4} />}
                >
                  <div className="settings-customize-Box1">
                    <Radio value="5"></Radio>
                  </div>
                </Card>
              </Col>

              <Col sm={3} md={3}>
                <div style={{ textAlign: "center" }} className="customize-Box3">
                  Invoice 7
                </div>
                <Card
                  hoverable
                  style={{ width: 240, height: 400, marginTop: 17 }}
                  cover={<img src={temp7} />}
                >
                  <div className="settings-customize-Box1">
                    <Radio value="7"></Radio>
                  </div>
                </Card>
              </Col>
            </Row>
          </Radio.Group>
          <br /> <br />
          <div className="heading-txt2">
            {t("home_page.homepage.INVOICE_LOGO")}
          </div>
          <hr />
          <Row className="settings-customize-Box2">
            <div className="settings-customize-Box4">
              <img
                src={`${API.FILE_PATH}logo/${
                  user?.companyInfo?.logo || Avatar
                }`}
                className="settings-customize-Img1"
              />
            </div>
            <div className="settings-customize-Box6">
              <MdOutlinePhotoCamera
                size="24"
                onClick={() => toggleModal(true)}
              />
            </div>
          </Row>
          <br />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div className="heading-txt2">
              {t("home_page.homepage.INVOICENUMBER_CONFIGURATION")}
            </div>
            <Select
              allowClear
              showSearch
              placeholder="Location"
              fieldNames={{
                label: "location",
                value: "id",
              }}
              onDropdownVisibleChange={locationQueryReset}
              style={{ width: "20%" }}
              onChange={(val) => {
                setSelectedLocationId(val?.value);
                GetCustimedData(val?.value);
              }}
              // className="createCompositeSelector"
              onSearch={onSearchLocation}
              filterOption={false}
              labelInValue
              options={location}
              onPopupScroll={(e: React.UIEvent<HTMLDivElement>) =>
                onPopupScroll(e, "location")
              }
              listHeight={200}
            />
          </div>
          <hr />
          <DataGrid
            dataSource={getData}
            columnAutoWidth={true}
            showBorders={true}
            showRowLines={true}
            noDataText={
              !selectedLocationId
                ? "please choose a location"
                : "No data available!"
            }
          >
            {columns.map((column: any, index: any) => (
              <Column
                key={index}
                dataField={column.dataField}
                caption={column.caption}
                cellRender={column.cellRender}
                alignment="center"
              />
            ))}
          </DataGrid>
        </Card>
        <ImgPicker
          open={toggle}
          modalClose={() => toggleModal(false)}
          data={user}
          // setImg={setImg}
        />
        {/* --- */}
        <Modal
          open={invEditModal}
          centered
          onCancel={() => {
            setInvEditModal(false);
            setEditData({});
          }}
          footer={false}
          title={"Edit Invoice Numbers"}
          width={500}
        >
          <br />
          <Form
            form={form}
            initialValues={{
              prefix: editData?.prefix,
              startNumber: editData?.startNumber,
            }}
            onFinish={updateInvoiceInfo}
          >
            <Row>
              <Col md={6}>
                <div>
                  <label className="formLabel">Prefix</label>
                  <Form.Item
                    name="prefix"
                    rules={[
                      {
                        required: true,
                        message: "Prefix is required",
                      },
                    ]}
                  >
                    <Input size="large" />
                  </Form.Item>
                </div>
              </Col>
              <Col md={6}>
                <div>
                  <label className="formLabel">Start Number</label>
                  <Form.Item
                    name="startNumber"
                    rules={[
                      {
                        required: true,
                        message: "Start Number is required",
                      },
                    ]}
                  >
                    <Input type="number" size="large" />
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Button
                  size="large"
                  block
                  danger
                  onClick={() => setInvEditModal(false)}
                >
                  Close
                </Button>
              </Col>
              <Col sm={6}>
                <Button
                  block
                  size="large"
                  type="primary"
                  htmlType="submit"
                  loading={updateLoading}
                >
                  Update
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal>
      </Container>
      <br />
    </>
  );
}

export default Customize;
