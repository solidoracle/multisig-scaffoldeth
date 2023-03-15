import React from "react";
import { Card, Divider, Row, Spin, List } from "antd";
import Address from "./Address";
import Balance from "./Balance";
import AddSigner from "./AddSigner";
import proposeTx from "../helpers/propseTx";
import AddSignatures from "./AddSignatures";
import SendEth from "./SendEth";
import AddCustomCall from "./AddCustomCall";

export default function Multisig({
  provider,
  apiBaseUrl,
  ownerEvents,
  price,
  mainnetProvider,
  neededSigns,
  blockExplorer,
  multiSigAdd,
  signaturesRequired,
}) {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "15px" }}>
      <Card style={{ width: "450px" }}>
        <Row title="Header" style={{ display: "flex", justifyContent: "space-between" }}>
          <h2 style={{ marginBottom: "20px" }}> 🔮solidoracle's multisig </h2>
          <span>
            <Address address={multiSigAdd} />{" "}
            <Balance address={multiSigAdd} provider={provider} dollarMultiplier={price} />
          </span>
          <div>Signatures Required: {signaturesRequired ? signaturesRequired.toNumber() : <Spin></Spin>}</div>
          <Divider />
        </Row>
        <h3>Active Owners :</h3>

        <List
          style={{ maxWidth: 400, margin: "auto" }}
          bordered
          dataSource={ownerEvents}
          renderItem={item => {
            return (
              <List.Item key={"owner_" + item[0]}>
                <Address address={item[0]} ensProvider={mainnetProvider} blockExplorer={blockExplorer} fontSize={32} />
                <div style={{ padding: 16 }}>{item[1] ? "👍" : "👎"}</div>
              </List.Item>
            );
          }}
        />

        <Divider />
        <Row title="Signers" style={{ display: "flex", justifyContent: "center" }}></Row>
        <Row title="Add a member" style={{ display: "flex", justifyContent: "center" }}>
          <AddSigner
            multiSigAdd={multiSigAdd}
            mainnetProvider={mainnetProvider}
            apiBaseUrl={apiBaseUrl}
            neededSigns={neededSigns}
            blockExplorer={blockExplorer}
          />
        </Row>
        <Divider />

        {/* <Row title="Add Sigantures" style={{ display: "flex", justifyContent: "center" }}>
          <AddSignatures
            members={members}
            multiSigAdd={multiSigAdd}
            mainnetProvider={mainnetProvider}
            apiBaseUrl={apiBaseUrl}
            neededSigns={neededSigns}
          />
        </Row>
        <Divider /> */}
        {/* <Row title="Send Eth" style={{ display: "flex", justifyContent: "center" }}>
          <SendEth
            members={members}
            multiSigAdd={multiSigAdd}
            mainnetProvider={mainnetProvider}
            apiBaseUrl={apiBaseUrl}
            neededSigns={neededSigns}
            price={price}
          />
        </Row>
        <Divider />
        <Row title="Send Eth" style={{ display: "flex", justifyContent: "center" }}>
          <AddCustomCall
            members={members}
            multiSigAdd={multiSigAdd}
            mainnetProvider={mainnetProvider}
            apiBaseUrl={apiBaseUrl}
            neededSigns={neededSigns}
            price={price}
          />
        </Row> */}
      </Card>
    </div>
  );
}
