import { Button, InputNumber, Form } from "antd";
import React from "react";
import { useState } from "react";
import proposeTx from "../helpers/propseTx";
import { useHistory } from "react-router-dom";

const AddSignatures = ({ neededSigns, members, apiBaseUrl, multiSigAdd }) => {
  const [signsNeeded, setSignsNeeded] = useState(neededSigns);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function handleClick() {
    try {
      await proposeTx(apiBaseUrl, "setSignersRequired(uint8)", [["uint8"], [signsNeeded]], multiSigAdd, 0, neededSigns);
      history.push("/transactions");
    } catch (err) {
      console.log("error while propose tx to add sigantures required : ", err);
    }
  }

  return (
    <div>
      <Form title="Add a Signatures" style={{ width: "350px", display: "flex", flexDirection: "column" }}>
        {" "}
        update the signs required
        <div style={{ marginTop: "15px" }}>
          <InputNumber placeholder={neededSigns} value={signsNeeded} onChange={setSignsNeeded} />
          <Button
            disabled={0 < signsNeeded && signsNeeded <= members?.length ? false : true}
            loading={loading}
            onClick={() => handleClick()}
          >
            {" "}
            Propose{" "}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddSignatures;
