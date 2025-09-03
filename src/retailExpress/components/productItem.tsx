import { MdOutlineRadioButtonChecked, MdOutlineRadioButtonUnchecked } from "react-icons/md";
function ProductItem(props: any) {
  let totalRate = props?.item?.rate - props?.item?.vatamt
  return (
    <div className="RetailExpress-ProductItem" onClick={() => {
      props.onSelect(props?.item);
    }}>
      <div>
        <img
          src={props?.item?.pimage}
          className="RetailExpress-ProductItemImg"
        />
      </div>
      <div className="RetailExpress-ProductItemBox">
        <div className="RetailExpress-ProductItemtxt1">
          {props?.item?.idescription} ({props?.item?.icode})
        </div>
        <div className="RetailExpress-ProductItemtxt2">
          {props?.item?.includevat == '1.00' ?
            totalRate.toFixed(2) :
            props?.item?.rate} {props.currencycode}
        </div>
        <div className="RetailExpress-ProductItemtxt3">
          <div>{props?.item?.stock} left</div>
          <div>
            {props?.selectedItem?.find((slectedProduct: any) => Number(slectedProduct.id) === (props?.item.id)) ?
              <MdOutlineRadioButtonChecked size={20} color="green" /> :
              <MdOutlineRadioButtonUnchecked color="grey" size={20} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductItem;
