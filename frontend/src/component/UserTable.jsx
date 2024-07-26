import React, { useState, useEffect } from 'react';
import './../css/componentCss/UserTable.css';

const UserTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Simulate an API call
    const fetchData = async () => {
      // Dummy data
      const dummyData = [
        { idno: 1, cardid: '1234', name: 'John Doe', contactno: '9876543210' },
        { idno: 2, cardid: '5678', name: 'Jane Smith', contactno: '1234567890' },
        // Add more rows as needed
      ];
      setData(dummyData);
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
              <td>{entry.idno}</td>
              <td>{entry.cardid}</td>
              <td>{entry.name}</td>
              <td>{entry.contactno}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
