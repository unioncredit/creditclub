export const clubNftAbi = [{
  "inputs": [{
    "internalType": "address",
    "name": "_plugin",
    "type": "address",
  }, { "internalType": "bytes32", "name": "_root", "type": "bytes32" }, {
    "internalType": "string",
    "name": "_name",
    "type": "string",
  }, { "internalType": "string", "name": "_symbol", "type": "string" }, {
    "internalType": "string",
    "name": "_uri",
    "type": "string",
  }], "stateMutability": "nonpayable", "type": "constructor",
}, { "inputs": [], "name": "AccessControlBadConfirmation", "type": "error" }, {
  "inputs": [{
    "internalType": "address",
    "name": "account",
    "type": "address",
  }, { "internalType": "bytes32", "name": "neededRole", "type": "bytes32" }],
  "name": "AccessControlUnauthorizedAccount",
  "type": "error",
}, {
  "inputs": [],
  "name": "ERC721EnumerableForbiddenBatchMint",
  "type": "error",
}, {
  "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, {
    "internalType": "uint256",
    "name": "tokenId",
    "type": "uint256",
  }, { "internalType": "address", "name": "owner", "type": "address" }],
  "name": "ERC721IncorrectOwner",
  "type": "error",
}, {
  "inputs": [{ "internalType": "address", "name": "operator", "type": "address" }, {
    "internalType": "uint256",
    "name": "tokenId",
    "type": "uint256",
  }], "name": "ERC721InsufficientApproval", "type": "error",
}, {
  "inputs": [{ "internalType": "address", "name": "approver", "type": "address" }],
  "name": "ERC721InvalidApprover",
  "type": "error",
}, {
  "inputs": [{ "internalType": "address", "name": "operator", "type": "address" }],
  "name": "ERC721InvalidOperator",
  "type": "error",
}, {
  "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
  "name": "ERC721InvalidOwner",
  "type": "error",
}, {
  "inputs": [{ "internalType": "address", "name": "receiver", "type": "address" }],
  "name": "ERC721InvalidReceiver",
  "type": "error",
}, {
  "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }],
  "name": "ERC721InvalidSender",
  "type": "error",
}, {
  "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
  "name": "ERC721NonexistentToken",
  "type": "error",
}, {
  "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, {
    "internalType": "uint256",
    "name": "index",
    "type": "uint256",
  }], "name": "ERC721OutOfBoundsIndex", "type": "error",
}, {
  "anonymous": false,
  "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, {
    "indexed": true,
    "internalType": "address",
    "name": "approved",
    "type": "address",
  }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
  "name": "Approval",
  "type": "event",
}, {
  "anonymous": false,
  "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, {
    "indexed": true,
    "internalType": "address",
    "name": "operator",
    "type": "address",
  }, { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" }],
  "name": "ApprovalForAll",
  "type": "event",
}, {
  "anonymous": false,
  "inputs": [{ "indexed": false, "internalType": "string", "name": "oldName", "type": "string" }, {
    "indexed": false,
    "internalType": "string",
    "name": "newName",
    "type": "string",
  }],
  "name": "NameUpdated",
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
  "inputs": [{ "indexed": false, "internalType": "string", "name": "oldSymbol", "type": "string" }, {
    "indexed": false,
    "internalType": "string",
    "name": "newSymbol",
    "type": "string",
  }],
  "name": "SymbolUpdated",
  "type": "event",
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": false,
    "internalType": "string",
    "name": "oldTokenURI",
    "type": "string",
  }, { "indexed": false, "internalType": "string", "name": "newTokenURI", "type": "string" }],
  "name": "TokenURIUpdated",
  "type": "event",
}, {
  "anonymous": false,
  "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, {
    "indexed": true,
    "internalType": "address",
    "name": "to",
    "type": "address",
  }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
  "name": "Transfer",
  "type": "event",
}, {
  "anonymous": false,
  "inputs": [{ "indexed": true, "internalType": "address", "name": "oldPlugin", "type": "address" }, {
    "indexed": true,
    "internalType": "address",
    "name": "newPlugin",
    "type": "address",
  }],
  "name": "UnionClubPluginUpdated",
  "type": "event",
}, {
  "anonymous": false,
  "inputs": [{ "indexed": false, "internalType": "bytes32", "name": "oldRoot", "type": "bytes32" }, {
    "indexed": false,
    "internalType": "bytes32",
    "name": "newRoot",
    "type": "bytes32",
  }],
  "name": "WhitelistRootUpdated",
  "type": "event",
}, {
  "inputs": [],
  "name": "BURNER_ROLE",
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
  "name": "MINTER_ROLE",
  "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
  "stateMutability": "view",
  "type": "function",
}, {
  "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, {
    "internalType": "uint256",
    "name": "tokenId",
    "type": "uint256",
  }], "name": "approve", "outputs": [], "stateMutability": "nonpayable", "type": "function",
}, {
  "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
  "name": "balanceOf",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function",
}, {
  "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
  "name": "blockList",
  "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
  "stateMutability": "view",
  "type": "function",
}, {
  "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
  "name": "burn",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function",
}, {
  "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
  "name": "getApproved",
  "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
  "stateMutability": "view",
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
  "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, {
    "internalType": "address",
    "name": "operator",
    "type": "address",
  }],
  "name": "isApprovedForAll",
  "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
  "stateMutability": "view",
  "type": "function",
}, {
  "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, {
    "internalType": "bytes32[]",
    "name": "proof",
    "type": "bytes32[]",
  }],
  "name": "mint",
  "outputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
  "stateMutability": "nonpayable",
  "type": "function",
}, {
  "inputs": [],
  "name": "name",
  "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
  "stateMutability": "view",
  "type": "function",
}, {
  "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
  "name": "ownerOf",
  "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
  "stateMutability": "view",
  "type": "function",
}, {
  "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
  "name": "remove",
  "outputs": [],
  "stateMutability": "nonpayable",
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
  "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, {
    "internalType": "address",
    "name": "to",
    "type": "address",
  }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
  "name": "safeTransferFrom",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function",
}, {
  "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, {
    "internalType": "address",
    "name": "to",
    "type": "address",
  }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }, {
    "internalType": "bytes",
    "name": "data",
    "type": "bytes",
  }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function",
}, {
  "inputs": [{ "internalType": "address", "name": "operator", "type": "address" }, {
    "internalType": "bool",
    "name": "approved",
    "type": "bool",
  }], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function",
}, {
  "inputs": [{ "internalType": "string", "name": "newName", "type": "string" }],
  "name": "setName",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function",
}, {
  "inputs": [{ "internalType": "string", "name": "newSymbol", "type": "string" }],
  "name": "setSymbol",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function",
}, {
  "inputs": [{ "internalType": "string", "name": "newTokenURI", "type": "string" }],
  "name": "setTokenURI",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function",
}, {
  "inputs": [{ "internalType": "address", "name": "newPlugin", "type": "address" }],
  "name": "setUnionClubPlugin",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function",
}, {
  "inputs": [{ "internalType": "bytes32", "name": "newRoot", "type": "bytes32" }],
  "name": "setWhitelistRoot",
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
  "name": "symbol",
  "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
  "stateMutability": "view",
  "type": "function",
}, {
  "inputs": [{ "internalType": "uint256", "name": "index", "type": "uint256" }],
  "name": "tokenByIndex",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function",
}, {
  "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, {
    "internalType": "uint256",
    "name": "index",
    "type": "uint256",
  }],
  "name": "tokenOfOwnerByIndex",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function",
}, {
  "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "name": "tokenURI",
  "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
  "stateMutability": "view",
  "type": "function",
}, {
  "inputs": [],
  "name": "totalSupply",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function",
}, {
  "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, {
    "internalType": "address",
    "name": "to",
    "type": "address",
  }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
  "name": "transferFrom",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function",
}, {
  "inputs": [],
  "name": "unionClubPlugin",
  "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
  "stateMutability": "view",
  "type": "function",
}, {
  "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "name": "updateTimestamp",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function",
}, {
  "inputs": [],
  "name": "contractURI",
  "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
  "stateMutability": "view",
  "type": "function",
}] as const;