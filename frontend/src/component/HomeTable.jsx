import React, { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import { Download } from '@mui/icons-material'; // Import the Download icon
import './../css/componentCss/HomeTable.css';

const HomeTable = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async (query = '') => {
    try {
      const response = await fetch(`http://localhost:3000/api/search?name=${query}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData(searchQuery);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const headers = [
    { label: 'ID No', key: 'id' },
    { label: 'Name', key: 'name' },
    { label: 'Card ID', key: 'card_id' },
    { label: 'Date', key: 'date' },
    { label: 'Time In', key: 'time_in' },
    { label: 'Time Out', key: 'time_out' }
  ];

  const csvData = data.map(entry => ({
    ...entry,
    date: formatDate(entry.date)
  }));

  return (
    <div className="home-container">
      <h1>Attendance Log</h1>
      <div className="search-export-container">
        <form onSubmit={handleSearch} className="search-form">
          Search :&nbsp;
          <input
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
        <CSVLink
          data={csvData}
          headers={headers}
          filename="attendance_log.csv"
          className="export-button"
        >
          <Download fontSize="small" style={{ marginRight: '8px' }} />
          Export as CSV
        </CSVLink>
      </div>
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
