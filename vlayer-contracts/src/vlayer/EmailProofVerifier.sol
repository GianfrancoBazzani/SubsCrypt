// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import {EmailDomainProver} from "./EmailDomainProver.sol";
import {ISubscrypt} from "./ISubscrypt.sol";

import {Proof} from "vlayer-0.1.0/Proof.sol";
import {Verifier} from "vlayer-0.1.0/Verifier.sol";

contract EmailProofVerifier is Verifier {
    address public prover;
    ISubscrypt public subscrypt;

    mapping(bytes32 => bool) public takenEmailHashes;

    constructor(address _prover, address _subscrypt) {
        prover = _prover;
        subscrypt = ISubscrypt(_subscrypt);
    }

    function verify(Proof memory _proof, uint256 _serviceId, bytes32 _emailHash, address _signer)
        public
        onlyVerified(prover, EmailDomainProver.main.selector)
    {
        require(takenEmailHashes[_emailHash] == false, "You cannot reuse the same proof");
        takenEmailHashes[_emailHash] = true;
        subscrypt.InitializeAccount(_serviceId, _signer, _emailHash);
    }
}
