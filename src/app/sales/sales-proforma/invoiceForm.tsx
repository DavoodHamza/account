import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import API from "../../../config/api";
import { GET } from "../../../utils/apiCalls";
import "../styles.scss";
import Create from "./create";
import Edit from "./edit";
import Generate from "./generate";

function ProformaInvoiceForm(props: any) {
  const { id, type }: any = useParams();
  const { user } = useSelector((state: any) => state.User);
  const adminid = user?.id;
  const [customers, setCustomers] = useState([]);
  const [ledgers, setLedgers] = useState([]);
  const [banks, setBanks] = useState([]);
  const [details, setDetails] = useState({});
  const [taxList, setTaxlist] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [product, setProduct] = useState([]);

  useEffect(() => {
    loadTaxList();
    if (type === "generate") {
      getLedgers();
      getBankList();
    }
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
    } catch (error) {}
  };

  const getLedgers = async () => {
    try {
      let url = "account_master/defualt-ledger/sales/" + adminid;
      const { data }: any = await GET(url, null);
      const filterData = data?.filter((item: any) => {
        return (
          item.nominalcode === "4000" || item.nominalcode === "4001"
          //  || item.nominalcode === "4002"
        );
      });
      setLedgers(filterData);
    } catch (error) {}
  };
  const getBankList = async () => {
    try {
      let url =
        "account_master/getBankList/" + adminid + "/" + user?.companyInfo?.id;
      const { data }: any = await GET(url, null);
      setBanks(data.list);
    } catch (error) {}
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

  const getProduct = async (itemType: any, locationId: any) => {
    try {
      let url = API.GET_PRODUCTS_BY_LOCATION + locationId;
      const response: any = await GET(url, null);

      if (response.status) {
        setProduct(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {type === "create" ? (
        <Create
          customers={customers}
          id={id}
          products={product}
          taxList={taxList}
          customerName={(val: any) => setCustomerName(val)}
          getProduct={(itemType: any, locationId: any) =>
            getProduct(itemType, locationId)
          }
        />
      ) : type === "generate" ? (
        <Generate
          customers={customers}
          products={product}
          ledgers={ledgers}
          banks={banks}
          taxList={taxList}
          details={details}
          id={id}
          customerName={(val: any) => setCustomerName(val)}
          getProduct={(itemType: any, locationId: any) =>
            getProduct(itemType, locationId)
          }
        />
      ) : (
        <Edit
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
          getProduct={(itemType: any, locationId: any) =>
            getProduct(itemType, locationId)
          }
        />
      )}
      <br />
    </div>
  );
}
export default ProformaInvoiceForm;
