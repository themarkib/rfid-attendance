import React, { useState, useEffect } from 'react';
import './../css/componentCss/ManageUserTable.css';
import UpdateUserForm from './UpdateUserForm.jsx';

const ManageUserTable = () => {
  const [data, setData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

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

  const handleUpdate = (user) => {
    // Implement update functionality
    console.log('Updating user:', user);
    setData(data.map(entry => (entry.idno === user.idno ? user : entry)));
    setCurrentUser(null);
  };

  const handleDelete = (idno) => {
    // Implement delete functionality
    console.log('Deleting user with ID:', idno);
    setData(data.filter(entry => entry.idno !== idno)); // Remove from UI for now
  };

  const handleCancelUpdate = () => {
    setCurrentUser(null);
  };

  return (
    <div className="manage-user-container">
      <h1>Manage Users</h1>
      <table className="manage-user-table">
        <thead>
          <tr>
            <th>ID No</th>
            <th>Card ID</th>
            <th>Name</th>
            <th>Contact No</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr key={entry.idno}>
              <td>{entry.idno}</td>
              <td>{entry.cardid}</td>
              <td>{entry.name}</td>
              <td>{entry.contactno}</td>
              <td className="actions">
                <button className="update-button" onClick={() => setCurrentUser(entry)}>Update</button>
                <button className="delete-button" onClick={() => handleDelete(entry.idno)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {currentUser && (
        <UpdateUserForm
          user={currentUser}
          onUpdate={handleUpdate}
          onCancel={handleCancelUpdate}
        />
      )}
    </div>
  );
};

export default ManageUserTable;
