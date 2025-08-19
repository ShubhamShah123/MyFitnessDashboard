// @components/add/Add.tsx
import { useState } from "react";
import "./add.scss";

interface AddProps {
  onClose: () => void;
  onSubmit: (newUser: any) => void;
  totalCount: number;
}

const Add = ({ onClose, onSubmit, totalCount }: AddProps) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = {
      id: totalCount + 1,
      ...formData,
      age: Number(formData.age),
      fullName: `${formData.firstName} ${formData.lastName}`,
    };
    onSubmit(newUser);
  };

  return (
    <div className="add-modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>&times;</span>
        <h2>Add New User</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
          <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required />
          <input type="number" name="age" placeholder="Age" onChange={handleChange} required />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Add;
