

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {EmailDomainProver} from "../src/vlayer/EmailDomainProver.sol";
import {IEmailProofVerifier} from "../src/vlayer/IEmailProofVerifier.sol";

contract CounterScript is Script {
    address contrato = address(0);

    function setUp() public {}

    function run() public {
        vm.startBroadcast();
        IEmailProofVerifier interf = IEmailProofVerifier(contrato);
        vm.stopBroadcast();
    }
}
