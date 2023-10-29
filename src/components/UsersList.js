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
  FormControl,
  TextField,
  DialogContent,
  CircularProgress,
} from "@mui/material";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { Search } from "@mui/icons-material";
import { useAuth } from "./Account/AuthContext";
import { useNavigate } from "react-router-dom";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("any");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [dialogOpened, setDialogOpened] = useState(false);

  const { refreshTokens } = useAuth();
  const navigate = useNavigate();

  const roles = ["Admin", "Subscriber", "NonSubscriber", "any"];

  const fetchUsers = async (retry = true) => {
    try {
      let apiResponse = await fetch(
        `https://${process.env.REACT_APP_API_ADDRESS}/users?pageNumber=${page}&pageSize=${pageSize}&search=${search}&role=${selectedRole}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (apiResponse.ok) {
        let data = await apiResponse.json();
        setTotalPages(data.totalPages);
        setUsers(data.users);
      } else if (apiResponse.status === 401 && retry) {
        var refreshResponse = await refreshTokens(false);
        if (refreshResponse == "LoginAgain") {
          navigate("/logout");
        } else {
          return fetchUsers(false);
        }
      }
    } catch (error) {
      console.log("error happened: ", error);
      console.log("JSON.stringinfy(error): ", JSON.stringify(error));
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, pageSize]);

  const handleDialogOpen = () => {
    setDialogOpened(true);
  };

  const handleDialogClose = () => {
    setDialogOpened(false);
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleDownloadJson = async () => {
    try {
      setDialogOpened(true);
      const response = await fetch(
        `https://${process.env.REACT_APP_API_ADDRESS}/users/GetAllUsersJson`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data)], {
          type: "application/json",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "users.json";
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.log("Download JSON error:", error);
    } finally {
      setDialogOpened(false);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      setDialogOpened(true);
      const response = await fetch(
        `https://${process.env.REACT_APP_API_ADDRESS}/users/GetAllUsersExcel`,
        {
          method: "GET",
          headers: {
            "Content-Type":
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "users.xlsx";
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.log("Download error:", error);
    } finally {
      setDialogOpened(false);
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-7">
          <FormControl variant="standard" style={{ minWidth: "100%" }}>
            <TextField
              label="Search"
              id="filter-search"
              onChange={handleSearchChange}
              value={search}
              variant="filled"
            />
          </FormControl>
        </div>
        <div className="col-3">
          <Select
            value={selectedRole}
            onChange={handleRoleChange}
            style={{ minWidth: "100%" }}
          >
            {roles.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div className="col-2" style={{ alignItems: "center" }}>
          <Button
            variant="outlined"
            style={{ marginTop: 5, minWidth: "100%", minHeight: "80%" }}
            onClick={fetchUsers}
          >
            <Search />
          </Button>
        </div>
      </div>

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
              <TableCell style={{ fontSize: "20px" }}>Is user active</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users &&
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell component="th" scope="row">
                    {user.userEmail}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {user.role}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {user.isActive ? "yes" : "no"}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        onClick={() => handlePageChange(page - 1)}
        disabled={page <= 1}
        style={{ margin: "1%" }}
      >
        Previous Page
      </Button>
      <Button
        onClick={() => handlePageChange(page + 1)}
        disabled={page >= totalPages}
        style={{ margin: "1%" }}
      >
        Next Page
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleDownloadJson}
        style={{ margin: "1%" }}
      >
        Download JSON
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleDownloadExcel}
        style={{ margin: "1%" }}
      >
        Download Excel
      </Button>
      <Dialog open={dialogOpened} onClose={handleDialogClose}>
        <DialogTitle>Please wait, generating file...</DialogTitle>
        <DialogContent style={{ textAlign: "center" }}>
          <CircularProgress />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UsersList;
