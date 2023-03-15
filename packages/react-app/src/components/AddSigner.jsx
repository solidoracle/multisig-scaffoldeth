import React, { useState } from "react";
import { Form, Button } from "antd";
import { ethers } from "ethers";
import proposeTx from "../helpers/propseTx";
import AddressInput from "./AddressInput";
import { useHistory } from "react-router-dom";

const AddSigner = ({ multiSigAdd, mainnetProvider, apiBaseUrl, neededSigns }) => {
  const [newSigner, setNewSigner] = useState("");
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);
  const history = useHistory();

  async function handlePropose() {
    try {
      setLoading(true);
      await proposeTx(apiBaseUrl, "addSigner(address)", [["address"], [newSigner]], multiSigAdd, 0, neededSigns);
      setNewSigner("");
      setActive(false);
      setLoading(false);
      history.push("/transactions");
    } catch (err) {
      alert(err);
      console.log(err);
      setActive(false);
      setLoading(false);
    }
  }

  return (
    <div>
      <Form title="Add a Signer" style={{ width: "350px" }}>
        {" "}
        New Signer Address
        <AddressInput
          autoFocus
          ensProvider={mainnetProvider}
          placeholder={"New member address"}
          value={newSigner}
          onChange={e => {
            setActive(false);
            console.log(e);
            setNewSigner(e);
            if (ethers.utils.isAddress(e)) setActive(true);
          }}
        />
        {newSigner.length > 0 && !ethers.utils.isAddress(newSigner) ? <p>Add a valid address</p> : null}
        <Button
          title="Propose"
          disabled={!active}
          onClick={() => handlePropose()}
          loading={loading}
          style={{ marginTop: "15px" }}
        >
          Propose
        </Button>
      </Form>
    </div>
  );
};

export default AddSigner;
