
import React from 'react'

function payHeadForm() {
  return (
    <div>payHeadForm</div>
  )
}

export default payHeadForm

// import React, { useEffect, useState } from "react";
// import { Form, Input, Select, RadioChangeEvent } from "antd";
// import { Col, Row } from "react-bootstrap";
// import API from "../../../../../config/api";
// import { GET } from "../../../../../utils/apiCalls";
// import { useSelector } from "react-redux";

// function PayHeadForm(props: any) {
//   const { user } = useSelector((state: any) => state.User);
//   const adminid = user?.id;
//   const [isAffect, setisAffect] = useState(false);
//   const [formType, setFormType] = useState<any>("flatAmount");
//   const [percentageOf, setPercentageOf] = useState<any>([
//     { label: "CTC", value: "ctc" },
//   ]);
//   const [ledger, setLedger] = useState([]);
//   const fetchLedgerList = async () => {
//     try {
//       let ledger_url = API.GET_LEDGER_CATEGORY + "all";
//       const data: any = await GET(ledger_url, null);
//       setLedger(data);
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   useEffect(() => {
//     fetchLedgerList();
//     fetcPayHead();
//   }, []);

//   const fetcPayHead = async () => {
//     try {
//       let unit_url = API.PAYROLLPAYHEAD_LIST_USER + `${adminid}`;
//       const data: any = await GET(unit_url, null);
//       const existingIds = percentageOf.map((item: any) => item.value);

//       // Filter out duplicates from data and map to the required format
//       const modifiedData = data
//         .filter((item: any) => !existingIds.includes(item.id))
//         .map((item: any) => ({
//           label: item.name,
//           value: item?.id,
//         }));

//       setPercentageOf([...percentageOf, ...modifiedData]);
//     } catch (error) {}
//   };

//   let ledgerOptions: any = [];
//   ledgerOptions =
//     ledger.length &&
//     ledger?.map((item: any) => ({
//       label: item?.category,
//       value: item.id,
//     }));

//   const radioOptions = [
//     { label: "Flat Amount", value: "flatAmount" },
//     { label: "Percentage", value: "percentage" },
//   ];
//   function onRadioChange({ target: { value } }: RadioChangeEvent) {
//     setFormType(value);
//   }
//   return (
//     <div>
//       <Row>
//         <Col md={12}>
//           <div className="formItem">
//             <label className="formLabel">
//               Name in Pay Head <strong style={{ color: "red" }}>*</strong>
//             </label>
//             <Form.Item
//               name="name"
//               rules={[
//                 {
//                   required: true,
//                   message: "",
//                 },
//               ]}
//             >
//               <Input />
//             </Form.Item>
//           </div>

//           <div className="formItem">
//             <label className="formLabel">
//               Type <strong style={{ color: "red" }}>*</strong>
//             </label>
//             <Form.Item
//               name="type"
//               rules={[
//                 {
//                   required: true,
//                   message: "",
//                 },
//               ]}
//             >
//               <Select>
//                 {[
//                   {
//                     label: "Earnings",
//                     value: "earnings",
//                   },
//                   {
//                     label: "Dedections",
//                     value: "dedections",
//                   },
//                   {
//                     label: "Reibursements",
//                     value: "reibursements",
//                   },
//                 ]?.map((option: any) => (
//                   <Select.Option key={option.value} value={option.value}>
//                     {option.label}
//                   </Select.Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           </div>
//           <div className="formItem">
//             <label className="formLabel">
//               Ledger Category <strong style={{ color: "red" }}>*</strong>
//             </label>
//             <Form.Item
//               name="ledgercategory"
//               rules={[
//                 {
//                   required: true,
//                   message: "",
//                 },
//               ]}
//             >
//               <Select allowClear>
//                 {ledgerOptions?.length &&
//                   ledgerOptions?.map((option: any) => (
//                     <Select.Option key={option.value} value={option.value}>
//                       {option.label}
//                     </Select.Option>
//                   ))}
//               </Select>
//             </Form.Item>
//           </div>

//           <div className="formItem">
//             <label className="formLabel">
//               Calculation Period <strong style={{ color: "red" }}>*</strong>
//             </label>
//             <Form.Item
//               name="calculationPeriods"
//               rules={[
//                 {
//                   required: true,
//                   message: "",
//                 },
//               ]}
//             >
//               <Select>
//                 {[
//                   { label: "Hourly", value: "hourly" },
//                   { label: "Daily", value: "daily" },
//                   { label: "Weekly", value: "weekly" },
//                   { label: "Monthly", value: "monthly" },
//                   { label: "Yearly", value: "yearly" },
//                 ]?.map((option: any) => (
//                   <Select.Option key={option.value} value={option.value}>
//                     {option.label}
//                   </Select.Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           </div>

//         </Col>
//       </Row>
//     </div>
//   );
// }

// export default PayHeadForm;
