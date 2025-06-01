// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {VTest} from "vlayer-0.1.0/testing/VTest.sol";
import {Proof} from "vlayer-0.1.0/Proof.sol";
import {console} from "forge-std/console.sol";

import {UnverifiedEmail, EmailProofLib, VerifiedEmail} from "vlayer-0.1.0/EmailProof.sol";

import {EmailDomainProver} from "../../src/vlayer/EmailDomainProver.sol";

contract EmailProofLibWrapper {
    using EmailProofLib for UnverifiedEmail;

    function verify(UnverifiedEmail calldata email) public view returns (VerifiedEmail memory v) {
        return email.verify();
    }
}

contract EmailDomainProverTest is VTest {
    function getTestEmail(string memory path) public view returns (UnverifiedEmail memory) {
        string memory mime = vm.readFile(path);
        return preverifyEmail(mime);
    }

    function test_verifiesEmailDomain() public {
        EmailProofLibWrapper wrapper = new EmailProofLibWrapper();
        address johnDoe = vm.addr(1);

        EmailDomainProver prover = new EmailDomainProver();
        UnverifiedEmail memory email = getTestEmail("testdata/nose.eml");
        VerifiedEmail memory verifiedEmail = wrapper.verify(email);
        // callProver();
        bytes32 hash = 0x9d7f4133fd9b2ca03e2c4d901820033eba3f4b0211a39798841d306dfe72abc3;
        bytes32 r = 0x87e3d0de173194183a7ac7393a6b331c1de84662dc86cef9380dff11b43385db;
        bytes32 s = 0x144d769b1b0cbb410de3ef2804e3ecc52341f3b758f7f72d670c4d0545d5ec92;
        uint8 v = 28;
        bytes32 salt = 0xeffb808d753cab648a810be7767e53bd068af1e4794820eb1fc24b7a72035cd5;

        (, uint serviceId, bytes32 hashEmail, address signer) = prover.main(email, hash, r, s, v, 1, salt);
        // console.log(auth);

        console.log(serviceId);
        // console.log(hashEmail);
        console.log(signer);

        // assertEq(emailHash, sha256(abi.encodePacked(verifiedEmail.from)));
        // assertEq(registeredWallet, johnDoe);
        // assertEq(emailDomain, "gmail.com");
    }
}
