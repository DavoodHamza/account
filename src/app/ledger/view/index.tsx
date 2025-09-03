import { Card } from 'antd'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'
import PageHeader from '../../../components/pageHeader'
import API from '../../../config/api'
import { GET } from '../../../utils/apiCalls'
import LedgerStatementTable from '../component/statementTable'
import { useTranslation } from "react-i18next";

const ViewLedger = () => {
  const location = useLocation();
  const {t} =useTranslation();
  const [isLoading,setIsLoading] = useState(false)
  const [ledgerData,setLedgerData] = useState<any>()
  const [ledgerEntries,setLedgerEntries] = useState<any>()
  const today = new Date();
  const { fDate, lDate } = location?.state || {};
  const startDay =moment(new Date(today.setDate(1))).format("YYYY-MM-DD");
  const [currentDate, setCurrentDate] = useState(lDate || moment(new Date()).format("YYYY-MM-DD"));
  const [firstDate, setFirstDate] = useState(fDate || startDay);
  const {id} = useParams();
  const {user} = useSelector((state:any)=>state.User)
  let companyid = user.companyInfo?.id;

  const fetchLedgerEntries = async() =>{
    try {
      setIsLoading(true);
      let url = API.GET_ALL_LEDGER_DETAILS + `${id}/${companyid}/${firstDate}/${currentDate}`
      const response:any = await GET(url,null)
      setLedgerEntries(response?.data)
    } catch (error) {
      console.log(error)
    }finally{
      setIsLoading(false)
    }
  }
  
  const fetchLedgerDetails = async() =>{
    try {
      setIsLoading(true)
      let url = API.GET_LEDGER_DETAILS + id;
      const res:any = await GET(url,null);
      setLedgerData(res?.data)
    } catch (error) {
      console.log(error)
    }finally{
      setIsLoading(false)
    }
  }

  useEffect(()=>{
    fetchLedgerEntries();
    fetchLedgerDetails();
  },[])

  return (
    <>
    <PageHeader
        title={t("home_page.homepage.Ledger_Details")}
        secondPathLink ={location.pathname}
        secondPathText ={t("home_page.homepage.Ledger_Details")}
        firstPathLink={'/usr/ledgerMyLedger'}
        firstPathText={t("home_page.homepage.myledger")} 
        goBack={"/usr/ledgerMyCategory"}
      ></PageHeader>
    <Container>
      <br />
        <Card>
        <LedgerStatementTable
        list={ledgerEntries}
        fetchLedgerDetails={fetchLedgerDetails}
        setCurrentDate={setCurrentDate}
        setFirstDate={setFirstDate}
        currentDate={currentDate}
        firstDate={firstDate}
        openingBalance={ledgerData?.nominalcode == 2202 ? ledgerData?.total : ledgerData?.opening}
        title={ledgerData?.laccount}
        />
        </Card>
    </Container>  
    </>
  )
}

export default ViewLedger