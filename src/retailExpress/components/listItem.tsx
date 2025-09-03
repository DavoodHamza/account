import { Button, Space } from "antd";
import { IoMdClose } from "react-icons/io";

function ListItem(props: any) {
  return (
    <div className="RetailExpress-ListItem">
      <div className="RetailExpress-ListItemtxt">
        {Number(props?.index) + 1}.
      </div>
      <div style={{ flex: 1 }}>
        <div className="RetailExpress-ListItemtxt1">
          {props?.item?.idescription}
        </div>
        <div className="RetailExpress-ListItemtxt2">
          {`${props?.item?.rate} ${props.currencycode}`} | {props.item.quantity_no}{" "}
          {props?.item?.unit}
        </div>
      </div>
      <div>
        <Space.Compact block>
          <Button
            size="small"
            onClick={() => props.minus(props.item.id)}
          >
            -
          </Button>
          <Button size="small">{props.item.quantity_no}</Button>
          <Button
            size="small"
            onClick={() => props.add(props.item.id)}
          >
            +
          </Button>
        </Space.Compact>
      </div>
      &nbsp; &nbsp; &nbsp;
      <div>
        <Button
          size="small"
          danger
          onClick={() => props.isChange(props.item.id)}
        >
          <IoMdClose />
        </Button>
      </div>
    </div>
  );
}

export default ListItem;
