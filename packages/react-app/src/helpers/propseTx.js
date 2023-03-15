import axios from "axios";
import { ethers } from "ethers";

export function getCallData(functionName, params) {
  let abi = ethers.utils.defaultAbiCoder;
  let functionNameEncoded = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(functionName)).substring(0, 10);
  let paramsEncoded = abi.encode(params[0], params[1]).substring(2);
  return functionNameEncoded + paramsEncoded;
}

export default async function proposeTx(apiBaseUrl, _functionName, _params, _to, _value, neededSigns) {
  let callData = getCallData(_functionName, _params);
  let txId = await axios.get(apiBaseUrl + "txId");
  try {
    let result = await axios.post(apiBaseUrl + "addTransaction", {
      functionName: _functionName,
      params: _params,
      to: _to,
      value: _value,
      txId: txId.data.txId,
      callData: callData,
      neededSigns: neededSigns,
      signatures: [],
    });

    console.log(result);
  } catch (err) {
    console.log(err);
  }
}
