import React, { Component } from "react";
import "./Ticker.css";
import API from "../../utils/API";
import moment from "moment";

class Ticker extends Component {
  constructor(props) {
    super(props);

    this.getIndexQuotes = this.getIndexQuotes.bind(this);
    this.getForexQuotes = this.getForexQuotes.bind(this);
    this.getTreasuryYield = this.getTreasuryYield.bind(this);

    this.state = {
      DOW: { price: 0, change: 0 },
      SNP: { price: 0, change: 0 },
      NAS: { price: 0, change: 0 },
      BTC: { price: 0, change: 0 },
      EURUSD: { price: 0, change: 0 },
      USDJPY: { price: 0, change: 0 },
      YIELD10: { yield: 0, change: 0 }
    };
  }

  componentDidMount() {
    this.getIndexQuotes();
    this.intervalIndex = setInterval(this.getIndexQuotes, 60000); //Update quotes every minute
    this.getForexQuotes();
    this.intervalForex = setInterval(this.getForexQuotes, 300000); //Update quotes every 5 minutes
    this.getTreasuryYield({ id: "DGS10", points: 2, frequency: "d" });
    // this.intervalTreasury = setInterval(() => {
    //   let parameters = { id: "DGS10", points: 2, frequency: "d" };
    //   this.getTreasuryYield(parameters);
    // }, 1200000); //Update quotes every 20 minutes
  }

  componentWillMount() {
    clearInterval(this.intervalIndex);
    clearInterval(this.intervalForex);
    clearInterval(this.intervalTreasury);
  }

  getIndexQuotes() {
    console.log("Index executed");
    const indices = {
      DOW: "DIA",
      SNP: "SPY",
      NAS: "ONEQ",
      BTC: "BTCUSDT"
    };

    API.getIndexQuotes(indices)
      .then(res => {
        // console.log(res.data);

        this.setState({
          SNP: {
            change: res.data.SPY.quote.changePercent * 100,
            price: res.data.SPY.quote.latestPrice
          },
          DOW: {
            change: res.data.DIA.quote.changePercent * 100,
            price: res.data.DIA.quote.latestPrice
          },
          NAS: {
            change: res.data.ONEQ.quote.changePercent * 100,
            price: res.data.ONEQ.quote.latestPrice
          },
          BTC: {
            change: res.data.BTCUSDT.quote.changePercent * 100,
            price: res.data.BTCUSDT.quote.latestPrice
          }
        });
      })
      .catch(err => console.log(err));
  }

  getForexQuotes() {
    console.log("Forex executed");
    const currency = [
      { cur1: "EUR", cur2: "USD" },
      { cur1: "USD", cur2: "JPY" }
    ];

    const priorCloseDate = moment(Date.now())
      .subtract(18, "hours")
      .format("YYYY-MM-DD");

    currency.forEach(element => {
      API.getForexDaily(element).then(res => {
        let dailyData = res.data["Time Series FX (Daily)"];

        if (dailyData) {
          let priorClose = parseFloat(dailyData[priorCloseDate]["4. close"]);

          API.getForexQuotes(element)
            .then(res => {
              let currentExchange = parseFloat(
                res.data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]
              );

              let currencyPair = element.cur1 + element.cur2;

              this.setState({
                [currencyPair]: {
                  change: ((currentExchange - priorClose) / priorClose) * 100,
                  price: currentExchange
                }
              });
            })
            .catch(err => console.log(err));
        }
      });
    });
  }

  getTreasuryYield(parameters) {
    console.log("Treasury executed");
    API.getTreasuries(parameters).then(res => {
      console.log(res.data);
      let currentYield = parseFloat(res.data.observations[0].value);
      let priorYield = parseFloat(res.data.observations[1].value);

      let yieldDifference = 0;

      if (!isNaN(priorYield) && !isNaN(currentYield)) {
        yieldDifference = currentYield - priorYield;
      }

      this.setState({
        YIELD10: {
          yield: currentYield,
          change: yieldDifference
        }
      });
    });
  }

  render() {
    const upArrow = " fal fa-arrow-up";
    const downArrow = "fal fa-arrow-down";
    return (
      <div>
        <div className="row flex-md-column tickerRow">
          <ul className="tickerRowText d-flex flex-row w-100">
            <li className="mx-auto .tickerSymbol">
              SPY{" "}
              <span
                className="price"
                style={{ fontWeight: "bold" }}
              >{`${this.state.SNP.price.toFixed(2)}  `}</span>
              <span
                style={
                  this.state.SNP.change < 0
                    ? { color: "red" }
                    : { color: "green" }
                }
              >
                {`${this.state.SNP.change.toFixed(2)}% `}
                <i
                  className={
                    (this.state.SNP.change < 0 ? downArrow : upArrow) + " price"
                  }
                />
              </span>
            </li>
            <li className="mx-auto .tickerSymbol">
              DIA{" "}
              <span
                className="price"
                style={{ fontWeight: "bold" }}
              >{`${this.state.DOW.price.toFixed(2)}  `}</span>
              <span
                style={
                  this.state.DOW.change < 0
                    ? { color: "red" }
                    : { color: "green" }
                }
              >
                {`${this.state.DOW.change.toFixed(2)}% `}
                <i
                  className={
                    (this.state.DOW.change < 0 ? downArrow : upArrow) + " price"
                  }
                />
              </span>
            </li>
            <li className="mx-auto .tickerSymbol">
              ONEQ{" "}
              <span
                className="price"
                style={{ fontWeight: "bold" }}
              >{`${this.state.NAS.price.toFixed(2)}  `}</span>
              <span
                style={
                  this.state.NAS.change < 0
                    ? { color: "red" }
                    : { color: "green" }
                }
              >
                {`${this.state.NAS.change.toFixed(2)}% `}
                <i
                  className={
                    (this.state.NAS.change < 0 ? downArrow : upArrow) + " price"
                  }
                />
              </span>
            </li>
            <li className="mx-auto .tickerSymbol">
              U.S. 10-yr{" "}
              <span
                style={{ fontWeight: "bold" }}
              >{`${this.state.YIELD10.yield.toFixed(2)}%  `}</span>
              <span
                className="price"
                style={
                  this.state.YIELD10.change < 0
                    ? { color: "red" }
                    : { color: "green" }
                }
              >
                {`${this.state.YIELD10.change.toFixed(2)} `}
                <i
                  className={
                    (this.state.YIELD10.change < 0 ? downArrow : upArrow) +
                    " price"
                  }
                />
              </span>
            </li>
            <li className="mx-auto .tickerSymbol">
              <i className="fal fa-dollar-sign" />
              /BTC{" "}
              <span
                className="price"
                style={{ fontWeight: "bold" }}
              >{`${this.state.BTC.price.toFixed(2)}  `}</span>
              <span
                style={
                  this.state.BTC.change < 0
                    ? { color: "red" }
                    : { color: "green" }
                }
              >
                {`${this.state.BTC.change.toFixed(2)}% `}
                <i
                  className={
                    (this.state.BTC.change < 0 ? downArrow : upArrow) + " price"
                  }
                />
              </span>
            </li>
            <li className="mx-auto .tickerSymbol">
              <i className="fal fa-dollar-sign" />/
              <i className="fal fa-euro-sign" />{" "}
              <span
                className="price"
                style={{ fontWeight: "bold" }}
              >{`${this.state.EURUSD.price.toFixed(4)}  `}</span>
              <span
                style={
                  this.state.EURUSD.change < 0
                    ? { color: "red" }
                    : { color: "green" }
                }
              >
                {`${this.state.EURUSD.change.toFixed(2)}% `}
                <i
                  className={
                    (this.state.EURUSD.change < 0 ? downArrow : upArrow) +
                    " price"
                  }
                />
              </span>
            </li>
            <li className="mx-auto .tickerSymbol">
              <i className="fal fa-yen-sign" />/
              <i className="fal fa-dollar-sign" />{" "}
              <span
                className="price"
                style={{ fontWeight: "bold" }}
              >{`${this.state.USDJPY.price.toFixed(2)}  `}</span>
              <span
                style={
                  this.state.USDJPY.change < 0
                    ? { color: "red" }
                    : { color: "green" }
                }
              >
                {`${this.state.USDJPY.change.toFixed(2)}% `}
                <i
                  className={
                    (this.state.USDJPY.change < 0 ? downArrow : upArrow) +
                    " price"
                  }
                />
              </span>
            </li>
          </ul>
        </div>
        <div className="row footnote justify-content-end">
          <p>
            ETF data provided for free by{" "}
            <a href="https://iextrading.com/developer"> IEX</a>. View IEX’s{" "}
            <a href="https://iextrading.com/api-exhibit-a/"> Terms of Use</a>.
          </p>
        </div>
      </div>
    );
  }
}

export default Ticker;
