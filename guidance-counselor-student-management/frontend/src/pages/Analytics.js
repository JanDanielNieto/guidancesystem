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
import '../css/Analytics.css';
import config from '../config';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const Analytics = () => {
  const [studentData, setStudentData] = useState([]);
  const [offenseData, setOffenseData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch students and offenses
        const studentResponse = await fetch(`${config.API_BASE_URL}/api/students`);
        const offenseResponse = await fetch(`${config.API_BASE_URL}/api/offenses`);
        if (!studentResponse.ok || !offenseResponse.ok) {
          throw new Error('Failed to fetch data from the server');
        }
        const students = await studentResponse.json();
        const offenses = await offenseResponse.json();
        setStudentData(students);
        setOffenseData(offenses);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate offenses by type (robust to property name)
  const offensesByType = offenseData.reduce((acc, offense) => {
    // Try different possible property names
    const type =
      offense.offense_type ||
      offense.type ||
      offense.offenseType ||
      'Unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  // Calculate students with offenses by grade
  const studentsWithOffensesByGrade = studentData.reduce((acc, student) => {
    // Check if student has offenses (array and not empty)
    if (Array.isArray(student.offenses) && student.offenses.length > 0) {
      acc[student.grade] = (acc[student.grade] || 0) + 1;
    }
    return acc;
  }, {});

  // Prepare data for the pie chart
  const pieChartData = {
    labels: Object.keys(offensesByType),
    datasets: [
      {
        data: Object.values(offensesByType),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#B2FF66', '#FF66B2', '#66B2FF', '#B266FF'
        ],
        hoverBackgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#B2FF66', '#FF66B2', '#66B2FF', '#B266FF'
        ],
      },
    ],
  };

  // Prepare data for the bar chart
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

  // Calculate summary data
  const totalStudents = studentData.length;
  const totalOffenses = offenseData.length;
  const mostCommonOffense =
    Object.keys(offensesByType).length > 0
      ? Object.keys(offensesByType).reduce((a, b) =>
          offensesByType[a] > offensesByType[b] ? a : b
        )
      : 'N/A';

  if (loading) {
    return <p>Loading analytics...</p>;
  }

  return (
    <div className="analytics-container">
      <header className="analytics-header">
        <h1>Guidance System Analytics</h1>
        <p className="analytics-subtitle">A comprehensive overview of student offenses and trends</p>
      </header>
      <section className="analytics-section">
        <div className="chart-container">
          <h2 className="chart-title">Student Offenses by Type</h2>
          <div className="chart-wrapper">
            <Pie data={pieChartData} />
          </div>
        </div>
        <div className="chart-container">
          <h2 className="chart-title">Students with Offenses by Grade</h2>
          <div className="chart-wrapper">
            <Bar data={barChartData} />
          </div>
        </div>
      </section>

      <section className="analytics-summary">
        <h2 className="summary-title">Summary</h2>
        <div className="summary-content">
          <p><strong>Total Students:</strong> {totalStudents}</p>
          <p><strong>Total Offenses Recorded:</strong> {totalOffenses}</p>
          <p><strong>Most Common Offense:</strong> {mostCommonOffense}</p>
        </div>
      </section>
    </div>
  );
};

export default Analytics;