import { Card, Popover, notification } from "antd";
import DataGrid, {
  Column,
  Export,
  HeaderFilter,
  Item,
  Pager,
  Paging,
  SearchPanel,
  Selection,
  Toolbar,
} from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.light.css";
import moment from "moment";
import { useRef, useState } from "react";
import { Container } from "react-bootstrap";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import ViewPopover from "../../../components/viewPopover";
import API from "../../../config/api";
import { DELETE } from "../../../utils/apiCalls";
import { EXPORT } from "../../../utils/exportData";
import "../styles.scss";
import { useTranslation } from "react-i18next";

const ReccuringNotificationTable = (props: any) => {
  const dataGridRef: any = useRef(null);
  const [selectedRows, setSelectedRows] = useState();
  const { t } = useTranslation();

  const navigate = useNavigate();

  const onSelectionChanged = (e: any) => {
    setSelectedRows(e.selectedRowsData.length);
  };

  //function to delete a record using id
  const OnDelete = async (id: number) => {
    try {
      const deleteUrl = API.DELETE_RECCURING + id
      const deletedData: any = await DELETE(deleteUrl)
      if (deletedData.status === true) {
        notification.success({
          message: "Success",
          description: "Credit Note Deleted Successfully",
        });
        props.refreshData()
      } else if (deletedData.status === false) {
        notification.error({
          message: "Failed",
          description: "Credit Note Deletion Failed",
        });
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Server Error",
        description: "Something went wrong in server!! Please try again later",
      });
    }
  };

  //function to edit a row using id
  const OnEdit = async (invoice_id: number, id: number) => {
    navigate(`edit/${invoice_id}`, { state: { id } });
  };


  const columns = [
    {
      dataField: "invoice_number",
      caption: t("home_page.homepage.Reference_Invoice"),
    },
    {
      dataField: "period",
      caption: t("home_page.homepage.Period"),
    },
    {
      dataField: "date",
      caption: t("home_page.homepage.Start_Date"),
      cellRender: ({ data }: any) => moment(data.date).format("DD-MM-YY"),
    },
    {
      dataField: "nextdate",
      caption: t("home_page.homepage.next_date"),
      cellRender: ({ data }: any) => moment(data.nextdate).format("DD-MM-YY"),
    },
    {
      caption: "Action",
      cellRender: ({ data }: any) => {
        return (
          <div className="table-title">
            <Popover
              content={
                <ViewPopover
                  OnDelete={() => OnDelete(data.id)}
                  OnEdit={() => OnEdit(data.invoice_id, data.id)}
                />
              }
              placement="bottom"
              trigger={"click"}
            >
              <BsThreeDotsVertical size={16} cursor={"pointer"} />
            </Popover>
          </div>
        );
      },
      fixed:true,
      fixedPosition:"right"
    },
  ];

  const exportFormats = ["pdf", "xlsx"];
  const handleRowDoubleClick=()=>{
    
  }
  return (
    <Container>
      <br />
      <Card>
        <DataGrid
          ref={dataGridRef}
          dataSource={props?.list}
          columnAutoWidth={true}
          showRowLines={true}
          remoteOperations={false}
          showBorders={true}
          onExporting={(e) => EXPORT(e, dataGridRef, "recurring", () => { })}
          onSelectionChanged={onSelectionChanged}
          onRowDblClick={handleRowDoubleClick} 
        >
          <Selection
            mode="multiple"
            selectAllMode="allPages"
            showCheckBoxesMode="always"
          />
          <SearchPanel visible={true} width={window.innerWidth <= 580 ? 140 : 240}
          />
          <HeaderFilter visible={true} />
          {columns?.map((column:any, index) => (
            <Column
              key={index}
              dataField={column.dataField}
              caption={column.caption}
              fixed={column?.fixed || ""}
              fixedPosition={column?.fixedPosition || ""}
              alignment="center"
              cellRender={column?.cellRender}
            />
          ))}
          <Paging defaultPageSize={10} />
          <Pager
            showPageSizeSelector={true}
            allowedPageSizes={[10, 20, "all"]}
            showInfo={true}
          />
          <Export
            enabled={true}
            allowExportSelectedData={true}
            formats={exportFormats}
          />
          <Toolbar>
            {selectedRows ? (
              <Item location="before" visible={true}>
                <div style={{ fontSize: "17px", fontWeight: 600 }}>
                  {selectedRows} selected
                </div>
              </Item>
            ) : (
              <Item location="before" visible={true}>
                <div style={{ fontSize: "17px", fontWeight: 600 }}>
                  Total Reccuring Invoices :{props?.list?.length}
                </div>
              </Item>
            )}
            <Item name="searchPanel" />
            <Item location="after" visible={true} name="exportButton" />
          </Toolbar>
        </DataGrid>
      </Card>
    </Container>
  );
};
export default ReccuringNotificationTable;
