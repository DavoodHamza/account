import FirstPage from "./firstPage";
import FourthPage from "./forthPage";
import SecoundPage from "./secoundPage";
import ThirdPage from "./thirdPage";

const QuestionScreen = ({ id, item, nextPage }: any) => {

  return (
    <>
      {id === 0 && <FirstPage item={item} nextPage={nextPage} />}
      {id === 1 && <SecoundPage item={item} nextPage={nextPage} />}
      {id === 2 && <ThirdPage item={item} nextPage={nextPage} />}
      {id === 3 && <FourthPage item={item} nextPage={nextPage} />}
      <div>
        
      </div>
    </>
  );
};

export default QuestionScreen;
