import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './patients.css';
import { getApi } from '../../helpers/requestHelpers';
import Loader from '../loader/Loader';

Chart.register(...registerables);

const Patients = () => {
  const [loading, setLoading] = useState(true)

  const today = new Date();
  const formattedToday = today.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(new Date(formattedToday));
  const [endDate, setEndDate] = useState(new Date(formattedToday));
  const [genderStats, setGenderStats] = useState([]);

  const fetchGenderData = async (startDate, endDate) => {
    try {
      setLoading(true)
      const startDateFormatted = moment(startDate).format('YYYY-MM-DD');
      const endDateFormatted = moment(endDate).format('YYYY-MM-DD');
      const response = await getApi('get', `api/analytics/gender?startDate=${startDateFormatted}&endDate=${endDateFormatted}`);
      setGenderStats(response?.data);
      setLoading(false)

    } catch (error) {
      console.error('Failed to fetch gender data:', error);
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchGenderData(startDate, endDate);
  }, [startDate, endDate]);

  const generateChartData = (genderStats) => {

    const maleCount = genderStats?.find(entry => entry.gender === 'male')?.totalForms || 0;
    const femaleCount = genderStats?.find(entry => entry.gender === 'female')?.totalForms || 0;
    const otherCount = genderStats?.find(entry => entry.gender === 'others')?.totalForms || 0;

    return {
      labels: ['Male', 'Female', 'Others'],
      datasets: [{
        label: 'Patient Gender Distribution',
        data: [maleCount, femaleCount, otherCount],
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
      }]
    };
  };

  const chartData = generateChartData(genderStats);

  return (
    <>
     {loading && (
      <div style={{minHeight:"40vh"}} className="d-flex w-100 justify-content-center align-items-center">
        <Loader />
      </div>
    )}
   {!loading && <div>
      <h2 className='mb-2 pb-2'>Patient Gender Distribution</h2>
     
      <div className='d-flex justify-content-between'>
      <div>
        <label className='me-3 startEnd'>Start Date: </label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
                    maxDate={today}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Select a start date"
        />
      </div>
      <div>
        <label className='me-3 startEnd'>End Date: </label>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
                    minDate={startDate}
          maxDate={today}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          placeholderText="Select an end date"
        />
      </div>
    </div>
      <div className="d-flex mt-3 justify-content-between align-items-center">
        <div style={{ width: '300px', height: '300px', margin: '0 auto' }}>
          <Pie data={chartData} />
        </div>
      </div>
    </div>}
    </>
  );
};

export default Patients;
