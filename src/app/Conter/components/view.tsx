import { Card, DatePicker, Form, Input, Modal, Pagination } from 'antd';
import dayjs from 'dayjs';
import DataGrid, {
    Column,
    Item,
    MasterDetail,
    Toolbar
} from "devextreme-react/data-grid";
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import LoadingBox from '../../../components/loadingBox';
import PageHeader from '../../../components/pageHeader';
import { GET, POST } from '../../../utils/apiCalls';
import { EXPORT } from '../../../utils/exportData';
import CounterModal from './counterModal';
import DenominationList from './denominationList';
import { useTranslation } from 'react-i18next';

function CounterView() {
    const location = useLocation()
    const { t } = useTranslation();
    const dataGridRef: any = useRef(null);
    const { user } = useSelector((state: any) => state.User);
    const { id } = useParams()
    const [form] = Form.useForm()

    const [list, setList] = useState([]);
    const [meta, setMeta] = useState<any>();
    const [page, setPage] = useState(1);
    const [take, setTake] = useState(10);
    const [loding, setLoding] = useState(true)
    const [currentDate, setCurrentDate] = useState(dayjs().format("YYYY-MM-DD"));
    const [firstDate, setFirstDate] = useState(dayjs().format("YYYY-MM-DD"));
    const [query, setQuery] = useState('');
    const [formModal, setFormModal] = useState(false);
    const [counterList, setCounterList] = useState([]);
    const [counterSearch, setCounterSearch] = useState('');
    const [customerSerch, setCustomerSerch] = useState("");
    const [customer, setCustomer] = useState([]);

    const fetchStaffTransactionList = async () => {
        try {
            let obj = {
                counter_id: Number(id),
                adminId: user?.id,
                companyid: user?.companyInfo?.id,
                page: page,
                take: take,
                query: query,
                sDate: firstDate,
                lDate: currentDate,
            }
            let url = `counter_details/list`;
            const response: any = await POST(url, obj);
            if (response?.status) {
                setList(response.data);
                setMeta(response.meta);
                setLoding(false)
            } else {
                setLoding(false)
            }
        } catch (error) {
            console.log('------- error -', error)
            setLoding(false)
        }
    }

    useEffect(() => {
        fetchStaffTransactionList();
    }, [query, firstDate, currentDate, page, take]);

    const onValuesChange = (val: any) => {
        if (val.dateRange) {
            let d1: any = dayjs(val.dateRange[0], "YYYY-MM-DD");
            let d2: any = dayjs(val.dateRange[1], "YYYY-MM-DD");
            setFirstDate(d1);
            setCurrentDate(d2);
        }
        setQuery(val.search)
    }

    const fetchStaffCounterList = async () => {
        try {
            let obj = {
                adminId: user?.id,
                companyid: user?.companyInfo?.id,
                query: counterSearch,
                page: 1,
                take: 10
            }
            let url = `billing_counter/list`;
            const response: any = await POST(url, obj);
            if (response?.status) {
                setCounterList(response.datas);
            }
        } catch (error) {
            console.log('------- error -', error)
        }
    }

    const customerList = async () => {
        try {
            let URL =
                "contactMaster/searchList/staff/" +
                user?.id + '/' + user?.companyInfo?.id +
                `?name=${customerSerch}`;
            const data: any = await GET(URL, null);
            setCustomer(data.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchStaffCounterList()
        customerList()
    }, [counterSearch, customerSerch])

    const columns = [
        {
            name: "sdate",
            title: `${t("home_page.homepage.Date")}`,
            dataType: "date",
            alignment: "center",
            format: "dd-MM-yyyy"
        },
        {
            name: "staffdetails",
            title: `${t("home_page.homepage.Staf_Name")}`,
            dataType: "string",
            alignment: "center",
            cellRender: ({ data }: any) => {
                return (
                    <div>{data?.staffdetails?.name}</div>
                )
            }
        },
        {
            name: "shift_type",
            title:`${t("home_page.homepage.Shift")}`,
            dataType: "string",
            alignment: "center",
        },
        {
            name: "balance",
            title: `${t("home_page.homepage.Balance")}`,
            dataType: "string",
            alignment: "center",
        },
    ];

    return (
        <>
            <PageHeader
                firstPathText='Counter List'
                firstPathLink={`/usr/counter`}
                secondPathText='Counter Details'
                secondPathLink={location.pathname}
                onSubmit={() => setFormModal(true)}
                buttonTxt={t("home_page.homepage.ADD")}
                goback="/usr/counter"
                title={t("home_page.homepage.Counter_Details")}
            />
            {loding ? (
                <LoadingBox />
            ) : (
                <Card>
                    <>
                        <Form
                            form={form}
                            onValuesChange={onValuesChange}
                            initialValues={{
                                dateRange: [
                                    dayjs(firstDate, "YYYY-MM-DD"),
                                    dayjs(currentDate, "YYYY-MM-DD")
                                ],
                                search: query
                            }}
                        >
                            <DataGrid
                                ref={dataGridRef}
                                dataSource={list}
                                columnAutoWidth={true}
                                showBorders={true}
                                onExporting={(e) =>
                                    EXPORT(e, dataGridRef, "ledgers", {})
                                }
                                showRowLines={true}
                                remoteOperations={false}
                            >
                                <MasterDetail
                                    enabled={true}
                                    component={({ data }) => {
                                        return (
                                            <DenominationList data={data.data} />
                                        );
                                    }}
                                />
                                {columns.map((column: any, index: number) => {
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
                                    <Item>
                                        <Form.Item name="dateRange">
                                            <DatePicker.RangePicker size="large" />
                                        </Form.Item>
                                    </Item>
                                    <Item >
                                        <Form.Item name="search">
                                            <Input size="large" placeholder='Search...' />
                                        </Form.Item>
                                    </Item>
                                </Toolbar>
                            </DataGrid>
                        </Form>
                    </>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: '20px' }}>
                        <Pagination
                            total={meta?.itemCount}
                            showSizeChanger={true}
                            showTotal={(total) =>
                                `${t("home_page.homepage.total")} ${meta?.totalCount} ${t("home_page.homepage.Counter_Details")}`
                            }
                            onChange={(page, pageSize) => {
                                setPage(page);
                                setTake(pageSize)
                            }}
                        />
                    </div>
                </Card>
            )}
            {formModal ? (
                <Modal
                    open={formModal}
                    width={'50%'}
                    onCancel={() => setFormModal(false)}
                    footer={false}
                >
                    <CounterModal
                        counterList={counterList}
                        counterSearch={(val: any) => setCounterSearch(val)}
                        onClose={() => setFormModal(false)}
                        customerSerch={(val: any) => setCustomerSerch(val)}
                        customerList={customer}
                        counterId={id}
                        relode={fetchStaffTransactionList}
                    />
                </Modal>
            ) : null}
        </>
    )
}

export default CounterView