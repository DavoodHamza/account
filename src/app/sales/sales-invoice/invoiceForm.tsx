import { useEffect, useState } from "react";
import { useParams } from "react-router";
import "../styles.scss";

import { useSelector } from "react-redux";
import API from "../../../config/api";
import { GET } from "../../../utils/apiCalls";
import Create from "./create";
import Edit from "./edit";

function SaleInvoiceForm(props: any) {
  const { id }: any = useParams();
  const { user } = useSelector((state: any) => state.User);
  const adminid = user?.id;
  const [isLoading, setIsLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [ledgers, setLedgers] = useState([]);
  const [product, setProduct] = useState([]);
  const [banks, setBanks] = useState([]);
  const [taxList, setTaxlist] = useState([]);
  const [reccuring,setReccuring] = useState([])
  const [customerName, setCustomerName] = useState("");

  useEffect(() => {
    getCustomers();
    getLedgers();
    loadTaxList();
    getBanks();
    getBankList();
    getReccuring();
  }, []);
  useEffect(() => {
    setTimeout(()=>{
      getCustomers();
    },500)
  }, [customerName]);

  const getCustomers = async () => {
    try {
      let customerapi = API.SUPPLIERS_AND_CUSTOMERS_SEARCH_LIST + adminid + `/${user?.companyInfo?.id}?name=${customerName}` ;
      const { data: customer }: any = await GET(customerapi, null);
      setCustomers(customer);
    } catch (error) {}
  };
  const getLedgers = async () => {
    try {
      let url = "account_master/defualt-ledger/sales/" + adminid;
      const { data: bank }: any = await GET(url, null);
      const filterData = bank.filter((item: any) => {
        return (
          item.nominalcode === "4000" ||
          item.nominalcode === "4001"
         //  || item.nominalcode === "4002"
        );
      });
      setLedgers(filterData);
    } catch (error) {}
  };
  const getBankList = async () => {
    try {
      let url = "account_master/getBankList/" + adminid + '/' + user?.companyInfo?.id;
      const { data }: any = await GET(url, null);
      setBanks(data.bankList);
    } catch (error) {}
  };

  const getProduct = async (itemType: any,locationId:any) => {
    try {
      if(itemType === "Stock"){
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
    
  const loadTaxList = async () => {
    try {
      let URL = API.TAX_MASTER + `list/${user?.id}/${user?.companyInfo?.id}`
      const data :any = await GET(URL, null);
      setTaxlist(data?.data);
    } catch (error) {
      console.log(error)
    }
  };
  const getReccuring = async ()=>{
    try{
      let URL = API.GET_RECCURING + id
      const {data}: any = await GET(URL,null)
      setReccuring(data)
    } catch(error){}
  }

  const getBanks = () => {};

  return (
    <div>
      {id === "0" ? (
        <Create
          customers={customers}
          ledgers={ledgers}
          banks={banks}
          adminid={adminid}
          product={product}
          taxList={taxList}
          customerName={(val: any) => setCustomerName(val)}
          getProduct={(itemType: any,locationId:any) => getProduct(itemType,locationId)}
        />
      ) : (
        <Edit
          customers={customers}
          ledgers={ledgers}
          banks={banks}
          adminid={adminid}
          product={product}
          taxList={taxList}
          reccuring = {reccuring}
          customerName={(val: any) => setCustomerName(val)}
          id={id}
          getProduct={(itemType: any,locationId:any) => getProduct(itemType,locationId)}
        />
      )}
      <br />
    </div>
  );
}
export default SaleInvoiceForm;
