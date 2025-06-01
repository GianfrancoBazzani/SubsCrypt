// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {SubsCryptSmartAccountDelegate} from "./SubsCryptSmartAccountDelegate.sol";
import {SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "hardhat/console.sol";

contract SubsCryptMarketplace is Ownable {
    // Types
    struct ServiceOffer {
        address serviceProvider;
        address paymentRecipient;
        address paymentAsset;
        uint256 assetChainId;
        uint256 servicePrice; // in wei/seconds
        uint256 paymentInterval; // seconds
    }

    struct PullFundsParams {
        address account;
        address assetAddress;
        address feeReceiverAddress;
    }

    // Events
    event ServiceRegistered(
        address indexed paymentRecipient,
        uint256 serviceId,
        uint256 servicePrice, // in wei/secons
        uint256 paymentInterval // seconds
    );

    event AccountInitialized(
        uint256 indexed serviceId,
        address indexed account
    );

    // Errors
    error UnauthorizedVerifier();
    error UnauthorizedServiceProvider();
    error InvalidPaymentRecipient();
    error ServiceFeeMustBeGreaterThanZero();
    error ServiceNotRegistered();
    error AccountNotEIP7702Delegated();
    error ServiceRegisteredToThisAccount();

    address constant NATIVE_ASSET = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
    address public immutable verifier;
    address public immutable subsCryptSmartAccountDelegate;

    // State Variables
    uint256 public executionBountyPercentage;
    uint256 public serviceCount;
    mapping(uint256 serviceId => ServiceOffer) public serviceOffers;
    mapping(address account => uint256 serviceId) public accountToServices;

    // Modifiers
    modifier onlyVerifier() {
        require(msg.sender == verifier, UnauthorizedVerifier());
        _;
    }

    constructor(
        address _owner,
        uint256 _executionBountyPercentage,
        address _verifier
    ) Ownable(_owner) {
        executionBountyPercentage = _executionBountyPercentage;
        verifier = _verifier;
        subsCryptSmartAccountDelegate = address(
            new SubsCryptSmartAccountDelegate()
        );
    }

    // Service provider marketplace functions
    function registerService(ServiceOffer memory serviceOffer) external {
        require(
            serviceOffer.serviceProvider == msg.sender,
            UnauthorizedServiceProvider()
        );
        require(
            serviceOffer.paymentRecipient != address(0),
            InvalidPaymentRecipient()
        );
        require(
            serviceOffer.servicePrice > 0,
            ServiceFeeMustBeGreaterThanZero()
        );

        serviceCount++;
        serviceOffers[serviceCount] = serviceOffer;

        emit ServiceRegistered(
            serviceOffer.paymentRecipient,
            serviceCount,
            serviceOffer.servicePrice,
            serviceOffer.paymentInterval
        );
    }

    function unregisterService(uint256 Id) external {
        ServiceOffer storage serviceOffer = serviceOffers[Id];
        require(
            serviceOffer.serviceProvider == msg.sender,
            UnauthorizedServiceProvider()
        );
        require(
            serviceOffer.paymentRecipient != address(0),
            ServiceNotRegistered()
        );
        delete serviceOffers[Id];
    }

    // Verifier functions
    function initializeAccount(
        uint256 Id,
        address account,
        bytes32 emailHash
    ) external onlyVerifier {
        ServiceOffer storage serviceOffer = serviceOffers[Id];
        require(
            serviceOffer.paymentRecipient != address(0),
            ServiceNotRegistered()
        );
        require(
            keccak256(account.code) ==
                keccak256(
                    abi.encodePacked(hex"ef0100", subsCryptSmartAccountDelegate)
                ),
            AccountNotEIP7702Delegated()
        );

        SubsCryptSmartAccountDelegate(account).initialize(
            emailHash,
            serviceOffer.paymentInterval,
            serviceOffer.servicePrice
        );
        accountToServices[account] = Id;

        emit AccountInitialized(Id, account);
    }

    // Payment trigger logic
    function batchExecutePayments(
        PullFundsParams[] memory paramsArray
    ) external {
        for (uint256 i = 0; i < paramsArray.length; i++) {
            PullFundsParams memory params = paramsArray[i];
            uint256 serviceId = accountToServices[params.account];
            require(serviceId != 0, ServiceRegisteredToThisAccount());
            _executePayment(params, serviceId);
        }
    }
    function _executePayment(
        PullFundsParams memory params,
        uint256 serviceId
    ) internal {
        ServiceOffer storage serviceOffer = serviceOffers[serviceId];
        require(
            serviceOffer.paymentRecipient != address(0),
            ServiceNotRegistered()
        );

        uint256 balanceBefore;
        if (serviceOffer.paymentAsset == NATIVE_ASSET) {
            balanceBefore = address(this).balance;
        } else {
            balanceBefore = IERC20(serviceOffer.paymentAsset).balanceOf(
                address(this)
            );
        }

        SubsCryptSmartAccountDelegate(params.account).pullFunds(
            params.assetAddress,
            serviceOffer.paymentAsset,
            serviceOffer.assetChainId
        );

        uint256 balanceAfter;
        if (serviceOffer.paymentAsset == NATIVE_ASSET) {
            balanceAfter = address(this).balance;
        } else {
            balanceAfter = IERC20(serviceOffer.paymentAsset).balanceOf(
                address(this)
            );
        }

        uint256 amountPaid = balanceAfter - balanceBefore;
        uint256 amountToTransfer = (amountPaid *
            (100_000 - executionBountyPercentage)) / 100_000;
        uint256 feeAmount = (amountPaid * executionBountyPercentage) / 100_000;

        if (serviceOffer.paymentAsset == NATIVE_ASSET) {
            payable(serviceOffer.paymentRecipient).transfer(amountToTransfer);
            payable(params.feeReceiverAddress).transfer(feeAmount);
        } else {
            SafeERC20.safeTransfer(
                IERC20(serviceOffer.paymentAsset),
                serviceOffer.paymentRecipient,
                amountToTransfer
            );
            SafeERC20.safeTransfer(
                IERC20(serviceOffer.paymentAsset),
                params.feeReceiverAddress,
                feeAmount
            );
        }
    }

    // View functions
    function isServiceAvailable(uint256 Id) external view returns (bool) {
        return serviceOffers[Id].paymentRecipient != address(0);
    }

    // Owner functions
    function setExecutionBountyPercentage(
        uint256 newPercentage
    ) external onlyOwner {
        executionBountyPercentage = newPercentage;
    }

    receive() external payable {}
}
