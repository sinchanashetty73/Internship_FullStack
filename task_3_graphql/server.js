require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { graphqlHTTP } =
  require("express-graphql");

const schema = require("./schema/schema");

const app = express();

app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));


app.use("/graphql", graphqlHTTP({
  schema,
  graphiql: true
}));


app.listen(4000, () => {
  console.log("Server running on port 4000");
});