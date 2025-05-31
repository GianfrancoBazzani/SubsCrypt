
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {EmailDomainProver} from "../src/vlayer/EmailDomainProver.sol";

contract CounterTest is Test {
    EmailDomainProver public prover;

    function setUp() public {
        prover = new EmailDomainProver();
    }

    function test_number_1() public {
        assertEq(prover.stringToUint("1"), 1);
        assertEq(prover.stringToUint("39"), 39);
        assertEq(prover.stringToUint("0123456789"), 123456789);
    }
}
