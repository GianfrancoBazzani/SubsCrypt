
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {EmailDomainProver} from "../src/vlayer/EmailDomainProver.sol";
import {EmailProofVerifier} from "../src/vlayer/EmailProofVerifier.sol";

contract CounterScript is Script {
    EmailProofVerifier public verifier;
    EmailDomainProver public prover;

    address marketplace = 0x541C016941542699bE15db5E4fBb71445c62fD90;


    function setUp() public {}

    function run() public {
        vm.startBroadcast();
        prover = new EmailDomainProver();
        verifier = new EmailProofVerifier(address(prover), marketplace);
        vm.stopBroadcast();
    }
}
