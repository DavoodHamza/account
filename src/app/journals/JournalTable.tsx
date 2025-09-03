import { useState, useRef } from "react";
import DataGrid, {
  Column,
  SearchPanel,
  Export,
  Paging,
  Pager,
  HeaderFilter,
  Selection,
  Toolbar,
  Item,
} from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.light.css";
import { Card, Popover } from "antd";
import { Container } from "react-bootstrap";
import { EXPORT } from "../../utils/exportData";
import { BsThreeDotsVertical } from "react-icons/bs";
import ViewPopover from "../../components/viewPopover";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import moment from "moment";
const Table = (props: any) => {
  const { t } = useTranslation();
  const dataGridRef: any = useRef(null);
  const [selectedRows, setSelectedRows] = useState();
  const [page, SetPage] = useState(1);
  const [take, setTake] = useState(10);
  const navigate = useNavigate();
  const onSelectionChanged = (e: any) => {
    setSelectedRows(e.selectedRowsData.length);
  };
  const exportFormats = ["xlsx", "pdf"];
  const handleOptionChanged = (e: any) => {
    if (e.fullName === "paging.pageIndex") {
      SetPage(e.value);
    }
    if (e.fullName === "paging.pageSize") {
      setTake(e.value);
    }
    if (e.fullName === "paging.pageSize" || e.name === "pageSize") {
      props.onPageChange(page, take);
    }
  };

  const columns = [
    {
      name: "id",
      caption: "SL No",
      dataType: "string",
      alignment: "center",
      cellRender: (data: any) => data?.rowIndex + 1,
    },
    {
      dataField: "userdate",
      caption: t("home_page.homepage.Date"),
      format: "date",
      cellRender: ({ data }: any) => (
        <div style={{ textAlign: "center" }}>
          {moment(data?.userdate).format("DD-MM-YYYY")}
        </div>
      ),
    },

    {
      dataField: "particulars",
      caption: t("home_page.homepage.Particulars"),
      cellRender: ({ data }: any) => (
        <div>
          {data?.contactData?.length === 0
            ? "-"
            : data?.contactData?.map((contact: any) => (
                <div>{contact?.bus_name || contact?.laccount}</div>
              ))}
        </div>
      ),
    },
    {
      dataField: "total",
      caption: t("home_page.homepage.Amount"),
    },
  ];

  const customizeExportCell = (type: any, gridCell: any, cell: any) => {
    if (
      gridCell.rowType === "data" &&
      (gridCell.column.dataField === "userdate" ||
        gridCell.column.dataField === "particulars") &&
      gridCell.rowType !== "header" &&
      gridCell.rowType !== "totalFooter"
    ) {
      if (gridCell.column.dataField === "userdate") {
        const userdate = moment(gridCell.data?.userdate)?.format("DD-MM-YYYY");
        if (type === "pdf") {
          cell.text = userdate ?? "";
        } else if (type === "xlsx") {
          cell.value = userdate ?? "";
        }
      }
      if (
        gridCell.rowType === "data" &&
        gridCell?.column?.caption === "SL No"
      ) {
        const id = gridCell?.column?.index + 1;
        if (type === "pdf") {
          cell.text = id.toString();
        } else if (type === "xlsx") {
          cell.value = id;
        }
      }
      if (gridCell.column.dataField === "particulars") {
        const particulars = gridCell.data?.contactData.map((Item: any) => {
          return Item.bus_name || Item.laccount;
        });
        if (type === "pdf") {
          cell.text = particulars.join(", ") ?? "";
        } else if (type === "xlsx") {
          cell.value = particulars.join(", ") ?? "";
        }
      }
    }
  };
  const handleRowDoubleClick = (record: any) => {
    navigate(`/usr/journal/details/${record?.data.id}`);
  };
  const onRowPrepared = (e: any) => {
    if (e.rowType === "data") {
      e.rowElement.style.cursor = "pointer";
    }
  };
  return (
    <Container>
      <br />
      <Card>
        <DataGrid
          ref={dataGridRef}
          dataSource={props.journals}
          onExporting={(e) =>
            EXPORT(e, dataGridRef, "journal List", customizeExportCell)
          }
          onOptionChanged={handleOptionChanged}
          onRowDblClick={handleRowDoubleClick}
          onSelectionChanged={onSelectionChanged}
          showRowLines={true}
          onRowPrepared={onRowPrepared}
          columnAutoWidth={true}
          showColumnLines={true}
          showBorders={true}
          remoteOperations={false}
          style={{ textAlign: "center" }}
          searchPanel={{
            visible: true,
            width: window.innerWidth <= 580 ? 140 : 240,
            placeholder: "Search Journals",
            searchVisibleColumnsOnly: true,
            highlightCaseSensitive: false,
          }}
        >
          <Selection
            mode="multiple"
            selectAllMode="allPages"
            showCheckBoxesMode="always"
          />
          <SearchPanel
            visible={true}
            width={window.innerWidth <= 580 ? 140 : 240}
          />
          <HeaderFilter visible={true} />
          <HeaderFilter visible={true} />
          {columns.map((column: any, index: number) => {
            return (
              <Column
                key={index}
                dataField={column.dataField}
                caption={column.caption}
                format={column.format}
                cellRender={column.cellRender}
                fixed={column?.fixed || ""}
                fixedPosition={column?.fixedPosition || ""}
                allowExporting={column.caption === "id" ? false : true}
                alignment="center"
              ></Column>
            );
          })}
          <Paging defaultPageSize={10} />
          <Pager
            visible={true}
            allowedPageSizes={[10, 20, 30]}
            displayMode={"compact"}
            showPageSizeSelector={true}
            showInfo={true}
            showNavigationButtons={true}
          />
          <Column
            alignment={"center"}
            type="buttons"
            caption="Action"
            fixed={true}
            fixedPosition="right"
            dataField="id"
            width={110}
            cellRender={({ data }) => {
              return (
                <div className="table-title">
                  <Popover
                    content={
                      <ViewPopover
                        onView={() => {
                          navigate(`/usr/journal/details/${data.id}`);
                        }}
                        OnEdit={
                          props.canUpdateJournals && props.canUpdateJournals()
                            ? () => navigate(`/usr/journal/edit/${data.id}`)
                            : undefined
                        }
                        OnDelete={
                          props.canDeleteJournals && props.canDeleteJournals()
                            ? () => {
                                props?.handleDelete(data?.id);
                              }
                            : undefined
                        }
                      />
                    }
                    placement="bottom"
                    trigger={"click"}
                  >
                    <BsThreeDotsVertical size={16} cursor={"pointer"} />
                  </Popover>
                </div>
              );
            }}
          ></Column>
          <Export
            enabled={true}
            allowExportSelectedData={true}
            formats={exportFormats}
          />
          <Toolbar>
            {selectedRows ? (
              <Item location="before" visible={true}>
                <div className="pageHdrTxt">{selectedRows} selected</div>
              </Item>
            ) : (
              <Item location="before" visible={true}>
                <div className="pageHdrTxt">
                  {t("home_page.homepage.Total_Jounals")} :
                  {props?.journals?.length}
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
export default Table;
