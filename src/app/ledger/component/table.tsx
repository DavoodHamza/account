import { Button, Card, Popover } from "antd";
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
import { useCallback, useRef, useState } from "react";
import { Container } from "react-bootstrap";
import { EXPORT } from "../../../utils/exportData";
import AddDefualtCategory from "../ledger-MyCategory/addCategory";
import AddLedger from "../ledger-MyLedger/addLedger";
import LedgerVisibility from "./visibility";
import { useNavigate } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdEditDocument, MdPreview } from "react-icons/md";
import { useTranslation } from "react-i18next";

const LedgerTable = (props: any) => {
  const { t } = useTranslation();
  const dataGridRef: any = useRef(null);
  const [selectedRows, setSelectedRows] = useState();
  const [page, SetPage] = useState(1);
  const [take, setTake] = useState(10);
  const [open, setOpen] = useState(false);
  const [categoryCreate, setCategoryCreate] = useState(false);
  const [visibility, setVisibility] = useState(false);
  const [data, setData] = useState();

  const onSelectionChanged = (e: any) => {
    setSelectedRows(e.selectedRowsData.length);
  };
  const exportFormats = ["xlsx", "pdf"];

  const reloadTable = useCallback(() => {
    if (dataGridRef.current && dataGridRef.current.instance) {
      dataGridRef.current.instance.clearFilter();
      dataGridRef.current.instance.refresh();

      if (typeof props?.onPageChange === "function") {
        props?.onPageChange(page, take);
      }
    }
  }, [page, take, props]);

  const handleOptionChanged = (e: any) => {
    if (e.fullName === "paging.pageIndex") {
      SetPage(e.value);
    }
    if (e.fullName === "paging.pageSize") {
      const newPageSize = [10, 20].includes(e.value) ? e.value : 10;
      setTake(newPageSize);

      SetPage(0);
      reloadTable();
    }
    if (
      (e.fullName === "paging.pageSize" || e.name === "pageSize") &&
      typeof props?.onPageChange === "function"
    ) {
      props.onPageChange(page, take);
    }
  };
  const onVisible = (val: any) => {
    setData(val);
    setVisibility(true);
  };

  const navigate = useNavigate();

  return (
    <Container>
      <br />
      <Card>
        <DataGrid
          ref={dataGridRef}
          dataSource={props.products}
          columnAutoWidth={true}
          showBorders={true}
          onExporting={(e) => EXPORT(e, dataGridRef, "ledgers", () => {})}
          showRowLines={true}
          onSelectionChanged={onSelectionChanged}
          onOptionChanged={handleOptionChanged}
          remoteOperations={false}
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
          {props?.columns.map((column: any, index: number) => {
            return (
              <Column
                dataField={column.name}
                caption={column.title}
                dataType={column.dataType}
                format={column.format}
                alignment={"center"}
                cellRender={column.cellRender}
              ></Column>
            );
          })}
          <Paging defaultPageSize={take} />

          <Pager
            visible={true}
            allowedPageSizes={[10, 20, 30, 60]}
            displayMode={"compact"}
            showPageSizeSelector={true}
            showInfo={true}
            showNavigationButtons={true}
          />
          {props?.type !== "Default Category" && (
            <Column
              alignment={"center"}
              caption={t("home_page.homepage.Status_comon")}
              cellRender={(item) => {
                return (
                  <Popover
                    content={
                      props?.type && props.type === "My Ledgers" ? (
                        <>
                          <div
                            className="table-actionBoxItem"
                            onClick={() => {
                              navigate(`/usr/ledger-view/${item?.data?.id}`);
                            }}
                          >
                            <div>{t("home_page.homepage.View")}</div>
                            <MdPreview size={18} color="grey" />
                          </div>
                          {props.canUpdateLedgers && props.canUpdateLedgers() && (
                            <div
                              className="table-actionBoxItem"
                              onClick={() => props.myLedgerOnEdit(item)}
                            >
                              <div>{t("home_page.homepage.Edit")}</div>
                              <MdEditDocument size={18} color="grey" />
                            </div>
                          )}
                          <Button
                            size="small"
                            type="primary"
                            onClick={() => onVisible(item)}
                          >
                            {t("home_page.homepage.Visibility")}
                          </Button>
                        </>
                      ) : props?.type === "Default Ledger" ? (
                        <>
                          <div className="table-title">
                            <div
                              className="table-actionBoxItem"
                              onClick={() => {
                                if (item?.data?.id == 47) {
                                  navigate(`/usr/report/sundryDebtors`);
                                } else if (item?.data?.id == 51) {
                                  navigate(`/usr/report/sundryCreditors`);
                                } else {
                                  navigate(
                                    `/usr/ledger-view/${item?.data?.id}`
                                  );
                                }
                              }}
                            >
                              <div>{t("home_page.homepage.View")}</div>
                              <MdPreview size={18} color="grey" />
                            </div>
                            <Button
                              type="primary"
                              size="small"
                              onClick={() => onVisible(item)}
                            >
                              {t("home_page.homepage.Visibility")}
                            </Button>
                          </div>
                        </>
                      ) : props?.type === "Default Ledger" ||
                        props?.type === "Default Category" ? null : (
                        <>
                          <div
                            className="table-actionBoxItem"
                            onClick={() =>
                              props.type === "My Category"
                                ? props.defualtCategoryOnEdit(item)
                                : props?.type === "Default Ledger"
                                ? props.defualtLedgeronEdit(item)
                                : null
                            }
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <MdEditDocument size={18} color="grey" />
                            <div>{t("home_page.homepage.Edit")}</div>
                          </div>
                        </>
                      )
                    }
                    placement="bottom"
                    trigger={"click"}
                  >
                    <BsThreeDotsVertical size={16} cursor={"pointer"} />
                  </Popover>
                );
              }}
            ></Column>
          )}

          <Export
            enabled={true}
            allowExportSelectedData={true}
            formats={exportFormats}
          />
          <Toolbar>
            {selectedRows ? (
              <Item location="before" visible={true}>
                <div style={{ fontSize: "17px", fontWeight: 600 }}>
                  {selectedRows} {t("home_page.homepage.selected")}
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
      {open && (
        <AddLedger data={data} onOpen={open} onClose={() => setOpen(false)} />
      )}
      {categoryCreate && (
        <AddDefualtCategory
          onOpen={categoryCreate}
          onClose={() => setCategoryCreate(false)}
        />
      )}
      {visibility ? (
        <LedgerVisibility
          data={data}
          open={visibility}
          onSuccess={props.onSuccess}
          onClose={() => setVisibility(false)}
        />
      ) : null}
    </Container>
  );
};

export default LedgerTable;
