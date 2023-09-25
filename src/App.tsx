import { useEffect, useRef, useState } from "react";
import "./App.css";

const styles = {
  input: {
    "font-size": "14px",
    "font-family": "helvetica, tahoma, calibri, sans-serif",
    color: "#555",
  },
  ":focus": { color: "blue" },
  ":disabled": { cursor: "not-allowed" },
  valid: { color: "#3c763d" },
  invalid: { color: "#a94442" },
};

function App() {
  const [expirationMonth, setExpirationMonth] = useState("");
  const [expirationYear, setExpirationYear] = useState("");

  const payButton = document.querySelector("#pay-button");

  const captureContext = useRef("");

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/capture-context`,
        {
          method: "get",
        }
      );
      captureContext.current = await data.json();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const flex = new Flex(captureContext.current);
      const microform = flex.microform({ styles });
      const number = microform.createField("number", {
        placeholder: "Enter card number",
      });
      const securityCode = microform.createField("securityCode", {
        placeholder: "•••",
      });
      number.load("#number-container");
      securityCode.load("#securityCode-container");

      payButton?.addEventListener("click", function () {
        const options = {
          expirationMonth,
          expirationYear,
        };
        microform.createToken(options, (err: any, token: string) => {
          if (err) {
            alert(err.message);
          } else {
            alert(
              `This is the token to be sent to the backend \n
            ${JSON.stringify(token)}`
            );
          }
        });
      });
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="container card">
        <div className="card-body">
          <div id="errors-output" role="alert"></div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="form-group">
              <label htmlFor="cardholderName">Name</label>
              <input
                id="cardholderName"
                className="form-control"
                name="cardholderName"
                placeholder="Name on the card"
              />

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

            <button
              type="submit"
              id="pay-button"
              className="mt-3 btn btn-primary"
            >
              Pay
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default App;
