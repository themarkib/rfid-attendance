import React, { useState, useEffect } from 'react';
import './../css/componentCss/UserTable.css';

const UserTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/users');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="user-container">
      <h1>User Table</h1>
      <table className="user-table">
        <thead>
          <tr>
            <th>ID No</th>
            <th>Card ID</th>
            <th>Name</th>
            <th>Contact No</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr key={entry.idno}>
              <td>{entry.userid}</td>
              <td>{entry.card_id}</td>
              <td>{entry.name}</td>
              <td>{entry.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
