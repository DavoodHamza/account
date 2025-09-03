import { Button, Card, Input, Popover, Table, message } from "antd";
import { BsThreeDotsVertical } from "react-icons/bs";
import ViewPopover from "../../../components/viewPopover";
import API from "../../../config/api";
import { DELETE } from "../../../utils/apiCalls";
import { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import AffiliationFormModal from "./modalForm";

function AddAffiliationTable(props: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [id, setId] = useState();

  const navigate = useNavigate();

  const deleteAffiliation = async (val: any) => {
    try {
      let url = API.AFFILIATION + val;
      const res: any = await DELETE(url);
      if (res) {
        message.success("Successfully Deleted The Affiliate");
        props?.reload();
      } else {
        message.error("Cant Delete The Affiliate!!");
      }
    } catch (error) {
      message.error("Something Went Wrong On Deleting The Affiliate!!");
    }
  };
  const columns = [
    {
      title: "Sl",
      dataIndex: "id",
      key: "id",
      render: (id: any, __: any, rowIndex: number) => {
        return <div className="table-Txt">{rowIndex + 1}</div>;
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (record: any) => {
        return <div className="table-Txt">{record}</div>;
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (record: any) => {
        return <div className="table-Txt">{record}</div>;
      },
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (record: any) => {
        return <div className="table-Txt">{record}</div>;
      },
    },
    {
      title: "Affiliate Code",
      dataIndex: "affiliationCode",
      key: "affiliationCode",
      render: (record: any) => {
        return <div className="table-Txt">{record}</div>;
      },
    },
    {
      title: "No Of Referrals",
      dataIndex: "noOfPersons",
      key: "noOfPersons",
      render: (record: any) => {
        return <div className="table-Txt">{record}</div>;
      },
    },
    {
      title: "Amount earned",
      dataIndex: "amountEarned",
      key: "amountEarned",
      render: (record: any) => {
        return (
          <div className="table-Txt">
            {" "}
            {record != null ? record.toFixed(2) : 0}
          </div>
        );
      },
    },

    {
      title: "Action",
      width: 10,
      render: (item: any) => {
        return (
          <div
            className="table-item"
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <Popover
                content={
                  <ViewPopover
                    onView={(val: any) => {
                      navigate("/admin/affiliations/" + item?.id);
                      setId(item?.id);
                    }}
                    OnEdit={() => {
                      setIsEditOpen(true);
                      setId(item?.id);
                    }}
                    OnDelete={() => deleteAffiliation(item?.id)}
                  />
                }
                placement="bottom"
                trigger={"click"}
              >
                <BsThreeDotsVertical size={16} cursor={"pointer"} />
              </Popover>
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <Card>
      <div className="affiliation_box1">
        <div className="affiliation_txt1">Affiliates</div>
        <div className="d-flex gap-3">
          <div>
            <Input
              placeholder="search...."
              prefix={<IoSearchSharp />}
              onChange={(e: any) => {
                props.search(e.target.value);
              }}
              value={props.searchData}
            />
          </div>
          <div>
            <Button type="primary" onClick={() => setIsOpen(true)}>
              Add an Affiliate
            </Button>
          </div>
        </div>
      </div>
      <br />

      <Table
        columns={columns}
        dataSource={props?.data}
        pagination={false}
        size="small"
      />
      {isOpen && (
        <AffiliationFormModal
          openModal={isOpen}
          setIsOpen={setIsOpen}
          type="create"
          mode="admin"
          reload={props?.reload}
        />
      )}

      {isEditOpen && (
        <AffiliationFormModal
          openModal={isEditOpen}
          setIsOpen={setIsEditOpen}
          type="edit"
          mode="admin"
          id={id}
          reload={props?.reload}
        />
      )}
    </Card>
  );
}

export default AddAffiliationTable;
