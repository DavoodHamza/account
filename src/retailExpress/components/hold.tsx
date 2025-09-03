import moment from 'moment';
import { BsClockHistory } from 'react-icons/bs';
import { CiSquareRemove } from 'react-icons/ci';
import "../styles.scss";

function HoldInvoice({item, index, addCartProductInCart, clearHoldInvoice}: any) {
    return (
        <div className='holder_container'>
            <BsClockHistory color="green" size={25} onClick={() => addCartProductInCart(item, index)}/>
            <div style={{ marginLeft: '10px', width: '100%' }}>
                <div className='holder_text'>
                    <span onClick={() => addCartProductInCart(item, index)}>{moment(item.date).format("ddd MMM DD YYYY") + ' ' + moment(item.date).format("HH:mm")}</span>
                    <CiSquareRemove style={{cursor: 'pointer'}} color="red" size={25} onClick={() => clearHoldInvoice(index)}/>
                </div>
                <div onClick={() => addCartProductInCart(item, index)}> Total : {item.total} - Quantity : {item.quatity} </div>
            </div>
        </div>
    )
}

export default HoldInvoice