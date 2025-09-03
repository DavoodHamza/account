import "../../styles.scss";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { GET } from "../../../../utils/apiCalls";
import API from "../../../../config/api";
import EditPurchaseOrder from "./edit";
import CreatePurchaseOrder from "./create";
import GeneratePurchase from "./generate";

function PurchaseOrderForm() {
  const { id, type }: any = useParams();
  const { user } = useSelector((state: any) => state.User);
  const adminid = user?.id;
  const [customers, setCustomers] = useState([]);
  const [ledgers, setLedgers] = useState<any>();
  const [banks, setBanks] = useState([]);
  const [details, setDetails] = useState({});
  const [taxList, setTaxlist] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [product, setProduct] = useState([]);


  useEffect(() => {
    loadTaxList();
    getLedgers();
    getBankList();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      getCustomers();
    }, 500);
  }, [customerName]);

  const getCustomers = async () => {
    try {
      let customerapi =
        API.SUPPLIERS_AND_CUSTOMERS_SEARCH_LIST +
        adminid +
        `/${user?.companyInfo?.id}?name=${customerName}`;
      const { data: customer }: any = await GET(customerapi, null);
      setCustomers(customer);
    } catch (error) {
      console.log(error);
    }
  };

  const getLedgers = async () => {
    try {
      let url = "account_master/list";
      const { data }: any = await GET(url, null);
      const filterData = data?.filter(
        (item: any) => item.id === 12 //|| item.id === 20835
      );
      setLedgers(filterData);
    } catch (error) {
      console.log(error);
    }
  };
  const getBankList = async () => {
    try {
      let url =
        "account_master/getBankList/" + adminid + "/" + user?.companyInfo?.id;
      const { data }: any = await GET(url, null);
      setBanks(data.list);
    } catch (error) {
      console.log(error);
    }
  };

  const loadTaxList = async () => {
    try {
      let URL = API.TAX_MASTER + `list/${user?.id}/${user?.companyInfo?.id}`;
      const data: any = await GET(URL, null);
      setTaxlist(data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getProduct = async (itemType: any,locationId:any) => {
    try {
      if(itemType === "both"){
        let url = API.GET_PRODUCTS_BY_LOCATION + locationId;
        const response: any = await GET(url, null);
      if (response.status) {
        setProduct(response.data);
      }
      }else{
        let productuul =
        "ProductMaster/user/" +
        itemType +
        "/" +
        adminid +
        "/" +
        user?.companyInfo?.id;
      const { data: products }: any = await GET(productuul, null);
      let productList = products?.filter(
        (item: any) => item.itemtype !== "fixed assets"
      );
      setProduct(productList);
      }
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div>
      {type === "create" ? (
        <CreatePurchaseOrder
          customers={customers}
          products={product}
          taxList={taxList}
          customerSearch={(val: any) => setCustomerName(val)}
          getProduct={(itemType: any,locationId:any) => getProduct(itemType,locationId)}
          ledgers={ledgers}
        />
      ) : type === "generate" ? (
        <GeneratePurchase
          customers={customers}
          products={product}
          ledgers={ledgers}
          banks={banks}
          taxList={taxList}
          details={details}
          id={id}
          customerSearch={(val: any) => setCustomerName(val)}
          getProduct={(itemType: any,locationId:any) => getProduct(itemType,locationId)}
        />
      ) : (
        <EditPurchaseOrder
          customers={customers}
          ledgers={ledgers}
          banks={banks}
          adminid={adminid}
          products={product}
          taxList={taxList}
          details={details}
          id={id}
          type={type}
          customerName={(val: any) => setCustomerName(val)}
          getProduct={(itemType: any,locationId:any) => getProduct(itemType,locationId)}
        />
      )}
      <br />
    </div>
  );
}
export default PurchaseOrderForm;
