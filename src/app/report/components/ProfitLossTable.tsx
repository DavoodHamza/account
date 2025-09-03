import { Table } from "react-bootstrap";
// import { FaEye } from "react-icons/fa";
const ProfitLossTable = (props: any) => {
  return (
    <Table bordered hover striped>
      <thead className="Report-thead">
        <th className="Report-table-th">Type</th>
        {/* <th className="Report-table-th">Invoice No/Reference</th> */}
        <th className="Report-table-th">Amount</th>
        {/* <th className="Report-table-th">
          No of Items ({props?.details?.detailedData?.length})
        </th> */}
      </thead>
      <tbody>
        {props?.details?.detailedData &&
          props?.details?.detailedData?.length &&
          props?.details?.detailedData?.map((details2: any, i: number) =>
            props?.type1?.length ? (
              details2.type === props?.type1 ? (
                <tr>
                  <td>{details2?.type}</td>
                  {/* <td>{details2?.invoiceno}</td> */}
                  <td>{details2?.amount}</td>
                  {/* <td onClick={() => alert("clicked")}>
                    {details2?.amount ? <FaEye/> : null}
                  </td> */}
                </tr>
              ) : null
            ) : (
              <tr>
                <td>{details2?.type}</td>
                {/* <td>{details2?.invoiceno}</td> */}
                <td>{details2?.amount}</td>
                {/* <td onClick={() => alert("clicked")}>
                  {details2?.amount ? <FaEye/> : null}
                </td> */}
              </tr>
            )
          )}
      </tbody>
    </Table>
  );
};

export default ProfitLossTable;
