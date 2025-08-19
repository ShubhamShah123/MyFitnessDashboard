// @pages/users/Users.tsx
import { useState } from "react";
import DataTable from "../../components/dataTable/DataTable";
import Add from "../../components/add/Add";
import "./users.scss";

const Users = () => {
  const [users, setUsers] = useState<any[]>([]); // Holds user rows
  const [open, setOpen] = useState(false);

  const handleAddUser = (newUser: any) => {
    setUsers((prev) => [...prev, newUser]); // Adds at bottom
    setOpen(false);
  };

  return (
    <div className="users">
      <div className="info">
        <h1>Users</h1>
        <div className="button" onClick={() => setOpen(true)}>
          Add New User
        </div>
      </div>

      <DataTable rows={users} />
      {open && <Add onClose={() => setOpen(false)} onSubmit={handleAddUser} totalCount={users.length} />}
    </div>
  );
};

export default Users;
