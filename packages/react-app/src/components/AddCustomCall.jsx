import { Input, Button, Select, Row, Tooltip } from "antd";
import React from "react";
import { useState } from "react";
import AddressInput from "./AddressInput";
import EtherInput from "./EtherInput";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import proposeTx from "../helpers/propseTx";
import { ethers } from "ethers";
import { useHistory } from "react-router-dom";

const AddCustomCall = ({ apiBaseUrl, neededSigns, mainnetProvider, price }) => {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("0");
  const [functionName, setFunctionName] = useState("");
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState();
  const [args, setArgs] = useState();
  const [params, setParams] = useState([[], []]);
  const count = 0;
  const history = useHistory();

  async function handlePropose() {
    try {
      await proposeTx(apiBaseUrl, functionName, params, to, amount, neededSigns);
      history.push("/transactions");
    } catch (err) {
      console.log("error while sneding propseTx in customCall : ", err);
      alert(err);
    }
  }
  function getArg(string, index) {
    let test = string.split(",", index).join(",").length;
    // console.log("test" , test)
    return test;
  }
  function handleFunctionName(value) {
    setFunctionName(value);
    console.log("value : ", value);
    let i = 0;
    while (value.indexOf(" ") !== -1 && i < 10000) {
      console.log(value);
      let newValue = value.replace(" ", "");
      value = newValue;
      i++; //prevent infinite loop ...
    }
    let stringWithoutSpace = value;
    console.log("no space :", stringWithoutSpace);
    setArgs([]);
    if (value.indexOf("(") !== -1 && value.indexOf(")") !== -1) {
      let betweenParantheses = stringWithoutSpace.substring(
        stringWithoutSpace.indexOf("(") + 1,
        stringWithoutSpace.indexOf(")"),
      );
      let index = (betweenParantheses.match(/,/g) || []).length + 1;
      let indexOfComa = [0];
      for (let i = 1; i < index; i++) {
        let arg = getArg(betweenParantheses, i);
        indexOfComa.push(arg);
      }
      let newArgs = [];

      for (let j = 0; j < index; j++) {
        let argument = betweenParantheses.substring(indexOfComa[j], indexOfComa[j + 1]);
        newArgs.push(argument.substring(argument.indexOf(",") + 1));
      }
      setArgs(newArgs);
      let oldParams = params;
      oldParams[0] = newArgs;
      setParams(oldParams);
    }
  }

  function displayArguments(args, index) {
    let toDisplay = [];
    console.log("Args : ", args);
    switch (args) {
      case "uint256":
        toDisplay = (
          <Row key={index}>
            <Input
              autoFocus
              placeholder="uint256"
              value={params[1][index]}
              onChange={async e => {
                let oldParam = [...params];
                oldParam[1][index] = e.target.value;
                setParams(oldParam);
              }}
              suffix={
                <Tooltip placement="right" title="* 10 ** 18">
                  <div
                    type="dashed"
                    style={{ cursor: "pointer" }}
                    onClick={async () => {
                      let newValue = [...params];
                      const floatValue = params[1][index];
                      console.log("float value : ", floatValue);
                      if (floatValue) {
                        newValue[1][index] = "" + floatValue * 10 ** 18;
                        console.log("after *18 : ", newValue[1][index]);
                        setParams(newValue);
                      }
                    }}
                  >
                    ✴️
                  </div>
                </Tooltip>
              }
            />
          </Row>
        );
        break;
      case "string":
        toDisplay = (
          <Row key={index}>
            <Input
              placeholder="string"
              onChange={e => {
                let oldParam = [...params];
                oldParam[1][index] = e.target.value;
                setParams(oldParam);
              }}
            />
          </Row>
        );
        break;
      case "uint64":
      case "uint":
      case "uint8":
      case "uint32":
      case "int":
      case "int8":
      case "int32":
      case "int64":
      case "int256":
        toDisplay = (
          <Row key={index}>
            <Input
              placeholder="Number"
              onChange={e => {
                let oldParam = [...params];
                oldParam[1][index] = e.target.value;
                setParams(oldParam);
              }}
            />
          </Row>
        );
        break;
      case "address":
        toDisplay = (
          <AddressInput
            key={index}
            placeholder="Address"
            ensProvider={mainnetProvider}
            value={params[1][index]}
            onChange={value => {
              let oldParam = [...params];
              oldParam[1][index] = value;
              setParams(oldParam);
            }}
          />
        );
        break;
      case "bool":
        toDisplay = (
          <Row key={index}>
            <Input
              placeholder="Bollean"
              onChange={e => {
                let oldParam = [...params];
                if (
                  e.target.value === "true" ||
                  e.target.value === "1" ||
                  e.target.value === "0x1" ||
                  e.target.value === "0x01" ||
                  e.target.value === "0x0001"
                ) {
                  oldParam[1][index] = 1;
                } else oldParam[1][index] = 0;
                setParams(oldParam);
              }}
            />
          </Row>
        );
        break;
      case "bytes32":
        toDisplay = (
          <Row key={index}>
            <Input
              placeholder="Bytes32"
              onChange={e => {
                let oldParam = [...params];
                if (ethers.utils.isHexString(e.target.value)) {
                  oldParam[1][index] = ethers.utils.parseBytes32String(e.target.value);
                  setParams(oldParam);
                } else {
                  oldParam[1][index] = ethers.utils.formatBytes32String(e.target.value);
                  setParams(oldParam);
                }
              }}
            />
          </Row>
        );
        break;
      case "bytes":
        toDisplay = (
          <Row key={index}>
            <Input
              placeholder="Bytes"
              onChange={e => {
                let oldParam = [...params];
                if (ethers.utils.isHexString(e.target.value)) {
                  oldParam[1][index] = ethers.utils.toUtf8String(e.target.value);
                  setParams(oldParam);
                } else {
                  oldParam[1][index] = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(e.target.value));
                  setParams(oldParam);
                }
              }}
            />
          </Row>
        );
        break;
      default:
        toDisplay = "waiting for argume,ts to display";
    }
    return toDisplay;
  }

  return (
    <div>
      Cusctom Call
      <AddressInput
        autoFocus
        ensProvider={mainnetProvider}
        placeholder="contract address to call"
        value={to}
        onChange={setTo}
      />
      <EtherInput
        price={price}
        value={amount}
        onChange={value => {
          setAmount(value);
        }}
      />
      <Input
        autoFocus
        placeholder="Function Name ex : mint(uint256)"
        value={functionName}
        onChange={e => {
          handleFunctionName(e.target.value);
        }}
      />
      {args?.map((arg, index) => displayArguments(arg, index))}
      <Button
        title="Propose"
        disabled={!active}
        onClick={() => handlePropose()}
        loading={loading}
        style={{ marginTop: "15px" }}
      >
        Propose
      </Button>
    </div>
  );
};

export default AddCustomCall;
