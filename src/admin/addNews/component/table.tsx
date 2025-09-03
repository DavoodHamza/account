import { Button, Card, Popover, Table, message } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import ViewPopover from "../../../components/viewPopover";
import API from "../../../config/api";
import { DELETE } from "../../../utils/apiCalls";
import BlogForm from "./form";

function AddNewsTable(props: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [id, setId] = useState();

  const deleteBlog = async (val: any) => {
    try {
      let url = API.DELETE_BLOG + val;
      const res: any = await DELETE(url);
      if (res) {
        message.success("Successfully Deleted The News");
        props?.reload();
      } else {
        message.error("Cant Delete The News!!");
      }
    } catch (error) {
      message.error("Something Went Wrong On Deleting The News!!");
    }
  };

  const navigate = useNavigate();
  const columns = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
      render: (id: any, __: any, rowIndex: number) => {
        return <div className="table-Txt">{rowIndex + 1}</div>;
      },
    },
    {
      title: "title",
      dataIndex: "title",
      key: "title",
      render: (record: any) => {
        return <div className="table-Txt">{record}</div>;
      },
    },
    {
      title: "image",
      dataIndex: "image",
      key: "image",
      render: (record: any) => {
        return (
          <div className="table-Txt">
            <img src={record} className="addNewsTable_img" />
          </div>
        );
      },
    },
    {
      title: "content",
      dataIndex: "content",
      key: "content",
      render: (record: any) => {
        return <div className="table-Txt">{record}</div>;
      },
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (record: any) => {
        return <div className="table-Txt">{record}</div>;
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (record: any) => {
        return (
          <div className="table-Txt">{dayjs(record).format("DD-MM-YY")}</div>
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
                    OnEdit={() => {
                      setIsEditOpen(true);
                      setId(item?.id);
                    }}
                    OnDelete={() => deleteBlog(item?.id)}
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
      <div className="addNews_box1">
        <div className="addNews_txt1">News Screen</div>
        <div>
          <Button type="primary" onClick={() => setIsOpen(true)}>
            Add News
          </Button>
        </div>
      </div>
      <br />
      <div style={{ overflowX: "auto" }}>
        <Table
          columns={columns}
          dataSource={props?.data}
          pagination={false}
          size="small"
        />
      </div>
      {isOpen && (
        <BlogForm
          openModal={isOpen}
          setIsOpen={setIsOpen}
          type="create"
          reload={props?.reload}
        />
      )}

      {isEditOpen && (
        <BlogForm
          openModal={isEditOpen}
          setIsOpen={setIsEditOpen}
          type="edit"
          id={id}
          reload={props?.reload}
        />
      )}
    </Card>
  );
}

export default AddNewsTable;
