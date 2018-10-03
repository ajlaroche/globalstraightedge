import axios from "axios";

export default {
  getIndexQuotes: function(indices) {
    return axios.get(
      `/api/marketdata/indexquotes/${indices.DOW}/${indices.SNP}/${
        indices.NAS
      }/${indices.BTC}`
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
  }
};
