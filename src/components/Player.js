import { useNavigate, useParams } from "react-router-dom";
import styles from "./Player.module.css";
import "plyr-react/plyr.css";
import Plyr from "plyr-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "./Account/AuthContext";
import DOMPurify from "dompurify";

const Player = (props) => {
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const params = useParams();
  const ref = useRef(null);
  const { accessToken } = useAuth();

  if (params.id === ":id") navigate("/films-list");

  useEffect(() => {
    fetchMetadataWithSAS();
  }, []);
  async function fetchMetadataWithSAS() {
    setLoading(true);
    // FROM HERE Encapsulate it to another function
    const apiResponse = await fetch(
      `https://${process.env.REACT_APP_API_ADDRESS}/api/blobs/getMetadata?Id=${params.id}`
    );

    const blobResponseJson = await apiResponse.json();
    setVideoTitle(blobResponseJson.name);
    const sanitizedHTML = DOMPurify.sanitize(blobResponseJson.description);
    setVideoDescription(sanitizedHTML);
    // TILL HERE
    const sasTokenResponse = await fetchSasToken();
    setVideoUrl(`${blobResponseJson.blobUrl}?${sasTokenResponse}`);
    setLoading(false);
  }

  async function fetchSasToken() {
    try {
      const response = await fetch(
        `https://${
          process.env.REACT_APP_API_ADDRESS
        }/api/sas/film/${params.id.toUpperCase()}.mp4`,
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
    <>
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
      <h3>{videoTitle}</h3>
      {videoDescription && (
        <div dangerouslySetInnerHTML={{ __html: videoDescription }} />
      )}
    </>
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
