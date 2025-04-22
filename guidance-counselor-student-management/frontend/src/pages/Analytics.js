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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentResponse = await fetch('http://localhost:5000/api/students');
        const offenseResponse = await fetch('http://localhost:5000/api/offenses');
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

  const studentsWithOffensesByGrade = studentData.reduce((acc, student) => {
    if (student.offenses.length > 0) {
      acc[student.grade] = (acc[student.grade] || 0) + 1;
    }
    return acc;
  }, {});

  const barChartData = {
    labels: Object.keys(studentsWithOffensesByGrade),
    datasets: [
      {
        label: 'Number of Students with Offenses',
        data: Object.values(studentsWithOffensesByGrade),
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
          <h2 className="chart-title">Students with Offenses by Grade</h2>
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