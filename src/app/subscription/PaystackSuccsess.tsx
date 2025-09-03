import "bootstrap/dist/css/bootstrap.min.css";
import { XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import API from "../../config/api";
import { POST } from "../../utils/apiCalls";
import { clearPaystack } from "../../redux/slices/paystackSlice";

const styles = `
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes scale-up {
    from {
      transform: scale(0.8);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
  .loading-container {
    position: relative;
    width: 96px;
    height: 96px;
  }
  .loading-spinner {
    position: absolute;
    inset: 0;
    border: 4px solid #198754;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  .icon-container {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .success-icon, .error-icon {
    animation: scale-up 0.3s ease-out forwards;
    border-radius: 50%;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .success-icon {
    background-color: #198754;
  }
  .error-icon {
    background-color: #DC3545;
  }
  .min-vh-100 {
    min-height: 100vh;
  }
`;

const PaystackSuccess = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const [status, setStatus] = useState("loading");
  const data = useSelector((state: any) => state?.paystack?.data);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchParams] = useSearchParams();
  const paymentid = searchParams.get("reference"); 
  useEffect(() => {
    hadleSubscribtion();
  }, []);
  async function hadleSubscribtion() {
    try {
      let obj = {
        stripeId: paymentid,
        status: "succeeded",
        adminid: data?.adminid,
        amount: data?.total,
        company: data?.company,
        counter: data?.counter,
        retailXpress: data?.retailXpress,
        soleTrader: false,
        period: data?.period,
        addOn: data?.addOn,
        affiliationCode:data?.affiliationCode
      };

      let url = API.SUBSCRIPTION_PAYMENT;
      const response: any = await POST(url, obj);
      if (response?.status) {
        setStatus("success");
        setLoading(false);
        dispatch(clearPaystack({}));
        
      } else {
        setStatus("error");
        setLoading(false);
      }
    } catch (error) {
      setStatus("error");
      setLoading(false);
    }
  }

  return (
    <>
      <style>{styles}</style>
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center">

        <div className="loading-container">

          {loading && (
            <>
              <div className="icon-container">
                <svg
                  style={{ width: "48px", height: "48px" }}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#198754"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M8.5 14.5A2.5 2.5 0 0111 12" />
                  <path d="M5 11C6.5 9.5 9.5 9.5 11 11" />
                  <path d="M2.5 8.5C5.5 5.5 12.5 5.5 15.5 8.5" />
                </svg>
              </div>
              <div className="loading-spinner" />
            </>
          )}
          {/* Success State */}
          {status === "success" && (
            <div className="success-icon">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17L4 12" />
              </svg>
            </div>
          )}
 
          {status === "error" && (
            <div className="error-icon">
              <XCircle size={48} color="white" />
            </div>
          )}
        </div>

        <h2 className="mt-4 fw-bold">
          {loading && <span className="text-dark">Processing Payment...</span>}
          {status === "success" && (
            <span className="text-success">Payment Successful!</span>
          )}
          {status === "error" && (
            <span className="text-danger">Payment Failed</span>
          )}
        </h2>

        {status === "error" && (
          <p className="mt-2 text-danger">{errorMessage}</p>
        )}

        {status === "error" && (
          <button
            onClick={() => window.location.reload()}
            className="mt-4 btn btn-danger"
          >
            Try Again
          </button>
        )}
        {status === "success" && (
          <>
            <button
              onClick={() => (window.location.href = "/login")}
              className="mt-4 btn btn-success"
            >
              Continue
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default PaystackSuccess;

