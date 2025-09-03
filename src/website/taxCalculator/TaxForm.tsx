import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  List,
  Radio,
  Row,
  Select,
  Space,
  Steps,
  Typography
} from "antd";
import React, { useEffect, useRef, useState } from "react";

import { useLocation } from "react-router-dom";
import LoadingBox from "../../components/loadingBox";
import WebsiteFooter from "../../components/websiteFooter";
import API from "../../config/api";
// import { useParams } from "react-router-dom";
import { Pie } from "@ant-design/plots";
import { withTranslation } from "react-i18next";
import WebsiteHeader from "../../components/websiteHeader";
import "./styles.scss";
const { Step } = Steps;
const { Option } = Select;
const TaxForm = (props: any) => {
  const { t } = props;
  const [form] = Form.useForm();
  const [showResult, setShowResult] = useState(false);
  const [countryData, setCountryData] = useState<any>([]);
  const [formData, setFormData] = useState<any>([]);
  const [taxResult, setTaxResult] = useState([]);
  const [datasets, setDatasets] = useState(null);
  // const [selectedCountry, setSelectedCountry] = useState<any>();
  const [id, setId] = useState();
  const [idNumber, setIdNumber] = useState<any>();
  const [currentStep, setCurrentStep] = React.useState(0);
  const [steps, setSteps] = useState<any>();
  const [formValues, setFormValues] = useState<any>([]);
  // const [selectedCardId, setSelectedCardId] = useState(null);
  const [formComplete, setFormComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { pathname } = useLocation();
  const resultsContainerRef = useRef(null);
  const formContainerRef = useRef(null);

  const get_countries_url = API.GET_COUNTRIES_DETAILS;
  const get_country_form = API.GET_COUNTRY_FORM;

  useEffect(() => {
    window.scrollTo(0, 10);
  }, [pathname]);

  useEffect(() => {
    getCountries();
    getSelectedCountry();
  }, []);

  useEffect(() => {
    getSelectedCountry();
    getSelectedCountryForm();
  }, [countryData, id]);

  useEffect(() => {
    if (formData && formData.tabs) {
      setFormFields();
    }
  }, [formData]);

  useEffect(() => {
    if (showResult && resultsContainerRef.current) {
      (resultsContainerRef.current as HTMLElement).scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [showResult]);

  //get all countries
  const getCountries = async () => {

    const requestOptions: any = {
      method: "GET",
      redirect: "follow",
    };

    await fetch(get_countries_url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setCountryData(result);
      })
      .catch((error) => console.log("error", error));
  };

  //get the selected country
  const getSelectedCountry = async () => {
    // console.log("get selected country : ", id);

    if (id !== undefined && countryData[id]) {
      setIdNumber(parseInt(id));
      if (idNumber) {
        // setSelectedCountry(countryData[idNumber - 1]);
        // console.log("selected country : ", countryData[idNumber - 1]);
      }
    }
  };

  //get selected country form
  const getSelectedCountryForm = async () => {
    // console.log("get selected country form");
    const requestOptions: any = {
      method: "GET",
      redirect: "follow",
    };

    await fetch(get_country_form + `${id}.json`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log("result from fetching form : ", result);
        setFormData(result);
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      })
      .catch((error) => console.log("error", error));
  };

  //function to set form fields
  const setFormFields = async () => {
    // console.log("inside set form fields");

    if (formData?.tabs && formData.tabs.length > 0) {
      const newSteps = formData.tabs.map((tab: any, tabIndex: number) => {
        return {
          title: tab.name,
          content: (
            <>
              {tab.fields.map((field: any, fieldIndex: number) => (
                <Form.Item
                  key={fieldIndex}
                  // name={`${field.id}_tab${tabIndex}`}
                  name={`step${tabIndex}_${field.id}`}
                  label={field.label || field.title}
                  rules={[
                    {
                      required: true,
                      message: `Please ${field.type === "picker" ? "select" : "enter"
                        } ${field.label}`,
                    },
                  ]}
                >
                  {field.type === "picker" ? (
                    <Select
                      placeholder={`Select ${field.label}`}
                      onChange={(value) =>
                        handleFormValueChange(field.id, value)
                      }
                    >
                      {field.options &&
                        field.options.map(
                          (option: string, optionIndex: number) => (
                            <Option key={optionIndex} value={option}>
                              {option}
                            </Option>
                          )
                        )}
                    </Select>
                  ) : field.type === "radio-group" ? (
                    <Radio.Group
                      id={field.id}
                      name={field.id}
                      onChange={(e) =>
                        handleFormValueChange(field.id, e.target.value)
                      }
                    >
                      {field.groups.map((group: any, groupIndex: number) => (
                        <Radio className="radio-group" key={groupIndex} value={group.value}>
                          {group.label}
                        </Radio>
                      ))}
                    </Radio.Group>
                  ) : (
                    <Input
                      type="number"
                      name={field.id} //change
                      placeholder={`Enter ${field.label}`}
                      // required={true}
                      onChange={(e) =>
                        handleFormValueChange(field.id, e.target.value)
                      }
                    />
                  )}
                </Form.Item>
              ))}
            </>
          ),
        };
      });

      setSteps(newSteps);
    }
  };

  const handleFormValueChange = (fieldName: string, value: any) => {
    //change any to string
    // console.log(`Field Name: ${fieldName}, Value: ${value}`);
    setFormValues((prevValues: any) => ({
      ...prevValues,
      [fieldName]: value,
    }));
  };

  const handleFinish = (values: any) => {
    // console.log("form url : ", formData.url);
    // console.log("values : ", values);
    // console.log("formValues : ", formValues);
    const data = {
      age: formValues?.age,
      BIK: formValues?.other_bik,
      pension: formValues["pension_in_%"],
      // pension: "10",
      // employed_radio: values.employed_radio,
      income: formValues?.taxable_salary,
      status: formValues?.file_status,
      period:
        formValues?.payment_frequency === "Monthly"
          ? "month"
          : formValues?.payment_frequency === "Weekly"
            ? "week"
            : formValues?.payment_frequency === "Yearly"
              ? "year"
              : "2week",
      // period: "month",
      taxYear: formValues?.tax_year,
      payCredit: formValues.employed_radio === "true" ? "Yes" : "No",
    };
    // console.log("data values for payload: ", data);

    try {
      const myHeaders = { "Content-Type": "application/json" };

      const requestOptions: any = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(data),
        redirect: "follow",
      };

      fetch(formData.url, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          // console.log("result after calculation : ", result);
          let label: any = [];
          let dataVal: any = [];
          let total: number = 0;
          result.list.forEach((item: any) => {
            if (!isNaN(item.value)) {
              label.push(item.title);
              dataVal.push(item.value);
              total += Number(item.value);
            }
          });
          const dataPoints: any = {
            data: dataVal,
            labels: label,
            total: total,
          };
          // console.log("dataPoints : ", dataPoints);

          dataPoints.data = dataPoints.data.map((value: any) =>
            parseFloat(value)
          );

          const newDataPoints = dataPoints.labels.map(
            (label: any, index: number) => ({
              type: label,
              value: (dataPoints.data[index] / total) * 100,
            })
          );

          console.log(newDataPoints);
          setDatasets(newDataPoints);

          if (result.status) {
            setShowResult(true);
            setTaxResult(result.list);
          } else {
          }
        })
        .catch((error) => {
          console.log(error.message);
        });
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const handleNext = () => {
    // console.log("Next button clicked. Form complete:", formComplete);
    setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  //Pie chart
  const DemoPie = ({ datasets }: { datasets: any }) => {
    const config = {
      appendPadding: 10,
      data: datasets,
      angleField: "value",
      colorField: "type",
      radius: 0.8,
      // label: {
      //   type: 'outer',
      // },
      interactions: [
        {
          type: "element-active",
        },
      ],
    };
    return <Pie {...config} />;
  };

  //handle country card click
  const handleCardClick = (cardId: any) => {
    (formContainerRef.current as unknown as HTMLElement).scrollIntoView({
      behavior: "smooth",
    });
    setIsLoading(true);
    form.resetFields();
    // setSelectedCardId(cardId);
    setFormValues([]);
    setCurrentStep(0);
    // console.log("selected country : ", cardId);
    setId(cardId);
    setDatasets(null);
    setTaxResult([]);
    setShowResult(false);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  // check for completion
  const checkFormCompletion = () => {
    const allValuesEntered = Object.values(formValues).every(
      (value) => !!value
    );
    setFormComplete(allValuesEntered);
  };

  return (
    <div className="main-body">
      <WebsiteHeader />
      <div className="main-container">
        <div className="main-top">
          <div className="left-container">
            <Row className="left-row" gutter={[16, 16]}>
              {countryData.map((card: any, index: number) => (
                <Col
                  key={index}
                  // xs={24}
                  // sm={12}
                  // md={8}
                  // lg={6}
                  // xl={5}
                  xs={6}
                  sm={5}
                  md={6}
                  lg={5}
                  xl={5}
                  // xxl={3}
                  className="card-col"
                >
                  <Card
                    onClick={() => handleCardClick(card.id)}
                    className="country-card"
                    hoverable
                    cover={
                      <img
                        className="country-image circular-image"
                        alt={`Card ${index + 1}`}
                        src={`${card.icon}`}
                      />
                    }
                  >
                    <Card.Meta className="country-text" title={card.name} />
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
          <div className="right-container" ref={formContainerRef}>
            {!id ? (
              <>
                <h1>{t("home_page.homepage.Select_a_country")}</h1>
                <div className="loader">
                  <div className="inner one"></div>
                  <div className="inner two"></div>
                  <div className="inner three"></div>
                </div>
              </>
            ) : (
              <>
                {isLoading ? (
                  <LoadingBox />
                ) : (
                  <>
                    <div>
                      <h1 className="tax-form-header" >
                        {formData && formData.title}
                      </h1>
                    </div>
                    <Card className="tax-card">
                      {formData && formData.tabs && steps && (
                        <Form
                          form={form}
                          name="taxForm"
                          disabled={showResult && true}
                          onFinish={handleFinish}
                          labelCol={{ span: 8 }}
                          wrapperCol={{ span: 16 }}
                          onValuesChange={() => {
                            checkFormCompletion();
                          }}
                        >
                          <Steps
                            className="card-steps"
                            current={currentStep}
                            size="small"
                          >
                            {steps.map((step: any) => (
                              <Step key={step.title} title={step.title} />
                            ))}
                          </Steps>

                          <div>{steps[currentStep].content}</div>

                          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <Space>
                              {currentStep > 0 && (
                                <Button type="primary" onClick={handlePrev}>
                                  Back
                                </Button>
                              )}

                              {currentStep < steps.length - 1 && (
                                <Button
                                  type="primary"
                                  onClick={handleNext}
                                  disabled={!formComplete}
                                >
                                  Next
                                </Button>
                              )}

                              {currentStep === steps.length - 1 && (
                                <Button type="primary" htmlType="submit">
                                  Calculate
                                </Button>
                              )}
                            </Space>
                          </Form.Item>
                        </Form>
                      )}
                    </Card>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        <div className="results-div" ref={resultsContainerRef}>
          <div className="results-container">
            {showResult && (
              <Card className=" results-card" id="resultData">
                <Card.Meta
                  title={
                    <Typography.Title className="income-tax-results">
                      Income Tax Results
                    </Typography.Title>
                  }
                />
                <Divider />
                <List>
                  {taxResult.map((item: any, index) => (
                    <List.Item
                      key={index}
                      style={{ borderBottom: "1px solid #e8e8e8" }}
                    >
                      <div className="list-item">
                        <Typography className="item-title">
                          {item.title}
                        </Typography>
                        <Typography className="item-value">
                          {item.value}
                        </Typography>
                      </div>
                    </List.Item>
                  ))}
                </List>
                {datasets && (
                  <div className="chart-container">
                    <div className="left">
                      <Card className="card-left">
                        <Card.Meta
                          title={
                            <Typography.Title level={4}>
                              Income Distribution Chart
                            </Typography.Title>
                          }
                        />
                        {/* pie chart */}
                        <DemoPie datasets={datasets} />
                      </Card>
                    </div>
                  </div>
                )}
              </Card>
            )}
          </div>
        </div>
      </div>
      <WebsiteFooter />
    </div>
  );
};

export default withTranslation()(TaxForm);
