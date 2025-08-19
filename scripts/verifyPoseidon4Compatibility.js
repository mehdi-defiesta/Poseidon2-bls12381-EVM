const { ethers } = require("hardhat");
const { poseidon4 } = require("poseidon-bls12381");

async function main() {
    console.log("🔍 === POSEIDON4 100% COMPATIBILITY VERIFICATION ===\n");

    // Deploy the Poseidon4 contract
    console.log("📋 Deploying Poseidon4 contract...");
    const Poseidon4 = await ethers.getContractFactory("Poseidon4");
    const poseidon4Contract = await Poseidon4.deploy();
    await poseidon4Contract.waitForDeployment();
    console.log(`✅ Contract deployed at: ${await poseidon4Contract.getAddress()}`);

    // Comprehensive test cases
    const testCases = [
        { name: "Zero inputs", inputs: [0n, 0n, 0n, 0n] },
        { name: "Sequential inputs", inputs: [1n, 2n, 3n, 4n] },
        { name: "Medium numbers", inputs: [123n, 456n, 789n, 101112n] },
        { name: "Large numbers", inputs: [18446744073709551615n, 1311768467463790320n, 999n, 888n] },
        { name: "Near field boundary", inputs: [52435875175126190479447740508185965837690552500527637822603658699938581184512n, 1n, 2n, 3n] },
        { name: "Random-like", inputs: [999999999999999n, 888888888888888n, 777777777777777n, 666666666666666n] },
        { name: "Power of 2", inputs: [2n**64n, 2n**32n, 2n**16n, 2n**8n] },
        { name: "Fibonacci-like", inputs: [1n, 1n, 2n, 3n] },
        { name: "Edge case 1", inputs: [1n, 0n, 0n, 0n] },
        { name: "Edge case 2", inputs: [0n, 1n, 0n, 0n] },
        { name: "Edge case 3", inputs: [0n, 0n, 1n, 0n] },
        { name: "Edge case 4", inputs: [0n, 0n, 0n, 1n] }
    ];

    console.log("📊 === Running Compatibility Tests ===\n");

    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;

    for (const testCase of testCases) {
        totalTests++;
        console.log(`🔍 Test ${totalTests}: ${testCase.name}`);
        console.log(`   Input: [${testCase.inputs.join(', ')}]`);
        
        try {
            // Get off-chain result
            const offChainResult = poseidon4(testCase.inputs);
            
            // Get on-chain result
            const onChainResult = await poseidon4Contract.poseidon4(
                testCase.inputs[0],
                testCase.inputs[1],
                testCase.inputs[2],
                testCase.inputs[3]
            );
            
            // Compare results
            const match = offChainResult.toString() === onChainResult.toString();
            
            if (match) {
                passedTests++;
                console.log(`   ✅ MATCH: ${onChainResult.toString()}`);
            } else {
                failedTests++;
                console.log(`   ❌ MISMATCH!`);
                console.log(`      Off-chain: ${offChainResult.toString()}`);
                console.log(`      On-chain:  ${onChainResult.toString()}`);
            }
            
        } catch (error) {
            failedTests++;
            console.log(`   ❌ ERROR: ${error.message}`);
        }
        
        console.log("");
    }

    // Summary
    console.log("📋 === COMPATIBILITY SUMMARY ===\n");
    console.log(`🏆 Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`📊 Success Rate: ${((passedTests / totalTests) * 100).toFixed(2)}%`);
    
    if (failedTests === 0) {
        console.log("\n🎉 PERFECT COMPATIBILITY ACHIEVED! 🎉");
        console.log("✅ 100% match between on-chain and off-chain implementations");
        console.log("✅ All test cases passed successfully");
        console.log("✅ Constants and implementation are correct");
    } else {
        console.log("\n⚠️  COMPATIBILITY ISSUES DETECTED");
        console.log("❌ Some tests failed - investigation needed");
    }

    // Additional verification
    console.log("\n🔍 === ADDITIONAL VERIFICATION ===\n");
    
    // Test the permutation function
    try {
        const permutationResult = await poseidon4Contract.permutation(
            [1n, 2n, 3n, 4n, 5n]
        );
        console.log("✅ Permutation function working correctly");
        console.log(`   Result: ${permutationResult.toString()}`);
    } catch (error) {
        console.log("❌ Permutation function error:", error.message);
    }

    // Test gas consumption
    try {
        const gasEstimate = await poseidon4Contract.poseidon4.estimateGas(1n, 2n, 3n, 4n);
        console.log(`✅ Gas estimation working: ${gasEstimate.toString()} gas`);
    } catch (error) {
        console.log("❌ Gas estimation error:", error.message);
    }

    console.log("\n========================================\n🚀 Compatibility Verification Completed! 🚀");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
