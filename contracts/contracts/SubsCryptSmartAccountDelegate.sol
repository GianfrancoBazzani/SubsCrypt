// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "hardhat/console.sol";

contract SubsCryptSmartAccountDelegate {
    // Events
    event FundsPulled(uint256 indexed blockTimestamp, uint256 amount);

    // Errors
    error EmailHashCannotBeZero();
    error OnlyMarketplaceCanPullFunds();
    error AmountMustBeGreaterThanZero();
    error PaymentIntervalNotReached();
    error InsufficientBalance();
    error AccountNotFunded();

    address constant NATIVE_ASSET = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
    address public immutable marketplace;
    bytes32 public emailHash; // Hash of email salt + email address
    uint256 public paymentInterval; // in seconds
    uint256 public servicePrice; // in wei/seconds
    uint256 public lastPullTimestamp;

    constructor() {
        marketplace = msg.sender;
    }

    function initialize(
        bytes32 _emailHash,
        uint256 _paymentInterval,
        uint256 _servicePrice
    ) external {
        require(_emailHash != bytes32(0), EmailHashCannotBeZero());
        emailHash = _emailHash;
        paymentInterval = _paymentInterval;
        servicePrice = _servicePrice;
    }

    function pullFunds(
        address originAssetAddress,
        address destinationAssetAddress,
        uint256 destinationChainId
    ) external {
        require(msg.sender == marketplace, OnlyMarketplaceCanPullFunds());
        require(
            lastPullTimestamp + paymentInterval <= block.timestamp,
            PaymentIntervalNotReached()
        );

        // TODO Implement swap
        require(
            originAssetAddress == destinationAssetAddress,
            "Swap not implemented"
        );
        require(
            block.chainid == destinationChainId,
            "Cross-chain not implemented"
        );

        // First iteration
        uint256 _amount;
        if (lastPullTimestamp == 0) {
            _amount = servicePrice * paymentInterval;
        } else {
            _amount = servicePrice * (block.timestamp - lastPullTimestamp);
        }

        lastPullTimestamp = block.timestamp;

        if (destinationAssetAddress == NATIVE_ASSET) {
            require(address(this).balance >= _amount, InsufficientBalance());
            payable(msg.sender).transfer(_amount);
        } else {
            SafeERC20.safeTransfer(
                IERC20(destinationAssetAddress),
                msg.sender,
                _amount
            );
        }

        // Emit event funds pulled
        emit FundsPulled(block.timestamp, _amount);
    }
}
