import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './caseTypeStats.css';
import { getApi } from '../../helpers/requestHelpers';
import Loader from '../loader/Loader';

Chart.register(...registerables);

const CaseTypeStats = ({ adminEmail, caseTypes }) => {
  const today = new Date();
  const formattedToday = today.toISOString().split('T')[0];

  const [caseStartDate, setCaseStartDate] = useState(new Date(formattedToday));
  const [caseEndDate, setCaseEndDate] = useState(new Date(formattedToday));
  const [selectedCaseType, setSelectedCaseType] = useState('all');
  const [caseTypeStats, setCaseTypeStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCaseTypeData = async () => {
    try {
      setLoading(true);
      const startDateFormatted = moment(caseStartDate).format('YYYY-MM-DD');
      const endDateFormatted = moment(caseEndDate).format('YYYY-MM-DD');
      const res = await getApi('get', `api/analytics/caseTypes?startDate=${startDateFormatted}&endDate=${endDateFormatted}&caseType=${selectedCaseType}`);
      setCaseTypeStats(res?.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaseTypeData();
  }, [caseStartDate, caseEndDate, selectedCaseType]);

  const generateChartData = (data) => {
    const groupedData = data.reduce((acc, entry) => {
      const date = moment(entry.date.date).format('YYYY-MM-DD'); // Extract and format the date correctly
      acc[date] = (acc[date] || 0) + entry.cases;
      return acc;
    }, {});

    const labels = Object.keys(groupedData).sort(); // Sort the labels to ensure correct order
    const dataPoints = labels.map(label => groupedData[label]);

    return {
      labels,
      datasets: [{
        label: 'Number of Cases',
        data: dataPoints,
        backgroundColor: '#36A2EB',
      }]
    };
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  const chartData = generateChartData(caseTypeStats);

  return (
    <>
      {loading && (
        <div style={{ minHeight: "40vh" }} className="d-flex w-100 justify-content-center align-items-center">
          <Loader />
        </div>
      )}
      {!loading && (
        <div>
          <h2 className='mb-2 pb-2'>Case Type Distribution</h2>
          <div className='d-flex justify-content-between'>
            <div>
              <label className='me-3 startEnd'>Start Date: </label>
              <DatePicker
                selected={caseStartDate}
                onChange={(date) => {
                  setCaseStartDate(date);
                  if (caseEndDate && date > caseEndDate) {
                    setCaseEndDate(null); // Reset end date if start date is after end date
                  }
                }}
                maxDate={today}
                selectsStart
                startDate={caseStartDate}
                endDate={caseEndDate}
                placeholderText="Select a start date"
              />
            </div>
            <div>
              <label className='me-3 startEnd'>End Date: </label>
              <DatePicker
                selected={caseEndDate}
                onChange={(date) => setCaseEndDate(date)}
                minDate={caseStartDate}
                maxDate={today}
                selectsEnd
                startDate={caseStartDate}
                endDate={caseEndDate}
                placeholderText="Select an end date"
              />
            </div>
          </div>
          <div className="mt-3 w-100 d-flex justify-content-between">
            <label className='me-3 startEnd' style={{ minWidth: "81px" }}>Case Type: </label>
            <select className='w-100 py-1' value={selectedCaseType} onChange={(e) => setSelectedCaseType(e.target.value)}>
              <option value="all">All Case Types</option>
              {caseTypes?.map((caseType, index) => (
                <option key={index} value={caseType}>{caseType}</option>
              ))}
            </select>
          </div>
          <div style={{ width: '100%', height: '100%', margin: '' }} className='caseTypeCanvas'>
            <Bar data={chartData} options={options} />
          </div>
        </div>
      )}
    </>
  );
};

export default CaseTypeStats;
