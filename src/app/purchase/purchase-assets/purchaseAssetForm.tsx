import "../styles.scss";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { GET } from "../../../utils/apiCalls";
import Edit from "./edit";
import API from "../../../config/api";
import CreatePurchaseAsset from "./create";
import DuplicatePurchaseAsset from "./duplicate";

function PurchaseAssetForm(props: any) {
  const { type, id }: any = useParams();
  const { user } = useSelector((state: any) => state.User);
  const adminid = user?.id;
  const [ledgers, setLedgers] = useState([]);
  const [product, setProduct] = useState([]);
  const [banks, setBanks] = useState([]);
  const [taxList, setTaxlist] = useState([]);
  const [supplier, setSupplier] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getLedgers();
    loadTaxList();
    getBankList();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      getSuppliers();
    }, 500);
  }, [searchQuery]);

  const getSuppliers = async () => {
    try {
      let url =
        API.SUPPLIERS_AND_CUSTOMERS_SEARCH_LIST +
        adminid +
        `/${user?.companyInfo?.id}?name=${searchQuery}`;
      const { data: customer }: any = await GET(url, null);
      setSupplier(customer);
    } catch (error) {
      console.log(error);
    }
  };

  const getLedgers = async () => {
    try {
      let url = API.GET_FIXED_ASSET_LEDJERS + user?.id;
      const response: any = await GET(url, null);
      setLedgers(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const getProduct = async (val: any) => {
    let allLedgers = await getLedgers();
    const nominalCode: any =
      allLedgers &&
      allLedgers.length &&
      allLedgers.find((item: any) => item.id === val);
    try {
      let url = API.GET_AACCOUNT_BYID + adminid + `/${nominalCode.nominalcode}`;
      const data: any = await GET(url, null);
      setProduct(data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadTaxList = async () => {
    try {
      let URL =
        API.TAX_MASTER + `list/${user?.id}/${user?.companyInfo?.id}`;
      const data: any = await GET(URL, null);
      if (data?.status) {
        setTaxlist(data?.data);
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getBankList = async () => {
    try {
      let url =
        "account_master/getBankList/" + adminid + "/" + user?.companyInfo?.id;
      const { data }: any = await GET(url, null);
      setBanks(data.bankList);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {type === "create" ? (
        <CreatePurchaseAsset
          customers={supplier}
          ledgers={ledgers}
          banks={banks}
          adminid={adminid}
          product={product}
          taxList={taxList}
          getProduct={(val: any) => getProduct(val)}
          customerSearch={(val: any) => setSearchQuery(val)}
        />
      ) : type === "duplicate" ? (
        <DuplicatePurchaseAsset
          customers={supplier}
          ledgers={ledgers}
          banks={banks}
          adminid={adminid}
          product={product}
          taxList={taxList}
          id={id}
          getProduct={(val: any) => getProduct(val)}
          customerSearch={(val: any) => setSearchQuery(val)}
        />
      ) : (
        <Edit
          customers={supplier}
          ledgers={ledgers}
          banks={banks}
          adminid={adminid}
          product={product}
          taxList={taxList}
          id={id}
          type={type}
          getProduct={(val: any) => getProduct(val)}
          customerSearch={(val: any) => setSearchQuery(val)}
        />
      )}
      <br />
    </div>
  );
}
export default PurchaseAssetForm;
