import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import API from "../../../config/api";
import { GET } from "../../../utils/apiCalls";
import "../styles.scss";
import Create from "./create";

function CreditNotesForm() {
  const { user } = useSelector((state: any) => state.User);
  const adminid = user?.id;
  const [customers, setCustomers] = useState([]);
  const [ledgers, setLedgers] = useState([]);
  const [product, setProduct] = useState([]);
  const [banks, setBanks] = useState([]);
  const [taxList, setTaxlist] = useState([]);
  const [customerName, setCustomerName] = useState("");
  
  useEffect(() => {
    getCustomers();
    getProduct();
    loadTaxList();
    getLedgers();
  }, []);

  useEffect(() => {
    getCustomers();
  }, [customerName]);

  //get ledgers
  const getLedgers = async () => {
    try {
      let url = "account_master/defualt-ledger/sales/" + adminid;
      const { data: bank }: any = await GET(url, null);
      setLedgers(bank);
    } catch (error) {
      console.log(error)
    }
  };

  const getProduct = async () => {
    try {
      let productuul = "ProductMaster/user/non-assets/" + adminid + '/' + user?.companyInfo?.id;
      const { data: products }: any = await GET(productuul, null);
      setProduct(products);
    } catch (error) {
      console.log(error)
    }
  };

  const loadTaxList = async () => {
    try {
      let URL = API.TAX_MASTER + `list/${user?.id}/${user?.companyInfo?.id}`;
      const data :any = await GET(URL, null);
      setTaxlist(data?.data);
    } catch (error) {
      console.log(error)
    }
  };

  const getCustomers = async () => {
    try {
      let customerapi = API.SUPPLIERS_AND_CUSTOMERS_SEARCH_LIST + adminid + `/${user?.companyInfo?.id}?name=${customerName}` ;
      const { data: customer }: any = await GET(customerapi, null);
      setCustomers(customer);
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div>
        <Create
          customers={customers}
          banks={banks}
          adminid={adminid}
          ledgers={ledgers}
          product={product}
          getProduct={getProduct}
          taxList={taxList}
          customerName={(val: any) => setCustomerName(val)}
        />
      <br />
    </div>
  );
}
export default CreditNotesForm;
