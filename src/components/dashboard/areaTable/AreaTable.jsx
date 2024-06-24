import AreaTableAction from "./AreaTableAction";
import "./AreaTable.scss";
import { useEffect, useState } from "react";
import { getApi } from "../../../helpers/requestHelpers";

const TABLE_HEADS = [
  "Case Type",
  "Created By",
  "Created At",
  "Action",
];

// const data = [
//   {
//       _id: "6676866f5b90da3848b08227",
//       createdBy: "alaukik@gmail.com",
//       caseType: "dengue",
//       createdAt: "2024-06-22T08:08:15.711Z"
//   },
//   {
//       _id: "6675270c78b53b9ce3d91230",
//       createdBy: "alaukik@gmail.com",
//       caseType: "kidney stone",
//       createdAt: "2024-06-21T07:09:00.606Z"
//   },
//   {
//       _id: "667521aab984fcec726be9dc",
//       createdBy: "alaukiksingh123@gmail.com",
//       caseType: "Catarct-demo 3",
//       createdAt: "2024-06-21T06:46:02.693Z"
//   },
//   {
//       _id: "667520b4b984fcec726be9bd",
//       createdBy: "alaukiksingh123@gmail.com",
//       caseType: "fibroids",
//       createdAt: "2024-06-21T06:41:56.095Z"
//   },
//   {
//       _id: "66751fed3dec18c492ba3916",
//       createdBy: "alaukiksingh123@gmail.com",
//       caseType: "dengue",
//       createdAt: "2024-06-21T06:38:37.087Z"
//   }
// ];




const AreaTable = () => {

  useEffect(() => {
    getData()
  }, [])
  
  const [data, setData] = useState()
  
  
  
  const getData=async()=>{
  const res= await getApi('get','/api/analytics/getAnalyticsData')

  setData(res?.data?.recentConsents)
  }
  
  return (
    <section className="content-area-table">
      <div className="data-table-info">
        <h4 className="data-table-title">Latest Consent Form</h4>
      </div>
      <div className="data-table-diagram">
        <table>
          <thead>
            <tr>
              {TABLE_HEADS.map((head, index) => (
                <th key={index}>{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.map((dataItem) => (
              <tr key={dataItem._id}>
                <td>{dataItem.caseType}</td>
                <td>{dataItem.createdBy}</td>
                <td>{new Date(dataItem.createdAt).toLocaleString()}</td>
                <td>
                  <AreaTableAction dataItem={dataItem}   />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AreaTable;
