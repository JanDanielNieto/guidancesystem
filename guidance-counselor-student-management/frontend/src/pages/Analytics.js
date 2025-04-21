import React, { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import '../css/Analytics.css'; // Ensure the CSS file exists

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const Analytics = () => {
  const [studentData, setStudentData] = useState([]);
  const [offenseData, setOffenseData] = useState([]);

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentResponse = await fetch('/api/students'); // Replace with your actual API endpoint
        const offenseResponse = await fetch('/api/offenses'); // Replace with your actual API endpoint
        const students = await studentResponse.json();
        const offenses = await offenseResponse.json();
        setStudentData(students);
        setOffenseData(offenses);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

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
    <div className="analytics-container">
      <header className="analytics-header">
        <h1>Guidance System Analytics</h1>
      </header>
      <section className="analytics-section">
        <div className="chart-container">
          <h2 className="chart-title">Student Offenses</h2>
          <Pie
            data={pieChartData}
            options={{
              plugins: {
                legend: {
                  position: 'top',
                  labels: {
                    boxWidth: 10,
                  },
                },
              },
              maintainAspectRatio: false,
            }}
          />
        </div>
        <div className="chart-container">
          <h2 className="chart-title">Students by Section</h2>
          <Bar
            data={barChartData}
            options={{
              plugins: {
                legend: {
                  position: 'top',
                  labels: {
                    boxWidth: 10,
                  },
                },
              },
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </section>
      <section className="analytics-summary">
        <h2>Summary</h2>
        <p>Total Students: {studentData.length}</p>
        <p>Total Offenses Recorded: {offenseData.length}</p>
        <p>
          Most Common Offense:{' '}
          {Object.keys(offensesByType).reduce((a, b) => (offensesByType[a] > offensesByType[b] ? a : b), 'N/A')}
        </p>
      </section>
    </div>
  );
};

export default Analytics;