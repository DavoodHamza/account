import React, { useEffect, useState } from "react";
import LoadingBox from "../../components/loadingBox";
import { Container } from "react-bootstrap";
import LoyaltyCardTable from "./components/table";
import { REGISTERGET } from "../../utils/apiCalls";
import API from "../../config/api";
import SubHeader from "../adminNavigation/subHeader";

const columns = [
  {
    name: "id",
    title: "SL No",
    dataType: "string",
    alignment: "center",
    cellRender: (data: any) => data?.rowIndex + 1,
  },
  {
    name: "userName",
    title: "Name",
    dataType: "string",
  },
  {
    name: "companyName",
    title: "Company",
    dataType: "string",
  },
  {
    name: "allowedCardCount",
    title: "Number of Cards Issued",
    dataType: "string",
  },
];

const LoyaltyCard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [cardData, setCardData] = useState<any>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchCardData();
  }, []);

  const fetchCardData = async () => {
    try {
      setIsLoading(true);
      let url = API.MASTER_BASE_URL + `loyalyCardMaster/overallData`;
      const data: any = await REGISTERGET(url, null);
      setCardData(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <LoadingBox />
      ) : (
        <>
          <SubHeader
            firstPathLink={"/admin/loyaltyCard"}
            firstPathText="Loyalty Cards"
            goback={-1}
            title="Loyalty Cards"
          />
          <Container>
            <br />
            <LoyaltyCardTable
              columns={columns}
              list={cardData}
              title="Loyalty Card List"
              setIsOpen={setIsOpen}
            />
          </Container>
        </>
      )}
    </>
  );
};

export default LoyaltyCard;
