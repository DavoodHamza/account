import { useEffect, useState } from 'react'
import { Button, Card, notification } from 'antd'
import { t } from 'i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import StockTransferTable from './components/stockTable'
import { Container } from 'react-bootstrap'
import API from '../../config/api'
import { DELETE, GET } from '../../utils/apiCalls'
import PageHeader from '../../components/pageHeader'
import LoadingBox from '../../components/loadingBox'
import { useTranslation } from 'react-i18next'

const StockTransfer = () => {
  const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const {user} = useSelector((state:any)=>state.User)
    const [data,setData] = useState<any>()

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      let url = API.GET_STOCK_TRANSFER_LIST + user?.companyInfo?.id;
      const {data}: any = await GET(url, null);
      setData(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error)
      setIsLoading(false);
    }
  };

  const deleteHandler = async(id:number) =>{
    try {
      setIsLoading(true)
      let url = API.VIEW_STOCK_TRANSFER + id
      const response : any = await DELETE(url);
      if(response.status){
        fetchData();
        notification.success({
          message:"Success",
          description:"Transfer data deleted successfully"
        })
      }else{
        notification.error({
          message:"Failed",
          description:"Failed to delete transfer data"
        })
      }
    } catch (error) {
      console.log(error)
      notification.error({
        message:"Error",
        description:"Failed to delete transfer data! Please try again later"
      })
    }finally{
      setIsLoading(false)
    }
  }

  return (
    <>
    <PageHeader
      firstPathLink={location?.pathname}
      firstPathText={t("home_page.homepage.stock_transfer")} 
      title={t("home_page.homepage.stock_transfer")}
    >
      <div>
        <Button
          type="primary"
          onClick={() => navigate("/usr/stock-transfer/create")}
        >
           {t("home_page.homepage.stock_transfer")}
        </Button>
      </div>
    </PageHeader>
    {isLoading ? (
        <LoadingBox />
      ) : (
        <Container>
          <br />
        <Card>
           <StockTransferTable
          list={data}
          title={t("home_page.homepage.stock_transfer")}
          handleDelete={deleteHandler}
        />
        </Card>
          </Container>
      )}
    </>
  )
}

export default StockTransfer