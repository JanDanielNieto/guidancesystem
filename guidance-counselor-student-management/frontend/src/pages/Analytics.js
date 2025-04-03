import React, { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [studentData, setStudentData] = useState([]);
  const [offenseData, setOffenseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch student data
        const studentResponse = await axios.get('http://localhost:5000/api/students');
        setStudentData(studentResponse.data);

        // Fetch offense data
        const offenseResponse = await axios.get('http://localhost:5000/api/offenses');
        setOffenseData(offenseResponse.data);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // Prepare data for the pie chart (student offenses)
  const offensesByType = offenseData.reduce((acc, offense) => {
    acc[offense.offense_type] = (acc[offense.offense_type] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = {
    labels: Object.keys(offensesByType),
    datasets: [
      {
        data: Object.values(offensesByType),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  };

  // Prepare data for the bar chart (students by section)
  const studentsBySection = studentData.reduce((acc, student) => {
    acc[student.section] = (acc[student.section] || 0) + 1;
    return acc;
  }, {});

  const barChartData = {
    labels: Object.keys(studentsBySection),
    datasets: [
      {
        label: 'Number of Students',
        data: Object.values(studentsBySection),
        backgroundColor: '#36A2EB',
        borderColor: '#36A2EB',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Analytics</h1>
      <div style={{ marginBottom: '40px' }}>
        <h2>Student Offenses</h2>
        <Pie data={pieChartData} />
      </div>
      <div>
        <h2>Students by Section</h2>
        <Bar
          data={barChartData}
          options={{
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Analytics;