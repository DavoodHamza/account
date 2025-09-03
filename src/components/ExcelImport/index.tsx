import { Button, Modal, notification } from "antd";
import EXCEL from "../../assets/images/excel.webp";
import "./styles.scss";
import { useState } from "react";
import { UPLOAD_EXCEL } from "../../utils/apiCalls";
import { Row, Col } from "react-bootstrap";
import * as xlsx from "xlsx";
import Table from "./table";
import { useSelector } from "react-redux";
import Dropzone from "react-dropzone";
import { useTranslation } from "react-i18next";

function ExcelImport(props: any) {
  const { t } = useTranslation();
  const { user } = useSelector((state: any) => state.User);

  const adminid = user?.id;
  const userid = user.id;

  const [isloading, setIsLoading] = useState(false);
  const [file, setFile] = useState();
  const [filedata, setFiledata] = useState([]);
  const [fileheaders, setFileheaders] = useState([]);
  const [hasErrors, setHasErrors] = useState(false);

  const uploadfile = async (fileObj: any) => {
    if (hasErrors) {
      notification.error({
        message: "Validation Error",
        description: "Please fix all errors in the table before uploading.",
      });
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      let reqObj = {
        adminid: adminid,
        companyid: user?.companyid,
        userid: userid,
        itemtype: props.type,
      };
      formData.append("file", fileObj);
      formData.append("reqObj", JSON.stringify(reqObj));
      const response: any = await UPLOAD_EXCEL(props?.URL, formData);
      if (response.status) {
        notification.success({
          message: "Success",
          description: "Uploaded Successfully!",
        });
        props.onSucess();
        props.onCancel();
        setIsLoading(false);
      } else {
        setIsLoading(false);
        notification.error({
          message: "Failed",
          description: "Failed to upload!",
        });
      }
    } catch (error: any) {
      console.log("error==>", error);
      setIsLoading(false);
      notification.error({
        message: "Failed to upload excel file",
        description: error.message,
      });
    }
  };

  const validateData = (data: any[], requiredFields: any[]) => {
    let hasError = false;
    const validatedData: any = data.map((row) => {
      const errors: any = {};
      requiredFields.forEach((field) => {
        // if(row.hasOwnProperty(field.label)){
        if (field.type !== typeof row[field.label]) {
          errors[field.label] = true;
          hasError = true;
        }
        const fieldValue = row[field.label];
        if (typeof fieldValue === "string" && fieldValue.trim() === "") {
          errors[field.label] = true;
          hasError = true;
        } else if (fieldValue === null || fieldValue === undefined) {
          errors[field.label] = true;
          hasError = true;
        }
        // }
      });
      return { ...row, _errors: errors };
    });

    setHasErrors(hasError);
    setFiledata(validatedData);
  };

  const readExcel = (event: any) => {
    const fileObj = event[0];
    setFile(fileObj);
    var reader = new FileReader();
    reader.onload = function (e: any) {
      var data = e.target.result;
      let readedData = xlsx.read(data, { type: "binary" });
      const wsname = readedData.SheetNames[0];
      const ws = readedData.Sheets[wsname];
      const dataParse: any = xlsx.utils.sheet_to_json(ws);
      const headers: any = [];
      for (let key in ws) {
        if (key.match(/^[A-Z]+1$/) && ws[key].t === "s") {
          headers.push(ws[key].v);
        }
      }
      setFileheaders(headers);

      // Validate data after parsing
      const requiredFields = [
        { label: "item code", type: "string" },
        { label: "item name", type: "string" },
        { label: "category", type: "string" },
        { label: "unit", type: "string" },
        { label: "sale price", type: "number" },
        { label: "cost price(opening stock)", type: "number" },
        { label: "vat %", type: "number" },
        { label: "includevat", type: "string" },
        { label: "wholesale price", type: "number" },
        { label: "quantity(opening stock)", type: "number" },
      ];
      validateData(dataParse, requiredFields);
    };

    reader.readAsBinaryString(fileObj);
  };

  return (
    <Modal
      visible={props.visible}
      onCancel={props.onCancel}
      footer={false}
      width={1000}
    >
      <h2 className="ExcelImport-txt1">
        {t("home_page.homepage.Import_from_Excel")}
      </h2>
      <br />
      <Dropzone onDrop={readExcel}>
        {({ getRootProps, getInputProps }) => (
          <section>
            <div
              style={{ cursor: "pointer" }}
              {...getRootProps({ className: "ExcelImport-box1" })}
            >
              <input {...getInputProps()} />
              <div className="ExcelImport-box2">
                <img src={EXCEL} width={"30%"} />
                {t("home_page.homepage.Click_here_to_Upload_Excel")}
              </div>
              <div className="ExcelImport-box3">
                <ul>
                  <li>
                    {t("home_page.homepage.Download_the")}{" "}
                    <a href={props.template} className="ExcelImport-txt2">
                      {t("home_page.homepage.Sample_Document")}
                    </a>
                  </li>
                  <li>{t("home_page.homepage.Fill_All_Required_Details")}</li>
                  <li>
                    {t("home_page.homepage.Upload_xlsx_format_files_only")}
                  </li>
                  <li>{t("home_page.homepage.Any_Issues_Contact_Support")}</li>
                </ul>
              </div>
            </div>
          </section>
        )}
      </Dropzone>
      <br />
      {filedata.length ? <Table data={filedata} columns={fileheaders} /> : null}
      <br />
      <Row>
        <Col sm="6" md="6"></Col>
        <Col sm="3" md="3">
          <Button block onClick={() => props.onCancel()}>
            {t("home_page.homepage.Cancel")}
          </Button>
        </Col>
        <Col sm="3" md="3">
          <Button
            type="primary"
            block
            loading={isloading}
            onClick={() => {
              if (!file) {
                notification.error({
                  message: "Error",
                  description: "Please select a file before uploading.",
                });
                return;
              }

              uploadfile(file);
            }}
          >
            {t("home_page.homepage.Upload")}
          </Button>
        </Col>
      </Row>
    </Modal>
  );
}

export default ExcelImport;
