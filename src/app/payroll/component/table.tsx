import { useRef, useState } from "react";
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
import { Button, Card, Popover } from "antd";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Container } from "react-bootstrap";
import { EXPORT } from "../../../utils/exportData";
import { MdEditDocument, MdPreview } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { RiDeleteBinLine } from "react-icons/ri";
import { useTranslation } from 'react-i18next';

const Table = (props: any) => {
  const dataGridRef: any = useRef(null);
  const [selectedRows, setSelectedRows] = useState();

  const navigate = useNavigate();
  const { t } = useTranslation();

  const onSelectionChanged = (e: any) => {
    setSelectedRows(e.selectedRowsData.length);
  };
  const exportFormats = ["pdf", "xlsx"];
  return (
    <Container>
      <br />
      <Card>
        <DataGrid
          ref={dataGridRef}
          dataSource={props.products}
          columnAutoWidth={true}
          showBorders={true}
          onExporting={(e) => EXPORT(e, dataGridRef, "Payroll", () => {})}
          showRowLines={true}
          onSelectionChanged={onSelectionChanged}
        >
          <Selection
            mode="multiple"
            selectAllMode="allPages"
            showCheckBoxesMode="always"
          />
          <SearchPanel visible={true} width={window.innerWidth <= 580 ? 140 : 240}
 />
          <HeaderFilter visible={true} />
          {props.columns.map((column: any, index: number) => {
            return (
              <Column
                dataField={column.name}
                caption={column.title}
                dataType={column.dataType}
                format={column.format}
                alignment={column.alignment}
                allowExporting={column.caption === "Action" ? false : true}
              ></Column>
            );
          })}

          <Paging defaultPageSize={10} />
          <Pager
            visible={true}
            allowedPageSizes={[10, 20, "all"]}
            displayMode={"compact"}
            showPageSizeSelector={true}
            showInfo={true}
            showNavigationButtons={true}
          />
          <Column
            alignment={"center"}
            type="buttons"
            caption={ `${t("home_page.homepage.Action_paysheet")}`}
            width={110}
            cellRender={(item, _) => {
              return (
                <div className="table-title">
                  <Popover
                    content={
                      <div className="table-actionBox">
                        <div
                          className="table-actionBoxItem"
                          onClick={(data: any) =>
                            navigate(
                              props?.view+item?.data?.id
                            )
                          }
                        >
                          <div>View</div>
                          <MdPreview size={18} color="grey" />
                        </div>
                        <div
                          className="table-actionBoxItem"
                          onClick={() =>
                             {
                            navigate(
                             props?.edit+item?.data?.id
                            );
                          }}
                        >
                          <div>Edit</div>
                          <MdEditDocument size={18} color="grey" />
                        </div>
                        {
                          props?.onDelete && 
                          <div
                          className="table-actionBoxItem"
                          onClick={() =>props?.onDelete(item?.data?.id)}
                        >
                          <div>Delete</div>
                          <RiDeleteBinLine size={18} color="grey" />
                        </div>
                        }
                        
                        <div>
                          {props?.isOpen && (
                            <Button
                              type="primary"
                              onClick={() => props?.isOpen(item?.data)}
                            >
                              Send Payment
                            </Button>
                          )}
                        </div>
                      </div>
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
                <div style={{ fontSize: "17px", fontWeight: 600 }}>
                  {selectedRows} selected
                </div>
              </Item>
            ) : (
              <Item location="before" visible={true}>
                <div style={{ fontSize: "17px", fontWeight: 600 }}>
                  {props.title}
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
