import moment from "moment";
import "../styles.scss";
import Dropzone from "react-dropzone";
import { Button } from "antd";
import { BsCloudUpload } from "react-icons/bs";

const PickImage = (props: any) => {
  const handleDrop = (acceptedFiles: any) => {
    var myFile = acceptedFiles[0];
    let name = moment(new Date()).unix();
    const myNewFile = new File([myFile], name + "N.png", { type: myFile.type });
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
            <div
              {...getRootProps({
                className: `ImagePicker-backgroud ${
                  props?.size ? "small" : ""
                }`,
              })}
            >
              <input {...getInputProps()} />

              {props.fileURL ? (
                <>
                  <img src={props.fileURL} alt="" className="imagePickerImg" />
                </>
              ) : (
                <>
                  <BsCloudUpload size={30} />
                  <h5 className="ImagePickertxt2">
                    Drag or click to select files
                  </h5>
                  <Button type="dashed" size="small">
                    Choose file . . .
                  </Button>
                </>
              )}
            </div>
          </section>
        )}
      </Dropzone>
    </div>
  );
};

export default PickImage;
