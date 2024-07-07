import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getApi } from '../../helpers/requestHelpers';
import Loader from '../loader/Loader';

Chart.register(...registerables);

const AgeGroup = () => {
  const today = new Date();
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [ageData, setAgeData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAgeData = useCallback(async () => {
    try {
      setLoading(true);
      const startDateFormatted = startDate.toISOString().split('T')[0];
      const endDateFormatted = endDate.toISOString().split('T')[0];
      const response = await getApi('get', `api/analytics/age?startDate=${startDateFormatted}&endDate=${endDateFormatted}`);
      setAgeData(response?.data?.data || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchAgeData();
  }, [fetchAgeData]);

  const generateAgeChartData = (ageData) => {
    let aggregatedData = {};
    ageData.forEach(entry => {
      aggregatedData[entry.ageRange] = (aggregatedData[entry.ageRange] || 0) + entry.count;
    });

    const labels = Object.keys(aggregatedData).map(ageRange => `Age ${ageRange}`);
    const dataPoints = Object.values(aggregatedData);
    const minDataPoint = Math.min(...dataPoints);

    return {
      labels,
      datasets: [{
        label: 'Number of Cases by Age Group',
        data: dataPoints,
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0'],
      }],
      minDataPoint
    };
  };

  const ageChartData = generateAgeChartData(ageData);

  const options = useMemo(() => ({
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
        },
        beginAtZero: ageChartData.minDataPoint > 1 ? false : true,
        ticks: {
          stepSize: 1,
          precision: 0,
          min: ageChartData.minDataPoint > 1 ? ageChartData.minDataPoint : 1
        }
      }
    }
  }), [ageChartData.minDataPoint]);

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (date > endDate) {
      setEndDate(date);
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  return (
    <>
      {loading && (
        <div style={{ minHeight: "40vh" }} className="d-flex w-100 justify-content-center align-items-center">
          <Loader />
        </div>
      )}
      {!loading && (
        <div>
          <h2 className='mb-2 pb-2'>Cases by Age Group</h2>
          <div className='d-flex justify-content-between'>
            <div>
              <label className='me-3'>Start Date: </label>
              <DatePicker
                selected={startDate}
                onChange={handleStartDateChange}
                maxDate={today}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText="Select a start date"
              />
            </div>
            <div>
              <label className='me-3'>End Date: </label>
              <DatePicker
                selected={endDate}
                onChange={handleEndDateChange}
                minDate={startDate}
                maxDate={today}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                placeholderText="Select an end date"
              />
            </div>
          </div>
          <div style={{ width: '100%', height: '100%' }}>
            <Bar data={ageChartData} options={options} />
          </div>
        </div>
      )}
    </>
  );
};

export default AgeGroup;
