import React, { useState, useEffect } from 'react';
import './../css/componentCss/HomeTable.css';

const HomeTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Simulate an API call
    const fetchData = async () => {
      // Dummy data
      const dummyData = [
        { idno: 1, name: 'John Doe', cardid: '1234', date: '2024-07-26', timein: '08:00 AM', timeout: '05:00 PM' },
        { idno: 2, name: 'Jane Smith', cardid: '5678', date: '2024-07-26', timein: '09:00 AM', timeout: '06:00 PM' },
        // Add more rows as needed
      ];
      setData(dummyData);
    };

    fetchData();
  }, []);

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
              <td>{entry.idno}</td>
              <td>{entry.name}</td>
              <td>{entry.cardid}</td>
              <td>{entry.date}</td>
              <td>{entry.timein}</td>
              <td>{entry.timeout}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HomeTable;
