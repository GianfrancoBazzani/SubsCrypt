// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

interface ISubsCryptSmartAccountDelegate {
    // Event declarations
    event FundsPulled(uint256 indexed blockTimestamp, uint256 amount);

    // Public variable getters
    function marketplace() external view returns (address);
    function emailHash() external view returns (bytes32);
    function paymentInterval() external view returns (uint256);
    function servicePrice() external view returns (uint256);
    function lastPullTimestamp() external view returns (uint256);

    // Function declarations
    function initialize(
        bytes32 _emailHash,
        uint256 _paymentInterval,
        uint256 _servicePrice
    ) external;

    function pullFunds(address assetAddress) external;
}
