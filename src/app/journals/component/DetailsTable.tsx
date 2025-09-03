import DataGrid, { Column } from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.light.css";
import { Card } from "antd";
import { Container } from "react-bootstrap";
const DetailsTable = (props: any) => {
  return (
    <Container>
      <br />
      <Card>
        <DataGrid
          dataSource={props?.data}
          columnAutoWidth={true}
          showBorders={true}
          showRowLines={true}
          showColumnLines={true}
          style={{ textAlign: "center" }}
        >
           <Column
            alignment={"center"}
            caption="Ledger"
            cellRender={({data}) => {
              return (
                <div>
                  { data?.bus_name || data?.ledgerDetails?.laccount}
                </div>
              );
            }}
          ></Column>
          {props.columns.map((column: any) => {
            return (
              <Column
                dataField={column?.name}
                caption={column?.title}
                dataType={column?.dataType}
                format={column?.format}
                alignment={column?.alignment}
              ></Column>
            );
          })}
         
        </DataGrid>
      </Card>
    </Container>
  );
};
export default DetailsTable;