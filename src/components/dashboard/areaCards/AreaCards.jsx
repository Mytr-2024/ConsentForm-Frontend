import { useEffect, useState } from "react";
import AreaCard from "./AreaCard";
import "./AreaCards.scss";
import { getApi } from "../../../helpers/requestHelpers";
import admins from '../../../assets/icons/profile.png'
import patients from '../../../assets/icons/hospitalisation.png'
import efficency from '../../../assets/icons/statistics.png'



const AreaCards = () => {

const [data, setData] = useState()



const getData=async()=>{
  const res= await getApi('get','/api/analytics/getAnalyticsData')
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
    <section className="content-area-cards">
      <AreaCard
        colors={["#e4e8ef", "#475be8"]}
        percentFillValue={100}
        cardInfo={{
          title: "Admins",
          value: data?.totalAdmins,
          text: "Total Number Of Admins.",
        }}
        cardImage={admins}
      />
      <AreaCard
        colors={["#e4e8ef", "#4ce13f"]}
        percentFillValue={100}
        cardInfo={{
          title: "Consent Form",
          value: data?.totalConsents,
          text: "Total Consent Form.",
        }}
        cardImage={patients}

      />
      <AreaCard
        colors={["#e4e8ef", "#f29a2e"]}
        percentFillValue={100}
        cardInfo={{
          title: "Effiecency",
          value: data?.totalTemplate|| 8,
          text: "Total Number Of Template.",
        }}
        cardImage={efficency}

      />
    </section>
  );
};

export default AreaCards;
