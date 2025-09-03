import { Form, Input } from "antd";
import { BiUser } from "react-icons/bi";
import { useSelector } from "react-redux";

function Header(props: any) {
  const { user } = useSelector((state: any) => state.User);

  return (
    <div className="RetailExpress-Header">
      <div className="RetailExpress-HeaderBox2">
        <div>
          <div className="Navigation-HeaderIcon1">
            {user?.companyInfo?.bimage == null ||
              user?.companyInfo?.bimage == "" ? (
              <BiUser />
            ) : (
              <div className="profile-picture">
                <img
                  src={user?.companyInfo?.bimage}
                  className="profile-img"
                  style={{ padding: 0 }}
                  alt=""
                />
              </div>
            )}
          </div>
        </div>
        <div className="RetailExpress-Headertxt1">{user?.companyInfo?.bname}</div>
        <div style={{ flex: 1 }}></div>
        <div>
          <Form>
            <Form.Item noStyle>
            <Input style={{ width: 300 }} placeholder="Search Product or Scan Barcode" onChange={(e) => props.product(e.target.value)} />
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Header;
