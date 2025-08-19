const { ethers } = require("hardhat");
const { poseidon4 } = require("poseidon-bls12381");

async function main() {
  console.log("🧪 === POSEIDON4 IMPLEMENTATION TEST ===");
  console.log("========================================\n");

  // Deploy the Poseidon4 contract
  console.log("📋 Deploying Poseidon4 contract...");
  const Poseidon4 = await ethers.getContractFactory("Poseidon4");
  const poseidon4Contract = await Poseidon4.deploy();
  await poseidon4Contract.waitForDeployment();
  const contractAddress = await poseidon4Contract.getAddress();
  console.log(`✅ Contract deployed at: ${contractAddress}\n`);

  // Test cases from npm library
  const testCases = [
    { 
      inputs: [0n, 0n, 0n, 0n], 
      description: "Zero inputs",
      expected: "13414013329667544728247370350271255543326139971590598177275881238397992759743"
    },
    { 
      inputs: [1n, 2n, 3n, 4n], 
      description: "Sequential inputs",
      expected: "21145329782224435656281698581333264404190182101555512590871803982657985796198"
    },
    { 
      inputs: [123n, 456n, 789n, 101112n], 
      description: "Medium numbers",
      expected: null // Will be computed from npm library
    },
    { 
      inputs: [BigInt("0xffffffffffffffff"), BigInt("0x123456789abcdef0"), 999n, 888n], 
      description: "Large numbers",
      expected: null
    }
  ];

  console.log("📊 Running comparison tests...\n");
  
  let allMatch = true;
  
  for (const { inputs, description, expected } of testCases) {
    try {
      console.log(`Testing ${description}: [${inputs[0]}, ${inputs[1]}, ${inputs[2]}, ${inputs[3]}]`);
      
      // Get result from npm library
      const offChainResult = poseidon4(inputs);
      console.log(`  Off-chain result: ${offChainResult.toString()}`);
      
      // Get result from Solidity contract
      const onChainResult = await poseidon4Contract.poseidon4Uint256(inputs[0], inputs[1], inputs[2], inputs[3]);
      console.log(`  On-chain result:  ${onChainResult.toString()}`);
      
      // Compare results
      const match = offChainResult.toString() === onChainResult.toString();
      console.log(`  Match: ${match ? '✅ YES' : '❌ NO'}`);
      
      if (!match) {
        allMatch = false;
        console.log(`  Expected: ${expected || offChainResult.toString()}`);
      }
      
      console.log();
      
    } catch (error) {
      console.error(`  Error: ${error.message}`);
      allMatch = false;
      console.log();
    }
  }

  // Test additional cases
  console.log("🔍 Testing additional cases...\n");
  
  const additionalTests = [
    [BigInt(2)**64n, BigInt(2)**128n, BigInt(2)**256n, BigInt(2)**512n],
    [BigInt("0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000000"), 1n, 2n, 3n],
    [999999999999999n, 888888888888888n, 777777777777777n, 666666666666666n]
  ];

  for (let i = 0; i < additionalTests.length; i++) {
    const inputs = additionalTests[i];
    try {
      console.log(`Additional test ${i + 1}: [${inputs[0]}, ${inputs[1]}, ${inputs[2]}, ${inputs[3]}]`);
      
      const offChainResult = poseidon4(inputs);
      const onChainResult = await poseidon4Contract.poseidon4Uint256(inputs[0], inputs[1], inputs[2], inputs[3]);
      
      const match = offChainResult.toString() === onChainResult.toString();
      console.log(`  Match: ${match ? '✅ YES' : '❌ NO'}`);
      
      if (!match) allMatch = false;
      
    } catch (error) {
      console.log(`  Error: ${error.message}`);
      allMatch = false;
    }
  }

  console.log("\n🏆 Final Assessment:");
  console.log(`Overall compatibility: ${allMatch ? '🎉 PERFECT MATCH' : '⚠️ ISSUES DETECTED'}`);
  
  if (!allMatch) {
    console.log("\n⚠️ Note: The current implementation uses placeholder constants.");
    console.log("To get exact matches, you need to generate proper round constants and MDS matrix.");
    console.log("Use the Sage script: generate_params_poseidon.sage 1 0 255 4 5 128 <PRIME>");
  }

  console.log("\n📋 Test Vectors for Verification:");
  for (const { inputs, description } of testCases) {
    const result = poseidon4(inputs);
    console.log(`${description}: poseidon4([${inputs[0]}, ${inputs[1]}, ${inputs[2]}, ${inputs[3]}]) = ${result.toString()}`);
  }

  console.log("\n========================================");
  console.log(`🚀 POSEIDON4 TEST ${allMatch ? 'SUCCESSFUL' : 'NEEDS IMPROVEMENT'}! 🚀`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
