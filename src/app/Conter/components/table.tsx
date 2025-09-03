import { Card, Form, Input, Pagination } from 'antd';
import DataGrid, {
  Column,
  Item,
  SearchPanel,
  Selection,
  Toolbar
} from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.light.css";
import { useRef, useState } from "react";
import LoadingBox from '../../../components/loadingBox';
import { EXPORT } from '../../../utils/exportData';
import { useTranslation } from 'react-i18next';

const CounterTable = (props: any) => {
  const [form] = Form.useForm()
  const { t } = useTranslation();

  const [selectedRows, setSelectedRows] = useState();
  const dataGridRef: any = useRef(null);
  const exportFormats = ["xlsx", "pdf"];
  const onSelectionChanged = (e: any) => {
    setSelectedRows(e.selectedRowsData.length);
  };

  const onValuesChange = (val: any) => {
    props.onQuery(val.search)
  }
  return (
    <Card>
      <>
        {props?.isLoading ? (
          <LoadingBox />
        ) : (
          <Form
            form={form}
            onValuesChange={onValuesChange}
            initialValues={{
              search: props?.query
            }}
          >
            <DataGrid
              ref={dataGridRef}
              dataSource={props?.list}
              columnAutoWidth={true}
              showBorders={true}
              onExporting={(e) =>
                EXPORT(e, dataGridRef, "ledgers", {})
              }
              showRowLines={true}
              onSelectionChanged={onSelectionChanged}
              remoteOperations={false}
            >
              <Selection
                mode="multiple"
                selectAllMode="allPages"
                showCheckBoxesMode="always"
              />
              <SearchPanel visible={true} width={window.innerWidth <= 580 ? 140 : 240}
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

                <Item >
                  <Form.Item name="search">
                    <Input size="large" placeholder='Search...' />
                  </Form.Item>
                </Item>
              </Toolbar>
            </DataGrid>
          </Form>
        )}
      </>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: '20px' }}>
        <Pagination
          total={props.meta?.itemCount}
          showSizeChanger={true}
          showTotal={(total) =>
            `${t("home_page.homepage.countertitle")} ${props.meta?.totalCount} Counter`
          }
          onChange={(page, pageSize) => props.onPage(page, pageSize)}
        />
      </div>
    </Card>
  )
}

export default CounterTable