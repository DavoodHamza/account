import "../../styles.scss";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

import Create from "./create";
import Edit from "./edit";
import { useSelector } from "react-redux";
import { GET } from "../../../../utils/apiCalls";
import API from "../../../../config/api";
import PurchaseDuplicate from "./duplicate";

function PurchaceInvoiceForm(props: any) {
  const { type,id }: any = useParams();
  const { user } = useSelector((state: any) => state.User);
  const adminid = user?.id;
  const [supplier, setSupplier] = useState([]);
  const [ledgers, setLedgers] = useState([]);
  const [product, setProduct] = useState([]);
  const [banks, setBanks] = useState([]);
  const [details, setDetails] = useState({});
  const [taxList, setTaxlist] = useState([]);
  const [purchace, setPurchace] = useState([]);
  const [searchQuery, setSearchQurey] = useState("");

  useEffect(() => {
    getLedgers();
    loadTaxList();
    getBankList();
    if (type !== "create") {
      getDetails();
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      fetchSuppliers();
    }, 500);
  }, [searchQuery]);

  const fetchSuppliers = async () => {
    try {
      let supplierapi =
        API.SUPPLIERS_AND_CUSTOMERS_SEARCH_LIST +
        adminid +
        `/${user?.companyInfo?.id}?name=${searchQuery}`;
      const { data: supplier }: any = await GET(supplierapi, null);
      setSupplier(supplier);
    } catch (error) {
      console.log(error);
    }
  };

  const getLedgers = async () => {
    let URL = "account_master/list";
    const { data }: any = await GET(URL, null);
    const filtered = data?.filter(
      (item: any) => item.id === 12 || item.id === 20835
    );
    setLedgers(filtered);
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

  const loadTaxList = async () => {
    try {
      let URL =
        API.TAX_MASTER + `list/${user?.id}/${user?.companyInfo?.id}`;
      const data: any = await GET(URL, null);
      setTaxlist(data?.data);
    } catch (error) {}
  };

  const getBankList = async () => {
    try {
      let url =
        "account_master/getBankList/" + adminid + "/" + user?.companyInfo?.id;
      const { data }: any = await GET(url, null);
      setBanks(data.bankList);
    } catch (error) {}
  };

  const getDetails = async () => {
    try {
      let invoiceurl = API.PURCHASE_SUPPLIER_LIST + id + "/purchase";
      const { data: purchaceDeatails }: any = await GET(invoiceurl, null);
      setPurchace(purchaceDeatails);
    } catch (err) {}
  };

  return (
    <div>
      {type === "create" ? (
        <Create
          customers={supplier}
          ledgers={ledgers}
          banks={banks}
          adminid={adminid}
          taxList={taxList}
          getProduct={(itemType: any,locationId:any) => getProduct(itemType,locationId)}
          product={product}
          customerSearch={(val: any) => setSearchQurey(val)}
        />
      ) : type === "duplicate" ? (
        <PurchaseDuplicate
          customers={supplier}
          ledgers={ledgers}
          banks={banks}
          adminid={adminid}
          product={product}
          taxList={taxList}
          purchace={purchace}
          getProduct={(itemType: any,locationId:any) => getProduct(itemType,locationId)}
          customerSearch={(val: any) => setSearchQurey(val)}
        />
      ) : (
        <Edit
          customers={supplier}
          ledgers={ledgers}
          banks={banks}
          product={product}
          details={details}
          adminid={adminid}
          taxList={taxList}
          purchace={purchace}
          id={id}
          getProduct={(itemType: any,locationId:any) => getProduct(itemType,locationId)}
          customerSearch={(val: any) => setSearchQurey(val)}
        />
      )}
      <br />
    </div>
  );
}
export default PurchaceInvoiceForm;
