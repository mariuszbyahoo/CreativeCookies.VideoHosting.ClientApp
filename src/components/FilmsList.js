"use client";

import { useCallback, useEffect, useState } from "react";
import styles from "./FilmsList.module.css";
import Mosaic from "./Mosaic";
import { Button, FormControl, TextField } from "@mui/material";
import { Search } from "@mui/icons-material";
import { useAuth } from "./Account/AuthContext";
import ConfirmationDialog from "./ConfirmationDialog";
import { useNavigate } from "react-router-dom";

const FilmsList = () => {
  const [videoMetadatas, setVideoMetadatas] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [confirmDialogIsOpened, setConfirmDialogIsOpened] = useState(false);
  const [authDialogIsOpened, setAuthDialogIsOpened] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [error, setError] = useState();
  const navigate = useNavigate();

  const { refreshTokens } = useAuth();

  const fetchMoviesHandler = async () => {
    if (!hasMore && pageNumber > 1) return; // Don't fetch if there are no more items and it's not the first page

    setLoading(true);
    setError(null);

    fetchSasToken()
      .then((token) => {
        fetch(
          `https://${process.env.REACT_APP_API_ADDRESS}/api/blobs/films?search=${searchTerm}&pageNumber=${pageNumber}&pageSize=24`,
          {
            credentials: "include",
          }
        )
          .then((response) => response.json())
          .then((data) => {
            console.log(
              `fetch blobs metadata called with searchTerm: ${searchTerm}`
            );
            setVideoMetadatas((prevVideoMetadatas) => [
              ...prevVideoMetadatas,
              ...data.films,
            ]);
            setTotalPages(data.totalPages);
            console.log(
              `inside of fetchMoviesHandler, data.hasMore: ${data.hasMore}`
            );
            setHasMore(data.hasMore);
            setPageNumber((prevPage) => prevPage + 1);
            setLoading(false);
          })
          .catch((error) => {
            setError(error);
            setLoading(false);
          });
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMoviesHandler();
  }, [pageNumber]);

  async function fetchSasToken() {
    const response = await fetch(
      `https://${process.env.REACT_APP_API_ADDRESS}/api/SAS/filmsList/`
    );
    const data = await response.json();
    return data.sasToken;
  }

  const loadMoreHandler = () => {
    setPageNumber((prevPage) => {
      return prevPage + 1;
    });
  };

  const filterInputChangeHandler = (e) => {
    setSearchTerm(e.target.value);
  };

  const fetchWithSearchTerm = async () => {
    setVideoMetadatas([]);
    setPageNumber(1);
    setHasMore(false);

    await fetchMoviesHandler();
  };
  const openDeleteDialog = (videoId) => {
    setSelectedVideoId(videoId);
    setConfirmDialogIsOpened(true);
  };

  const closeDeleteDialog = () => {
    setSelectedVideoId(null);
    setConfirmDialogIsOpened(false);
  };

  const openEditorDialog = (videoId) => {
    navigate(`/editor/${videoId}`);
  };

  const confirmDeleteHandler = async () => {
    setConfirmDialogIsOpened(false);
    if (!selectedVideoId) return;

    try {
      if (await sendDeleteRequest(selectedVideoId)) {
        setVideoMetadatas((prev) =>
          prev.filter((video) => video.id !== selectedVideoId)
        );
      }
    } catch (error) {
      console.error(
        "An error occured while deleting a video: " + selectedVideoId
      );
      return;
    }
    setSelectedVideoId(null);
  };

  const sendDeleteRequest = async (selectedVideoId, retry = true) => {
    var result = await fetch(
      `https://${process.env.REACT_APP_API_ADDRESS}/api/blobs/deleteVideo?Id=${selectedVideoId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );
    if (result.status == "204") {
      return true;
    }
    if ((result.status == "401" || result.status == "400") && retry) {
      // Why is this returning 400 with Bearer = "invalid_token" instead of standard 401??
      var refreshRes = await refreshTokens();
      if (refreshRes.length > 0 && refreshRes == "LoginAgain") {
        setAuthDialogIsOpened(true);
      }
      return sendDeleteRequest(selectedVideoId, false);
    } else {
      return false;
    }
  };

  let content = <p>Upload a movie to get started!</p>;
  if (loading) {
    content = <p>Loading...</p>;
  }
  if (error) {
    content = <h4>An error occured, while fetching the API: {error}</h4>;
  }

  if (videoMetadatas.length > 0) {
    // Order by date desc
    videoMetadatas.sort(
      (a, b) => new Date(b.createdOn) - new Date(a.createdOn)
    );
    content = (
      <Mosaic
        videoMetadatas={videoMetadatas}
        deleteVideoHandler={openDeleteDialog}
        openEditorHandler={openEditorDialog}
      />
    );
  }

  let loadBtn = hasMore && (
    <Button variant="outlined" onClick={loadMoreHandler}>
      Load more
    </Button>
  );

  return (
    <div className={styles.container}>
      <div className="row">
        <FormControl variant="standard">
          <TextField
            label="Search"
            id="filter-search"
            onChange={filterInputChangeHandler}
            variant="filled"
          />
        </FormControl>
        <Button
          variant="outlined"
          style={{ marginTop: 5 }}
          onClick={fetchWithSearchTerm}
        >
          <Search />
        </Button>
      </div>
      {content}
      {loadBtn}
      <ConfirmationDialog
        open={confirmDialogIsOpened}
        title="Delete Video"
        message="Are you sure you want to delete this video?"
        hasCancelOption={true}
        onConfirm={confirmDeleteHandler}
        onCancel={closeDeleteDialog}
      />
      <ConfirmationDialog
        open={authDialogIsOpened}
        title="Tokens expired"
        message="Please login again"
        hasCancelOption={false}
        onConfirm={() => {
          setAuthDialogIsOpened(false);
        }}
      />
    </div>
  );
};

export default FilmsList;
