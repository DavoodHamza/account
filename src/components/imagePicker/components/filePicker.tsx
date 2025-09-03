import moment from "moment";
import "../styles.scss";
import Dropzone from "react-dropzone";
import { useState } from "react";
import { Button, Upload } from "antd";

const FilePicker = (props: any) => {
  const handleDrop = (acceptedFiles: any) => {
    var myFile = acceptedFiles[0];
    let name = moment(new Date()).unix();
    const array = myFile.path.split(".");
    const extension = array?.[array.length - 1];
    const myNewFile = new File([myFile], name + "N." + extension, {
      type: myFile.type,
    });
    const url = URL.createObjectURL(myNewFile);
    let obj = {
      file: myNewFile,
      url: url,
    };
    props.onChange(obj);
  };
  return (
    <div className="ImagePicker">
      <Dropzone onDrop={handleDrop}>
        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps({ className: "ImagePicker" })}>
              <input {...getInputProps()} />

              {props.fileURL ? (
                <>
                  <img src={props.fileURL} className="imagePickerImg rounded" />
                </>
              ) : (
                <>
                  <p className="ImagePickertxt2">
                    Drag 'n' drop file here, or click to select files
                  </p>
                </>
              )}
              <Button type="primary">Choose file . . .</Button>

              {/* <input
                type="button"
                value="Choose file . . ."
                className="ImagePickerbtn ms-2"
              /> */}
            </div>
          </section>
        )}
      </Dropzone>
    </div>
  );
};

export default FilePicker;
