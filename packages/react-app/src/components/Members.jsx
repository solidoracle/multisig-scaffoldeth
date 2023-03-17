import React from "react";
import { Row, Button, Select, List } from "antd";
import Address from "./Address";
import Balance from "./Balance";
import { DeleteOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import proposeTx from "../helpers/propseTx";
import { useState } from "react";
import { useEffect } from "react";

const Members = ({ members, roles, mainnetProvider, blockExplorer }) => {
  return (
    <div title="Members">
      Members
      {members?.map((member, index) => (
        <List.Item key={"owner_" + index}>
          <Address address={member} ensProvider={mainnetProvider} blockExplorer={blockExplorer} fontSize={32} />
        </List.Item>
      ))}
    </div>
  );
};

export default Members;
