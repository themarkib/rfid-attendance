import React, { useState, useEffect } from 'react';
import './../css/componentCss/UpdateUserForm.css';

const UpdateUserForm = ({ user, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState(user);

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <div className="update-form-container">
      <form className="update-form" onSubmit={handleSubmit}>
        <h2>Update User</h2>
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
          <label htmlFor="contactno">Contact No:</label>
          <input
            type="text"
            id="contactno"
            name="contactno"
            value={formData.contactno}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Update</button>
        <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default UpdateUserForm;
