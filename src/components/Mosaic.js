import styles from "./Mosaic.module.css";
import MosaicElement from "./MosaicElement";

const Mosaic = (props) => {
  return (
    <div className={styles["mosaic-wrapper"]}>
      {props.videoMetadatas.map((videoMetadata, index) => (
        <MosaicElement
          film={videoMetadata.name}
          videoId={videoMetadata.id}
          thumbnail={videoMetadata.thumbnailName}
          duration={videoMetadata.length}
          createdOn={videoMetadata.createdOn}
          key={index}
        />
      ))}
    </div>
  );
};

export default Mosaic;
