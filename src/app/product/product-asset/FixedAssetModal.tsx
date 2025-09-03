import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import API from "../../../config/api";
import { GET, POST, PUT } from "../../../utils/apiCalls";
import { Button, Form, Input, Modal, Select, Spin, notification } from "antd";
import CreateSettings from "../../settings/components/form";
function FixedAssetModal(props: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [ledgerCategoryList, setLedgerCategoryList] = useState([]);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [hsnCodes, setHsnCodes] = useState([]);
  const { edit, setEdit, setIsOpen, isOpen, loadData, page, take } = props;
  const [form] = Form.useForm();
  const { user } = useSelector((state: any) => state.User);
  const [formType, setFormType] = useState();
  const [isForm, setIsForm] = useState(false);

  const businessStartDate: any = user?.companyInfo?.books_begining_from
    ? user?.companyInfo?.books_begining_from
    : user?.companyInfo?.financial_year_start;

  useEffect(() => {
    ledgerCategoryDetails();
    fetchHsnCodes();
  }, []);
  const fetchHsnCodes = async () => {
    try {
      setIsLoading(true);
      let unit_url = API.HSN_CODE_LIST + user?.id + "/" + user?.companyInfo?.id;
      const { data }: any = await GET(unit_url, null);
      setHsnCodes(data);
      setIsLoading(false);
    } catch (error) {}
  };
  const addCategory = (val: any) => {
    let type: any =
      val === "unit"
        ? "unit"
        : val === "productCategory"
        ? "productCategory"
        : val === "tax"
        ? "tax"
        : val === "location"
        ? "location"
        : "hsnCode";
    if (val == type) {
      setFormType(type);
      setIsForm(true);
    }
  };

  const ledgerCategoryDetails = async () => {
    try {
      let url = API.GET_FIXED_ASSET_LEDJERS + user?.id;
      const response: any = await GET(url, null);
      setLedgerCategoryList(response.data);
    } catch {}
  };

  const checkIfItemExist = async (type: any, item: any) => {
    if (item.length > 2) {
      let url = API.CHECK_IF_EXIST + `${user?.id}/${user?.companyInfo?.id}/${type}/${item}`;
      const res: any = await GET(url, null);
      if (res.status) {
        notification.error({ message: "Asset Already Exists" });
      }
    }
  };

  const onFinish = async (val: any) => {
    try {
      setIsLoading(true);
      let reqObj = {
        idescription: val.idescription,
        saccount: Number(val.saccount) || 4000,
        notes: val.notes,
        userid: user.id,
        adminid: user?.id,
        itemtype: "Asset",
        type: "Asset",
        createdBy: user?.isStaff ? user?.staff?.id : user?.id,
        icode: val.icode || "",
        price: 0,
        sp_price: val.sp_price || 0,
        c_price: Number(val.c_price) || 0,
        trade_price: 0, 
        rate: val?.sp_price,
        logintype: "user",
        paccount: 0,
        includevat: val.includevat === true ? 1 : 0,
        vat: Number(val.vat) || 0,
        vatamt: Number(val.vatamt) || 0,
        product_category: null,
        existingstock: false,
        costprice: val.c_price || 0,
        wholesale: val.wholesale || 0,
        rlevel: val.rlevel || 0,
        quantity: val.quantity || 0,
        stockquantity: val.stockquantity || 0,
        rquantity: 0,
        stock: 0,
        date: businessStartDate,
        unit: null,
        location: null,
        barcode: "",
        pimage: "",
        companyid: user?.companyInfo?.id,
        hsn_code: val?.hsn_code,
      };

      let URL =
        edit === "create" ? API.ADD_PRODUCT : API.GET_PRODUCT_UPDATE + edit;
      const response: any =
        edit === "create" ? await POST(URL, reqObj) : await PUT(URL, reqObj);
      if (response.status) {
        notification.success({
          message: "Success",
          description:
            edit === "create"
              ? "Fixed asset created successfully"
              : "Fixed asset updated successfully",
        });
        setIsOpen(false);
        edit !== "create" && setEdit("create");
        loadData && loadData(page, take);
        form.setFieldsValue({
          idescription: "",
          saccount: "",
          hsn_code: "",
          notes: "",
        });
      } else {
        notification.error({
          message: "Failed",
          description:
            edit === "create"
              ? `Faild to create fixed asset${response.message}`
              : `Failed to update fixed asset${response.message}`,
        });
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Server Error",
        description:
          edit === "create"
            ? "Faild to create fixed asset!! Please try again later"
            : "Failed to update fixed asset!! Please try again later ",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setEdit && setEdit("create");
    form.setFieldsValue({
      idescription: "",
      saccount: "",
      hsn_code: "",
      notes: "",
    });
  };

  const getLedger = async (val: any) => {
    try {
      let url = API.GET_FIXED_ASSET_LEDJERS + user?.id;
      const response: any = await GET(url, null);
      const filteredLedgers = response.data.filter(
        (item: any) => item?.nominalcode == val
      );
      return filteredLedgers;
    } catch (error) {
      console.log(error);
    }
  };

  const loadProductById = async () => {
    try {
      setIsInitialLoading(true);
      let URL = API.GET_PRODUCT_MASTER_BY_ID + edit;
      const { data }: any = await GET(URL, null);
      let ledgerData = await getLedger(data?.saccount);
      form.setFieldsValue({
        idescription: data?.idescription,
        saccount: ledgerData[0]?.nominalcode,
        hsn_code: data?.hsn_code,
        notes: data?.notes,
      });
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsInitialLoading(false);
    }
  };
  useEffect(() => {
    edit !== "create" && loadProductById();
  }, [edit]);
  return (
    <Modal
      open={isOpen}
      onCancel={handleCancel}
      footer={false}
      closable={false}
      maskClosable={false}
    >
      <div className="productAdd-Txt1 d-flex justify-content-between">
        {" "}
        {edit === "create" ? "Create Asset" : "Update Asset Information"}
        {isInitialLoading ? <Spin /> : null}
      </div>
      <Form onFinish={onFinish} form={form}>
        <div className="formItem">
          <label className="formLabel">Item Name</label>
          <Form.Item
            name="idescription"
            rules={[
              {
                required: true,
                message: "Please enter a Item Name",
              },
            ]}
          >
            <Input
              onChange={(e) => checkIfItemExist("idescription", e.target.value)}
            />
          </Form.Item>
        </div>
        {user?.companyInfo?.tax === "gst" && (
          
    <div className="formItem">
          <label className="formLabel">HSN/SAC Code</label>
          <Form.Item
            name="hsn_code"
            rules={[
              {
                required: true,
                message: "Choose HSN/SAC code",
              },
            ]}
          >
            <Select onChange={addCategory} allowClear>
              <Select.Option
                value={"hsnCode"}
                style={{
                  color: "gray",
                  fontSize: 15,
                  fontWeight: "bold",
                }}
              >
                Add HSN/SAC
              </Select.Option>
              {hsnCodes.length &&
                hsnCodes.map((item: any) => (
                  <Select.Option
                    value={item.hsn_code}
                    key={item.id}
                  >
                    {item.hsn_code} - {item.description}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
        </div>
        )}
        <div className="formItem">
          <label className="formLabel">Ledger Category </label>
          <Form.Item
            name="saccount"
            rules={[
              {
                required: true,
                message: "Please enter a Ledger Category",
              },
            ]}
          >
            <Select size="large">
              {ledgerCategoryList?.length &&
                ledgerCategoryList?.map((item: any) => (
                  <Select.Option key={item.nominalcode}>
                    {item.laccount}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
        </div>
        <div className="formItem">
          <label className="formLabel">Notes</label>
          <Form.Item name="notes">
            <Input.TextArea rows={3} size="large" />
          </Form.Item>
        </div>
        <div className="d-flex justify-content-end">
          <Button
            onClick={handleCancel}
            size="large"
            style={{ height: 40, marginRight: 5 }}
          >
            Cancel
          </Button>
          <Button
            loading={isLoading}
            type="primary"
            htmlType="submit"
            style={{ height: 40 }}
            size="large"
          >
            {edit === "create" ? "Submit" : "Update"}
          </Button>
        </div>
      </Form>
      {isForm ? (
        <CreateSettings
          open={isForm}
          close={() => setIsForm(false)}
          source={formType}
          id={"create"}
          reload={
            formType == "hsnCode"
              ? fetchHsnCodes : null
          }
        />
      ) : null}
    </Modal>
  );
}

export default FixedAssetModal;
