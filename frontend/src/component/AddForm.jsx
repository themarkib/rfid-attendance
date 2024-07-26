import React, { useState } from 'react';
import './../css/componentCss/AddForm.css';

const AddForm = () => {
  const [formData, setFormData] = useState({
    cardid: '',
    name: '',
    phoneNo: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/add-user', { // Update with your actual API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess('User added successfully!');
        setFormData({
          cardid: '',
          name: '',
          phoneNo: '',
        }); // Reset form
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to add user.');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="form-container">
      <form className="add-form" onSubmit={handleSubmit}>
        <h2>Add User</h2>
        {success && <p className="success">{success}</p>}
        {error && <p className="error">{error}</p>}
        <div className="form-group">
          <label htmlFor="cardid">Card ID:</label>
          <input
            type="text"
            id="cardid"
            name="cardid"
            value={formData.cardid}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNo">Phone No:</label>
          <input
            type="text"
            id="phoneNo"
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddForm;
