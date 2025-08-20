const { ethers } = require("hardhat");
const { poseidon4 } = require("poseidon-bls12381");

async function main() {
  console.log("🧪 === SIMPLE POSEIDON4 TEST ===");
  console.log("================================\n");

  try {
    // Deploy the Poseidon4 contract
    console.log("📋 Deploying Poseidon4 contract...");
    const Poseidon4 = await ethers.getContractFactory("Poseidon4");
    const poseidon4Contract = await Poseidon4.deploy();
    await poseidon4Contract.waitForDeployment();
    const contractAddress = await poseidon4Contract.getAddress();
    console.log(`✅ Contract deployed at: ${contractAddress}\n`);

    // Test basic functionality
    console.log("📊 Testing basic functionality...\n");
    
    const testInputs = [1n, 2n, 3n, 4n];
    console.log(`Input: [${testInputs[0]}, ${testInputs[1]}, ${testInputs[2]}, ${testInputs[3]}]`);
    
    // Get result from npm library
    const offChainResult = poseidon4(testInputs);
    console.log(`Off-chain result: ${offChainResult.toString()}`);
    
    // Try to get result from contract (this will likely fail due to placeholder constants)
    try {
      const onChainResult = await poseidon4Contract.poseidon4Uint256(testInputs[0], testInputs[1], testInputs[2], testInputs[3]);
      console.log(`On-chain result:  ${onChainResult.toString()}`);
      
      const match = offChainResult.toString() === onChainResult.toString();
      console.log(`Match: ${match ? '✅ YES' : '❌ NO'}`);
      
    } catch (error) {
      console.log(`On-chain error: ${error.message}`);
      console.log("This is expected with placeholder constants.");
    }

    console.log("\n📋 Test Vectors from npm library:");
    const testCases = [
      [0n, 0n, 0n, 0n],
      [1n, 2n, 3n, 4n],
      [123n, 456n, 789n, 101112n]
    ];

    for (const inputs of testCases) {
      const result = poseidon4(inputs);
      console.log(`poseidon4([${inputs[0]}, ${inputs[1]}, ${inputs[2]}, ${inputs[3]}]) = ${result.toString()}`);
    }

    console.log("\n========================================");
    console.log("🚀 BASIC POSEIDON4 TEST COMPLETED! 🚀");
    console.log("\n⚠️  Note: The current implementation uses placeholder constants.");
    console.log("To get exact matches, you need to generate proper round constants and MDS matrix.");
    console.log("Use the Sage script: generate_params_poseidon.sage 1 0 255 4 5 128 <PRIME>");

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
