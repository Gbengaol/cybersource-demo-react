/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import "./App.css";

const styles = {
  input: {
    "font-size": "14px",
    "font-family": "helvetica, tahoma, calibri, sans-serif",
    color: "#999",
  },
  ":focus": { color: "blue" },
  ":disabled": { cursor: "not-allowed" },
  valid: { color: "#3c763d" },
  invalid: { color: "#ff0014" },
};

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [expirationMonth, setExpirationMonth] = useState("");
  const [expirationYear, setExpirationYear] = useState("");

  const payButton = useRef<HTMLButtonElement | null>(null);
  const captureContext = useRef("");

  const flex = useRef<any>(null);
  const microform = useRef<any>(null);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      const data = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/capture-context`,
        {
          method: "get",
        }
      );
      captureContext.current = await data.json();
      // @ts-ignore
      flex.current = new Flex(captureContext.current);
      microform.current = flex.current.microform({ styles });
      const number = microform.current.createField("number", {
        placeholder: "Enter card number",
      });
      const securityCode = microform.current.createField("securityCode", {
        placeholder: "•••",
      });
      number.load("#number-container");
      securityCode.load("#securityCode-container");
      setIsLoading(false);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = () => {
    const options = {
      expirationMonth,
      expirationYear,
    };
    microform.current.createToken(options, (err: any, token: string) => {
      if (err) {
        console.log({ err });
        alert(err.message);
      } else {
        alert(
          `This is the token to be sent to the backend \n
            ${JSON.stringify(token)}`
        );
      }
    });
  };

  return (
    <>
      <div className="container card p-3 rounded-3">
        <h3 className="text-uppercase text-secondary">CyberSource Demo</h3>
        <div className="card-body">
          {isLoading && (
            <div className="loader">
              <span className="text-danger">
                Loading form's capture context...
              </span>
              <div className="spinner-border text-danger" role="status"></div>
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className="form-group">
              <label>Card Number</label>
              <div id="number-container" className="form-control" />

              <label htmlFor="securityCode-container">Security Code</label>
              <div id="securityCode-container" className="form-control" />
            </div>

            <div className="row">
              <div className="form-group col-md-6">
                <label htmlFor="expMonth">Expiry month</label>
                <select
                  value={expirationMonth}
                  onChange={(e) => setExpirationMonth(e.target.value)}
                  className="form-control"
                >
                  <option value="01">01</option>
                  <option value="02">02</option>
                  <option value="03">03</option>
                  <option value="04">04</option>
                  <option value="05">05</option>
                  <option value="06">06</option>
                  <option value="07">07</option>
                  <option value="08">08</option>
                  <option value="09">09</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                </select>
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="expYear">Expiry year</label>
                <select
                  value={expirationYear}
                  onChange={(e) => setExpirationYear(e.target.value)}
                  className="form-control"
                >
                  <option value={2021}>2021</option>
                  <option value={2022}>2022</option>
                  <option value={2023}>2023</option>
                </select>
              </div>
            </div>

            <label htmlFor="cardholderName">Name</label>
            <input
              id="cardholderName"
              className="form-control"
              name="cardholderName"
              placeholder="Name on the card"
            />

            <button
              type="submit"
              ref={payButton}
              disabled={isLoading}
              className="btn btn-primary w-100 mt-3"
            >
              Pay 2500 CFA
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default App;
