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
    return axios.get(`/api/marketdata/forexquotes/${currency}`);
  }
};
