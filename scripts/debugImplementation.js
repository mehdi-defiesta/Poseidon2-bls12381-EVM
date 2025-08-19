const { poseidon2 } = require("poseidon-bls12381");

async function analyzeNpmLibrary() {
  console.log("=== ANALYZING NPM POSEIDON-BLS12381 LIBRARY ===\n");
  
  // Test basic functionality
  console.log("1. Basic functionality test:");
  console.log("poseidon2([1n, 2n]) =", poseidon2([1n, 2n]).toString());
  console.log("poseidon2([0n, 0n]) =", poseidon2([0n, 0n]).toString());
  
  // Test with different input formats
  console.log("\n2. Input format tests:");
  try {
    console.log("poseidon2([1, 2]) =", poseidon2([1, 2]).toString());
  } catch (e) {
    console.log("poseidon2([1, 2]) = Error:", e.message);
  }
  
  try {
    console.log("poseidon2(['1', '2']) =", poseidon2(['1', '2']).toString());
  } catch (e) {
    console.log("poseidon2(['1', '2']) = Error:", e.message);
  }
  
  // Test the npm library's parameters
  console.log("\n3. Checking library behavior:");
  
  // Test if it matches the TypeScript code you provided exactly
  const testInputs = [1n, 2n];
  const result = poseidon2(testInputs);
  
  console.log(`Input: [${testInputs[0]}, ${testInputs[1]}]`);
  console.log(`Result: ${result.toString()}`);
  console.log(`Result (hex): 0x${result.toString(16)}`);
  
  // Test boundary cases
  console.log("\n4. Boundary tests:");
  const prime = BigInt("0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001");
  console.log("Prime:", prime.toString());
  
  try {
    const boundaryResult = poseidon2([prime - 1n, prime - 1n]);
    console.log(`poseidon2([prime-1, prime-1]) = ${boundaryResult.toString()}`);
  } catch (e) {
    console.log("Boundary test error:", e.message);
  }
  
  // Let's check if the library is using the correct constants
  console.log("\n5. Implementation check:");
  console.log("This npm library likely implements the CORRECT Poseidon2 specification");
  console.log("Our Solidity implementation was modified to match the TypeScript bug");
  console.log("We need to check if the npm library has the same bug or is corrected");
}

// Let's also create a simple TypeScript-like implementation to compare
function simpleTypeScriptPoseidon(inputs) {
  console.log("\n=== SIMULATING TYPESCRIPT IMPLEMENTATION ===");
  
  const PRIME = 0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001n;
  
  // Initialize state as in TypeScript: [0n, ...inputs]
  let state = [0n, ...inputs];
  console.log("Initial state:", state.map(x => x.toString()));
  
  // This is a simplified version - we don't have all the constants here
  // But we can see the structure
  console.log("TypeScript initializes state as [0n, input1, input2]");
  console.log("Then applies the full permutation and returns state[0]");
  
  return "Simulation complete - need full constants for actual calculation";
}

analyzeNpmLibrary();
simpleTypeScriptPoseidon([1n, 2n]);
