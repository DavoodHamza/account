import { Store } from "../redux/store";
import API from "../config/api";

const S3FileUpload = require("react-s3").default;
window.Buffer = window.Buffer || require("buffer").Buffer;
const GETBASEURL = async (url: any, params: any) => {
  return new Promise(async (resolve, reject) => {
    fetch(API.MASTER_BASE_URL + url, {
      method: "get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        resolve(json);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const GETWITHBASE = async (url: any, params: any) => {
  const User: any = Store.getState().User;
  const token = User.token;
  return new Promise(async (resolve, reject) => {
    fetch(API.BASE_URL + url, {
      method: "get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        resolve(json);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
const CREATEBASEURL = async (url: any, body: any) => {
  const User = Store.getState().User;
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(API.MASTER_BASE_URL + url, {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const json = await response.json();
      resolve(json);
    } catch (error) {
      reject(error);
    }
  });
};
const REGISTERPOST = async (url: any, body: any) => {
  const User: any = Store.getState().User;
  const token = User.token;
  return new Promise(async (resolve, reject) => {
    fetch(url, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((json) => {
        resolve(json);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const REGISTERGET = async (url: any, params: any) => {
  const User: any = Store.getState().User;
  const token = User.token;
  return new Promise(async (resolve, reject) => {
    fetch(url, {
      method: "get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        resolve(json);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const BASE_DELETE = async (url: any) => {
  const User: any = Store.getState().User;
  const token = User.token;
  return new Promise(async (resolve, reject) => {
    fetch(url, {
      method: "delete",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        resolve(json);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const BASE_PUT = async (url: any, body: any) => {
  const User: any = Store.getState().User;
  const token = User.token;
  return new Promise(async (resolve, reject) => {
    fetch(url, {
      method: "put",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((json) => {
        resolve(json);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const BASE_COMPRESS_IMAGE = async (file: any) => {
  const User: any = Store.getState().User;
  return new Promise(async (resolve, reject) => {
    try {
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch(`${API.BASE_URL}${API.IMAGE_COMPRESS}`, {
          method: "POST",
          body: formData,
        });
        if (response.ok) {
          const jsonResponse: any = await response.json();
          const obj = {
            ...jsonResponse,
            url: jsonResponse.Location,
            status: true,
          };
          resolve(obj);
        } else {
          let obj = {
            status: false,
            url: null,
          };
          reject(obj);
        }
      } else {
        reject("no file selected");
      }
    } catch (err) {
      reject(err);
    }
  });
};

const GET = async (url: any, params: any) => {
  const User: any = Store.getState().User;
  const token = User.token;
  return new Promise(async (resolve, reject) => {
    fetch(User.baseUrl + url, {
      method: "get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        resolve(json);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const POST = async (url: any, body: any) => {
  const User: any = Store.getState().User;
  const token = User.token;
  return new Promise(async (resolve, reject) => {
    fetch(User.baseUrl + url, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((json) => {
        resolve(json);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const POST2 = async (url: any, body: any) => {
  const User = Store.getState().User;
  const token: any = User.token;
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(User.baseUrl + url, {
        method: "post",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: body,
      });
      const json = await response.json();
      resolve(json);
    } catch (error) {
      reject(error);
    }
  });
};

const PUT = async (url: any, body: any) => {
  const User: any = Store.getState().User;
  const token = User.token;
  return new Promise(async (resolve, reject) => {
    fetch(User.baseUrl + url, {
      method: "put",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())

      .then((json) => {
        resolve(json);
      })

      .catch((error) => {
        reject(error);
      });
  });
};

const DELETE = async (url: any) => {
  const User: any = Store.getState().User;
  const token = User.token;

  return new Promise(async (resolve, reject) => {
    fetch(User.baseUrl + url, {
      method: "delete",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        resolve(json);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const UPLOAD_EXCEL = async(url: string, formData: any)=>{
  try {
    const User: any = Store.getState().User;
    const token = User.token;
    const response = await fetch(User?.baseUrl + url, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    console.log("dat===>",data)
    return data;
  } catch (error:any) {
    console.log(error);
    return Promise.reject(new Error(error?.message));
  }
}

const COMPRESS_IMAGE = async (file: any) => {
  const User: any = Store.getState().User;
  return new Promise(async (resolve, reject) => {
    try {
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch(`${User.baseUrl}${API.IMAGE_COMPRESS}`, {
          method: "POST",
          body: formData,
        });
        if (response.ok) {
          const jsonResponse: any = await response.json();
          const obj = {
            ...jsonResponse,
            url: jsonResponse.Location,
            status: true,
          };
          resolve(obj);
        } else {
          let obj = {
            status: false,
            url: null,
          };
          reject(obj);
        }
      } else {
        reject("no file selected");
      }
    } catch (err) {
      reject(err);
    }
  });
};

export {
  GET,
  POST,
  PUT,
  DELETE,
  POST2,
  UPLOAD_EXCEL,
  COMPRESS_IMAGE,
  CREATEBASEURL,
  GETBASEURL,
  REGISTERPOST,
  GETWITHBASE,
  REGISTERGET,
  BASE_DELETE,
  BASE_PUT,
  BASE_COMPRESS_IMAGE,
};
