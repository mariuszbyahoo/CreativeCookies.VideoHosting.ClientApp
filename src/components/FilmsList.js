"use client";

import { useCallback, useEffect, useState } from "react";
import styles from "./FilmsList.module.css";
import Mosaic from "./Mosaic";
import { Button, FormControl, InputAdornment, TextField } from "@mui/material";
import { Search } from "@mui/icons-material";

const FilmsList = () => {
  const [videoMetadatas, setVideoMetadatas] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  const fetchMoviesHandler = async () => {
    if (!hasMore && pageNumber > 1) return; // Don't fetch if there are no more items and it's not the first page

    setLoading(true);
    setError(null);

    fetchSasToken()
      .then((token) => {
        fetch(
          `https://${process.env.REACT_APP_API_ADDRESS}/api/blobs/films?search=${searchTerm}&pageNumber=${pageNumber}&pageSize=24`
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
    content = <Mosaic videoMetadatas={videoMetadatas} />;
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
          {/* <Button variant="outlined" onClick={fetchWithSearchTerm}>
            Search
          </Button> */}
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
    </div>
  );
};

export default FilmsList;
