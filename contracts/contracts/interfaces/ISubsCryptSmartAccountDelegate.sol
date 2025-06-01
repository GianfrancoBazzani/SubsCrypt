// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

/// @title ISubsCryptSmartAccountDelegate
/// @notice Interface for the SubsCrypt Smart Account Delegate contract.
/// @dev Defines the methods and events for initializing and pulling funds from a smart account.
interface ISubsCryptSmartAccountDelegate {
    /// @notice Emitted when funds are successfully pulled.
    /// @param blockTimestamp The block timestamp when the funds were pulled.
    /// @param amount The amount of funds pulled.
    event FundsPulled(uint256 indexed blockTimestamp, uint256 amount);

    /// @notice Returns the address of the marketplace that deployed this delegate.
    /// @return The marketplace address.
    function marketplace() external view returns (address);

    /// @notice Returns the email hash associated with this smart account delegate.
    /// @return The email hash.
    function emailHash() external view returns (bytes32);

    /// @notice Returns the payment interval in seconds during which funds can be pulled.
    /// @return The payment interval.
    function paymentInterval() external view returns (uint256);

    /// @notice Returns the service price in wei per second.
    /// @return The service price.
    function servicePrice() external view returns (uint256);

    /// @notice Returns the timestamp of the last successful fund pull.
    /// @return The last pull timestamp.
    function lastPullTimestamp() external view returns (uint256);

    /// @notice Initializes the smart account delegate with configuration parameters.
    /// @param _emailHash The hash derived from the user's email and salt.
    /// @param _paymentInterval The interval, in seconds, that defines when funds can be pulled.
    /// @param _servicePrice The service price expressed in wei per second.
    function initialize(
        bytes32 _emailHash,
        uint256 _paymentInterval,
        uint256 _servicePrice
    ) external;

    /// @notice Pulls funds from the smart account delegate.
    /// @dev Can only be called by the designated marketplace. Handles calculation of the pull amount based on elapsed time.
    /// @param originAssetAddress The address of the asset to pull funds from.
    /// @param destinationAssetAddress The address of the asset to which funds will be transferred.
    /// @param destinationChainId The chain ID of the destination blockchain.
    function pullFunds(
        address originAssetAddress,
        address destinationAssetAddress,
        uint256 destinationChainId
    ) external;
}
