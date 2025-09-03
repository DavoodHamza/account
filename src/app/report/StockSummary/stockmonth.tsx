// import { useEffect, useState } from "react";
// import { Container, Table } from "react-bootstrap";
// import { useSelector } from "react-redux";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import LoadingBox from "../../../components/loadingBox";
// import PageHeader from "../../../components/pageHeader";
// import API from "../../../config/api";
// import { GET } from "../../../utils/apiCalls";
// import "./styles.scss";

// const StockMonth = () => {
//   const navigate = useNavigate();
//   const [data, setData] = useState<any>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const { user } = useSelector((state: any) => state.User);
//   const adminid = user?.id;
//   const { id } = useParams();
//   const [monthQuantitySum, setMonthQuantitySum] = useState<any>({});
//   const [monthsaleqty, setmonthsaleqty] = useState<any>({});
//   const [sumsTotall, setSumsTotal] = useState<any>([]);
//   const [sumtotalpur, setsumtotalpur] = useState<any>([]);
//   const [Quantity, setQuantity] = useState<any>();
//   const [curentQuantity, setCurentQuantity] = useState<any>();
//   const [Costprice, setCostprice] = useState<any>({});
//   const location = useLocation();
//   const monthDatas = [
//     { id: 4, value: "April" },
//     { id: 5, value: "May" },
//     { id: 6, value: "June" },
//     { id: 7, value: "July" },
//     { id: 8, value: "August" },
//     { id: 9, value: "September" },
//     { id: 10, value: "October" },
//     { id: 11, value: "November" },
//     { id: 12, value: "December" },
//     { id: 1, value: "January" },
//     { id: 2, value: "February" },
//     { id: 3, value: "March" },
//   ];

//   let totalQuantity = 0;
//   let totalVal: any = 0;
//   const loadData = async () => {
//     try {
//       setIsLoading(true);
//       let product_url = API.GET_PRODUCT_TYPE + `${adminid}/${user?.companyInfo?.id}`;
//       const { data }: any = await GET(product_url, null);
//       const filteredData = data.filter((item: any) => item.id == id);
//       setQuantity(filteredData[0]?.stockquantity);
//       setCurentQuantity(Number(filteredData[0].stock));
//       setCostprice(filteredData[0].stockquantity ? filteredData[0].costprice : 0);
//       setData(data);
//     } catch (error) {
//       console.error("Error loading data:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getmonthpurchase = async () => {
//     try {
//       setIsLoading(true);
//       let URL = API.INWARD_DATA + user?.id + '/' + id;
//       const { data }: any = await GET(URL, null);
//       let sum: any = {};
//       let sumsTotalpur: any = {};
//       let totalInwards = 0;
//       let totalinwardsvalue = 0;
//       if (data) {
//         monthDatas.forEach((month) => {
//           const monthData = data[month.value] || [];
//           sum[month.value] = monthData.reduce(
//             (quan: any, item: any) => quan + parseFloat(item.quantity),
//             0
//           );
//           totalInwards += sum[month.value];
//         });
//         monthDatas.forEach((month) => {
//           const monthData = data[month.value] || [];
//           sumsTotalpur[month.value] = monthData.reduce(
//             (totalValue: any, item: any) => {
//               let tot: any = Number(item?.total / item?.quantity);
//               totalValue += parseFloat(item.quantity) * parseFloat(tot);
//               return totalValue;
//             },
//             0
//           );
//           totalinwardsvalue += sumsTotalpur[month.value];
//         });
//         setMonthQuantitySum(sum);
//         setsumtotalpur(sumsTotalpur);
//       }
//       setIsLoading(false);
//     } catch (error) {
//       console.error("Error fetching month purchase data:", error);
//       setIsLoading(false);
//     }
//   };

//   const getmonthsales = async () => {
//     try {
//       setIsLoading(true);
//       let URL = API.OUTWARD_DATA + user?.id + '/' + id;
//       const { data }: any = await GET(URL, null);

//       let sumsales: any = {};
//       let sumsTotal: any = {};
//       let totaloutwards = 0;
//       let totaloutvalue = 0;
//       if (data) {
//         monthDatas.forEach((month) => {
//           const monthData = data[month.value] || [];
//           sumsales[month.value] = monthData.reduce(
//             (quan: any, item: any) => quan + parseFloat(item.quantity),
//             0
//           );
//           totaloutwards += sumsales[month.value];
//         });
//         monthDatas.forEach((month) => {
//           const monthData = data[month.value] || [];
//           sumsTotal[month.value] = monthData.reduce(
//             (totalValue: any, item: any) => {
//               let tot: any = Number(item?.total / item?.quantity);
//               totalValue += parseFloat(item.quantity) * parseFloat(tot);
//               return totalValue;
//             },
//             0
//           );
//           totaloutvalue += sumsTotal[month.value];
//         });
//         setmonthsaleqty(sumsales);
//         setSumsTotal(sumsTotal);
//       }
//       setIsLoading(false);
//     } catch (error) {
//       console.error("Error  month sales data:", error);
//       setIsLoading(false);
//     }
//   };

//   const calculateTotalClosingQty = (index: any, purchase: any, sales: any) => {
//     let totalClosingQtyCalculation: any;
//     if (index === 0) {
//       totalClosingQtyCalculation =
//         Number(Quantity) ? Number(Quantity) + Number(purchase) - Number(sales) : Number(purchase) - Number(sales);
//       totalQuantity = totalClosingQtyCalculation;
//     } else {
//       totalClosingQtyCalculation =
//         Number(totalQuantity) ? Number(totalQuantity) + Number(purchase) - Number(sales) : Number(purchase) - Number(sales);
//       totalQuantity = totalClosingQtyCalculation;
//     }
//     return totalClosingQtyCalculation;
//   };
//   let purchaseRate = 0
//   let purchaseQuantity = 0
//   const calculateTotalClosingValue = (
//     index: any,
//     purchase: any,
//     quantity: any
//   ) => {
//     if (index == 0) {
//       let val: any = Number(Quantity) * Number(Costprice);
//       let purchaceAllRate = Number(purchaseRate) + Number(purchase) + val
//       purchaseRate = purchaceAllRate ? purchaceAllRate : 0
//       let purchaseAllQty = Number(purchaseQuantity) + (Number(quantity) + Number(Quantity))
//       purchaseQuantity = purchaseAllQty ? purchaseAllQty : 0
//       let val2 = Number(purchaseQuantity) ? Number(purchaseRate) / Number(purchaseQuantity) : 0;
//       let val3 = Number(purchaseQuantity) ? val2 * (Number(totalQuantity)) : 0;
//       totalVal = val3;
//     } else {
//       purchaseRate = Number(purchaseRate) + Number(purchase)
//       purchaseQuantity = Number(purchaseQuantity) + Number(quantity)
//       let val1 = Number(purchaseQuantity) ? Number(purchaseRate) / Number(purchaseQuantity) : 0;
//       let totalClosingValue = val1 * (Number(totalQuantity))
//       totalVal = Number(purchaseQuantity) ? totalClosingValue : totalVal;
//     }
//     return totalVal;
//   };

//   const fetchData = async () => {
//     await getmonthpurchase();
//     await getmonthsales();
//     await loadData();
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   return (
//     <>
//       <PageHeader firstPathText="Report" 
//       title="STOCK SUMMARY - Month"
//       firstPathLink="/usr/report"
//       secondPathText="stocksummary"
//       secondPathLink={location.pathname} 
//       thirdPathText = "stocksummary-month"
//       thirdPathLink={location.pathname} 
//        />
//       {isLoading ? (
//         <LoadingBox />
//       ) : (
//         <Container>
//           <div className="StocksummaryTable-box">
//             <div className="StocksummaryTable-box1">
//               <div className="StocksummaryTable-head">
//                 {data?.map((items: any) => {
//                   if (items?.id == id) {
//                     return (
//                       <div
//                         key={items?.id}
//                         style={{
//                           fontSize: "25px",
//                         }}
//                       >
//                         {items.idescription}
//                       </div>
//                     );
//                   }
//                 })}
//               </div>

//               <Table bordered hover striped width={"auto"}>
//                 <thead className="Report-thead">
//                   <tr>
//                     <th className="Report-table-th">PARTICULAR</th>
//                     <th className="Report-table-th">
//                       <center style={{ marginBottom: 10 }}>Inwards</center>
//                       <>
//                         <div className="stockSummaryItem1">
//                           <span>QUANTITY</span>
//                           <span>VALUE</span>
//                         </div>
//                       </>
//                     </th>
//                     <th className="Report-table-th">
//                       <center style={{ marginBottom: 10 }}>Outwards</center>
//                       <>
//                         <div className="stockSummaryItem1">
//                           <span>QUANTITY</span>
//                           <span>VALUE</span>
//                         </div>
//                       </>
//                     </th>

//                     <th className="Report-table-th">
//                       <center style={{ marginBottom: 10 }}>
//                         Closing Balance
//                       </center>
//                       <>
//                         <div className="stockSummaryItem1">
//                           <span>QUANTITY</span>
//                           <span>VALUE</span>
//                         </div>
//                       </>
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   <tr>
//                     <td className="Report-table-td">Opening Balance</td>
//                     <td className="Report-table-td"></td>
//                     <td className="Report-table-td"></td>
//                     {data?.map((item: any) => {
//                       if (item?.id == id) {
//                         return (
//                           <td key={item?.id} className="Report-table-td">
//                             <>
//                               <div className="Report-cardIcon-view-box">
//                                 <span>{Quantity}</span>
//                                 <span>
//                                   {Number(
//                                     Number(Quantity) * Number(Costprice)
//                                   ).toFixed(2)}
//                                 </span>
//                               </div>
//                             </>
//                           </td>
//                         );
//                       }
//                     })}
//                     {!data.length ? (
//                       <td className="Report-table-td">
//                         <div className="Report-cardIcon-view-box">
//                           <span>0</span>
//                           <span>0.00</span>
//                         </div>
//                       </td>
//                     ) : null}
//                   </tr>

//                   {monthDatas?.map((month, index, item) => {
//                     return (
//                       <tr key={index}>
//                         <td
//                           className="Report-td-link"
//                           onClick={() =>
//                             navigate(
//                               `/usr/report/StockSummary/stockbase/${user?.id}/${id}/${month.id}`
//                             )
//                           }
//                         >
//                           {month.value}
//                         </td>
//                         <td className="Report-table-td">
//                           <>
//                             <div className="stockSummaryItem1">
//                               <span>
//                                 {monthQuantitySum[month.value] === 0
//                                   ? " "
//                                   : monthQuantitySum[month.value]}
//                               </span>{" "}
//                               <span>
//                                 {isNaN(sumtotalpur[month.value]) || sumtotalpur[month.value] == 0
//                                   ? " "
//                                   : Number(sumtotalpur[month.value]).toFixed(2)}
//                               </span>
//                             </div>
//                           </>
//                         </td>
//                         <td className="Report-table-td">
//                           <>
//                             <div className="stockSummaryItem1">
//                               <span>
//                                 {monthsaleqty[month.value] === 0
//                                   ? " "
//                                   : monthsaleqty[month.value]}
//                               </span>{" "}
//                               <span>
//                                 {isNaN(sumtotalpur[month.value]) || sumsTotall[month.value] == 0
//                                   ? " "
//                                   : Number(sumsTotall[month.value]).toFixed(2)}
//                               </span>
//                             </div>
//                           </>
//                         </td>
//                         <td className="Report-table-td">
//                           <>
//                             <div className="stockSummaryItem1">
//                               <span>
//                                 {" "}
//                                 {calculateTotalClosingQty(
//                                   index,
//                                   monthQuantitySum[month.value],
//                                   monthsaleqty[month.value]
//                                 ) || 0}
//                               </span>{" "}
//                               <span>
//                                 {calculateTotalClosingValue(
//                                   index,
//                                   sumtotalpur[month.value],
//                                   monthQuantitySum[month.value]
//                                 ).toFixed(2)}
//                               </span>
//                             </div>
//                           </>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                   <tr>
//                     <th className="Report-table-th"> Grand Total</th>
//                     <th className="Report-table-th">
//                     </th>
//                     <th className="Report-table-th">
//                     </th>
//                     <th className="Report-table-th">
//                       <div className="stockSummaryItem1">
//                         <span>{curentQuantity}</span>
//                         <span>{totalVal.toFixed(2)}</span>
//                       </div>
//                     </th>
//                   </tr>
//                 </tbody>
//               </Table>
//             </div>
//           </div>
//         </Container>
//       )}
//     </>
//   );
// };
// export default StockMonth;




import { useEffect, useState } from "react";
import { Container, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import LoadingBox from "../../../components/loadingBox";
import PageHeader from "../../../components/pageHeader";
import API from "../../../config/api";
import { GET } from "../../../utils/apiCalls";
import "./styles.scss";

const StockMonth = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state: any) => state.User);
  const adminid = user?.id;
  const { id } = useParams();
  const [monthQuantitySum, setMonthQuantitySum] = useState<any>({});
  const [monthsaleqty, setmonthsaleqty] = useState<any>({});
  const [sumsTotall, setSumsTotal] = useState<any>([]);
  const [sumtotalpur, setsumtotalpur] = useState<any>([]);
  const [Quantity, setQuantity] = useState<any>();
  const [curentQuantity, setCurentQuantity] = useState<any>();
  const [Costprice, setCostprice] = useState<any>({});
  const location = useLocation();
  const monthDatas = [
    { id: 4, value: "April" },
    { id: 5, value: "May" },
    { id: 6, value: "June" },
    { id: 7, value: "July" },
    { id: 8, value: "August" },
    { id: 9, value: "September" },
    { id: 10, value: "October" },
    { id: 11, value: "November" },
    { id: 12, value: "December" },
    { id: 1, value: "January" },
    { id: 2, value: "February" },
    { id: 3, value: "March" },
  ];
console.log("user",user)
const getFilteredMonths = (financialYearStartMonth: string) => {
  const allMonths = [
    { id: 4, value: "April" },
    { id: 5, value: "May" },
    { id: 6, value: "June" },
    { id: 7, value: "July" },
    { id: 8, value: "August" },
    { id: 9, value: "September" },
    { id: 10, value: "October" },
    { id: 11, value: "November" },
    { id: 12, value: "December" },
    { id: 1, value: "January" },
    { id: 2, value: "February" },
    { id: 3, value: "March" },
  ];

  // Get current date and month
  const currentDate = new Date(); 
  const currentMonthName = currentDate.toLocaleString('default', { month: 'long' }); 
  
  // Normalize financial year start month
  const startMonthName = financialYearStartMonth.charAt(0).toUpperCase() + 
                       financialYearStartMonth.slice(1).toLowerCase(); 
  
  // Get indices
  const financialStartIndex = allMonths.findIndex(month => month.value === startMonthName); 
  const currentIndex = allMonths.findIndex(month => month.value === currentMonthName); 

  if (financialStartIndex === -1) {
    throw new Error("Invalid financial year start month provided");
  }

  // Get months from financial start to current month
  let resultMonths = [];
  if (currentIndex >= financialStartIndex) {
    // If current month is after or equal to start month in the array
    resultMonths = allMonths.slice(financialStartIndex, currentIndex + 1);
  } else {
    // If current month is before start month in the array (wraps around year)
    resultMonths = [
      ...allMonths.slice(financialStartIndex),
      ...allMonths.slice(0, currentIndex + 1)
    ];
  }

  return resultMonths;
};
console.log("new Date(user?.companyInfo?.financial_year_start).toLocaleString('default', { month: 'long' })new Date(user?.companyInfo?.financial_year_start).toLocaleString('default', { month: 'long' })",new Date(user?.companyInfo?.financial_year_start).toLocaleString('default', { month: 'long' }))
console.log("getFilteredMonths",getFilteredMonths(new Date(user?.companyInfo?.financial_year_start).toLocaleString('default', { month: 'long' })))
  let totalQuantity = 0;
  let totalVal: any = 0;
  const loadData = async () => {
    try {
      setIsLoading(true);
      let product_url = API.GET_PRODUCT_TYPE + `${adminid}/${user?.companyInfo?.id}`;
      const { data }: any = await GET(product_url, null);
      const filteredData = data.filter((item: any) => item.id == id);
      setQuantity(filteredData[0]?.stockquantity);
      setCurentQuantity(Number(filteredData[0].stock));
      setCostprice(filteredData[0].stockquantity ? filteredData[0].costprice : 0);
      setData(data);
    } catch (error) {
      console.error("Error loading data:", error);
      
    } finally {
      setIsLoading(false);
    }
  };

  const getmonthpurchase = async () => {
    try {
      setIsLoading(true);
      let URL = API.INWARD_DATA + user?.id + '/' + id;
      const { data }: any = await GET(URL, null);
      let sum: any = {};
      let sumsTotalpur: any = {};
      let totalInwards = 0;
      let totalinwardsvalue = 0;
      if (data) {
        getFilteredMonths(new Date(user?.companyInfo?.financial_year_start).toLocaleString('default', { month: 'long' })).forEach((month) => {
          const monthData = data[month.value] || [];
          sum[month.value] = monthData.reduce(
            (quan: any, item: any) => quan + parseFloat(item.quantity),
            0
          );
          totalInwards += sum[month.value];
        });
        getFilteredMonths(new Date(user?.companyInfo?.financial_year_start).toLocaleString('default', { month: 'long' })).forEach((month) => {
          const monthData = data[month.value] || [];
          sumsTotalpur[month.value] = monthData.reduce(
            (totalValue: any, item: any) => {
              let tot: any = Number(item?.total / item?.quantity);
              totalValue += parseFloat(item.quantity) * parseFloat(tot);
              return totalValue;
            },
            0
          );
          totalinwardsvalue += sumsTotalpur[month.value];
        });
        setMonthQuantitySum(sum);
        setsumtotalpur(sumsTotalpur);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching month purchase data:", error);
      setIsLoading(false);
    }
  };

  const getmonthsales = async () => {
    try {
      setIsLoading(true);
      let URL = API.OUTWARD_DATA + user?.id + '/' + id;
      const { data }: any = await GET(URL, null);

      let sumsales: any = {};
      let sumsTotal: any = {};
      let totaloutwards = 0;
      let totaloutvalue = 0;
      if (data) {
        getFilteredMonths(new Date(user?.companyInfo?.financial_year_start).toLocaleString('default', { month: 'long' })).forEach((month) => {
          const monthData = data[month.value] || [];
          sumsales[month.value] = monthData.reduce(
            (quan: any, item: any) => quan + parseFloat(item.quantity),
            0
          );
          totaloutwards += sumsales[month.value];
        });
        getFilteredMonths(new Date(user?.companyInfo?.financial_year_start).toLocaleString('default', { month: 'long' })).forEach((month) => {
          const monthData = data[month.value] || [];
          sumsTotal[month.value] = monthData.reduce(
            (totalValue: any, item: any) => {
              let tot: any = Number(item?.total / item?.quantity);
              totalValue += parseFloat(item.quantity) * parseFloat(tot);
              return totalValue;
            },
            0
          );
          totaloutvalue += sumsTotal[month.value];
        });
        setmonthsaleqty(sumsales);
        setSumsTotal(sumsTotal);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error  month sales data:", error);
      setIsLoading(false);
    }
  };

  const calculateTotalClosingQty = (index: any, purchase: any, sales: any) => {
    let totalClosingQtyCalculation: any;
    if (index === 0) {
      totalClosingQtyCalculation =
        Number(Quantity) ? Number(Quantity) + Number(purchase) - Number(sales) : Number(purchase) - Number(sales);
      totalQuantity = totalClosingQtyCalculation;
    } else {
      totalClosingQtyCalculation =
        Number(totalQuantity) ? Number(totalQuantity) + Number(purchase) - Number(sales) : Number(purchase) - Number(sales);
      totalQuantity = totalClosingQtyCalculation;
    }
    return totalClosingQtyCalculation;
  };
  let purchaseRate = 0
  let purchaseQuantity = 0
  const calculateTotalClosingValue = (
    index: any,
    purchase: any,
    quantity: any
  ) => {
    if (index == 0) {
      let val: any = Number(Quantity) * Number(Costprice);
      let purchaceAllRate = Number(purchaseRate) + Number(purchase) + val
      purchaseRate = purchaceAllRate ? purchaceAllRate : 0
      let purchaseAllQty = Number(purchaseQuantity) + (Number(quantity) + Number(Quantity))
      purchaseQuantity = purchaseAllQty ? purchaseAllQty : 0
      let val2 = Number(purchaseQuantity) ? Number(purchaseRate) / Number(purchaseQuantity) : 0;
      let val3 = Number(purchaseQuantity) ? val2 * (Number(totalQuantity)) : 0;
      totalVal = val3;
    } else {
      purchaseRate = Number(purchaseRate) + Number(purchase)
      purchaseQuantity = Number(purchaseQuantity) + Number(quantity)
      let val1 = Number(purchaseQuantity) ? Number(purchaseRate) / Number(purchaseQuantity) : 0;
      let totalClosingValue = val1 * (Number(totalQuantity))
      totalVal = Number(purchaseQuantity) ? totalClosingValue : totalVal;
    }
    return totalVal;
  };

  const fetchData = async () => {
    await getmonthpurchase();
    await getmonthsales();
    await loadData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <PageHeader firstPathText="Report" 
      title="STOCK SUMMARY - Month"
      firstPathLink="/usr/report"
      secondPathText="stocksummary"
      secondPathLink={location.pathname} 
      thirdPathText = "stocksummary-month"
      thirdPathLink={location.pathname} 
       />
      {isLoading ? (
        <LoadingBox />
      ) : (
        <Container>
          <div className="StocksummaryTable-box">
            <div className="StocksummaryTable-box1">
              <div className="StocksummaryTable-head">
                {data?.map((items: any) => {
                  if (items?.id == id) {
                    return (
                      <div
                        key={items?.id}
                        style={{
                          fontSize: "25px",
                        }}
                      >
                        {items.idescription}
                      </div>
                    );
                  }
                })}
              </div>

              <Table bordered hover striped width={"auto"}>
                <thead className="Report-thead">
                  <tr>
                    <th className="Report-table-th">PARTICULAR</th>
                    <th className="Report-table-th">
                      <center style={{ marginBottom: 10 }}>Inwards</center>
                      <>
                        <div className="stockSummaryItem1">
                          <span>QUANTITY</span>
                          <span>VALUE</span>
                        </div>
                      </>
                    </th>
                    <th className="Report-table-th">
                      <center style={{ marginBottom: 10 }}>Outwards</center>
                      <>
                        <div className="stockSummaryItem1">
                          <span>QUANTITY</span>
                          <span>VALUE</span>
                        </div>
                      </>
                    </th>

                    <th className="Report-table-th">
                      <center style={{ marginBottom: 10 }}>
                        Closing Balance
                      </center>
                      <>
                        <div className="stockSummaryItem1">
                          <span>QUANTITY</span>
                          <span>VALUE</span>
                        </div>
                      </>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td className="Report-table-td">Opening Balance</td>
                    <td className="Report-table-td"></td>
                    <td className="Report-table-td"></td>
                    {data?.map((item: any) => {
                      if (item?.id == id) {
                        return (
                          <td key={item?.id} className="Report-table-td">
                            <>
                              <div className="Report-cardIcon-view-box">
                                <span>{Quantity}</span>
                                <span>
                                  {Number(
                                    Number(Quantity) * Number(Costprice)
                                  ).toFixed(2)}
                                </span>
                              </div>
                            </>
                          </td>
                        );
                      }
                    })}
                    {!data.length ? (
                      <td className="Report-table-td">
                        <div className="Report-cardIcon-view-box">
                          <span>0</span>
                          <span>0.00</span>
                        </div>
                      </td>
                    ) : null}
                  </tr>

                  {getFilteredMonths(new Date(user?.companyInfo?.financial_year_start).toLocaleString('default', { month: 'long' }))?.map((month, index, item) => {
                    return (
                      <tr key={index}>
                        <td
                          className="Report-td-link"
                          onClick={() =>
                            navigate(
                              `/usr/report/StockSummary/stockbase/${user?.id}/${id}/${month.id}`
                            )
                          }
                        >
                          {month.value}
                        </td>
                        <td className="Report-table-td">
                          <>
                            <div className="stockSummaryItem1">
                              <span>
                                {monthQuantitySum[month.value] === 0
                                  ? " "
                                  : monthQuantitySum[month.value]}
                              </span>{" "}
                              <span>
                                {isNaN(sumtotalpur[month.value]) || sumtotalpur[month.value] == 0
                                  ? " "
                                  : Number(sumtotalpur[month.value]).toFixed(2)}
                              </span>
                            </div>
                          </>
                        </td>
                        <td className="Report-table-td">
                          <>
                            <div className="stockSummaryItem1">
                              <span>
                                {monthsaleqty[month.value] === 0
                                  ? " "
                                  : monthsaleqty[month.value]}
                              </span>{" "}
                              <span>
                                {isNaN(sumtotalpur[month.value]) || sumsTotall[month.value] == 0
                                  ? " "
                                  : Number(sumsTotall[month.value]).toFixed(2)}
                              </span>
                            </div>
                          </>
                        </td>
                        <td className="Report-table-td">
                          <>
                            <div className="stockSummaryItem1">
                              <span>
                                {" "}
                                {calculateTotalClosingQty(
                                  index,
                                  monthQuantitySum[month.value],
                                  monthsaleqty[month.value]
                                ) || 0}
                              </span>{" "}
                              <span>
                                {calculateTotalClosingValue(
                                  index,
                                  sumtotalpur[month.value],
                                  monthQuantitySum[month.value]
                                ).toFixed(2)}
                              </span>
                            </div>
                          </>
                        </td>
                      </tr>
                    );
                  })}
                  <tr>
                    <th className="Report-table-th"> Grand Total</th>
                    <th className="Report-table-th">
                    </th>
                    <th className="Report-table-th">
                    </th>
                    <th className="Report-table-th">
                      <div className="stockSummaryItem1">
                        <span>{curentQuantity}</span>
                        <span>{totalVal.toFixed(2)}</span>
                      </div>
                    </th>
                  </tr>
                </tbody>
              </Table>
            </div>
          </div>
        </Container>
      )}
    </>
  );
};
export default StockMonth;
