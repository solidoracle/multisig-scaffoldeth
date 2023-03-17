// SPDX-License-Identifier: MIT

// solidoracle🔮 solution of Scaffold ETH multisig challenge
// started from 🏗 scaffold-eth - meta-multi-sig-wallet https://github.com/austintgriffith/scaffold-eth/tree/meta-multi-sig

pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract MetaMultiSigWallet {
    using ECDSA for bytes32;

    event Deposit(address indexed sender, uint amount, uint balance);
    event ExecuteTransaction(address indexed owner, address payable to, uint256 value, bytes data, uint256 nonce, bytes32 hash, bytes result);
    event Owner(address indexed owner, bool added);
    event TxSent(address to, uint256 value);

    mapping(address => bool) public isOwner;
    mapping(uint256 => bool) txSent; //when a txId is receive this mapping is set to true
    address[] owners;

    uint public signaturesRequired;
    uint public nonce;
    uint public chainId;

    struct Params {
        bytes callData;
        address to;
        uint256 amount;
        uint8 signRequired;
        uint256 txId;
    }

    constructor(uint256 _chainId, address[] memory _owners, uint _signaturesRequired) {
        require(_signaturesRequired > 0, "constructor: must be non-zero sigs required");
        signaturesRequired = _signaturesRequired;
        for (uint i = 0; i < _owners.length; i++) {
            address owner = _owners[i];
            require(owner != address(0), "constructor: zero address");
            require(!isOwner[owner], "constructor: owner not unique");
            isOwner[owner] = true;
            owners.push(owner);
            emit Owner(owner, isOwner[owner]);
        }
        chainId = _chainId;
    }

    modifier onlySelf() {
        require(msg.sender == address(this), "Not Self");
        _;
    }

    function addSigner(address newSigner) public onlySelf {
        require(newSigner != address(0), "addSigner: zero address");
        require(!isOwner[newSigner], "addSigner: owner not unique");
        isOwner[newSigner] = true;
        owners.push(newSigner);
        emit Owner(newSigner, isOwner[newSigner]);
    }

    function setSignersRequired(uint8 newSignaturesRequired) public onlySelf {
        require(newSignaturesRequired > 0, "addSigner: must be non-zero sigs required");
        signaturesRequired = newSignaturesRequired;
    }

    function removeSigner(address oldSigner) public onlySelf {
        require(isOwner[oldSigner], "removeSigner: not owner");
        bool done = false;
        uint8 index;
        for (uint8 i = 0; i < owners.length; i++) {
            if (owners[i] == oldSigner) {
                index = i;
                done = true;
            }
        }
        require(done, "Signer not fund");
        isOwner[oldSigner] = false;
        require(owners.length > 1, "Last signer can't be removed !");
        for (uint256 i = index; i < owners.length - 1; i++) {
            // shifting the element in the array from index to the last
            owners[i] = owners[i + 1];
        }
        owners.pop(); //remove the last entry of the array

        if (signaturesRequired > owners.length && signaturesRequired > 1) {
            signaturesRequired--;
        } 

    }

    function updateSignaturesRequired(uint256 newSignaturesRequired) public onlySelf {
        require(newSignaturesRequired > 0, "updateSignaturesRequired: must be non-zero sigs required");
        signaturesRequired = newSignaturesRequired;
    }

    function getHash(
        bytes memory _callData,
        address _to,
        uint256 _amount,
        uint8 _signRequired,
        uint256 _txId
    ) public pure returns (bytes32 _hash) {
        // function getHash(uint8 _functionCalled, uint8 _signRequired) public pure returns (bytes32 _hash) {
        Params memory data;
        data.callData = _callData;
        data.to = _to;
        data.amount = _amount;
        data.signRequired = _signRequired;
        data.txId = _txId;
        return (keccak256(abi.encode(data)));
    }

    // function executeTransaction(address payable to, uint256 value, bytes memory data, bytes[] memory signatures)
    //     public
    //     returns (bytes memory)
    // {
    //     require(isOwner[msg.sender], "executeTransaction: only owners can execute");
    //     bytes32 _hash =  getHash(nonce, to, value, data);
    //     nonce++;
    //     uint256 validSignatures;
    //     address duplicateGuard;
    //     for (uint i = 0; i < signatures.length; i++) {
    //         address recovered = recover(_hash, signatures[i]);
    //         require(recovered > duplicateGuard, "executeTransaction: duplicate or unordered signatures");
    //         duplicateGuard = recovered;
    //         if(isOwner[recovered]){
    //           validSignatures++;
    //         }
    //     }

    //     require(validSignatures>=signaturesRequired, "executeTransaction: not enough valid signatures");

    //     (bool success, bytes memory result) = to.call{value: value}(data);
    //     require(success, "executeTransaction: tx failed");

    //     emit ExecuteTransaction(msg.sender, to, value, data, nonce-1, _hash, result);
    //     return result;
    // }
    function execute(
        bytes calldata _callData,
        address _to,
        uint256 _amount,
        uint8 _signRequired,
        uint256 _txId,
        bytes[] memory signatures
    ) external returns (bytes memory results){
        require(isOwner[msg.sender], "executeTransaction: only owners can execute");
        require(txSent[_txId] == false, "transaction allready sent ! ");
        Params memory data = Params(_callData, _to, _amount, _signRequired, _txId);
        // data.callData = _callData;
        // data.to = _to;
        // data.amount = _amount;
        // data.signRequired = _signRequired;
        // data.txId = _txId;
        bytes32 msgHash = keccak256(abi.encode(data));
        uint256 validSignatures;
        address duplicateGuard;
        for (uint i = 0; i < signatures.length; i++) {
            address recovered = recover(msgHash, signatures[i]);
            require(recovered > duplicateGuard, "executeTransaction: duplicate or unordered signatures");
            duplicateGuard = recovered;
            if(isOwner[recovered]){
              validSignatures++;
            }
        }

        require(validSignatures>=signaturesRequired, "executeTransaction: not enough valid signatures");

        txSent[_txId] = true; //to avoid to sent the same tx multiple times
        (bool success, bytes memory result) = _to.call{value :_amount}(_callData);
        require(success, "executeTransaction: tx failed");
        emit TxSent(_to, _amount);
        return result;
    }

    function recover(bytes32 _hash, bytes memory _signature) public pure returns (address) {
        return _hash.toEthSignedMessageHash().recover(_signature);
    }

    function getOwners() public view returns (address[] memory) {
        return owners;
    }

    receive() payable external {
        emit Deposit(msg.sender, msg.value, address(this).balance);
    }
}
