import React, { useEffect, useState } from 'react'
import { Col, Container, Row, Table } from 'react-bootstrap'
import PageHeader from '../../../components/pageHeader'
import { useLocation, useParams } from 'react-router-dom'
import API from '../../../config/api'
import { GET } from '../../../utils/apiCalls'
import LoadingBox from '../../../components/loadingBox'
import { Card, Checkbox } from 'antd'
import dayjs from 'dayjs'

function PaySheetView() {
    const [data,setData] = useState<any>()
    const [isLoading,setIsLoading] = useState(false)
    const location = useLocation()
    const {id} = useParams()

    const fetchDetails = async()=>{
        try {
            setIsLoading(true)
            let url = API.GET_PAYSHEET + id;
            const data:any = await GET(url,null)
            setData(data) 
        } catch (error) {
            console.log(error)
        }finally{
            setIsLoading(false)
        }
    }
    useEffect(()=>{
        fetchDetails()
    },[])

  return (
    <>
    <PageHeader
        firstPathLink={location?.pathname.slice(5)}
        firstPathText={'Pay Sheet List'}
        secondPathLink={location.pathname}
        secondPathText='Details'
        goBack={-1}
        title="Pay Roll - Pay Sheet Details"
      />
    <Container>
        {
            isLoading ? <LoadingBox/> : (
                <>
                <br/>
                <Card>
            <Row>
              <Col md="12">
                <div className="salesInvoice-Header">Pay Roll - Pay Sheet</div>

                <Table bordered>
                  <tbody>
                    <tr>
                      <td className="items-head">Name</td>
                      <td>
                      <strong>{`${data?.["employee.firstName"]} ${data?.["employee.lastName"]}`}</strong>
                      </td>
                      <td className="items-head">EIR Code</td>
                      <td className="items-value">
                      {data?.["employee.eircode"]}
                      </td>
                    </tr>
                    <tr>
                      <td className="items-head"> Designation</td>
                      <td className="items-value">
                      {data?.["employee.Designation"]}
                      </td>
                      <td className="items-head">Email</td>
                      <td className="items-value">
                      {data?.["employee.email"]}
                      </td>
                    </tr>
                    <tr>
                      <td className="items-head">Phone</td>
                      <td className="items-value">
                      {data?.["employee.phone"]}
                      </td>
                      <td className="items-head"> Full Address </td>
                      <td className="items-value">
                      {data?.["employee.fullAddress"]}
                      </td>
                    </tr>
                    <tr>
                      <td className="items-head">Date of Joining</td>
                      <td className="items-value">
                      {dayjs(data?.employee?.date_of_join).format(
                          "DD-MM-YYYY"
                        )}
                      </td>
                      <td className="items-head"> Salary Package </td>
                      <td className="items-value">
                      {data?.["employee.salaryPackage"]}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
              <Col>
                <div className="salesInvoice-SubHeader ">Earnings</div>
                        <Table bordered>
                        <thead>
                          <tr>
                            <th>Pay Head</th>
                            {/* <th>Calculation Period</th> */}
                            <th>Calculation Type</th>
                            <th>Percentage Of</th>
                            <th>Percentage %</th>
                            <th>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                { data?.paySheetItems && data?.paySheetItems?.filter((item:any) => item.type === 'earnings').map((item:any) => (
                              <tr>
                                <td>{item?.payHead?.laccount}</td>
                                {/* <td>{item?.payHead?.calculationPeriod == 1 ? 'Weekly' : item?.payHead?.calculationPeriod == 2 ? 'Monthly' : item?.payHead?.calculationPeriod == 3 ? 'Yearly' : ''}</td> */}
                                <td>{item?.calculationType? item?.calculationType : '-'}</td>
                                <td>{item?.persentageof ? item?.persentageof : '-'}</td>
                                <td>{item?.percentage == '0.00' ? '-' : item?.percentage}</td>
                                <td>{item?.amount}</td>
                              </tr> ))  }
                        </tbody>
                      </Table>
               
              </Col>

              <Col>
                <div className="salesInvoice-SubHeader ">Deductions</div>
                
                        <Table bordered>
                  <thead>
                    <tr>
                    <th>Pay Head</th>
                    {/* <th>Calculation Period</th> */}
                    <th>Calculation Type</th>
                    <th>Percentage Of</th>
                    <th>Percentage %</th>
                    <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                  {
                    data?.paySheetItems && data?.paySheetItems?.filter((item:any) => item.type === 'deduction').map((item:any) => (
                        <tr>
                        <td>{item?.payHead?.laccount}</td>
                        {/* <td>{item?.payHead?.calculationPeriod == 1 ? 'Weekly' : item?.payHead?.calculationPeriod == 2 ? 'Monthly' : item?.payHead?.calculationPeriod == 3 ? 'Yearly' : ''}</td> */}
                        <td>{item?.calculationType? item?.calculationType : '-'}</td>
                        <td>{item?.persentageof ? item?.persentageof : '-'}</td>
                        <td>{item?.percentage == '0.00' ? '-' : item?.percentage}</td>
                        <td>{item?.amount}</td>
                        </tr>
                  ))}
                  </tbody>
                </Table>
                
              </Col>
            </Row>
            <Row>
              <Col sm={8}></Col>
              <Col sm={4}>
                <Table bordered>
                  <tbody>
                    <tr>
                      <td>TOTAL EARNINGS</td>
                      <td>{data?.totalEarnings?.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td>TOTAL DEDUCTIONS</td>
                      <td>{data?.totalDeduction?.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td>NET SALARY</td>
                      <td>{data?.netSalary?.toFixed(2)}</td>
                    </tr>
                    
                  </tbody>
                </Table>
              </Col>
            </Row>
        

          </Card>
                </>
            )
        }

    </Container>
    </>
  )
}

export default PaySheetView