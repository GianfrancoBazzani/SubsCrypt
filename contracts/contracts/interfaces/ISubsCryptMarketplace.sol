// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title SubsCrypt Marketplace Interface
/// @notice Interface for the SubsCrypt Marketplace contract handling service registration, account initialization, and payment execution.
/// @dev Defines core functions, events, and view methods for interacting with the marketplace.
interface ISubsCryptMarketplace {
    /*//////////////////////////////////////////////////////////////////////////
                                  STRUCTS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Represents the details of a service offer.
    /// @param serviceProvider The address of the service provider.
    /// @param paymentRecipient The address designated to receive payments.
    /// @param paymentAsset The asset used for payment (native or ERC20).
    /// @param assetChainId The chain ID where the payment asset is valid.
    /// @param servicePrice The price of the service expressed in wei per second.
    /// @param paymentInterval The interval, in seconds, determining when payments occur.
    struct ServiceOffer {
        address serviceProvider;
        address paymentRecipient;
        address paymentAsset;
        uint256 assetChainId;
        uint256 servicePrice;
        uint256 paymentInterval;
    }

    /// @notice Contains parameters required to pull funds and process a payment.
    /// @param account The smart account delegate address.
    /// @param assetAddress The address of the asset to pull funds from.
    /// @param feeReceiverAddress The address designated to receive the execution fee.
    struct PullFundsParams {
        address account;
        address assetAddress;
        address feeReceiverAddress;
    }

    /*//////////////////////////////////////////////////////////////////////////
                                  EVENTS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Emitted when a new service is registered.
    /// @param paymentRecipient The address set to receive payments.
    /// @param serviceId The unique identifier of the registered service.
    /// @param servicePrice The service price in wei per second.
    /// @param paymentInterval The interval in seconds for payment execution.
    event ServiceRegistered(
        address indexed paymentRecipient,
        uint256 serviceId,
        uint256 servicePrice,
        uint256 paymentInterval
    );

    /// @notice Emitted when a smart account delegate is successfully initialized.
    /// @param serviceId The identifier of the service associated with the account.
    /// @param account The smart account delegate address that was initialized.
    event AccountInitialized(
        uint256 indexed serviceId,
        address indexed account
    );

    /*//////////////////////////////////////////////////////////////////////////
                              EXTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Registers a new service offer.
    /// @dev The caller must be the service provider specified in the offer.
    /// @param serviceOffer The service offer details.
    function registerService(ServiceOffer calldata serviceOffer) external;

    /// @notice Unregisters an existing service offer.
    /// @dev The caller must be the service provider that originally registered the service.
    /// @param id The unique identifier of the service to be unregistered.
    function unregisterService(uint256 id) external;

    /// @notice Initializes a smart account delegate for a given service.
    /// @dev Can only be called by the designated verifier.
    /// @param id The identifier of the service offer.
    /// @param account The smart account delegate address to initialize.
    /// @param emailHash A hash derived from the user's email and salt.
    function initializeAccount(
        uint256 id,
        address account,
        bytes32 emailHash
    ) external;

    /// @notice Executes batch payments for multiple accounts.
    /// @param paramsArray An array containing payment parameters for each account.
    function batchExecutePayments(PullFundsParams[] calldata paramsArray) external;

    /// @notice Sets a new execution bounty percentage.
    /// @dev Only callable by the contract owner.
    /// @param newPercentage The new bounty percentage.
    function setExecutionBountyPercentage(uint256 newPercentage) external;

    /*//////////////////////////////////////////////////////////////////////////
                              VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @notice Checks whether a service offer is currently available.
    /// @param id The unique identifier of the service offer.
    /// @return True if the service offer is active; otherwise, false.
    function isServiceAvailable(uint256 id) external view returns (bool);

    /// @notice Returns the address of the designated verifier.
    /// @return The verifier address.
    function verifier() external view returns (address);

    /// @notice Returns the address of the SubsCrypt Smart Account Delegate.
    /// @return The smart account delegate address.
    function subsCryptSmartAccountDelegate() external view returns (address);

    /// @notice Returns the current execution bounty percentage.
    /// @return The execution bounty percentage.
    function executionBountyPercentage() external view returns (uint256);

    /// @notice Returns the total number of registered services.
    /// @return The count of services.
    function serviceCount() external view returns (uint256);

    /// @notice Retrieves details of a specific service offer.
    /// @param serviceId The unique identifier of the service.
    /// @return serviceProvider The address of the service provider.
    /// @return paymentRecipient The address designated to receive payments.
    /// @return paymentAsset The asset used for payments.
    /// @return assetChainId The chain ID where the payment asset is valid.
    /// @return servicePrice The service price in wei per second.
    /// @return paymentInterval The interval in seconds for payment execution.
    function serviceOffers(uint256 serviceId)
        external
        view
        returns (
            address serviceProvider,
            address paymentRecipient,
            address paymentAsset,
            uint256 assetChainId,
            uint256 servicePrice,
            uint256 paymentInterval
        );

    /// @notice Returns the service ID associated with a specific smart account delegate.
    /// @param account The smart account delegate address.
    /// @return The service ID linked to the account.
    function accountToServices(address account) external view returns (uint256);
}
