import { Card, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { DataGrid } from "devextreme-react";
import { Column } from "devextreme-react/cjs/data-grid";
import { GET } from '../../../utils/apiCalls';
import LoadingBox from '../../../components/loadingBox';
import PageHeader from '../../../components/pageHeader';
import { useParams } from 'react-router-dom';

const columns = [
    {
        name: "invoiceno",
        title: "Invoice No.",
        dataType: "string",
        alignment: "center",
      },
      {
        name: "type",
        title: "Voucher Type",
        dataType: "string",
        alignment: "center",
      },
      {
          name: "paid_amount",
          title: "Paid Amount",
          dataType: "string",
          alignment: "center",
        },
        {
          name: "paid_status",
          title: "Paid Status",
          alignment: "center",
          cellRender:({data}:any)=><Tag
           color={data?.paid_status === 0 ? "#B71C1C" : data?.paid_status === 1 ? "#E65100" : "#1B5E20"}>
            {data?.paid_status === 0 ? "Unpaid" : data?.paid_status === 1 ? "Part paid" : "Paid" }</Tag>
        },
        {
          name: "status",
          title: "Status",
          alignment: "center",
          cellRender:({data}:any)=><Tag color={data?.status === 'open' ? "red" : "lightGreen"}>{data?.status}</Tag>
        },
  ];

const StaffTransactionView = () => {
    const [isLoading,setIsLoading] = useState(false);
    const [data,setData] = useState<any>();

    const {id} = useParams()
    const fetchStaffTransactionDetails = async () => {
        try {
          setIsLoading(true);
          let url = `StaffTransactions/getStaffTransaction/${id}`;
          const data : any = await GET(url, null);
          let details: any = [data.data];
          setData(details);
          setIsLoading(false);
        } catch (error) {
          console.log(error);
          setIsLoading(false);
        }
      };
      useEffect(()=>{
        fetchStaffTransactionDetails()
      },[])
  return (
    <>
      <PageHeader
        firstPathLink={"/usr/staff-transaction"}
        firstPathText={"Transactions"}
        // secondPathLink={`/usr/cash/cashTable/${type}`}
        secondPathText={"Transaction View"}
        goback={-1}
        title={`View Transaction`}
      />
      <br />
      <Container>
        {isLoading ? (
          <LoadingBox />
        ) : (
          <Card>
            <DataGrid
              dataSource={data}
              columnAutoWidth={true}
              showBorders={true}
              // onExporting={onExporting}
              showRowLines={true}
              remoteOperations={false}
            >
              {columns.map((column: any) => {
                return (
                  <Column
                    dataField={column.name}
                    caption={column.title}
                    dataType={column.dataType}
                    format={column.format}
                    alignment={'center'}
                  ></Column>
                );
              })}
            </DataGrid>
          </Card>
        )}
      </Container>
    </>
    
  )
}

export default StaffTransactionView