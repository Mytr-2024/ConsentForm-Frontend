import { useEffect, useState } from "react";
import AreaCard from "./AreaCard";
import "./AreaCards.scss";
import { getApi } from "../../../helpers/requestHelpers";
import admins from '../../../assets/icons/profile.png'
import patients from '../../../assets/icons/hospitalisation.png'
import efficency from '../../../assets/icons/statistics.png'
import Loader from "../../loader/Loader";



const AreaCards = () => {

const [data, setData] = useState()



const getData=async()=>{
  const res= await getApi('get','api/analytics/getConsentStatusCounts')
  setData(res?.data)

}

  useEffect(() => {
    getData()
  }, [])


// const data=[{
// adminCount:20,
// consentForm:40,
// template:34
// }]


  return (
    <>
   
     <section className="content-area-cards">
      <AreaCard
        colors={["#e4e8ef", "#475be8"]}
        percentFillValue={100}
        cardInfo={{
          title: "Total Consent Count ",
          value: data?.submittedCount || "Loading..",
          text: "Total Number Of Consent.",
        }}
        cardImage={admins}
      />
      <AreaCard
        colors={["#e4e8ef", "#4ce13f"]}
        percentFillValue={100}
        cardInfo={{
          title: "Total Patients",
          value: data?.inProgressCount+data?.submittedCount|| "Loading..",
          text: "Total Patients .",
        }}
        cardImage={patients}

      />
      <AreaCard
        colors={["#e4e8ef", "#f29a2e"]}
        percentFillValue={100}
        cardInfo={{
          title: "Efficiency",
          value: (( data?.submittedCount/(data?.inProgressCount + data?.submittedCount))*100).toFixed(3)+"%"|| "Loading..",
          text: "Total Efficiency.",
        }}
        cardImage={efficency}

      />
    </section>
    </>
   
  );
};

export default AreaCards;
