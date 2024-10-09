export const clubNftAbi = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, {
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
  "inputs": [{ "internalType": "address", "name": "implementation", "type": "address" }],
  "name": "ERC1967InvalidImplementation",
  "type": "error",
}, { "inputs": [], "name": "ERC1967NonPayable", "type": "error" }, {
  "inputs": [],
  "name": "ERC721EnumerableForbiddenBatchMint",
  "type": "error",
}, {
  "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, {
    "internalType": "uint256",
    "name": "tokenId",
    "type": "uint256",
  }, { "internalType": "address", "name": "owner", "type": "address" }], "name": "ERC721IncorrectOwner", "type": "error",
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
}, { "inputs": [], "name": "FailedInnerCall", "type": "error" }, {
  "inputs": [],
  "name": "InvalidInitialization",
  "type": "error",
}, { "inputs": [], "name": "NotInitializing", "type": "error" }, {
  "inputs": [],
  "name": "UUPSUnauthorizedCallContext",
  "type": "error",
}, {
  "inputs": [{ "internalType": "bytes32", "name": "slot", "type": "bytes32" }],
  "name": "UUPSUnsupportedProxiableUUID",
  "type": "error",
}, {
  "anonymous": false,
  "inputs": [{ "indexed": false, "internalType": "uint256", "name": "tokenId", "type": "uint256" }, {
    "indexed": false,
    "internalType": "bool",
    "name": "active",
    "type": "bool",
  }],
  "name": "ActiveSet",
  "type": "event",
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
  "inputs": [{ "indexed": false, "internalType": "uint256", "name": "tokenId", "type": "uint256" }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "baseTrust",
    "type": "uint256",
  }],
  "name": "BaseTrustSet",
  "type": "event",
}, {
  "anonymous": false,
  "inputs": [{ "indexed": false, "internalType": "string", "name": "oldBaseURI", "type": "string" }, {
    "indexed": false,
    "internalType": "string",
    "name": "newBaseURI",
    "type": "string",
  }],
  "name": "BaseURIUpdated",
  "type": "event",
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": false,
    "internalType": "string",
    "name": "oldContractURI",
    "type": "string",
  }, { "indexed": false, "internalType": "string", "name": "newContractURI", "type": "string" }],
  "name": "ContractURIUpdated",
  "type": "event",
}, {
  "anonymous": false,
  "inputs": [{ "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "baseTrust",
    "type": "uint256",
  }, { "indexed": false, "internalType": "bool", "name": "active", "type": "bool" }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "badDebt",
    "type": "uint256",
  }, { "indexed": false, "internalType": "enum ClubTiers.Tier", "name": "tier", "type": "uint8" }, {
    "indexed": false,
    "internalType": "uint8",
    "name": "invites",
    "type": "uint8",
  }],
  "name": "CreditProfileSet",
  "type": "event",
}, {
  "anonymous": false,
  "inputs": [{ "indexed": false, "internalType": "uint64", "name": "version", "type": "uint64" }],
  "name": "Initialized",
  "type": "event",
}, {
  "anonymous": false,
  "inputs": [{ "indexed": false, "internalType": "uint8", "name": "invites", "type": "uint8" }],
  "name": "MaxInviteSet",
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
  "inputs": [{ "indexed": false, "internalType": "uint256", "name": "tokenId", "type": "uint256" }, {
    "indexed": false,
    "internalType": "enum ClubTiers.Tier",
    "name": "tier",
    "type": "uint8",
  }],
  "name": "TierSet",
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
  "inputs": [{ "indexed": true, "internalType": "address", "name": "implementation", "type": "address" }],
  "name": "Upgraded",
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
  "inputs": [],
  "name": "UPGRADE_INTERFACE_VERSION",
  "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
  "stateMutability": "view",
  "type": "function",
}, {
  "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }, {
    "internalType": "uint8",
    "name": "count",
    "type": "uint8",
  }], "name": "addInvite", "outputs": [], "stateMutability": "nonpayable", "type": "function",
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
  "inputs": [],
  "name": "contractURI",
  "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
  "stateMutability": "view",
  "type": "function",
}, {
  "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }, {
    "internalType": "uint8",
    "name": "count",
    "type": "uint8",
  }], "name": "decInvite", "outputs": [], "stateMutability": "nonpayable", "type": "function",
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
  "inputs": [{ "internalType": "address", "name": "_plugin", "type": "address" }, {
    "internalType": "bytes32",
    "name": "_root",
    "type": "bytes32",
  }, { "internalType": "string", "name": "_name", "type": "string" }, {
    "internalType": "string",
    "name": "_symbol",
    "type": "string",
  }, { "internalType": "string", "name": "_contractUri", "type": "string" }, {
    "internalType": "string",
    "name": "_baseUri",
    "type": "string",
  }], "name": "initialize", "outputs": [], "stateMutability": "nonpayable", "type": "function",
}, {
  "inputs": [{ "internalType": "address", "name": "_plugin", "type": "address" }, {
    "internalType": "bytes32",
    "name": "_root",
    "type": "bytes32",
  }, { "internalType": "string", "name": "_name", "type": "string" }, {
    "internalType": "string",
    "name": "_symbol",
    "type": "string",
  }, {
    "internalType": "string",
    "name": "_contractUri",
    "type": "string",
  }, {
    "components": [{ "internalType": "string", "name": "name", "type": "string" }, {
      "internalType": "string",
      "name": "description",
      "type": "string",
    }, { "internalType": "string", "name": "image", "type": "string" }],
    "internalType": "struct ClubMemberNFTV3.TokenBase",
    "name": "_tokenBase",
    "type": "tuple",
  }, { "internalType": "uint8", "name": "_maxInvite", "type": "uint8" }],
  "name": "initialize",
  "outputs": [],
  "stateMutability": "nonpayable",
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
  "inputs": [],
  "name": "maxInvite",
  "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }],
  "stateMutability": "view",
  "type": "function",
}, {
  "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
  "name": "mint",
  "outputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
  "stateMutability": "nonpayable",
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
  "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, {
    "internalType": "uint256",
    "name": "baseTrust",
    "type": "uint256",
  }, { "internalType": "enum ClubTiers.Tier", "name": "tier", "type": "uint8" }, {
    "internalType": "bool",
    "name": "active",
    "type": "bool",
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
  "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "name": "nftCreditStatus",
  "outputs": [{ "internalType": "uint256", "name": "baseTrust", "type": "uint256" }, {
    "internalType": "bool",
    "name": "active",
    "type": "bool",
  }, { "internalType": "uint256", "name": "badDebt", "type": "uint256" }, {
    "internalType": "enum ClubTiers.Tier",
    "name": "tier",
    "type": "uint8",
  }, { "internalType": "uint8", "name": "invites", "type": "uint8" }],
  "stateMutability": "view",
  "type": "function",
}, {
  "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
  "name": "ownerOf",
  "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
  "stateMutability": "view",
  "type": "function",
}, {
  "inputs": [],
  "name": "proxiableUUID",
  "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
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
  "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }, {
    "internalType": "bool",
    "name": "active",
    "type": "bool",
  }], "name": "setActive", "outputs": [], "stateMutability": "nonpayable", "type": "function",
}, {
  "inputs": [{ "internalType": "address", "name": "operator", "type": "address" }, {
    "internalType": "bool",
    "name": "approved",
    "type": "bool",
  }], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function",
}, {
  "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, {
    "internalType": "uint256",
    "name": "badDebt",
    "type": "uint256",
  }], "name": "setBadDebt", "outputs": [], "stateMutability": "nonpayable", "type": "function",
}, {
  "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }, {
    "internalType": "uint256",
    "name": "baseTrust",
    "type": "uint256",
  }], "name": "setBaseTrust", "outputs": [], "stateMutability": "nonpayable", "type": "function",
}, {
  "inputs": [{ "internalType": "string", "name": "_newBaseUri", "type": "string" }],
  "name": "setBaseURI",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function",
}, {
  "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, {
    "internalType": "bool",
    "name": "isBlock",
    "type": "bool",
  }], "name": "setBlockList", "outputs": [], "stateMutability": "nonpayable", "type": "function",
}, {
  "inputs": [{ "internalType": "string", "name": "newContractURI", "type": "string" }],
  "name": "setContractURI",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function",
}, {
  "inputs": [{ "internalType": "uint8", "name": "_maxInvite", "type": "uint8" }],
  "name": "setMaxInvite",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function",
}, {
  "inputs": [{ "internalType": "string", "name": "newName", "type": "string" }],
  "name": "setName",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function",
}, {
  "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, {
    "internalType": "uint256",
    "name": "baseTrust",
    "type": "uint256",
  }, { "internalType": "bool", "name": "active", "type": "bool" }, {
    "internalType": "enum ClubTiers.Tier",
    "name": "tier",
    "type": "uint8",
  }, { "internalType": "uint8", "name": "invites", "type": "uint8" }],
  "name": "setNftCreditStatus",
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
  "inputs": [{
    "internalType": "uint256",
    "name": "tokenId",
    "type": "uint256",
  }, { "internalType": "enum ClubTiers.Tier", "name": "tier", "type": "uint8" }],
  "name": "setTier",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function",
}, {
  "inputs": [{
    "components": [{
      "internalType": "string",
      "name": "name",
      "type": "string",
    }, { "internalType": "string", "name": "description", "type": "string" }, {
      "internalType": "string",
      "name": "image",
      "type": "string",
    }], "internalType": "struct ClubMemberNFTV3.TokenBase", "name": "_tokenBase", "type": "tuple",
  }], "name": "setTokenBase", "outputs": [], "stateMutability": "nonpayable", "type": "function",
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
  "inputs": [],
  "name": "tokenBase",
  "outputs": [{ "internalType": "string", "name": "name", "type": "string" }, {
    "internalType": "string",
    "name": "description",
    "type": "string",
  }, { "internalType": "string", "name": "image", "type": "string" }],
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
  "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
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
  "inputs": [{
    "internalType": "address",
    "name": "newImplementation",
    "type": "address",
  }, { "internalType": "bytes", "name": "data", "type": "bytes" }],
  "name": "upgradeToAndCall",
  "outputs": [],
  "stateMutability": "payable",
  "type": "function",
}, {
  "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
  "name": "useInviteCount",
  "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
  "stateMutability": "nonpayable",
  "type": "function",
}] as const;