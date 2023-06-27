import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Button,
} from "@mui/material";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("any");

  const roles = ["admin", "subscriber", "nonsubscriber", "any"];

  useEffect(() => {
    fetch("https://localhost:7034/api/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleDownload = () => {
    // HACK TODO
    // const filteredUsers = users.filter(
    //   (user) =>
    //     selectedRole === "any" || user.role.toLowerCase() === selectedRole
    // );
    // const data = filteredUsers.map((user) => ({
    //   userEmail: user.userEmail,
    //   role: user.role,
    // }));
    // const csv = csvWriter.createObjectCsvStringifier({
    //   header: [
    //     { id: "userEmail", title: "Email" },
    //     { id: "role", title: "Role" },
    //   ],
    // });
    // const csvContent = csv.getHeaderString() + csv.stringifyRecords(data);
    // const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    // if (navigator.msSaveBlob) {
    //   // IE 10+
    //   navigator.msSaveBlob(blob, "filename.csv");
    // } else {
    //   const link = document.createElement("a");
    //   if (link.download !== undefined) {
    //     // feature detection
    //     // Browsers that support HTML5 download attribute
    //     const url = URL.createObjectURL(blob);
    //     link.setAttribute("href", url);
    //     link.setAttribute("download", "filename.csv");
    //     link.style.visibility = "hidden";
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    //   }
    // }
  };

  return (
    <>
      <Select value={selectedRole} onChange={handleRoleChange}>
        {roles.map((role) => (
          <MenuItem key={role} value={role}>
            {role}
          </MenuItem>
        ))}
      </Select>
      <Button variant="contained" color="primary" onClick={handleDownload}>
        Download CSV
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell style={{ fontSize: "20px" }}>Email</TableCell>
              <TableCell style={{ fontSize: "20px" }}>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell component="th" scope="row">
                  {user.userEmail}
                </TableCell>
                <TableCell>{user.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default UsersList;
