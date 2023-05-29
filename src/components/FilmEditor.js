import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const FilmEditor = (props) => {
  const params = useParams();
  const navigate = useNavigate();

  if (params.id === ":id") navigate("/films-list");

  useEffect(() => {
    getMetadata();
  });
  const getMetadata = async () => {
    const response = await fetch(
      `https://${process.env.REACT_APP_API_ADDRESS}/api/Blobs/getMetadata?id=${params.id}`
    );
    const responseData = response.json();
    console.log(`retrieved metadata for video: ${params.id}`);
    console.log(JSON.stringify(responseData));
  };

  return (
    <>
      <h1>Editor</h1>
      <p>Of a video with an Id of: {params.id}</p>
    </>
  );
};

export default FilmEditor;
