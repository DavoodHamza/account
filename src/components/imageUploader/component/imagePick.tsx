import { Button } from "antd";
import moment from "moment";
import Dropzone from "react-dropzone";
import { BsCloudUpload } from "react-icons/bs";
import "../styles.scss";

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
        {({ getRootProps, getInputProps }: any) => (
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
                  <Button
                    type="dashed"
                    size="small"
                    onClick={() => {
                      // Clear the existing image or trigger another action
                    }}
                  >
                    Choose another image
                  </Button>
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
