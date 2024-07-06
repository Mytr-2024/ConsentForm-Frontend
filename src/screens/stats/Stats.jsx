import { useEffect, useState } from "react";
import CaseTypeStats from "../../components/caseTypeStats/CaseTypeStats";
import ConsentFormBarChart from "../../components/consentFormChart/ConsentFormChart";
import Patients from "../../components/patients/Patients";
import { getApi } from "../../helpers/requestHelpers";
import AgeGroup from "../../components/ageGroup/AgeGroup";
import { AreaCards, AreaCharts, AreaTable, AreaTop } from "../../components";
import { Link } from "react-router-dom";
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { format, addDays } from 'date-fns';
import Loader from "../../components/loader/Loader";

export default function Stats() {



  const [allCaseType, setAllCaseType] = useState()

  const getAllcaseType = async () => {
    let allCase = await getApi("get", "/api/template/getAllCaseType")
    setAllCaseType(allCase?.data?.caseType)

}

useEffect(() => {
  // Fetch case types when component mounts
  getAllcaseType();

  // Set up form validation

}, []);



  const [duration, setDuration] = useState("Week")


  // const data = [
  //   {
  //     "name": "25/07/23",
  //     "uv": 4000,
  //     "amt": 2400
  //   },
  //   {
  //     "name": "26/07/23",
  //     "uv": 3000,
  //     "amt": 2210
  //   },
  //   {
  //     "name": "27/07/23",
  //     "uv": 2000,
  //     "amt": 2290
  //   },
  //   {
  //     "name": "28/07/23",
  //     "uv": 2780,
  //     "amt": 2000
  //   },
  //   {
  //     "name": "29/07/23",
  //     "uv": 1890,
  //     "amt": 2181
  //   },
  //   {
  //     "name": "30/07/23",
  //     "uv": 2390,
  //     "amt": 2500
  //   },
  //   {
  //     "name": "31/07/23",
  //     "uv": 3490,
  //     "amt": 2100
  //   }
  // ]
  

  const [chartData, setChartData] = useState()

  const getChartData=async(dur)=>{
    setLoading(true)
    setDuration(dur)
    const today = new Date();
    if(dur==="week"){
      const startDate = addDays(today, 0);
      const endDate = addDays(startDate, -6);
      const formattedDateRange = `${format(startDate, 'dd')} - ${format(endDate, 'dd MMM, yyyy')}`;
      setDateRange(formattedDateRange);
    }
    else if(dur==="month"){
      const startDate = addDays(today, 0);
      const endDate = addDays(startDate, -29);
      const formattedDateRange = `${format(startDate, 'dd')} - ${format(endDate, 'dd MMM, yyyy')}`;
      setDateRange(formattedDateRange);
    }
    else if(dur==="year"){
      const startDate = addDays(today, 0);
      const endDate = addDays(startDate, -364);
      const formattedDateRange = `${format(startDate, 'dd')} - ${format(endDate, 'dd MMM, yyyy')}`;
      setDateRange(formattedDateRange);
    }
   

   const res=await getApi('get',`/api/analytics/getConsentFormAnalytics?period=${dur || 'week'}`)
   console.log(res?.data?.data)
   setChartData(res?.data?.data)
   setLoading(false)
  }


  useEffect(() => {
    const today = new Date();
    const startDate = addDays(today, 0);
    const endDate = addDays(startDate, -6);
    setDuration("Week")
    const formattedDateRange = `${format(startDate, 'dd')} - ${format(endDate, 'dd MMM, yyyy')}`;
    setDateRange(formattedDateRange);
    getChartData()
  }, [])

  const [loading, setLoading] = useState(true)


  const [dateRange, setDateRange] = useState()

  return (
    <>
   
     <div className="content-area">


   
<div className="content-area">
      <AreaTop />
      <div className="d-flex justify-content-between">
        <h3 className="" >Welcome back <b>{JSON.parse(localStorage.getItem('user'))?.user?.name || "Admin"}!</b></h3>
        <div className="dropdown">
  <button style={{background:"#7C46BE", color:"white"}} className="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
    Activity This {duration?duration:"Week"}
  </button>
  <ul className="dropdown-menu">
    <li><Link className="dropdown-item" onClick={(e)=>{getChartData('month')}} >This Month</Link></li>
    <li><Link className="dropdown-item" onClick={(e)=>{getChartData('year')}} >This Year</Link></li>
    <li><Link className="dropdown-item" onClick={(e)=>{getChartData('week')}} >This Week</Link></li>
  </ul>
</div>
      </div>
      <AreaCards />
      {loading && (
      <div style={{minHeight:"40vh"}} className="d-flex w-100 justify-content-center align-items-center">
        <Loader />
      </div>
    )}
{!loading &&
<>
      <div className="d-flex mt-5">
  <h5>PATIENTS STATISTICS</h5>
</div>
      <div className="d-flex mt-3 justify-content-between">
        <h6 className="ms-3" >{dateRange}</h6>
        <div className="d-flex">
          <h6 style={{color:"#93A1C1"}} className={`mx-5`} >YEAR</h6>
          <h6 style={{color:"#93A1C1"}} className={`mx-5`} >MONTH</h6>
          <h6 style={{color:"#93A1C1"}} className={`mx-5`} >WEEK</h6>
        </div>
</div>


<AreaChart className="mb-5" width={1100} height={250} data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
            </defs>
            <XAxis dataKey="date" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Area type="monotone" dataKey="count" stroke="#8884d8" fillOpacity={1} fill="url(#colorCount)" />
        </AreaChart>


        </>}
      {/* <AreaCharts /> */}
      <AreaTable />
    </div>



      {/* <AreaTop title="Detailed Stats" /> */}
      <div className="container consentForm p-5">


<h1 className="text-center fw-bold " ><span style={{color:"#7C46BE"}} >Statistics</span> Of Particular Admin </h1>

        <form className="row g-3 mt-3">


          <ConsentFormBarChart 
            adminEmail="Admin1" 
          />
        </form>
        <form className="row chart-container mt-5 g-3">
          <Patients 
            // data={data} 
            // adminEmail="Admin1" 
          />
        </form>

<form className="row mt-5 g-3">
        <CaseTypeStats 
          adminEmail="Admin1" 
          caseTypes={allCaseType}
        />
      </form>
<form className="row mt-5 g-3">
        <AgeGroup 
        />
      </form>

      </div>
    </div>
    </>
  );
}
