// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import {EmailDomainProver} from "./EmailDomainProver.sol";
import {ISubscrypt} from "./ISubscrypt.sol";

import {Proof} from "vlayer-0.1.0/Proof.sol";
import {Verifier} from "vlayer-0.1.0/Verifier.sol";

contract EmailDomainVerifier is Verifier {
    address public prover;
    ISubscrypt public subscrypt;

    uint256 public currentTokenId;

    mapping(bytes32 => bool) public takenEmailHashes;
    mapping(uint256 => string) public tokenIdToMetadataUri;

    constructor(address _prover, address _subscrypt) {
        prover = _prover;
        subscrypt = ISubscrypt(_subscrypt);
    }

    function verify(Proof calldata, bytes32 _emailHash, address _targetWallet, uint256 _serviceId)
        public
        onlyVerified(prover, EmailDomainProver.main.selector)
    {
        require(takenEmailHashes[_emailHash] == false, "email taken");
        takenEmailHashes[_emailHash] = true;

        subscrypt.InitializeAccount(_serviceId, _targetWallet);
    }
}
