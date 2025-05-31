// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import {console} from "forge-std/console.sol";
import {Strings} from "@openzeppelin-contracts-5.0.1/utils/Strings.sol";
import {Proof} from "vlayer-0.1.0/Proof.sol";
import {Prover} from "vlayer-0.1.0/Prover.sol";
import {RegexLib} from "vlayer-0.1.0/Regex.sol";
import {VerifiedEmail, UnverifiedEmail, EmailProofLib} from "vlayer-0.1.0/EmailProof.sol";

contract EmailDomainProver is Prover {
    using RegexLib for string;
    using Strings for string;
    using EmailProofLib for UnverifiedEmail;

    // Función para obtener el contenido entre __AUTHORIZATION__ delimitadores
    function getAuthorizationContent(string memory input) public pure returns (string memory) {
        bytes memory inputBytes = bytes(input);
        bytes memory startDelimiter = bytes("__AUTHORIZATION__");
        bytes memory endDelimiter = bytes("__AUTHORIZATION__");

        uint256 startIdx = 0;
        uint256 endIdx = 0;
        bool foundStart = false;

        // Buscar el primer delimitador __AUTHORIZATION__
        for (uint256 i = 0; i < inputBytes.length - startDelimiter.length + 1; i++) {
            bool matchStart = true;

            for (uint256 j = 0; j < startDelimiter.length; j++) {
                if (inputBytes[i + j] != startDelimiter[j]) {
                    matchStart = false;
                    break;
                }
            }

            if (matchStart) {
                startIdx = i + startDelimiter.length;
                foundStart = true;
                break;
            }
        }

        // Si encontramos el inicio, buscar el segundo delimitador __AUTHORIZATION__
        if (foundStart) {
            for (uint256 i = startIdx; i < inputBytes.length - endDelimiter.length + 1; i++) {
                bool matchEnd = true;

                for (uint256 j = 0; j < endDelimiter.length; j++) {
                    if (inputBytes[i + j] != endDelimiter[j]) {
                        matchEnd = false;
                        break;
                    }
                }

                if (matchEnd) {
                    endIdx = i;
                    break;
                }
            }
        }

        // Si encontramos ambos delimitadores, extraemos el contenido entre ellos
        require(startIdx < endIdx, "Delimitadores no encontrados correctamente");

        bytes memory resultBytes = new bytes(endIdx - startIdx);
        for (uint256 i = 0; i < resultBytes.length; i++) {
            resultBytes[i] = inputBytes[startIdx + i];
        }

        return string(resultBytes);
    }

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

    function main(UnverifiedEmail calldata unverifiedEmail)
        public
        // view
        returns (string memory authResult)
        // returns (Proof memory, bytes32, address, string memory)
    {
        VerifiedEmail memory email = unverifiedEmail.verify();

        // extract for service id
        string[] memory serviceID = email.subject.capture("^.*serviceID: ([0-9]+).*$");
        require(serviceID.length >= 2, "no serviceID in subject");
        console.log("serviceID: ", serviceID[1]);
        
        // string[] memory auth = email.body.capture("(?<=__AUTHORIZATION__)(.*?)(?=__AUTHORIZATION__)");
        // require(auth.length > 0, "no Auth founded");
        
        //string[] memory auth = email.body.capture("^.*__AUTHORIZATION__(.*?)__AUTHORIZATION__.*$");
        //require(auth.length >= 2, "no Auth found");
        //console.log("Authorization: ", auth[1]);

        string memory auth = getAuthorizationContent(email.body);
        console.log("Authorization: ", auth);
        
        authResult = auth;
      
        // string[] memory captures = email.from.capture("^[\\w.-]+@([a-zA-Z\\d.-]+\\.[a-zA-Z]{2,})$");
        // require(captures.length == 2, "invalid email domain");
        // require(bytes(captures[1]).length > 0, "invalid email domain");
        //
        // return (proof(), sha256(abi.encodePacked(email.from)), targetWallet, captures[1]);
    }
}
