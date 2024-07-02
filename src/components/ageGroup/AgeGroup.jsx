import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getApi } from '../../helpers/requestHelpers';
import Loader from '../loader/Loader';

Chart.register(...registerables);

const AgeGroup = () => {
  const today = new Date();
  const formattedToday = today.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(new Date(formattedToday));
  const [endDate, setEndDate] = useState(new Date(formattedToday));
  const [ageData, setAgeData] = useState([]);

  const fetchAgeData = async () => {
    setLoading(true)
    try {
      const startDateFormatted = moment(startDate).format('YYYY-MM-DD');
      const endDateFormatted = moment(endDate).format('YYYY-MM-DD');
      const res = await getApi('get', `api/analytics/age?startDate=${startDateFormatted}&endDate=${endDateFormatted}`);
      setAgeData(res?.data || []);
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setLoading(false)

    }
  };

  useEffect(() => {
    fetchAgeData();
  }, [startDate, endDate]);

  const generateAgeChartData = (ageData) => {
    let aggregatedData = {};

    ageData.forEach(entry => {
      if (aggregatedData[entry.ageRange]) {
        aggregatedData[entry.ageRange] += entry.count;
      } else {
        aggregatedData[entry.ageRange] = entry.count;
      }
    });

    const labels = Object.keys(aggregatedData).map(ageRange => `Age ${ageRange}`);
    const dataPoints = Object.values(aggregatedData);

    return {
      labels,
      datasets: [{
        label: 'Number of Cases by Age Group',
        data: dataPoints,
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0'], // Adjust colors as needed
      }]
    };
  };

  const ageChartData = generateAgeChartData(ageData);
  const [loading, setLoading] = useState(true)

  return (
    <>
     {loading && (
      <div style={{minHeight:"40vh"}} className="d-flex w-100 justify-content-center align-items-center">
        <Loader />
      </div>
    )}
     {!loading && <div>
      <h2 className='mb-2 pb-2'>Cases by Age Group</h2>
      <div className='d-flex justify-content-between'>
        <div className="">
          <label className='me-3'>Start Date: </label>
          <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
        </div>
        <div className="">
          <label className='me-3'>End Date: </label>
          <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
        </div>
      </div>

      <div style={{ width: '100%', height: '100%', margin: '' }}>
        <Bar data={ageChartData} options={{
          responsive: true,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Age Groups'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Number of Cases'
              }
            }
          }
        }} />
      </div>
    </div>}
    </>
   
  );
};

export default AgeGroup;
