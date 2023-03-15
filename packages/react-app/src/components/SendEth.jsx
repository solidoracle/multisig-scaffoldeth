import { Button } from 'antd'
import { ethers } from 'ethers'
import React from 'react'
import { useState } from 'react'
import AddressInput from './AddressInput'
import EtherInput from './EtherInput'
import proposeTx from '../helpers/propseTx';
import { useHistory } from 'react-router-dom'

const SendEth = ({apiBaseUrl,mainnetProvider,price,neededSigns}) => {

    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState(0);
    const [active, setActive] = useState(true);
    const [loading, setLoading] = useState(false);

    const history = useHistory();

    async function handlePropose(){
        setLoading(true);
        try {
        await proposeTx(apiBaseUrl, "", [[] , []], recipient, ethers.utils.parseEther(amount.toString()), neededSigns);
        history.push("/transactions");
        setLoading(false)
     }catch (err) {
        console.log("erreur while proposing send eth tx" , err)
        setLoading(false)
    }
    }

  return (
    <div>SendEth
        <AddressInput
          autoFocus
          ensProvider={mainnetProvider}
          placeholder={"Recipient address"}
          value={recipient}
          onChange={setRecipient}
        />
        <EtherInput
            price={price}
            value={amount}
            onChange={value => {
              setAmount(value);
            }}
          />
        <Button title="Propose" 
            disabled={!active}
            onClick={() => handlePropose() } 
            loading={loading}
            style={{marginTop:"15px"}}
            >Propose
    </Button>
    </div>
  )
}

export default SendEth