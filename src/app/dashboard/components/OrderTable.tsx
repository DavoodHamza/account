import { Button, Tag } from "antd";
import DataGrid, {
  Column,
  Item,
  Paging,
  Toolbar,
} from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.light.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import statusData from "../../../config/statusCode.json";

const Table = (props: any) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const renderStatusCell = (cellData: any) => {
    const status = cellData?.data?.status;
    const statusInfo = statusData?.find((item: any) => item.value === status);
    if (statusInfo) {
      const { statusText, statusBgColor } = statusInfo;

      return <Tag color={statusBgColor}>{statusText}</Tag>;
    }

    return null;
  };

  return (
    <>
      <DataGrid
        dataSource={props?.data || []}
        columnAutoWidth={true}
        showBorders={true}
        showRowLines={true}
        remoteOperations={false}
        noDataText={t("home_page.homepage.No_data")}
      >
        {props?.columns?.map((column: any, index: number) => {
          if (column.name === "status") {
            return (
              <Column
                key={index}
                dataField={column.name}
                caption={column.title}
                alignment={column.alignment}
                cellRender={renderStatusCell}
              />
            );
          } else {
            return (
              <Column
                key={index}
                dataField={column.name}
                caption={column.title}
                dataType={column.dataType}
                format={column.format}
                alignment={column.alignment}
              />
            );
          }
        })}

        <Paging defaultPageSize={10} />
        <Toolbar>
          <Item location="before" visible={true}>
            <div style={{ fontSize: "17px", fontWeight: 600 }}>
              {props.title}
            </div>
          </Item>
          <Item location="after" visible={true}>
            <Button
              onClick={() => navigate("/usr/sales-proforma-invoice")}
              size="small"
              type="link"
            >
              {t("home_page.homepage.View_All")}
            </Button>
          </Item>
        </Toolbar>
      </DataGrid>
    </>
  );
};

export default Table;
