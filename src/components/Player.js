import { useNavigate, useParams } from "react-router-dom";
import styles from "./Player.module.css";
import "plyr-react/plyr.css";
import Plyr from "plyr-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "./Account/AuthContext";

const Player = (props) => {
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const params = useParams();
  const ref = useRef(null);
  const { accessToken } = useAuth();

  if (params.title === ":title") navigate("/films-list");

  useEffect(() => {
    async function fetchUrlWithSAS() {
      setLoading(true);
      // FROM HERE Encapsulate it to another function
      const blobUrlResponse = await fetch(
        `https://${process.env.REACT_APP_API_ADDRESS}/api/blobs/storageUrl?Id=${params.title}`
      );
      const blobResponseJson = await blobUrlResponse.json();
      // TILL HERE
      const sasTokenResponse = await fetchSasToken();
      setVideoUrl(`${blobResponseJson.blobUrl}?${sasTokenResponse}`);
      setLoading(false);
    }
    fetchUrlWithSAS();
  }, []);

  async function fetchSasToken() {
    try {
      const response = await fetch(
        `https://${process.env.REACT_APP_API_ADDRESS}/api/sas/film/${params.title}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      return data.sasToken;
    } catch (error) {
      console.log("error happened: ", error);
      console.log("JSON.stringinfy(error): ", JSON.stringify(error));
    }
  }

  const videoOptions = undefined;
  const plyrVideo = videoUrl && (
    <Plyr
      ref={ref}
      source={{
        type: "video",
        sources: [
          {
            src: videoUrl,
            provider: "html5",
            type: "video/mp4",
          },
        ],
      }}
      options={videoOptions}
    />
  );

  let content;

  if (loading) {
    content = <p>loading</p>;
  } else {
    content = plyrVideo;
  }

  return <div className={styles.container}>{content}</div>;
};
export default Player;
