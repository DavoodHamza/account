import moment from "moment";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import LoadingBox from "../../../components/loadingBox";
import API from "../../../config/api";
import { REGISTERPOST } from "../../../utils/apiCalls";
import UserTable from "../components/table";

const columns = [
  //   {
  //     name: "id",
  //     title: "SL No",
  //     dataType: "string",
  //     alignment: "center",
  //     cellRender: ( data : any) => data?.rowIndex + 1,
  //   },
  {
    name: "date",
    title: "Date",
    dataType: "string",
    alignment: "center",
    cellRender: ({ data }: any) =>
      moment(data?.created_at).format("YYYY-MM-DD"),
  },
  {
    name: "fullName",
    title: "Name",
    dataType: "string",
    cellRender: ({ data }: any) => (
      <div>
        {data.fullName}
      </div>
    ),
  },
  {
    name: "country",
    title: "Country",
    dataType: "string",
    alignment: "center",
    cellRender: ({ data }: any) => data?.countryInfo?.name,
  },
  {
    name: "email",
    title: "Email",
    dataType: "string",
  },
  {
    name: "phonenumber",
    title: "Phone Number",
    dataType: "string",
    cellRender: ({ data }: any) => (
      <div>{data.phonenumber ? data.phonenumber : "N/A"}</div>
    ),
  },
];

const RetailXpressUsers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [staffs, setStaffs] = useState<any>([]);
  const [staffName, setStaffName] = useState("");

  const [page, setPage] = useState(1);
  const [take, setTake] = useState(10);

  useEffect(() => {
    fetchRetailUsers();
  }, [page, take, staffName]);

  const fetchRetailUsers = async () => {
    try {
      //setIsLoading(true);
      let url = API.BASE_URL + `user/all?order=DESC&page=${page}&take=${take}`;
      let name;
      if (staffName) {
        name = staffName;
      }
      let obj = { name, isTaxgo: false };
      const data: any = await REGISTERPOST(url, obj);
      setStaffs(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const onPageChange = (page: any, take: any) => {
    setPage(page);
    setTake(take);
  };

  return (
    <>
      <Container>
        <br />
        {isLoading ? (
          <LoadingBox />
        ) : (
          <UserTable
            columns={columns}
            list={staffs}
            title="Retail Xpress List"
            onPageChange={onPageChange}
            setUserName={setStaffName}
          />
        )}
      </Container>
    </>
  );
};

export default RetailXpressUsers;
