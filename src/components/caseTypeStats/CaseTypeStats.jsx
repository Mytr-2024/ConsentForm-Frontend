import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './caseTypeStats.css';
import { getApi } from '../../helpers/requestHelpers';

Chart.register(...registerables);

const CaseTypeStats = ({ adminEmail, caseTypes }) => {
  const today = new Date();
  const formattedToday = today.toISOString().split('T')[0];

  const [caseStartDate, setCaseStartDate] = useState(new Date(formattedToday));
  const [caseEndDate, setCaseEndDate] = useState(new Date(formattedToday));
  const [selectedCaseType, setSelectedCaseType] = useState('all');
  const [caseTypeStats, setCaseTypeStats] = useState([]);

  const fetchCaseTypeData = async () => {
    try {
      const startDateFormatted = moment(caseStartDate).format('YYYY-MM-DD');
      const endDateFormatted = moment(caseEndDate).format('YYYY-MM-DD');
      const res = await getApi('get', `api/analytics/caseTypes?startDate=${startDateFormatted}&endDate=${endDateFormatted}&caseType=${selectedCaseType}`);
      setCaseTypeStats(res?.data || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  useEffect(() => {
    fetchCaseTypeData();
  }, [caseStartDate, caseEndDate, selectedCaseType]);

  const generateChartData = (data) => {
    const groupedData = data.reduce((acc, entry) => {
      const date = moment(entry.date).format('YYYY-MM-DD');
      acc[date] = (acc[date] || 0) + entry.cases;
      return acc;
    }, {});

    const labels = Object.keys(groupedData);
    const dataPoints = Object.values(groupedData);

    return {
      labels,
      datasets: [{
        label: 'Number of Cases',
        data: dataPoints,
        backgroundColor: '#36A2EB',
      }]
    };
  };

  const chartData = generateChartData(caseTypeStats);

  return (
    <div>
      <h2 className='mb-2 pb-2'>Case Type Distribution</h2>
      <div className='d-flex justify-content-between'>
        <div className="">
          <label className='me-3'>Start Date: </label>
          <DatePicker selected={caseStartDate} onChange={(date) => setCaseStartDate(date)} />
        </div>
        <div className="">
          <label className='me-3'>End Date: </label>
          <DatePicker selected={caseEndDate} onChange={(date) => setCaseEndDate(date)} />
        </div>
      </div>
      <div className="mt-3 w-100 d-flex justify-content-between">
        <label className='me-3' style={{minWidth:"81px"}}>Case Type: </label>
        <select className='w-100' value={selectedCaseType} onChange={(e) => setSelectedCaseType(e.target.value)}>
          <option value="">Select Case Type</option>
          {caseTypes?.map((caseType, index) => (
            <option key={index} value={caseType}>{caseType}</option>
          ))}
        </select>
      </div>
      <div style={{ width: '100%', height: '100%', margin: '' }} className='caseTypeCanvas'>
        <Bar data={chartData} />
      </div>
    </div>
  );
};

export default CaseTypeStats;
