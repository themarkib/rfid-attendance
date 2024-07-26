import React, { useState, useEffect } from 'react';
import './../css/componentCss/HomeTable.css';

const HomeTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/attendance');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);


  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="home-container">
      <h1>Attendance Table</h1>
      <table className="attendance-table">
        <thead>
          <tr>
            <th>ID No</th>
            <th>Name</th>
            <th>Card ID</th>
            <th>Date</th>
            <th>Time In</th>
            <th>Time Out</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr key={entry.idno}>
              <td>{entry.id}</td>
              <td>{entry.name}</td>
              <td>{entry.card_id}</td>
              <td>{formatDate(entry.date)}</td>
              <td>{entry.time_in}</td>
              <td>{entry.time_out}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HomeTable;
