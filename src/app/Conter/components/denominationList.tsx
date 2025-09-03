import { Col, Row } from "react-bootstrap";
import '../styles.scss';

function DenominationList({ data }: any) {
    const renderDenomination = (denominationData: any, isClose: boolean) => {
        const { shift_type, denomination, coins, staffname, time, total_balance } = denominationData;

        return (
            <Col md={6}>
                <div>
                    <div className="tableHeadingDenominations">{isClose ? 'Closing Details' : 'Opening Details'}</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Denominations</th>
                                <th>Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {denomination && denomination.map((item: any, index: number) => (
                                <tr key={index}>
                                    <td>{item.denomination}</td>
                                    <td>{item.count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="deatailText">Staff Name: {data.staffdetails.name}</div>
                    <div className="deatailText">{isClose ? 'Log Out Time' : 'Log In Time'}: {time}</div>
                    <div className="deatailText">{isClose ? 'Closing' : 'Opening'} Balance: {total_balance}</div>
                </div>
            </Col>
        );
    };

    return (
        <div className="denomination">
            <Row>
                {data.open_denomination && renderDenomination(data.open_denomination, false)}
                {data.close_denomination && renderDenomination(data.close_denomination, true)}
            </Row>
        </div>
    );
}

export default DenominationList;
