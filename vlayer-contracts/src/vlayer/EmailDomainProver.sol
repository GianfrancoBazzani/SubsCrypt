// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import {console} from "forge-std/console.sol";
import {Strings} from "@openzeppelin-contracts-5.0.1/utils/Strings.sol";
import {ECDSA} from "@openzeppelin-contracts-5.0.1/utils/cryptography/ECDSA.sol";
import {Proof} from "vlayer-0.1.0/Proof.sol";
import {Prover} from "vlayer-0.1.0/Prover.sol";
import {RegexLib} from "vlayer-0.1.0/Regex.sol";
import {VerifiedEmail, UnverifiedEmail, EmailProofLib} from "vlayer-0.1.0/EmailProof.sol";

contract EmailDomainProver is Prover, ECDSA {
    using RegexLib for string;
    using Strings for string;
    using EmailProofLib for UnverifiedEmail;


    function stringToAddress(string memory str) public pure returns (address) {
        bytes memory strBytes = bytes(str);
        require(strBytes.length == 42, "Invalid address length");
        bytes memory addrBytes = new bytes(20);

        for (uint256 i = 0; i < 20; i++) {
            addrBytes[i] = bytes1(hexCharToByte(strBytes[2 + i * 2]) * 16 + hexCharToByte(strBytes[3 + i * 2]));
        }

        return address(uint160(bytes20(addrBytes)));
    }

    function hexCharToByte(bytes1 char) internal pure returns (uint8) {
        uint8 byteValue = uint8(char);
        if (byteValue >= uint8(bytes1("0")) && byteValue <= uint8(bytes1("9"))) {
            return byteValue - uint8(bytes1("0"));
        } else if (byteValue >= uint8(bytes1("a")) && byteValue <= uint8(bytes1("f"))) {
            return 10 + byteValue - uint8(bytes1("a"));
        } else if (byteValue >= uint8(bytes1("A")) && byteValue <= uint8(bytes1("F"))) {
            return 10 + byteValue - uint8(bytes1("A"));
        }
        revert("Invalid hex character");
    }

        // Función para convertir un string a uint
    function stringToUint(string memory str) public pure returns (uint) {
        uint result = 0;
        bytes memory b = bytes(str);  // Convertir el string a bytes
        
        for (uint i = 0; i < b.length; i++) {
            // Asegurarse de que el carácter es un número
            require(b[i] >= 0x30 && b[i] <= 0x39, "Input string is not a valid number");
            
            result = result * 10 + (uint(b[i]) - 0x30); // '0x30' es el valor ASCII del carácter '0'
        }
        
        return result;
    }

    function main(UnverifiedEmail calldata unverifiedEmail, bytes32 hash, bytes32 r, bytes32 s, uint8 yParity, bytes32 salt)
        public
        // view
        // returns (string memory authResult)
        returns (Proof memory, uint256, string memory, address)
    {
        VerifiedEmail memory email = unverifiedEmail.verify();

        // extract for service id
        string[] memory serviceID = email.subject.capture("^.*serviceID: ([0-9]+).*$");
        require(serviceID.length >= 2, "no serviceID in subject");
        console.log("serviceID: ", serviceID[1]);
        
        address signer = tryRecover(hash, yParity, r, s);
        require(signer != address(0), "invalid address");

        console.log("signer: ");
        console.log(signer);

        require(email.to == "gordi2015ferrai@gmail.com", "the email does not have the expected receiver");

        // string[] memory captures = email.from.capture("^[\\w.-]+@([a-zA-Z\\d.-]+\\.[a-zA-Z]{2,})$");
        // require(captures.length == 2, "invalid email domain");
        // require(bytes(captures[1]).length > 0, "invalid email domain");
        
        return (proof(), stringToUint(serviceID[1]), keccak256(abi.encodePacked(email.from, salt)), signer);
    }
}
