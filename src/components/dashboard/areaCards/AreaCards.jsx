import { useEffect, useState } from "react";
import AreaCard from "./AreaCard";
import "./AreaCards.scss";
import { getApi } from "../../../helpers/requestHelpers";




const AreaCards = () => {

// const [data, setData] = useState()



// const getData=async()=>{
//   const res= await getApi('get','/api/user/getAdminCount')
//   setData(res?.data)
// }

//   useEffect(() => {
//     getData()
//   }, [])


const data=[{
adminCount:20,
consentForm:40,
template:34
}]

  return (
    <section className="content-area-cards">
      <AreaCard
        colors={["#e4e8ef", "#475be8"]}
        percentFillValue={100}
        cardInfo={{
          title: "Admins",
          value: data[0]?.adminCount,
          text: "Total Number Of Admins.",
        }}
      />
      <AreaCard
        colors={["#e4e8ef", "#4ce13f"]}
        percentFillValue={100}
        cardInfo={{
          title: "Consent Form",
          value: data[0]?.consentForm,
          text: "Total Consent Form.",
        }}
      />
      <AreaCard
        colors={["#e4e8ef", "#f29a2e"]}
        percentFillValue={100}
        cardInfo={{
          title: "Template",
          value: data[0]?.template,
          text: "Total Number Of Template.",
        }}
      />
    </section>
  );
};

export default AreaCards;
