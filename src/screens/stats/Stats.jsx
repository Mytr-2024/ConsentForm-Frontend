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

export default function Stats() {


  const datar = [
    { date: '2024-06-01', admin: 'Admin1', createdForms: 5, gender: 'male' },
    { date: '2024-07-02', admin: 'Admin1', createdForms: 7, gender: 'female' },
    { date: '2024-06-02', admin: 'Admin2', createdForms: 3, gender: 'male' },
    { date: '2024-06-03', admin: 'Admin2', createdForms: 6, gender: 'other' },
    { date: '2024-08-02', admin: 'Admin1', createdForms: 9, gender: 'female' },
    { date: '2024-06-04', admin: 'Admin1', createdForms: 70, gender: 'male' },
    { date: '2025-01-07', admin: 'Admin1', createdForms: 22, gender: 'male' },
    { date: '2025-01-08', admin: 'Admin1', createdForms: 22, gender: 'female' },
    { date: '2025-01-09', admin: 'Admin1', createdForms: 22, gender: 'female' },
    { date: '2025-01-10', admin: 'Admin1', createdForms: 22, gender: 'other' },
    { date: '2025-02-05', admin: 'Admin1', createdForms: 22, gender: 'male' },
    { date: '2025-02-05', admin: 'Admin1', createdForms: 22, gender: 'male' },
    { date: '2025-02-05', admin: 'Admin1', createdForms: 22, gender: 'male' },
    { date: '2025-02-05', admin: 'Admin1', createdForms: 22, gender: 'male' },
    { date: '2025-02-05', admin: 'Admin1', createdForms: 22, gender: 'male' },
    { date: '2025-02-05', admin: 'Admin1', createdForms: 22, gender: 'male' },
   { date: '2025-02-05', admin: 'Admin1', createdForms: 22, gender: 'male' },
  ];

  const ageData = [
    {date: '2024-06-01', age: '1-17', ageType: 'child', caseType: 'type1', cases: 10 },
    {date: '2024-06-01', age: '18-40', ageType: 'adult', caseType: 'type1', cases: 1 },
    {date: '2024-06-01', age: '41-60', ageType: 'middleAge', caseType: 'type1', cases: 22 },
    {date: '2024-06-01', age: '61-100', ageType: 'oldAge', caseType: 'type1', cases: 10 },
    {date: '2024-07-01', age: '1-17', ageType: 'child', caseType: 'type1', cases: 10 },
    {date: '2024-07-01', age: '18-40', ageType: 'adult', caseType: 'type1', cases: 1 },
    {date: '2024-07-01', age: '41-60', ageType: 'middleAge', caseType: 'type1', cases: 22 },
    {date: '2024-07-01', age: '61-100', ageType: 'oldAge', caseType: 'type1', cases: 10 },
 
  ];




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

  const data2 = [
    { date: '2024-06-01', admin: 'Admin1', caseType: 'type1', cases: 10 },
    { date: '2024-06-02', admin: 'Admin1', caseType: 'type1', cases: 1 },
    { date: '2024-06-03', admin: 'Admin1', caseType: 'type1', cases: 22 },
    { date: '2024-07-02', admin: 'Admin1', caseType: 'type1', cases: 10 },
    { date: '2024-08-02', admin: 'Admin1', caseType: 'type1', cases: 2 },
    { date: '2025-01-07', admin: 'Admin1', caseType: 'type1', cases: 11 },
  ];

  const [duration, setDuration] = useState("Week")


  const data = [
    {
      "name": "Page A",
      "uv": 4000,
      "amt": 2400
    },
    {
      "name": "Page B",
      "uv": 3000,
      "amt": 2210
    },
    {
      "name": "Page C",
      "uv": 2000,
      "amt": 2290
    },
    {
      "name": "Page D",
      "uv": 2780,
      "amt": 2000
    },
    {
      "name": "Page E",
      "uv": 1890,
      "amt": 2181
    },
    {
      "name": "Page F",
      "uv": 2390,
      "amt": 2500
    },
    {
      "name": "Page G",
      "uv": 3490,
      "amt": 2100
    }
  ]
  

  const [chartData, setChartData] = useState()

  const getChartData=async(dur)=>{
    setDuration(dur)
    const today = new Date();
    if(dur==="Week"){
      const startDate = addDays(today, 0);
      const endDate = addDays(startDate, -6);
      const formattedDateRange = `${format(startDate, 'dd')} - ${format(endDate, 'dd MMM, yyyy')}`;
      setDateRange(formattedDateRange);
    }
    else if(dur==="Month"){
      const startDate = addDays(today, 0);
      const endDate = addDays(startDate, -29);
      const formattedDateRange = `${format(startDate, 'dd')} - ${format(endDate, 'dd MMM, yyyy')}`;
      setDateRange(formattedDateRange);
    }
    else if(dur==="Year"){
      const startDate = addDays(today, 0);
      const endDate = addDays(startDate, -364);
      const formattedDateRange = `${format(startDate, 'dd')} - ${format(endDate, 'dd MMM, yyyy')}`;
      setDateRange(formattedDateRange);
    }
   

   const res=await getApi('get',`/api/${duration}|| Week`)
   setChartData(res?.data)
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


  const [dateRange, setDateRange] = useState()

  return (
    <div className="content-area">



<div className="content-area">
      <AreaTop />
      <div className="d-flex justify-content-between">
        <h3 className="" >Welcome back <b>NAGIREDDY!</b></h3>
        <div className="dropdown">
  <button style={{background:"#7C46BE", color:"white"}} className="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
    Activity This {duration?duration:"Week"}
  </button>
  <ul className="dropdown-menu">
    <li><Link className="dropdown-item" onClick={(e)=>{getChartData('Month')}} >This Month</Link></li>
    <li><Link className="dropdown-item" onClick={(e)=>{getChartData('Year')}} >This Year</Link></li>
    <li><Link className="dropdown-item" onClick={(e)=>{getChartData('Week')}} >This Week</Link></li>
  </ul>
</div>
      </div>
      <AreaCards />

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


      <AreaChart className="mb-5" width={1100} height={250} data={data}
  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
    
  <defs>
    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
    </linearGradient>
    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
    </linearGradient>
  </defs>
  <XAxis dataKey="name" />
  <YAxis />
  <CartesianGrid strokeDasharray="3 3" />
  <Tooltip />
  <Area type="monotone" dataKey="uv" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
  <Area type="monotone" dataKey="pv" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
</AreaChart>



      {/* <AreaCharts /> */}
      <AreaTable />
    </div>



      {/* <AreaTop title="Detailed Stats" /> */}
      <div className="container consentForm p-5">


<h1 className="text-center" >Stastistics Of Particular Admin </h1>

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
          // ageData={ageData}
        />
      </form>

      </div>
    </div>
  );
}
