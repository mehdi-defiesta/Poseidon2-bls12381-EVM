const { ethers } = require("hardhat");
const { poseidon2 } = require("poseidon-bls12381");

async function main() {
  console.log("=== Quick Poseidon2 Implementation Test ===\n");

  // Deploy the contract
  console.log("Deploying Poseidon2 contract...");
  const Poseidon2 = await ethers.getContractFactory("Poseidon2");
  const poseidon2Contract = await Poseidon2.deploy();
  await poseidon2Contract.waitForDeployment();
  console.log(`Contract deployed at: ${await poseidon2Contract.getAddress()}\n`);

  // Test cases
  const testCases = [
    { inputs: [0n, 0n], description: "Zero inputs" },
    { inputs: [1n, 2n], description: "Basic test (1, 2)" },
    { inputs: [123n, 456n], description: "Medium numbers" },
    { inputs: [123456789n, 987654321n], description: "Large numbers" },
  ];

  console.log("Running comparison tests...\n");
  
  let allMatch = true;
  
  for (const { inputs, description } of testCases) {
    try {
      console.log(`Testing ${description}: [${inputs[0]}, ${inputs[1]}]`);
      
      // Get off-chain result
      const offChainResult = poseidon2(inputs);
      console.log(`  Off-chain result: ${offChainResult.toString()}`);
      
      // Get on-chain result
      const onChainResult = await poseidon2Contract.poseidon2Uint256(inputs[0], inputs[1]);
      console.log(`  On-chain result:  ${onChainResult.toString()}`);
      
      // Compare
      const match = offChainResult.toString() === onChainResult.toString();
      console.log(`  Match: ${match ? '✅ YES' : '❌ NO'}\n`);
      
      if (!match) allMatch = false;
      
    } catch (error) {
      console.error(`  Error: ${error.message}\n`);
      allMatch = false;
    }
  }

  console.log("=== SUMMARY ===");
  console.log(`Overall result: ${allMatch ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  console.log(`Implementation compatibility: ${allMatch ? 'PERFECT' : 'NEEDS REVIEW'}`);
  
  // Additional info
  console.log("\n=== IMPLEMENTATION INFO ===");
  console.log("Off-chain library: poseidon-bls12381 (npm package)");
  console.log("On-chain implementation: Custom Solidity contracts");
  console.log("Field: BLS12-381 scalar field");
  console.log("Parameters: rFull=8, rPartial=56, t=3");
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
  process.exit(1);
});

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
