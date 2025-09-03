import { Empty } from "antd";
import { Table } from "react-bootstrap";
type Props = {
  itemsDetails: any; // table data
  title: string;
  type: "default" | "product";
  totalSum: number | null;
};
export default function ProductionItemsDataTable({
  itemsDetails,
  title,
  type,
  totalSum,
}: Props) {
  return (
    <Table responsive bordered className={"productionScreenTable-2"}>
      <thead>
        <tr>
          <th
            colSpan={type === "product" ? 6 : 5}
            className={"productionScreenTableHeader1"}
          >
            <div className="productionScreen-txt5">{title}</div>
          </th>
        </tr>
        {itemsDetails?.length ? (
          <tr>
            <th>sl no</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            {type === "product" ? <th>Unit Sale Price</th> : null}
            <th>Total Price</th>
          </tr>
        ) : null}
      </thead>

      <tbody>
        {itemsDetails?.length ? (
          <>
            {itemsDetails.map((item: any, index: number) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item?.productDetails?.idescription}</td>
                <td>
                  {item?.totalQuantity} &nbsp;
                  {item?.productDetails?.units}
                </td>
                <td>{item?.unitCostPrice.toFixed(2)}</td>
                {type === "product" ? (
                  <td>{item?.unitSalesPrice.toFixed(2)}</td>
                ) : null}
                <td>{item?.totalCostPrice.toFixed(2)}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={type === "product" ? 5 : 4} align="right">
                Total
              </td>
              <td>{totalSum?.toFixed(2) || 0}</td>
            </tr>
          </>
        ) : (
          <tr>
            <td colSpan={type === "product" ? 6 : 5}>
              <Empty description={`No Products`} />
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}
