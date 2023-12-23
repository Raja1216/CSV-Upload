const mongoose = require("mongoose");

const csvSchema = new mongoose.Schema({
  filename: String,
  data: Array,
});

const CsvModel = mongoose.model("Csv", csvSchema);

module.exports = CsvModel;
