const express = require("express");
const cors = require("cors");
const app = express();

var txId = 1000;
var content = { txs: [] };

app.use(cors());
app.use(express.json());

app.post("/api/addTransaction", async (req, res) => {
  try {
    console.log(req.body);
    content.txs.push(req.body);
    txId = txId + 1;
    res.status(201).send({ txId });
  } catch (err) {
    res.status(400).send(err);
  }
});

app.post("/api/updateSingleTransaction/:id", (req, res) => {
  const id = req.params.id;
  const sign = req.body.sign;
  try {
    let newContent = content.txs.map((tx) => {
      if (tx.txId == id && !tx.signatures.includes(sign))
        tx.signatures.push(sign);
      return tx;
    });
    content.txs = newContent;
    res.status(200).send({ content });
  } catch (err) {
    console.log("error in finding transaction id", err);
    res.status(404).send({ message: "not found" });
  }
});

app.get("/api/txId", async (req, res) => {
  try {
    res.status(200).send({ txId });
  } catch (err) {
    console.log("error in catch readfile", err);
    res.status(404).send({ message: "not found" });
  }
});

app.get("/api/singleTransaction/:id", (req, res) => {
  try {
    const id = req.params.id;
    let transaction = content.txs.filter(function (tx) {
      return tx.txId == id;
    });
    res.status(200).send(transaction);
  } catch (err) {
    console.log("error in finding transaction id", err);
    res.status(404).send({ message: "not found" });
  }
});

app.get("/api/deleteTx/:id", async (req, res) => {
  const id = req.params.id;
  try {
    let newContent = content.txs.filter(function (tx) {
      return tx.txId != id;
    });
    content.txs = [...newContent];
    res.status(200).send(content);
  } catch (err) {
    console.log("error in finding transaction id", err);
    res.status(404).send({ message: "not found" });
  }
});

app.get("/api/transactions", async (req, res) => {
  try {
    res.status(200).send({ content });
  } catch (err) {
    console.log("error in get all txs", err);
    res.status(404).send({ message: "no txs found" });
  }
});

const port = process.env.PORT || 33550;

app.listen(port, () => {
  console.log("Server is runing on port: ", port);
});
