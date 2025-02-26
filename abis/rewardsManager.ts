export const rewardsManagerAbi = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, {
  "inputs": [],
  "name": "AccessControlBadConfirmation",
  "type": "error",
}, {
  "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, {
    "internalType": "bytes32",
    "name": "neededRole",
    "type": "bytes32",
  }], "name": "AccessControlUnauthorizedAccount", "type": "error",
}, {
  "inputs": [{ "internalType": "address", "name": "target", "type": "address" }],
  "name": "AddressEmptyCode",
  "type": "error",
}, {
  "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
  "name": "AddressInsufficientBalance",
  "type": "error",
}, {
  "inputs": [{ "internalType": "address", "name": "implementation", "type": "address" }],
  "name": "ERC1967InvalidImplementation",
  "type": "error",
}, { "inputs": [], "name": "ERC1967NonPayable", "type": "error" }, {
  "inputs": [],
  "name": "FailedInnerCall",
  "type": "error",
}, { "inputs": [], "name": "InvalidInitialization", "type": "error" }, {
  "inputs": [],
  "name": "NotInitializing",
  "type": "error",
}, {
  "inputs": [{ "internalType": "address", "name": "token", "type": "address" }],
  "name": "SafeERC20FailedOperation",
  "type": "error",
}, { "inputs": [], "name": "UUPSUnauthorizedCallContext", "type": "error" }, {
  "inputs": [{
    "internalType": "bytes32",
    "name": "slot",
    "type": "bytes32",
  }], "name": "UUPSUnsupportedProxiableUUID", "type": "error",
}, {
  "anonymous": false,
  "inputs": [{ "indexed": false, "internalType": "uint64", "name": "version", "type": "uint64" }],
  "name": "Initialized",
  "type": "event",
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": false,
    "internalType": "uint256",
    "name": "oldInvitePrice",
    "type": "uint256",
  }, { "indexed": false, "internalType": "uint256", "name": "invitePrice", "type": "uint256" }],
  "name": "InvitePriceUpdated",
  "type": "event",
}, {
  "anonymous": false,
  "inputs": [{ "indexed": false, "internalType": "address", "name": "from", "type": "address" }, {
    "indexed": false,
    "internalType": "address",
    "name": "to",
    "type": "address",
  }, { "indexed": false, "internalType": "uint256", "name": "count", "type": "uint256" }],
  "name": "RewardInviteClaimed",
  "type": "event",
}, {
  "anonymous": false,
  "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, {
    "indexed": true,
    "internalType": "bytes32",
    "name": "previousAdminRole",
    "type": "bytes32",
  }, { "indexed": true, "internalType": "bytes32", "name": "newAdminRole", "type": "bytes32" }],
  "name": "RoleAdminChanged",
  "type": "event",
}, {
  "anonymous": false,
  "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, {
    "indexed": true,
    "internalType": "address",
    "name": "account",
    "type": "address",
  }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" }],
  "name": "RoleGranted",
  "type": "event",
}, {
  "anonymous": false,
  "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, {
    "indexed": true,
    "internalType": "address",
    "name": "account",
    "type": "address",
  }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" }],
  "name": "RoleRevoked",
  "type": "event",
}, {
  "anonymous": false,
  "inputs": [{ "indexed": false, "internalType": "address", "name": "from", "type": "address" }, {
    "indexed": false,
    "internalType": "address",
    "name": "to",
    "type": "address",
  }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "amountToRepay",
    "type": "uint256",
  }],
  "name": "StatementCreditClaimed",
  "type": "event",
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": false,
    "internalType": "uint256",
    "name": "oldUnionPer",
    "type": "uint256",
  }, { "indexed": false, "internalType": "uint256", "name": "unionPer", "type": "uint256" }],
  "name": "UnionPerUpdated",
  "type": "event",
}, {
  "anonymous": false,
  "inputs": [{ "indexed": true, "internalType": "address", "name": "implementation", "type": "address" }],
  "name": "Upgraded",
  "type": "event",
}, {
  "inputs": [],
  "name": "AUTH_ROLE",
  "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
  "stateMutability": "view",
  "type": "function",
}, {
  "inputs": [],
  "name": "DEFAULT_ADMIN_ROLE",
  "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
  "stateMutability": "view",
  "type": "function",
}, {
  "inputs": [],
  "name": "UPGRADE_INTERFACE_VERSION",
  "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
  "stateMutability": "view",
  "type": "function",
}, {
  "inputs": [],
  "name": "assetToken",
  "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
  "stateMutability": "view",
  "type": "function",
}, {
  "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }, {
    "internalType": "address",
    "name": "to",
    "type": "address",
  }, { "internalType": "address", "name": "clubPlugin", "type": "address" }],
  "name": "claimRewardInvite",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function",
}, {
  "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }, {
    "internalType": "address",
    "name": "to",
    "type": "address",
  }, { "internalType": "address", "name": "clubPlugin", "type": "address" }],
  "name": "claimStatementCredit",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function",
}, {
  "inputs": [{ "internalType": "address", "name": "token", "type": "address" }, {
    "internalType": "address",
    "name": "to",
    "type": "address",
  }, { "internalType": "uint256", "name": "amount", "type": "uint256" }],
  "name": "claimToken",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function",
}, {
  "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }],
  "name": "getRoleAdmin",
  "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
  "stateMutability": "view",
  "type": "function",
}, {
  "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, {
    "internalType": "address",
    "name": "account",
    "type": "address",
  }], "name": "grantRole", "outputs": [], "stateMutability": "nonpayable", "type": "function",
}, {
  "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, {
    "internalType": "address",
    "name": "account",
    "type": "address",
  }],
  "name": "hasRole",
  "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
  "stateMutability": "view",
  "type": "function",
}, {
  "inputs": [{ "internalType": "address", "name": "_auth", "type": "address" }, {
    "internalType": "address",
    "name": "_unionToken",
    "type": "address",
  }, { "internalType": "address", "name": "_uToken", "type": "address" }, {
    "internalType": "address",
    "name": "_assetToken",
    "type": "address",
  }, { "internalType": "uint256", "name": "_invitePrice", "type": "uint256" }, {
    "internalType": "uint256",
    "name": "_unionPer",
    "type": "uint256",
  }], "name": "initialize", "outputs": [], "stateMutability": "nonpayable", "type": "function",
}, {
  "inputs": [],
  "name": "invitePrice",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function",
}, {
  "inputs": [],
  "name": "proxiableUUID",
  "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
  "stateMutability": "view",
  "type": "function",
}, {
  "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, {
    "internalType": "address",
    "name": "callerConfirmation",
    "type": "address",
  }], "name": "renounceRole", "outputs": [], "stateMutability": "nonpayable", "type": "function",
}, {
  "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, {
    "internalType": "address",
    "name": "account",
    "type": "address",
  }], "name": "revokeRole", "outputs": [], "stateMutability": "nonpayable", "type": "function",
}, {
  "inputs": [{ "internalType": "uint256", "name": "_invitePrice", "type": "uint256" }],
  "name": "setInvitePrice",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function",
}, {
  "inputs": [{ "internalType": "uint256", "name": "_unionPer", "type": "uint256" }],
  "name": "setStatementCreditPrice",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function",
}, {
  "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }],
  "name": "supportsInterface",
  "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
  "stateMutability": "view",
  "type": "function",
}, {
  "inputs": [],
  "name": "uToken",
  "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
  "stateMutability": "view",
  "type": "function",
}, {
  "inputs": [],
  "name": "unionPer",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function",
}, {
  "inputs": [],
  "name": "unionToken",
  "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
  "stateMutability": "view",
  "type": "function",
}, {
  "inputs": [{
    "internalType": "address",
    "name": "newImplementation",
    "type": "address",
  }, { "internalType": "bytes", "name": "data", "type": "bytes" }],
  "name": "upgradeToAndCall",
  "outputs": [],
  "stateMutability": "payable",
  "type": "function",
}] as const;