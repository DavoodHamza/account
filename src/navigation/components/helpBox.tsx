import Table from "react-bootstrap/Table";
import { AiFillWindows } from "react-icons/ai";
import { FaApple } from "react-icons/fa";
import { BiSupport } from "react-icons/bi";
import { FaXTwitter } from "react-icons/fa6";

import { IoMailOutline } from "react-icons/io5";
import { IoCallOutline } from "react-icons/io5";
import { FaInstagram } from "react-icons/fa";
import { FaSquareFacebook } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { FaRegKeyboard } from "react-icons/fa6";
import { BsJournalBookmark } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { FiYoutube } from "react-icons/fi";

function HelpBox(props: any) {
  const navigate = useNavigate();

  const navigateandclose = () => {
    props?.closeDrawer();

    navigate("/usr/user-manual");
  };
  return (
    <div>
      {/* <div style={{ textDecoration: "underline", cursor: "pointer" }}>
        <BiSupport style={{ marginRight: "5px" }} size={20} />
        <span style={{ color: "blue" }}>Help & Support</span>
      </div>
      <br /> */}
      <div style={{ textDecoration: "underline" }}>
        <IoChatbubbleEllipsesOutline style={{ marginRight: "5px" }} size={20} />
        <a style={{ color: "blue" }} href="mailto:info@taxgoglobal.com">
          Have any query ?
          </a>
      </div>
      <br />
      <div>
        <IoMailOutline style={{ marginRight: "7px" }} size={20} />
        <a style={{ color: "blue" }} href="mailto:info@taxgoglobal.com">
          info@taxgoglobal.com
        </a>
      </div>
      <br />
      <div>
        <IoCallOutline style={{ marginRight: "7px" }} size={20} />
        <a style={{ color: "blue" }} href="tel:+1-929-999-4465">
        +1-929-999-4465
        </a>
      </div>

      <br />
      <div
        style={{ textDecoration: "underline", cursor: "pointer" }}
        onClick={navigateandclose}
      >
        <BsJournalBookmark style={{ marginRight: "7px" }} size={20} />
        <span style={{ color: "blue" }}>User Manual</span>
      </div>
      <br />
      <div className="HelpBox1">
        <a
          href="https://www.twitter.com/taxgoglobal/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaXTwitter size={20} color="#212529"/>
        </a>
        <a
          href="https://www.facebook.com/taxgoglobal/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {" "}
          <FaSquareFacebook size={22} color="#212529"/>
        </a>
        <a
          href="https://www.instagram.com/tax_go/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaInstagram size={24} color="#212529"/>
        </a>
        <a
          href="https://www.youtube.com/@taxgoglobal9871"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FiYoutube size={24} color="#212529" />
        </a>

        <FaWhatsapp size={22} color="#212529"/>
      </div>

      <hr />
      <div className="heading-txt2">
        <FaRegKeyboard /> &nbsp; Shortcut Keys
      </div>
      <hr />
      <Table hover size="small">
        <thead>
          <tr>
            <th>Action</th>
            <th>Key</th>
          </tr>
        </thead>
        <tbody style={{ fontSize: "11px" }}> 
          <tr>
            <td>Create Non-stock</td>
            <td>
              <AiFillWindows size={12} /> Alt + W <br />
              <FaApple size={12} /> Option + W
            </td>
          </tr>
          <tr>
            <td>Create Service</td>
            <td>
              <AiFillWindows size={12} /> Alt + M<br />
              <FaApple size={12} /> Option + M
            </td>
          </tr>
          <tr>
            <td>Create Sales invoice</td>
            <td>
              <AiFillWindows size={12} />  Alt + S <br /> <FaApple size={12} />{" "}
              Option + S
            </td>
          </tr>
          <tr>
            <td>Create Proforma invoice</td>
            <td>
              <AiFillWindows size={12} /> Alt + R<br />
              <FaApple size={12} /> Option + R
            </td>
          </tr>
          <tr>
            <td>Create Credit note</td>
            <td>
              <AiFillWindows size={12} />Alt + L<br />
              <FaApple size={12} /> Option + L
            </td>
          </tr>
          <tr>
            <td>Create Cost of goodS sold</td>
            <td>
              <AiFillWindows size={12} /> Alt + T<br />
              <FaApple size={12} /> Option + T
            </td>
          </tr>
          <tr>
            <td>Create Debit note</td>
            <td>
              <AiFillWindows size={12} /> Alt + Y<br />
              <FaApple size={12} /> Option + Y
            </td>
          </tr>
          <tr>
            <td>Create Purchase for asset</td>
            <td>
              <AiFillWindows size={12} /> Alt + U <br />
              <FaApple size={12} /> Option + U
            </td>
          </tr>
          <tr>
            <td>Create Customers</td>
            <td>
              <AiFillWindows size={12} /> Alt + I <br />
              <FaApple size={12} /> Option + I
            </td>
          </tr>
          <tr>
            <td>Create Suppliers</td>
            <td>
              <AiFillWindows size={12} />Alt + O
              <br />
              <FaApple size={12} /> Option + O
            </td>
          </tr><tr>
            <td>Create Journal</td>
            <td>
              <AiFillWindows size={12} /> Alt + P<br />
              <FaApple size={12} /> Option + P
            </td>
          </tr>
          <tr>
            <td>Create Bank</td>
            <td>
              <AiFillWindows size={12} />Alt + A<br />
              <FaApple size={12} /> Option + A
            </td>
          </tr>
          <tr>
            <td>Create My ledger</td>
            <td>
              <AiFillWindows size={12} /> Alt + D
              <br />
              <FaApple size={12} /> Option + D
            </td>
          </tr>
          <tr>
            <td>Create My Category</td>
            <td>
              <AiFillWindows size={12} />Alt + J<br />
              <FaApple size={12} /> Option + j
            </td>
          </tr>
          <tr>
            <td>Create Fixed Asset</td>
            <td>
              <AiFillWindows size={12} /> Alt + G<br />
              <FaApple size={12} /> Option + G
            </td>
          </tr>
          <tr>
            <td>Create  Proposal</td>
            <td>
              <AiFillWindows size={12} /> Alt + V<br />
              <FaApple size={12} /> Option + V
            </td>
          </tr>
          <tr>
            <td>Account Ledger</td>
            <td>
              <AiFillWindows size={12} />Alt + Q<br />
              <FaApple size={12} /> Option + Q
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}
export default HelpBox;
