import React, { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import axios from 'axios';

const Analytics = () => {
  const [studentData, setStudentData] = useState([]);
  const [offenseData, setOffenseData] = useState([]);

  useEffect(() => {
    // Fetch student data
    axios.get('http://localhost:5000/api/students')
      .then(response => {
        setStudentData(response.data);
      })
      .catch(error => {
        console.error('Error fetching student data:', error);
      });

    // Fetch offense data
    axios.get('http://localhost:5000/api/offenses')
      .then(response => {
        setOffenseData(response.data);
      })
      .catch(error => {
        console.error('Error fetching offense data:', error);
      });
  }, []);

  // Prepare data for the pie chart (student offenses)
  const offensesByType = offenseData.reduce((acc, offense) => {
    acc[offense.type] = (acc[offense.type] || 0) + 1;
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
