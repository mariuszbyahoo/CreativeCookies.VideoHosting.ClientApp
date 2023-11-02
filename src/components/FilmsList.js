"use client";

import { useCallback, useEffect, useState } from "react";
import styles from "./FilmsList.module.css";
import Mosaic from "./Mosaic";
import {
  Button,
  CircularProgress,
  FormControl,
  TextField,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useAuth } from "./Account/AuthContext";
import ConfirmationDialog from "./ConfirmationDialog";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

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

  const { t } = useTranslation();

  const { refreshTokens } = useAuth();

  const fetchMoviesHandler = async () => {
    if (!hasMore && pageNumber > 1) return; // Don't fetch if there are no more items and it's not the first page

    setLoading(true);
    setError(null);

    fetchSasToken()
      .then((token) => {
        fetch(
          `https://${process.env.REACT_APP_API_ADDRESS}/blobs/films?search=${searchTerm}&pageNumber=${pageNumber}&pageSize=24`,
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
      `https://${process.env.REACT_APP_API_ADDRESS}/SAS/filmsList/`
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
      `https://${process.env.REACT_APP_API_ADDRESS}/blobs/deleteVideo?Id=${selectedVideoId}`,
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
        setAuthDialogIsOpened(true); // warning pops up
        return false;
      }
      return sendDeleteRequest(selectedVideoId, false);
    } else {
      return false;
    }
  };

  let content = <p>{t("UploadFilmToGetStarted")}!</p>;
  if (loading) {
    content = (
      <p>
        <CircularProgress />
      </p>
    );
  }
  if (error) {
    content = (
      <h4>
        {t("ErrorOccuredWhileFetchingFromAPI")}: {error}
      </h4>
    );
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
      {t("LoadMore")}
    </Button>
  );

  const deleteConfirmationMsg = `${t("AreYouSureWantToDeleteThisVideo")}?`;

  return (
    <div className={styles.container}>
      <div className="row">
        <FormControl variant="standard">
          <TextField
            label={t("Search")}
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
        title={t("DeleteVideo")}
        message={deleteConfirmationMsg}
        hasCancelOption={true}
        onConfirm={confirmDeleteHandler}
        onCancel={closeDeleteDialog}
      />
      <ConfirmationDialog
        open={authDialogIsOpened}
        title={t("TokenExpired")}
        message={t("LoginAgain")}
        hasCancelOption={false}
        onConfirm={() => {
          setAuthDialogIsOpened(false);
        }}
      />
    </div>
  );
};

export default FilmsList;
