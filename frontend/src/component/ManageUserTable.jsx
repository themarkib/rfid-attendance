import React, { useState, useEffect } from 'react';
import './../css/componentCss/ManageUserTable.css';
import UpdateUserForm from './UpdateUserForm.jsx';

const ManageUserTable = () => {
  const [data, setData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/users');
        if (response.ok) {
          const users = await response.json();
          setData(users);
        } else {
          console.error('Failed to fetch users.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleUpdate = async (updatedUser) => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${updatedUser.userid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        const newUser = await response.json();
        setData(data.map(entry => (entry.userid === newUser.userid ? newUser : entry)));
        setCurrentUser(null);
        console.log('User updated successfully!');
      } else {
        console.error('Failed to update user.');
      }
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleDelete = async (idno) => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${idno}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setData(data.filter(entry => entry.userid !== idno)); // Remove from UI
        console.log('User deleted successfully!');
      } else {
        console.error('Failed to delete user.');
      }
    } catch (error) {
      console.error('Error deleting data:', error);
    }
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
            <th>ID</th>
            <th>Card ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr key={entry.userid}>
              <td>{entry.userid}</td>
              <td>{entry.card_id}</td>
              <td>{entry.name}</td>
              <td>{entry.phone}</td>
              <td className="actions">
                <button className="update-button" onClick={() => setCurrentUser(entry)}>Update</button>
                <button className="delete-button" onClick={() => handleDelete(entry.userid)}>Delete</button>
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
