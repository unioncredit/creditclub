export const creditVaultAbi = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, {
  "inputs": [],
  "name": "AccessControlError",
  "type": "error"
}, {
  "inputs": [{ "internalType": "address", "name": "target", "type": "address" }],
  "name": "AddressEmptyCode",
  "type": "error"
}, { "inputs": [], "name": "AlreadyActivated", "type": "error" }, {
  "inputs": [],
  "name": "AlreadyInInvitedList",
  "type": "error"
}, { "inputs": [], "name": "AlreadyInitialized", "type": "error" }, {
  "inputs": [],
  "name": "AmountIsZero",
  "type": "error"
}, { "inputs": [], "name": "BelowMinStake", "type": "error" }, {
  "inputs": [],
  "name": "CallTooEarly",
  "type": "error"
}, {
  "inputs": [{ "internalType": "address", "name": "implementation", "type": "address" }],
  "name": "ERC1967InvalidImplementation",
  "type": "error"
}, { "inputs": [], "name": "ERC1967NonPayable", "type": "error" }, {
  "inputs": [{
    "internalType": "address",
    "name": "spender",
    "type": "address"
  }, { "internalType": "uint256", "name": "allowance", "type": "uint256" }, {
    "internalType": "uint256",
    "name": "needed",
    "type": "uint256"
  }], "name": "ERC20InsufficientAllowance", "type": "error"
}, {
  "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, {
    "internalType": "uint256",
    "name": "balance",
    "type": "uint256"
  }, { "internalType": "uint256", "name": "needed", "type": "uint256" }],
  "name": "ERC20InsufficientBalance",
  "type": "error"
}, {
  "inputs": [{ "internalType": "address", "name": "approver", "type": "address" }],
  "name": "ERC20InvalidApprover",
  "type": "error"
}, {
  "inputs": [{ "internalType": "address", "name": "receiver", "type": "address" }],
  "name": "ERC20InvalidReceiver",
  "type": "error"
}, {
  "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }],
  "name": "ERC20InvalidSender",
  "type": "error"
}, {
  "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }],
  "name": "ERC20InvalidSpender",
  "type": "error"
}, {
  "inputs": [{ "internalType": "address", "name": "receiver", "type": "address" }, {
    "internalType": "uint256",
    "name": "assets",
    "type": "uint256"
  }, { "internalType": "uint256", "name": "max", "type": "uint256" }],
  "name": "ERC4626ExceededMaxDeposit",
  "type": "error"
}, {
  "inputs": [{ "internalType": "address", "name": "receiver", "type": "address" }, {
    "internalType": "uint256",
    "name": "shares",
    "type": "uint256"
  }, { "internalType": "uint256", "name": "max", "type": "uint256" }], "name": "ERC4626ExceededMaxMint", "type": "error"
}, {
  "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, {
    "internalType": "uint256",
    "name": "shares",
    "type": "uint256"
  }, { "internalType": "uint256", "name": "max", "type": "uint256" }],
  "name": "ERC4626ExceededMaxRedeem",
  "type": "error"
}, {
  "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, {
    "internalType": "uint256",
    "name": "assets",
    "type": "uint256"
  }, { "internalType": "uint256", "name": "max", "type": "uint256" }],
  "name": "ERC4626ExceededMaxWithdraw",
  "type": "error"
}, { "inputs": [], "name": "ExceedsMaxStake", "type": "error" }, {
  "inputs": [],
  "name": "FailedCall",
  "type": "error"
}, { "inputs": [], "name": "InsufficientBalance", "type": "error" }, {
  "inputs": [],
  "name": "InvalidAddress",
  "type": "error"
}, { "inputs": [], "name": "InvalidCooldownPeriod", "type": "error" }, {
  "inputs": [],
  "name": "InvalidCostParameter",
  "type": "error"
}, { "inputs": [], "name": "InvalidGracePeriod", "type": "error" }, {
  "inputs": [],
  "name": "InvalidInitialization",
  "type": "error"
}, { "inputs": [], "name": "InvalidLiquidityPercent", "type": "error" }, {
  "inputs": [],
  "name": "InvalidPercentParameter",
  "type": "error"
}, { "inputs": [], "name": "InvalidRewardManager", "type": "error" }, {
  "inputs": [],
  "name": "InvalidStartingPercentTrust",
  "type": "error"
}, { "inputs": [], "name": "InvalidState", "type": "error" }, {
  "inputs": [],
  "name": "InvalidTrusteeAddress",
  "type": "error"
}, { "inputs": [], "name": "InvalidVestingDuration", "type": "error" }, {
  "inputs": [],
  "name": "LockupPeriodNotEnded",
  "type": "error"
}, { "inputs": [], "name": "LockupPeriodTooLong", "type": "error" }, {
  "inputs": [],
  "name": "NewOwnerIsZeroAddress",
  "type": "error"
}, { "inputs": [], "name": "NoDepositWhenActive", "type": "error" }, {
  "inputs": [],
  "name": "NoGatingToken",
  "type": "error"
}, { "inputs": [], "name": "NoHandoverRequest", "type": "error" }, {
  "inputs": [],
  "name": "NoInviteCount",
  "type": "error"
}, { "inputs": [], "name": "NoPublicInvite", "type": "error" }, {
  "inputs": [],
  "name": "NotEnoughFee",
  "type": "error"
}, { "inputs": [], "name": "NotInitializing", "type": "error" }, {
  "inputs": [],
  "name": "NotInvited",
  "type": "error"
}, { "inputs": [], "name": "RaiseNotOpen", "type": "error" }, {
  "inputs": [],
  "name": "RaiseNotReached",
  "type": "error"
}, { "inputs": [], "name": "RecipientIsOverdue", "type": "error" }, {
  "inputs": [],
  "name": "ReentrancyGuardReentrantCall",
  "type": "error"
}, {
  "inputs": [{ "internalType": "address", "name": "token", "type": "address" }],
  "name": "SafeERC20FailedOperation",
  "type": "error"
}, { "inputs": [], "name": "SenderHasBadDebt", "type": "error" }, {
  "inputs": [],
  "name": "SenderIsOverdue",
  "type": "error"
}, { "inputs": [], "name": "SenderNotActive", "type": "error" }, {
  "inputs": [],
  "name": "SoulBoundNft",
  "type": "error"
}, { "inputs": [], "name": "TooManyTrustees", "type": "error" }, {
  "inputs": [],
  "name": "TrustAmountMustBeGreaterThanZero",
  "type": "error"
}, { "inputs": [], "name": "TrusteeAmountTooLarge", "type": "error" }, {
  "inputs": [],
  "name": "UUPSUnauthorizedCallContext",
  "type": "error"
}, {
  "inputs": [{ "internalType": "bytes32", "name": "slot", "type": "bytes32" }],
  "name": "UUPSUnsupportedProxiableUUID",
  "type": "error"
}, { "inputs": [], "name": "Unauthorized", "type": "error" }, {
  "anonymous": false,
  "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, {
    "indexed": true,
    "internalType": "address",
    "name": "spender",
    "type": "address"
  }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }],
  "name": "Approval",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{ "indexed": true, "internalType": "address", "name": "account", "type": "address" }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "tokenId",
    "type": "uint256"
  }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }],
  "name": "BadDebtCleared",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{ "indexed": false, "internalType": "address", "name": "bidder", "type": "address" }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "bidPrice",
    "type": "uint256"
  }, { "indexed": false, "internalType": "uint256", "name": "amountToBidder", "type": "uint256" }],
  "name": "BidPlaced",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": false,
    "internalType": "uint32",
    "name": "oldCooldown",
    "type": "uint32"
  }, { "indexed": false, "internalType": "uint32", "name": "newCooldown", "type": "uint32" }],
  "name": "CooldownUpdated",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{ "indexed": false, "internalType": "uint256", "name": "oldCost", "type": "uint256" }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "newCost",
    "type": "uint256"
  }],
  "name": "CostToCallUpdated",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{ "indexed": false, "internalType": "uint256", "name": "oldCost", "type": "uint256" }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "newCost",
    "type": "uint256"
  }],
  "name": "CostToMintUpdated",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{ "indexed": true, "internalType": "address", "name": "account", "type": "address" }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "trustAmount",
    "type": "uint256"
  }],
  "name": "CreditClaimed",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{ "indexed": true, "internalType": "address", "name": "sender", "type": "address" }, {
    "indexed": true,
    "internalType": "address",
    "name": "owner",
    "type": "address"
  }, { "indexed": false, "internalType": "uint256", "name": "assets", "type": "uint256" }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "shares",
    "type": "uint256"
  }],
  "name": "Deposit",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": false,
    "internalType": "uint256",
    "name": "adminAmount",
    "type": "uint256"
  }, { "indexed": false, "internalType": "uint256", "name": "creatorAmount", "type": "uint256" }],
  "name": "FeesDistributed",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{ "indexed": false, "internalType": "uint256", "name": "oldPrice", "type": "uint256" }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "newPrice",
    "type": "uint256"
  }],
  "name": "FixedBidPriceUpdated",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": false,
    "internalType": "address",
    "name": "oldGatingToken",
    "type": "address"
  }, { "indexed": false, "internalType": "address", "name": "newGatingToken", "type": "address" }, {
    "indexed": false,
    "internalType": "enum TokenType",
    "name": "tokenType",
    "type": "uint8"
  }],
  "name": "GatingTokenUpdated",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": false,
    "internalType": "uint256",
    "name": "oldPeriod",
    "type": "uint256"
  }, { "indexed": false, "internalType": "uint256", "name": "newPeriod", "type": "uint256" }],
  "name": "GracePeriodUpdated",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": false,
    "internalType": "uint256",
    "name": "oldInitialRaise",
    "type": "uint256"
  }, { "indexed": false, "internalType": "uint256", "name": "initialRaise", "type": "uint256" }],
  "name": "InitialRaiseUpdated",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{ "indexed": false, "internalType": "uint64", "name": "version", "type": "uint64" }],
  "name": "Initialized",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{ "indexed": false, "internalType": "address", "name": "member", "type": "address" }, {
    "indexed": false,
    "internalType": "address",
    "name": "invited",
    "type": "address"
  }],
  "name": "InvitationSent",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{ "indexed": false, "internalType": "uint256", "name": "amount0", "type": "uint256" }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "amount1",
    "type": "uint256"
  }],
  "name": "LPFeesCollected",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{ "indexed": true, "internalType": "address", "name": "member", "type": "address" }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "badDebtAmount",
    "type": "uint256"
  }],
  "name": "MemberRemoved",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": false,
    "internalType": "address",
    "name": "trusteesToUpdate",
    "type": "address"
  }, { "indexed": false, "internalType": "uint256", "name": "amounts", "type": "uint256" }],
  "name": "MemberTrustUpdated",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{ "indexed": true, "internalType": "address", "name": "pendingOwner", "type": "address" }],
  "name": "OwnershipHandoverCanceled",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{ "indexed": true, "internalType": "address", "name": "pendingOwner", "type": "address" }],
  "name": "OwnershipHandoverRequested",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{ "indexed": true, "internalType": "address", "name": "oldOwner", "type": "address" }, {
    "indexed": true,
    "internalType": "address",
    "name": "newOwner",
    "type": "address"
  }],
  "name": "OwnershipTransferred",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{ "indexed": false, "internalType": "uint16", "name": "oldPercent", "type": "uint16" }, {
    "indexed": false,
    "internalType": "uint16",
    "name": "newPercent",
    "type": "uint16"
  }],
  "name": "PercentFundedUpdated",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{ "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }],
  "name": "RaiseOpened",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": false,
    "internalType": "address",
    "name": "oldManager",
    "type": "address"
  }, { "indexed": false, "internalType": "address", "name": "newManager", "type": "address" }],
  "name": "RewardManagerUpdated",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": false,
    "internalType": "uint16",
    "name": "oldCallerPercent",
    "type": "uint16"
  }, { "indexed": false, "internalType": "uint16", "name": "oldWinnerPercent", "type": "uint16" }, {
    "indexed": false,
    "internalType": "uint16",
    "name": "newCallerPercent",
    "type": "uint16"
  }, { "indexed": false, "internalType": "uint16", "name": "newWinnerPercent", "type": "uint16" }],
  "name": "RewardPercentUpdated",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, {
    "indexed": true,
    "internalType": "uint256",
    "name": "roles",
    "type": "uint256"
  }],
  "name": "RolesUpdated",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": false,
    "internalType": "uint256",
    "name": "roundRewards",
    "type": "uint256"
  }, { "indexed": false, "internalType": "address", "name": "winner", "type": "address" }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "amountToWinner",
    "type": "uint256"
  }, { "indexed": false, "internalType": "uint256", "name": "amountToVault", "type": "uint256" }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "checkpoint",
    "type": "uint256"
  }],
  "name": "RoundCompleted",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{ "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }],
  "name": "StakedInUnion",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": false,
    "internalType": "uint256",
    "name": "oldPercent",
    "type": "uint256"
  }, { "indexed": false, "internalType": "uint256", "name": "newPercent", "type": "uint256" }],
  "name": "StartingPercentTrustUpdated",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, {
    "indexed": true,
    "internalType": "address",
    "name": "to",
    "type": "address"
  }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }],
  "name": "Transfer",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{ "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }],
  "name": "UnstakedFromUnion",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{ "indexed": true, "internalType": "address", "name": "implementation", "type": "address" }],
  "name": "Upgraded",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": false,
    "internalType": "uint256",
    "name": "timestamp",
    "type": "uint256"
  }, { "indexed": false, "internalType": "uint256", "name": "initialStake", "type": "uint256" }],
  "name": "VaultActivated",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{ "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }],
  "name": "VaultKilled",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": false,
    "internalType": "uint256",
    "name": "oldDuration",
    "type": "uint256"
  }, { "indexed": false, "internalType": "uint256", "name": "newDuration", "type": "uint256" }],
  "name": "VestingDurationUpdated",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{ "indexed": true, "internalType": "address", "name": "sender", "type": "address" }, {
    "indexed": true,
    "internalType": "address",
    "name": "receiver",
    "type": "address"
  }, { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "assets",
    "type": "uint256"
  }, { "indexed": false, "internalType": "uint256", "name": "shares", "type": "uint256" }],
  "name": "Withdraw",
  "type": "event"
}, {
  "inputs": [],
  "name": "MAX_TRUSTEES",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "OpenRaise",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [],
  "name": "UPGRADE_INTERFACE_VERSION",
  "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "VERSION",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "activate",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [],
  "name": "activationDate",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }, {
    "internalType": "uint8",
    "name": "count",
    "type": "uint8"
  }], "name": "addInvite", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
  "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, {
    "internalType": "address",
    "name": "spender",
    "type": "address"
  }],
  "name": "allowance",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, {
    "internalType": "uint256",
    "name": "value",
    "type": "uint256"
  }],
  "name": "approve",
  "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [],
  "name": "asset",
  "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }, {
    "internalType": "uint256",
    "name": "base",
    "type": "uint256"
  }, { "internalType": "enum ClubTiers.Tier", "name": "tier", "type": "uint8" }, {
    "internalType": "bool",
    "name": "active",
    "type": "bool"
  }],
  "name": "authMint",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
  "name": "balanceOf",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "callerPercent",
  "outputs": [{ "internalType": "uint16", "name": "", "type": "uint16" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "cancelOwnershipHandover",
  "outputs": [],
  "stateMutability": "payable",
  "type": "function"
}, {
  "inputs": [],
  "name": "checkpoint",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }],
  "name": "claimCredit",
  "outputs": [{ "internalType": "uint256", "name": "trustAmount", "type": "uint256" }],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [],
  "name": "claimLPFees",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
  "name": "clearBadDebt",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{ "internalType": "address", "name": "pendingOwner", "type": "address" }],
  "name": "completeOwnershipHandover",
  "outputs": [],
  "stateMutability": "payable",
  "type": "function"
}, {
  "inputs": [{ "internalType": "uint256", "name": "shares", "type": "uint256" }],
  "name": "convertToAssets",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{ "internalType": "uint256", "name": "assets", "type": "uint256" }],
  "name": "convertToShares",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "cooldown",
  "outputs": [{ "internalType": "uint32", "name": "", "type": "uint32" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "costToCall",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "costToMint",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{ "internalType": "uint256", "name": "_tokenId", "type": "uint256" }],
  "name": "currentPercentTrust",
  "outputs": [{ "internalType": "uint256", "name": "percentTrust", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }, {
    "internalType": "uint8",
    "name": "count",
    "type": "uint8"
  }], "name": "decInvite", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
  "inputs": [],
  "name": "decimals",
  "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{ "internalType": "uint256", "name": "_tokenId", "type": "uint256" }],
  "name": "deleteMembership",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{ "internalType": "uint256", "name": "assets", "type": "uint256" }, {
    "internalType": "address",
    "name": "receiver",
    "type": "address"
  }],
  "name": "deposit",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [],
  "name": "distributeFees",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [],
  "name": "feelingLucky",
  "outputs": [],
  "stateMutability": "payable",
  "type": "function"
}, {
  "inputs": [],
  "name": "fixedBid",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [],
  "name": "fixedBidPrice",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "gatingToken",
  "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "gatingTokenType",
  "outputs": [{ "internalType": "enum TokenType", "name": "", "type": "uint8" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "getAvailableBalance",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "getAvailableStakeBalance",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "getSharePrice",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "getStakedBalance",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "gracePeriod",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{ "internalType": "address", "name": "user", "type": "address" }, {
    "internalType": "uint256",
    "name": "roles",
    "type": "uint256"
  }], "name": "grantRoles", "outputs": [], "stateMutability": "payable", "type": "function"
}, {
  "inputs": [{ "internalType": "address", "name": "user", "type": "address" }, {
    "internalType": "uint256",
    "name": "roles",
    "type": "uint256"
  }],
  "name": "hasAllRoles",
  "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{ "internalType": "address", "name": "user", "type": "address" }, {
    "internalType": "uint256",
    "name": "roles",
    "type": "uint256"
  }],
  "name": "hasAnyRole",
  "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "initialRaise",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "components": [{ "internalType": "string", "name": "name", "type": "string" }, {
      "internalType": "string",
      "name": "symbol",
      "type": "string"
    }, { "internalType": "address", "name": "assetToken", "type": "address" }, {
      "internalType": "address",
      "name": "userManager",
      "type": "address"
    }, { "internalType": "address", "name": "uToken", "type": "address" }, {
      "internalType": "address",
      "name": "unionToken",
      "type": "address"
    }, { "internalType": "address", "name": "swapRouter", "type": "address" }, {
      "internalType": "address",
      "name": "positionManager",
      "type": "address"
    }, { "internalType": "address", "name": "memberNFT", "type": "address" }, {
      "internalType": "address",
      "name": "rewardManager",
      "type": "address"
    }, { "internalType": "address", "name": "admin", "type": "address" }, {
      "internalType": "address",
      "name": "auth",
      "type": "address"
    }, { "internalType": "uint256", "name": "initialRaise", "type": "uint256" }, {
      "internalType": "uint256",
      "name": "targetFundSize",
      "type": "uint256"
    }, { "internalType": "uint256", "name": "lockupPeriod", "type": "uint256" }, {
      "internalType": "uint16",
      "name": "liquidityPercent",
      "type": "uint16"
    }, { "internalType": "uint256", "name": "costToCall", "type": "uint256" }, {
      "internalType": "uint256",
      "name": "costToMint",
      "type": "uint256"
    }, { "internalType": "uint256", "name": "fixedBidPrice", "type": "uint256" }, {
      "internalType": "uint32",
      "name": "cooldown",
      "type": "uint32"
    }, { "internalType": "bool", "name": "tierEnabled", "type": "bool" }, {
      "internalType": "bool",
      "name": "inviteEnabled",
      "type": "bool"
    }, { "internalType": "bool", "name": "soulBoundNft", "type": "bool" }, {
      "internalType": "bool",
      "name": "vaultTokenEnabled",
      "type": "bool"
    }, { "internalType": "bytes", "name": "initialInvited", "type": "bytes" }],
    "internalType": "struct CreditVault.InitParams",
    "name": "params",
    "type": "tuple"
  }], "name": "initialize", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
  "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
  "name": "invite",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [],
  "name": "inviteEnabled",
  "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{ "internalType": "address[]", "name": "accounts", "type": "address[]" }],
  "name": "inviteList",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
  "name": "invited",
  "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "isActivated",
  "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "isKilled",
  "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
  "stateMutability": "view",
  "type": "function"
}, { "inputs": [], "name": "kill", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, {
  "inputs": [],
  "name": "liquidityPercent",
  "outputs": [{ "internalType": "uint16", "name": "", "type": "uint16" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "lockupPeriod",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "lpToken",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
  "name": "maxDeposit",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
  "name": "maxMint",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
  "name": "maxRedeem",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "maxStake",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
  "name": "maxWithdraw",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "memberMax",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "memberNFT",
  "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{ "internalType": "uint256", "name": "shares", "type": "uint256" }, {
    "internalType": "address",
    "name": "receiver",
    "type": "address"
  }],
  "name": "mint",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }],
  "name": "mintMemberNFT",
  "outputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [],
  "name": "name",
  "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "openRaise",
  "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "owner",
  "outputs": [{ "internalType": "address", "name": "result", "type": "address" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{ "internalType": "address", "name": "pendingOwner", "type": "address" }],
  "name": "ownershipHandoverExpiresAt",
  "outputs": [{ "internalType": "uint256", "name": "result", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "percentFunded",
  "outputs": [{ "internalType": "uint16", "name": "", "type": "uint16" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{ "internalType": "uint256", "name": "_tokenId", "type": "uint256" }],
  "name": "percentVested",
  "outputs": [{ "internalType": "uint256", "name": "percent", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "positionManager",
  "outputs": [{ "internalType": "contract INonfungiblePositionManager", "name": "", "type": "address" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }],
  "name": "previewCreditClaim",
  "outputs": [{ "internalType": "uint256", "name": "trustAmount", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{ "internalType": "uint256", "name": "assets", "type": "uint256" }],
  "name": "previewDeposit",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{ "internalType": "uint256", "name": "shares", "type": "uint256" }],
  "name": "previewMint",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{ "internalType": "uint256", "name": "shares", "type": "uint256" }],
  "name": "previewRedeem",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{ "internalType": "uint256", "name": "assets", "type": "uint256" }],
  "name": "previewWithdraw",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "proxiableUUID",
  "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "rebalance",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{ "internalType": "uint256", "name": "shares", "type": "uint256" }, {
    "internalType": "address",
    "name": "receiver",
    "type": "address"
  }, { "internalType": "address", "name": "owner", "type": "address" }],
  "name": "redeem",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{ "internalType": "address", "name": "member", "type": "address" }],
  "name": "removeMember",
  "outputs": [{ "internalType": "uint256", "name": "badDebtAmount", "type": "uint256" }],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [],
  "name": "renounceOwnership",
  "outputs": [],
  "stateMutability": "payable",
  "type": "function"
}, {
  "inputs": [{ "internalType": "uint256", "name": "roles", "type": "uint256" }],
  "name": "renounceRoles",
  "outputs": [],
  "stateMutability": "payable",
  "type": "function"
}, {
  "inputs": [],
  "name": "requestOwnershipHandover",
  "outputs": [],
  "stateMutability": "payable",
  "type": "function"
}, {
  "inputs": [{ "internalType": "address", "name": "user", "type": "address" }, {
    "internalType": "uint256",
    "name": "roles",
    "type": "uint256"
  }], "name": "revokeRoles", "outputs": [], "stateMutability": "payable", "type": "function"
}, {
  "inputs": [],
  "name": "rewardManager",
  "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
  "name": "rolesOf",
  "outputs": [{ "internalType": "uint256", "name": "roles", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{ "internalType": "uint256", "name": "_initialRaise", "type": "uint256" }],
  "name": "setInitialRaise",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [],
  "name": "soulBoundNft",
  "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "startingPercentTrust",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "swapRouter",
  "outputs": [{ "internalType": "contract ISwapRouter", "name": "", "type": "address" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "symbol",
  "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "targetFundSize",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "tierEnabled",
  "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "totalAssets",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "totalSupply",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, {
    "internalType": "uint256",
    "name": "value",
    "type": "uint256"
  }],
  "name": "transfer",
  "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, {
    "internalType": "address",
    "name": "to",
    "type": "address"
  }, { "internalType": "uint256", "name": "value", "type": "uint256" }],
  "name": "transferFrom",
  "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }],
  "name": "transferOwnership",
  "outputs": [],
  "stateMutability": "payable",
  "type": "function"
}, {
  "inputs": [],
  "name": "uToken",
  "outputs": [{ "internalType": "contract IUToken", "name": "", "type": "address" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "unionToken",
  "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "newImplementation",
    "type": "address"
  }, { "internalType": "bytes", "name": "data", "type": "bytes" }],
  "name": "upgradeToAndCall",
  "outputs": [],
  "stateMutability": "payable",
  "type": "function"
}, {
  "inputs": [],
  "name": "userManager",
  "outputs": [{ "internalType": "contract IUserManager", "name": "", "type": "address" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, {
    "internalType": "address",
    "name": "to",
    "type": "address"
  }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
  "name": "validateUpdate",
  "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [],
  "name": "vaultTokenEnabled",
  "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "vestingDuration",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "winnerPercent",
  "outputs": [{ "internalType": "uint16", "name": "", "type": "uint16" }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{ "internalType": "uint256", "name": "assets", "type": "uint256" }, {
    "internalType": "address",
    "name": "receiver",
    "type": "address"
  }, { "internalType": "address", "name": "owner", "type": "address" }],
  "name": "withdraw",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "nonpayable",
  "type": "function"
}, { "stateMutability": "payable", "type": "receive" }] as const;