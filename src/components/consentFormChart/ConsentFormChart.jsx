import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getApi } from '../../helpers/requestHelpers';
import { useParams } from 'react-router-dom';
import './ConsentFormChart.css'
import Loader from '../loader/Loader';
Chart.register(...registerables);

const ConsentFormBarChart = ({ adminEmail }) => {
  const { email } = useParams();

  const [filteredData, setFilteredData] = useState([]);
  const today = new Date();
  const formattedToday = today.toISOString().split('T')[0];

  const [adminStartDate, setAdminStartDate] = useState(new Date(formattedToday));
  const [adminEndDate, setAdminEndDate] = useState(new Date(formattedToday));
  const [adminConsentStats, setAdminConsentStats] = useState([]);
  const [loading, setLoading] = useState(true)

  const fetchConsentData = async () => {
    try {
      setLoading(true)
      const startDateFormatted = moment(adminStartDate).format('YYYY-MM-DD');
      const endDateFormatted = moment(adminEndDate).format('YYYY-MM-DD');
      const res = await getApi('get', `api/analytics/admin?startDate=${startDateFormatted}&endDate=${endDateFormatted}&admin=${email}`);
      setAdminConsentStats(res?.data || []);
      setLoading(false)

    } catch (error) {
      setLoading(false)
      console.error('Failed to fetch data:', error);
    }
  };

  useEffect(() => {
    fetchConsentData();
  }, [adminStartDate, adminEndDate, email]);

  useEffect(() => {
    const filtered = adminConsentStats.filter(entry =>
      moment(entry.date.date).isBetween(moment(adminStartDate).startOf('day'), moment(adminEndDate).endOf('day'), undefined, '[]')
    );
    setFilteredData(filtered);
  }, [adminConsentStats, adminStartDate, adminEndDate]);

  const generateChartData = (filteredData) => {
    const labels = filteredData.map(entry => moment(entry.date.date).format('MMM DD, YYYY'));
    const dataPoints = filteredData.map(entry => entry.createdForms);

    return {
      labels,
      datasets: [{
        label: `Created Forms by ${email}`,
        data: dataPoints,
        backgroundColor: generateRandomColor(), // Function to generate random colors
      }]
    };
  };

  const generateRandomColor = () => {
    return '#' + (Math.random().toString(16) + '000000').substring(2, 8);
  };

  const chartData = generateChartData(filteredData);

  const changeConsentData = (date, isStartDate = true) => {
    if (isStartDate) {
      setAdminStartDate(date);
    } else {
      setAdminEndDate(date);
    }
  };

  return (
    <>
   
     {loading && (
      <div style={{minHeight:"55vh"}} className="d-flex w-100 justify-content-center align-items-center">
        <Loader />
      </div>
    )}
  {!loading &&  <div>
      <h2 className='mb-2 pb-2'>Created Form's</h2>
      <div className='d-flex justify-content-between'>
        <div>
          <label className='me-3 startEnd '>Start Date: </label>
          <DatePicker selected={adminStartDate} onChange={date => changeConsentData(date, true)} />
        </div>
        <div>
          <label className='me-3 startEnd'>End Date: </label>
          <DatePicker selected={adminEndDate} onChange={date => changeConsentData(date, false)} />
        </div>
      </div>
      <Bar data={chartData} />
    </div>}
    </>
  );
};

export default ConsentFormBarChart;
