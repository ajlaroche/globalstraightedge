import axios from "axios";

export default {
  getIndexQuotes: function(indices) {
    console.log("made it to axios");
    return axios.get(
      `/api/marketdata/indexquotes/${indices.DOW}/${indices.SNP}/${indices.BTC}`
    );
  }
};
