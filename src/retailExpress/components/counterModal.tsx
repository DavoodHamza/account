import { Button, DatePicker, Form, Input, InputNumber, Select, Space, notification } from 'antd';
import dayjs from 'dayjs';
import { Col, Row } from 'react-bootstrap';
import { FiPlus } from "react-icons/fi";
import { RiDeleteBin4Line } from "react-icons/ri";
import { POST } from '../../utils/apiCalls';
import { useDispatch, useSelector } from 'react-redux';
import { addCounter, clearCounter } from '../../redux/slices/retailExpress';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CounterModal({ counterList, counterSearch, counterModal, onClose, counterDetails }: any) {
    const [form] = Form.useForm();
    const { user } = useSelector((state: any) => state.User);
    const { counter } = useSelector((state: any) => state.retailExpress);

    const dispatch = useDispatch();
    const navigate = useNavigate()

    const [btEnable, setBtEnable] = useState(true);
    const [btLoding, setBtLoding] = useState(false);
    const [shiftList, setShiftList] = useState([]);

    useEffect(() => {
        form.setFieldsValue({
            sdate: dayjs(new Date())
        })
        if (counterModal || counterDetails.status) {
            form.setFieldsValue({
                counter_id: counter?.counter_id?.toString() || counterDetails?.data?.counter_id?.toString(),
                shift: counter?.shift_type || counterDetails?.data?.shift_type?.toString(),
                sdate: dayjs(counter.sdate, "YYYY-MM-DD")
            })
        }
    })
    const onFinish = async (val: any) => {
        try {
            setBtLoding(true)
            let notes: any = []
            val.banknotes.forEach((note: any) => {
                let shiftObj = {
                    denomination: note?.denomination,
                    count: note?.count
                }
                notes.push(shiftObj)
            })
            let coins: any = []
            val.coins.forEach((coin: any) => {
                let shiftObj = {
                    denomination: coin?.denomination,
                    count: coin?.count
                }
                coins.push(shiftObj)
            })
            let dinominationsObj = {
                banknotes: notes,
                coins: coins,
                total_balance: val.balance,
                time: dayjs().format("hh:mm A"),
            }

            let openObj = {
                open_denomination: dinominationsObj,
                counter_id: Number(val?.counter_id),
                sdate: val?.sdate,
                adminid: user?.id,
                balance: val?.balance,
                shift_type: val?.shift,
                staffid: user?.staff?.id,
                companyid: user?.companyInfo?.id,
            };

            let closeObj = {
                [!counterModal ? counterDetails.status ? 'open_denomination' : 'close_denomination' : 'close_denomination']: dinominationsObj,
                balance: val?.balance,
                id: counter?.id || counterDetails?.data?.id,
                counter_id: Number(val?.counter_id),
                companyid: user?.companyInfo?.id,
            };

            let url = counterModal || counterDetails?.data?.id ? `counter_details/add/closeshift` : `counter_details/add/openshift`;
            let obj = counterModal || counterDetails?.data?.id ? closeObj : openObj
            const response: any = await POST(url, obj)
            if (response.status) {
                if (counterModal) {
                    setBtLoding(false)
                    dispatch(clearCounter({}))
                    onClose()
                    navigate("/usr/staff-activities");
                } else {
                    dispatch(addCounter(response.data));
                    setBtLoding(false)
                }
                notification.success({
                    message: "success",
                    description: counterModal ? `Success fully Shift close Add` : `Success fully Shift Open Add`
                })
            } else {
                notification.error({
                    message: "Failed", description: counterModal ? `Failed Shift close Add` : response.message
                })
                setBtLoding(false)
            }
        } catch (error) {
            setBtLoding(false)
            console.log(error, '错误信)')
        }
    }
    const onValueChange = (_: any, val: any) => {
        const calculateTotal = (items: any[]) => {
            return items.reduce((acc: number, item: any) => {
                const denomination = Number(item?.denomination) || 0;
                const count = Number(item?.count) || 0;
                return acc + (denomination * count);
            }, 0);
        };
        if (val && (val.banknotes?.length || val.coins?.length)) {
            const notesTotal = calculateTotal(val.banknotes || []);
            const coinsTotal = calculateTotal(val.coins || []);
            const balance = coinsTotal + notesTotal
            setBtEnable(balance != 0 ? false : true)
            form.setFieldValue('balance', balance);
        }
        if (_.counter_id) {
            const shift = counterList.find((find: any) => find.id == _.counter_id)
            setShiftList(shift.shiftlist)
        }
    };
    return (
        <div>
            <Form
                onFinish={onFinish}
                onValuesChange={onValueChange}
                form={form}
            >
                <Row>
                    <Col className="Table-Txt" md={12}>
                        {counterModal ? "Fill the Close Details" : 'Fill the Open Details'}
                    </Col>
                    <br />
                    <br />
                    <hr />
                    <Col md={6}>
                        <div className="formItem">
                            <label className="formLabel">COUNTER</label>
                            <Form.Item
                                name="counter_id"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please Select a ledger",
                                    },
                                ]}
                            >
                                <Select
                                    allowClear
                                    onSearch={(val) => counterSearch(val)}
                                    showSearch
                                    filterOption={false}
                                    size="large"
                                    disabled={counterModal || counterDetails?.data?.id}
                                >
                                    {counterList?.map((item: any) => (
                                        <Select.Option key={item.id}>
                                            {item.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>
                        <div className="formItem">
                            <label className="formLabel">SHIFT</label>
                            <Form.Item name="shift"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please Select a Shift",
                                    },
                                ]}
                            >
                                <Select
                                    allowClear
                                    showSearch
                                    filterOption={false}
                                    size="large"
                                    disabled={counterModal || counterDetails?.status}
                                >
                                    {shiftList?.map((item: any) => (
                                        <Select.Option key={item.name}>
                                            {item.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>
                        <div className="formItem">
                            <Form.List name="banknotes">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Space key={key} style={{ display: 'flex', margin: 0 }} align="baseline">
                                                <div className="formItem">
                                                    <label className="formLabel">DENOMINATION</label>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'denomination']}
                                                        rules={[{ required: true, message: 'Missing Denomination' }]}
                                                    >
                                                        <Input type='number' placeholder="Denomination" size="large" />
                                                    </Form.Item>
                                                </div>
                                                <div className="formItem">
                                                    <label className="formLabel">COUNT</label>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'count']}
                                                        rules={[{ required: true, message: 'Missing Count' }]}
                                                    >
                                                        <InputNumber controls={false} placeholder="Count" size="large" />
                                                    </Form.Item>
                                                </div>
                                                <RiDeleteBin4Line color='red' size={18} onClick={() => remove(name)} />
                                            </Space>
                                        ))}
                                        <Form.Item>
                                            <Button type="dashed" size="large" onClick={() => add()} block icon={<FiPlus size={24} />}>
                                                ADD BANKNOTES
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="formItem">
                            <label className="formLabel">DATE</label>
                            <Form.Item
                                name="sdate"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter date",
                                    },
                                ]}
                            >
                                <DatePicker disabled format="YYYY-MM-DD" style={{ width: "100%" }} size="large" />
                            </Form.Item>
                        </div>
                        <div className="formItem">
                            <label className="formLabel">TOTAL BALANCE</label>
                            <Form.Item
                                name="balance"
                            >
                                <Input readOnly size="large" />
                            </Form.Item>
                        </div>
                        <div className="formItem">
                            <Form.List name="coins">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Space key={key} style={{ display: 'flex', margin: 0 }} align="baseline">
                                                <div className="formItem">
                                                    <label className="formLabel">DENOMINATION</label>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'denomination']}
                                                        rules={[{ required: true, message: 'Missing Denomination' }]}
                                                    >
                                                        <Input type='number' placeholder="Denomination" size="large" />
                                                    </Form.Item>
                                                </div>
                                                <div className="formItem">
                                                    <label className="formLabel">COUNT</label>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'count']}
                                                        rules={[{ required: true, message: 'Missing Count' }]}
                                                    >
                                                        <InputNumber controls={false} placeholder="Count" size="large" />
                                                    </Form.Item>
                                                </div>
                                                <RiDeleteBin4Line color='red' size={18} onClick={() => remove(name)} />
                                            </Space>
                                        ))}
                                        <Form.Item>
                                            <Button type="dashed" size="large" onClick={() => add()} block icon={<FiPlus size={24} />}>
                                                ADD COINS
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                        </div>
                    </Col>
                    <Col md={counterModal ? 4 : 8}></Col>
                    {counterModal ? (
                        <Col md={4}>
                            <Button
                                block
                                size="large"
                                onClick={onClose}
                            >
                                CANCEL
                            </Button>
                        </Col>
                    ) : null}
                    <Col md={4}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            size="large"
                            disabled={btEnable}
                            loading={btLoding}
                        >
                            SUBMIT
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}

export default CounterModal