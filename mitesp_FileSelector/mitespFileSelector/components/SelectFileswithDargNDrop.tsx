import {
  Dropzone,
  FileItem,
  FileValidated,
  FullScreenPreview,
} from "@dropzone-ui/react";
import { useState } from "react";
import * as React from "react";

// prop
export interface IFileSelectorProps {
  onChange: (files: FileValidated[]) => void;
  onDelete: (id: string | number | undefined) => void;
  onSee: (imageSource: string) => void;
  onClean: (files: FileValidated[]) => void;
}
// state
interface MysampleState {}

export const FileSelector: React.FC<IFileSelectorProps> = ({
  onChange,
  onClean,
  onDelete,
  onSee,
}) => {
  const [files, setFiles] = useState<FileValidated[]>([]);
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  const updateFiles = React.useCallback(
    (incommingFiles: FileValidated[]) => {
      setFiles(incommingFiles);
      onChange(incommingFiles);
    },
    [onChange]
  );
  const Delete = React.useCallback(
    (id: string | number | undefined) => {
      // Filter files and setback
      setFiles(files.filter((x) => x.id !== id));
      onDelete(id);
    },
    [onDelete]
  );
  const handleSee = React.useCallback(
    (imageSource: string) => {
      setImageSrc(imageSource);
      onSee(imageSource);
    },
    [onSee]
  );
  const handleClean = React.useCallback(
    (files: FileValidated[]) => {
      //console.log("list cleaned", files);
      setFiles([]);
      onClean(files);
    },
    [onClean]
  );
  return (
    <>
      <Dropzone
        style={{ minWidth: "550px" }}
        //view={"grid"}
        onChange={updateFiles}
        //minHeight="195px"
        onClean={handleClean}
        value={files}
        maxFiles={5}
        header={true}
        footer={true}
        maxFileSize={2998000}
        label="Drag'n drop files here or click to browse"
        //label="Suleta tus archivos aquí"
        accept=".pdf,.xls,.xlsx"
        // uploadingMessage={"Uploading..."}
        //url="https://my-awsome-server/upload-my-file"
        //of course this url doens´t work, is only to make upload button visible
        //uploadOnDrop
        clickable={true}
        //fakeUploading
        //localization={"FR-fr"}
        disableScroll
      >
        {files.length > 0 &&
          files.map((file) => (
            <FileItem
              {...file}
              key={file.id}
              onDelete={Delete}
              onSee={handleSee}
              //localization={"ES-es"}
              resultOnTooltip
              preview
              info
              hd
            />
          ))}
      </Dropzone>
      {/* <FullScreenPreview
          imgSource={imageSrc}
          openImage={true}
          onClose={() => handleSee("undefined")}
        /> */}
    </>
  );
};
