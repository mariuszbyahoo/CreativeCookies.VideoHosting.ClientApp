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
  Input,
} from "@mui/material";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("any");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(0);

  const roles = ["admin", "subscriber", "nonsubscriber", "any"];

  useEffect(() => {
    fetch(
      `https://localhost:7034/api/users?pageNumber=${page}&pageSize=${pageSize}&search=${search}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    )
      .then((response) => {
        setTotalPages(parseInt(response.headers.get("X-Total-Pages")));
        return response.json();
      })
      .then((data) => {
        console.log(`Data received: ${JSON.stringify(data)}`);
        setTotalPages(data.totalPages);
        setUsers(data.users);
      })
      .catch((error) => console.error("Error:", error));
  }, [page, pageSize, search]);

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleDownload = () => {
    // TODO
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // TODO: Add UI for controlling pageSize, if desired.

  return (
    <>
      <Input
        value={search}
        onChange={handleSearchChange}
        placeholder="Search..."
      />
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
      <br />
      <span>
        Page {page} of {totalPages}
      </span>
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
      <Button onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
        Previous Page
      </Button>
      <Button
        onClick={() => handlePageChange(page + 1)}
        disabled={page >= totalPages}
      >
        Next Page
      </Button>
    </>
  );
};

export default UsersList;
