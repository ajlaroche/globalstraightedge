import axios from "axios";

export default {
  getIndexQuotes: function() {
    console.log("made it to axios");
    return axios.get("/api/marketdata/indexquotes");
  }
};
