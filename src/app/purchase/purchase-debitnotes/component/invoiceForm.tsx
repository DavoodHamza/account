import "../../styles.scss";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

import Create from "./create";
import Edit from "./edit";
import { useSelector } from "react-redux";
import { GET } from "../../../../utils/apiCalls";
import API from "../../../../config/api";

function PurchaceDebitnotesForm(props: any) {
  const { id }: any = useParams();
  const { user } = useSelector((state: any) => state.User);
  const adminid = user?.id;
  const [supplier, setSupplier] = useState([]);
  const [ledgers, setLedgers] = useState([]);
  const [banks, setBanks] = useState([]);
  const [taxList, setTaxlist] = useState([]);
  const [customerSerch, setCustomerSerch] = useState("");

  useEffect(() => {
    getLedgers();
    loadTaxList();
    getBankList();
  }, []);

  useEffect(() => {
    setTimeout(()=>{
      getSuplliers();
    },500)
  }, [customerSerch]);

  const getSuplliers = async () => {
    try {
      let supplierapi =API.SUPPLIERS_AND_CUSTOMERS_SEARCH_LIST + adminid + `/${user?.companyInfo?.id}?name=${customerSerch}` ;
      const { data: supplier }: any = await GET(supplierapi, null);
      setSupplier(supplier);
    } catch (error) {
      console.log(error)
    }
  };

  const getLedgers = async () => {
    let URL = API.PURCHASE_DEFUALT_LEDGER_LIST + user?.id;
    const { data }: any = await GET(URL, null);
    const filtered = data.filter(
      (item: any) => item.id === 20703 
      //|| item.id === 20705 // purchae service return added
    );
    setLedgers(filtered);
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

  const getBankList = async () => {
    try {
      let url = "account_master/getBankList/" + adminid + "/" + user?.companyInfo?.id;
      const { data }: any = await GET(url, null);
      setBanks(data.bankList);
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div>
      {id === "create" ? (
        <Create
          customers={supplier}
          ledgers={ledgers}
          banks={banks}
          adminid={adminid}
          companyid={user?.companyInfo?.id}
          taxList={taxList}
          customerSearch={(val: any) => setCustomerSerch(val)}
        />
      ) : (
        <Edit
          customers={supplier}
          ledgers={ledgers}
          banks={banks}
          adminid={adminid}
          companyid={user?.companyInfo?.id}
          taxList={taxList}
          id={id}
          customerSearch={(val: any) => setCustomerSerch(val)}
        />
      )}
      <br />
    </div>
  );
}
export default PurchaceDebitnotesForm;
