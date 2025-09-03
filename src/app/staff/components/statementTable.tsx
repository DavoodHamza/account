import { DatePicker, Form, Input, Select } from "antd";
import dayjs from "dayjs";
import DataGrid, {
  Column,
  Export,
  Item,
  Pager,
  Paging,
  Selection,
  Toolbar,
} from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.light.css";
import { useRef, useState } from "react";
import LoadingBox from "../../../components/loadingBox";
import { EXPORT } from "../../../utils/exportData";

const StatementTable = (props: any) => {
  const [form] = Form.useForm();

  const [selectedRows, setSelectedRows] = useState();
  const dataGridRef: any = useRef(null);
  // const exportFormats = ["xlsx", "pdf"];

  const onSelectionChanged = (e: any) => {
    setSelectedRows(e?.selectedRowsData?.length);
    props?.onSelectedData(e?.selectedRowsData);
  };

  return (
    <>
      <>
        {props?.isLoading ? (
          <LoadingBox />
        ) : (
          <Form
            form={form}
            onValuesChange={props.onValuesChange}
            initialValues={{
              dateRange: [
                dayjs(props?.onFilterData?.firstDate, "YYYY-MM-DD"),
                dayjs(props?.onFilterData?.currentDate, "YYYY-MM-DD"),
              ],
              status: props?.onFilterData?.onFilter,
              search: props?.onFilterData?.query,
            }}
          >
            <DataGrid
              ref={dataGridRef}
              dataSource={props?.list}
              columnAutoWidth={true}
              showBorders={true}
              onExporting={(e) => EXPORT(e, dataGridRef, "ledgers", {})}
              showRowLines={true}
              onSelectionChanged={onSelectionChanged}
              remoteOperations={false}
            >
              <Selection
                mode="multiple"
                selectAllMode="allPages"
                showCheckBoxesMode="always"
              />
              {props.columns.map((column: any, index: number) => {
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

              {selectedRows ? null : (
                <>
                  <Paging defaultPageSize={10} />

                  <Pager
                    visible={true}
                    allowedPageSizes={[10, 20, 30]}
                    displayMode={"compact"}
                    showPageSizeSelector={true}
                    showInfo={true}
                    showNavigationButtons={true}
                  />
                </>
              )}
              <Export
                enabled={true}
                allowExportSelectedData={true}
                //formats={exportFormats}
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
                <Item>
                  <Form.Item name="dateRange">
                    <DatePicker.RangePicker size="large" />
                  </Form.Item>
                </Item>
                {props?.trancection ? (
                  <Item>
                    <Form.Item name="status">
                      <Select
                        size="large"
                        style={{ width: 150 }}
                        placeholder="Select Status..."
                        defaultValue={'all'}
                      >
                        <Select.Option key="all" >All</Select.Option>
                        <Select.Option key="open">Open</Select.Option>
                        <Select.Option key="closed">Closed</Select.Option>
                      </Select>
                    </Form.Item>
                  </Item>
                ) : null}
                {props?.trancection ? (
                  <Item>
                    <Form.Item name="search">
                      <Input size="large" placeholder="Search..." />
                    </Form.Item>
                  </Item>
                ) : null}
              </Toolbar>
            </DataGrid>
          </Form>
        )}
      </>
    </>
  );
};

export default StatementTable;
