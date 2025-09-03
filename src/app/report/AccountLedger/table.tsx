import React, { useState } from "react";
import { Container } from 'react-bootstrap';
import { Card } from 'antd';
import moment from "moment";
import DataGrid, { Column, SearchPanel, HeaderFilter, Export, Toolbar, Item } from 'devextreme-react/data-grid';
import { useTranslation } from "react-i18next";

const LedgerTable = ({ customer, ledger, ledgerName }: any) => {
  const exportFormats = ["xlsx", "pdf"];
  const Data = customer?.length ? customer : ledger;
  const { t } = useTranslation();

  const columns = [
    {
      name: 'id',
      title: t("home_page.homepage.slno"),
      dataType: "string",
      alignment: "center",
      cellRender: (data: any) => data?.rowIndex + 1,
    },
    {
      name: 'date',
      title: t("home_page.homepage.Date"),
      cellRender: ({ data }: any) => (
        <div style={{ textAlign: "center" }}>
          {moment(data?.date).format("DD-MM-YYYY")}
        </div>
      ),
    },
    {
      name: 'invoiceno',
      title: t("home_page.homepage.InvoiceNo")
    },
    {
      name: 'reference',
      title: t("home_page.homepage.Reference")
    },
    {
      name: 'paidmethod',
      title: t("home_page.homepage.Particular"),
      cellRender: ({ data }: any) => {
        return (
          <div style={{ textAlign: "center" }}>
            {data?.type === "Sales Invoice"
              ? "Sales"
              : data?.type === "Purchase Invoice"
              ? "Purchase"
              : data?.type === "stockassets"
              ? "Purchase For Asset"
              : data?.type === "Credit Notes"
              ? "Sales Credit Note"
              : data?.type === "Debit Notes"
              ? "Purchase Debit Note"
              : data?.type === "Journal"
              ? Array.isArray(data?.ledgerAccount) 
              ? data?.ledgerAccount.map((item: any) => (
              <div key={item}>{item}</div>
              ))
              : null
              : data?.itemDetails?.laccount}
          </div>
        );}
    },
    {
      name: 'type',
      title: t("home_page.homepage.VoucharType"),
      cellRender: ({ data }: any) => (
        <div className="d-flex justify-content-center">
          {data.type === "Journal"
            ? "Journal"
            : data?.type === "stockassets"
              ? "Purchase Invoice"
              : data.type}
        </div>
      ),
    },
    {
      name: 'credit',
      title: t("home_page.homepage.Credit")
    },
    {
      name: 'debit',
      title: t("home_page.homepage.Debit")
    },
    {
      name: "",
      title: t("home_page.homepage.Balance"),
      cellRender: ({ rowIndex }: any) => {
        let balance = Math.abs(Data?.openingBalance || 0);
        for (let i = 0; i <= rowIndex; i++) {
          const debitValue = parseFloat(Data[i].debit) || 0;
          const creditValue = parseFloat(Data[i].credit) || 0;
          balance += creditValue;
          balance -= debitValue;
        }
        const formattedBalance = balance >= 0
          ? `${balance} Cr.`
          : `${Math.abs(balance)} Dr.`;
        return <div>{formattedBalance}</div>;
      }
    },
  ]
  return (
    <>
      <Container>
        <br />
        <Card>
          <DataGrid
            dataSource={Data}
            columnAutoWidth={true}
            showBorders={true}
            showRowLines={true}
            remoteOperations={false}
          >
            <SearchPanel visible={true} width={window.innerWidth <= 580 ? 140 : 240} />
            <HeaderFilter visible={true} />
            {columns.map((column: any, index: number) => (
              <Column
                key={index}
                dataField={column.name}
                caption={column.title}
                dataType={column.dataType}
                format={column.format}
                alignment={'center'}
                cellRender={column.cellRender}
              ></Column>
            ))}
            <Export
              enabled={true}
              allowExportSelectedData={true}
              formats={exportFormats}
            />
            <Toolbar>
              <Item location="before" visible={true}>
                <h5>{ledgerName}</h5>
              </Item>
              <Item name="searchPanel" />
              <Item location="after" visible={true} name="exportButton" />
            </Toolbar>
          </DataGrid>
        </Card>
      </Container>
    </>
  )
};
export default LedgerTable