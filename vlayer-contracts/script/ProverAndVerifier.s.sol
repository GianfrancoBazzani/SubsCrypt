
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {EmailDomainProver} from "../src/vlayer/EmailDomainProver.sol";
import {EmailProofVerifier} from "../src/vlayer/EmailProofVerifier.sol";

contract CounterScript is Script {
    EmailProofVerifier public verifier;
    EmailDomainProver public prover;

    address public marketplace = 0x541c016941542699be15db5e4fbb71445c62fd90;


    function setUp() public {}

    function run() public {
        vm.startBroadcast();
        prover = new EmailDomainProver();
        verifier = new EmailProofVerifier(address(prover), marketplace);
        vm.stopBroadcast();
    }
}
