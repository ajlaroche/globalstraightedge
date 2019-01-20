import axios from "axios";

export default {
  getIndexQuotes: function(indices) {
    return axios.get(
      `/api/marketdata/indexquotes/${indices.DOW}/${indices.SNP}/${
        indices.NAS
      }/${indices.BTC}`
    );
  },
  getGlobalIndex: function(parameters) {
    return axios.get(
      `/api/marketdata/globalindex/${parameters.ticker}/${parameters.interval}`
    );
  },

  getForexQuotes: function(currency) {
    return axios.get(
      `/api/marketdata/forexquotes/${currency.cur1}/${currency.cur2}`
    );
  },
  getForexDaily: function(currency) {
    return axios.get(
      `/api/marketdata/forexdaily/${currency.cur1}/${currency.cur2}`
    );
  },
  getTreasuries: function(parameters) {
    return axios.get(
      `/api/marketdata/treasury/${parameters.id}/${parameters.points}/${
        parameters.frequency
      }`
    );
  },
  getUnemployment: function() {
    return axios.get(`/api/economy/unemployment`);
  },
  getGDP: function() {
    return axios.get(`/api/economy/gdp`);
  },
  getCPI: function() {
    return axios.get(`/api/economy/cpi`);
  },
  getYieldSpread: function() {
    return axios.get(`/api/economy/yieldspread`);
  },
  getWageGrowth: function() {
    return axios.get(`/api/economy/wagegrowth`);
  },
  getTradeBalance: function() {
    return axios.get(`/api/economy/tradebalance`);
  },
  getPayrolls: function() {
    return axios.get("/api/economy/payrolls");
  },
  getConsumption: function() {
    return axios.get("/api/economy/consumption");
  },
  getRecessions: function() {
    return axios.get("/api/economy/recessions");
  },
  getYieldCurve: function() {
    return axios.get("/api/economy/yieldcurve");
  },
  getHousePrice: function() {
    return axios.get("/api/economy/houseprice");
  },
  getHousingStarts: function() {
    return axios.get("/api/economy/housingstarts");
  },

  getLendingClubSummary: function() {
    return axios.get("/api/other/lcsummary");
  },

  getLendingClubRecord: function() {
    return axios.get("/api/lcsummaryrecord");
  },

  saveLendingClubRecord: function(record) {
    return axios.post("/api/lcsummaryrecord", record);
  }
};
