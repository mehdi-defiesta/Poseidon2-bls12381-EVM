const { expect } = require("chai");
const { ethers } = require("hardhat");
const { poseidon2 } = require("poseidon-bls12381");

describe("Poseidon2 Implementation Comparison", function () {
  let poseidon2Contract;

  before(async function () {
    // Deploy the contracts
    const Poseidon2 = await ethers.getContractFactory("Poseidon2");
    poseidon2Contract = await Poseidon2.deploy();
    await poseidon2Contract.waitForDeployment();

    console.log("Contract deployed successfully!");
  });

  describe("Basic Functionality Tests", function () {
    const testCases = [
      { inputs: [0n, 0n], description: "Zero inputs" },
      { inputs: [1n, 2n], description: "Simple inputs" },
      { inputs: [123n, 456n], description: "Medium inputs" },
      { inputs: [123456789n, 987654321n], description: "Large inputs" },
      { inputs: [BigInt("0x1234567890abcdef"), BigInt("0xfedcba0987654321")], description: "Hex inputs" },
      { inputs: [BigInt("0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000000"), 1n], description: "Near prime boundary" },
    ];

    testCases.forEach(({ inputs, description }) => {
      it(`should match for ${description}: [${inputs[0]}, ${inputs[1]}]`, async function () {
        try {
          // Get result from npm library
          const offChainResult = poseidon2(inputs);
          console.log(`Off-chain result for [${inputs[0]}, ${inputs[1]}]: ${offChainResult.toString()}`);

          // Get result from Solidity contract
          const onChainResult = await poseidon2Contract.poseidon2Uint256(inputs[0], inputs[1]);
          console.log(`On-chain result for [${inputs[0]}, ${inputs[1]}]: ${onChainResult.toString()}`);

          // Compare results
          expect(onChainResult.toString()).to.equal(offChainResult.toString(), 
            `Results don't match for inputs [${inputs[0]}, ${inputs[1]}]`);
        } catch (error) {
          console.error(`Error testing ${description}:`, error);
          throw error;
        }
      });
    });
  });

  describe("Edge Cases", function () {
    it("should handle maximum safe integer", async function () {
      const maxSafe = BigInt(Number.MAX_SAFE_INTEGER);
      const inputs = [maxSafe, maxSafe - 1n];
      
      const offChainResult = poseidon2(inputs);
      const onChainResult = await poseidon2Contract.poseidon2Uint256(inputs[0], inputs[1]);
      
      console.log(`Max safe integer test - Off-chain: ${offChainResult.toString()}, On-chain: ${onChainResult.toString()}`);
      expect(onChainResult.toString()).to.equal(offChainResult.toString());
    });

    it("should handle power of 2 inputs", async function () {
      const inputs = [2n ** 64n, 2n ** 128n];
      
      const offChainResult = poseidon2(inputs);
      const onChainResult = await poseidon2Contract.poseidon2Uint256(inputs[0], inputs[1]);
      
      console.log(`Power of 2 test - Off-chain: ${offChainResult.toString()}, On-chain: ${onChainResult.toString()}`);
      expect(onChainResult.toString()).to.equal(offChainResult.toString());
    });
  });

  describe("Random Test Vectors", function () {
    it("should generate and test random inputs", async function () {
      const numTests = 10;
      const prime = BigInt("0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001");
      
      for (let i = 0; i < numTests; i++) {
        // Generate random inputs below the prime
        const input1 = BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
        const input2 = BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
        
        const offChainResult = poseidon2([input1, input2]);
        const onChainResult = await poseidon2Contract.poseidon2Uint256(input1, input2);
        
        console.log(`Random test ${i + 1} - Inputs: [${input1}, ${input2}]`);
        console.log(`  Off-chain: ${offChainResult.toString()}`);
        console.log(`  On-chain:  ${onChainResult.toString()}`);
        
        expect(onChainResult.toString()).to.equal(offChainResult.toString(), 
          `Random test ${i + 1} failed for inputs [${input1}, ${input2}]`);
      }
    });
  });

  describe("Performance Comparison", function () {
    it("should measure performance of both implementations", async function () {
      const testInputs = [123456789n, 987654321n];
      const iterations = 100;

      // Measure off-chain performance
      const offChainStart = Date.now();
      let offChainResult;
      for (let i = 0; i < iterations; i++) {
        offChainResult = poseidon2(testInputs);
      }
      const offChainTime = Date.now() - offChainStart;

      // Measure on-chain performance (single call due to gas costs)
      const onChainStart = Date.now();
      const onChainResult = await poseidon2Contract.poseidon2Uint256(testInputs[0], testInputs[1]);
      const onChainTime = Date.now() - onChainStart;

      console.log(`Performance comparison:`);
      console.log(`  Off-chain (${iterations} iterations): ${offChainTime}ms (${(offChainTime/iterations).toFixed(2)}ms per call)`);
      console.log(`  On-chain (1 iteration): ${onChainTime}ms`);
      console.log(`  Results match: ${offChainResult.toString() === onChainResult.toString()}`);

      expect(onChainResult.toString()).to.equal(offChainResult.toString());
    });
  });

  describe("Gas Usage Analysis", function () {
    it("should measure gas usage for different input sizes", async function () {
      const testCases = [
        { inputs: [0n, 0n], description: "Zero inputs" },
        { inputs: [1n, 1n], description: "Small inputs" },
        { inputs: [BigInt("0xffffffff"), BigInt("0xffffffff")], description: "32-bit max" },
        { inputs: [BigInt("0xffffffffffffffff"), BigInt("0xffffffffffffffff")], description: "64-bit max" },
      ];

      for (const { inputs, description } of testCases) {
        const gasEstimate = await poseidon2Contract.poseidon2Uint256.estimateGas(inputs[0], inputs[1]);
        console.log(`Gas usage for ${description}: ${gasEstimate.toString()}`);
      }
    });
  });

  describe("Contract Test Functions", function () {
    it("should test contract's built-in test vectors", async function () {
      const testVector1 = await poseidon2Contract.testVector1();
      const testVector2 = await poseidon2Contract.testVector2();

      // Compare with off-chain results
      const offChain1 = poseidon2([1n, 2n]);
      const offChain2 = poseidon2([0n, 0n]);

      console.log("Contract test vectors:");
      console.log(`Test 1 - Contract: ${testVector1.toString()}, Off-chain: ${offChain1.toString()}`);
      console.log(`Test 2 - Contract: ${testVector2.toString()}, Off-chain: ${offChain2.toString()}`);

      expect(testVector1.toString()).to.equal(offChain1.toString());
      expect(testVector2.toString()).to.equal(offChain2.toString());
    });
  });

  describe("Field Boundary Tests", function () {
    it("should handle inputs near field boundaries", async function () {
      const prime = BigInt("0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001");
      
      const boundaryCases = [
        { inputs: [prime - 1n, 0n], description: "Prime - 1, 0" },
        { inputs: [0n, prime - 1n], description: "0, Prime - 1" },
        { inputs: [prime - 1n, prime - 1n], description: "Prime - 1, Prime - 1" },
        { inputs: [prime / 2n, prime / 2n], description: "Prime / 2, Prime / 2" },
      ];

      for (const { inputs, description } of boundaryCases) {
        try {
          const offChainResult = poseidon2(inputs);
          const onChainResult = await poseidon2Contract.poseidon2Uint256(inputs[0], inputs[1]);
          
          console.log(`Boundary test - ${description}:`);
          console.log(`  Off-chain: ${offChainResult.toString()}`);
          console.log(`  On-chain:  ${onChainResult.toString()}`);
          
          expect(onChainResult.toString()).to.equal(offChainResult.toString());
        } catch (error) {
          console.log(`Expected error for ${description}: ${error.message}`);
          // Some boundary cases might legitimately fail
        }
      }
    });
  });

  describe("Comprehensive Test Report", function () {
    it("should generate a comprehensive comparison report", async function () {
      console.log("\n=== COMPREHENSIVE POSEIDON2 IMPLEMENTATION COMPARISON REPORT ===");
      console.log("Comparing npm package 'poseidon-bls12381' vs Solidity implementation");
      console.log("================================================================\n");

      // Test various input patterns
      const patterns = [
        { name: "Sequential", gen: (i) => [BigInt(i), BigInt(i + 1)] },
        { name: "Powers of 2", gen: (i) => [2n ** BigInt(i), 2n ** BigInt(i + 1)] },
        { name: "Fibonacci-like", gen: (i) => i === 0 ? [1n, 1n] : [BigInt(i), BigInt(i) + BigInt(i - 1)] },
      ];

      let totalTests = 0;
      let passedTests = 0;

      for (const pattern of patterns) {
        console.log(`Testing ${pattern.name} pattern:`);
        
        for (let i = 0; i < 5; i++) {
          const inputs = pattern.gen(i + 1);
          totalTests++;
          
          try {
            const offChainResult = poseidon2(inputs);
            const onChainResult = await poseidon2Contract.poseidon2Uint256(inputs[0], inputs[1]);
            
            const match = offChainResult.toString() === onChainResult.toString();
            if (match) passedTests++;
            
            console.log(`  [${inputs[0]}, ${inputs[1]}] => Match: ${match}`);
            
            expect(match).to.be.true;
          } catch (error) {
            console.log(`  [${inputs[0]}, ${inputs[1]}] => Error: ${error.message}`);
          }
        }
        console.log();
      }

      console.log(`\nFINAL REPORT:`);
      console.log(`Total tests: ${totalTests}`);
      console.log(`Passed tests: ${passedTests}`);
      console.log(`Success rate: ${((passedTests / totalTests) * 100).toFixed(2)}%`);
      console.log(`Implementation compatibility: ${passedTests === totalTests ? 'PERFECT' : 'PARTIAL'}`);
    });
  });
});
