import { round_constant, mds_matrix } from "./constants-poseidon2";

console.log(yul_generate());

function yul_generate() {
  return `// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0;

contract Poseidon2Yul {
    fallback() external {
        assembly {
            let PRIME := 0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001

            // Sponge state (t=3) - matching poseidon2Direct structure
            let state0 := 0  // Initialize to 0 (capacity)
            let state1 := 0  // Will hold first input
            let state2 := 0  // Will hold second input

            // Absorb inputs - matching poseidon2Direct structure
            // state[0] = 0, state[1] = input1, state[2] = input2
            state1 := calldataload(0)     // First input to state1
            state2 := calldataload(0x20)  // Second input to state2

            // No initial linear layer - start directly with rounds

            // First half of full rounds (4 rounds: 0-3)
            ${generate_first_full_rounds()}
            
            // Partial rounds (56 rounds: 4-59)  
            ${generate_partial_rounds()}
            
            // Second half of full rounds (4 rounds: 60-63)
            ${generate_second_full_rounds()}

            // Return state[0] (matching poseidon2Direct)
            state0 := mod(state0, PRIME)
            mstore(0, state0)
            return (0, 32)
        }
    }
}`;
}

function generate_first_full_rounds(): string {
  let round_counter = 0;
  let code: string[] = [];
  
  for (let i = 0; i < 4; i++) {
    code.push(`
            // Full round ${i}
            // Add round constants
            state0 := add(state0, ${round_constant[round_counter++]})
            state1 := add(state1, ${round_constant[round_counter++]})  
            state2 := add(state2, ${round_constant[round_counter++]})
            
            // S-box all elements
            ${s_box_all()}
            
            // MDS matrix multiplication
            ${matrix_multiplication_3x3()}`);
  }
  
  return code.join("\n");
}

function generate_partial_rounds(): string {
  let round_counter = 12; // 4 rounds * 3 constants = 12
  let code: string[] = [];
  
  for (let i = 0; i < 56; i++) {
    code.push(`
            // Partial round ${4 + i}
            // Add round constants  
            state0 := add(state0, ${round_constant[round_counter++]})
            state1 := add(state1, ${round_constant[round_counter++]})
            state2 := add(state2, ${round_constant[round_counter++]})
            
            // S-box only first element
            ${single_box("state0")}
            
            // MDS matrix multiplication
            ${matrix_multiplication_3x3()}`);
  }
  
  return code.join("\n");
}

function generate_second_full_rounds(): string {
  let round_counter = 12 + (56 * 3); // 12 + 168 = 180
  let code: string[] = [];
  
  for (let i = 0; i < 4; i++) {
    code.push(`
            // Full round ${60 + i}
            // Add round constants
            state0 := add(state0, ${round_constant[round_counter++]})
            state1 := add(state1, ${round_constant[round_counter++]})
            state2 := add(state2, ${round_constant[round_counter++]})
            
            // S-box all elements
            ${s_box_all()}
            
            // MDS matrix multiplication  
            ${matrix_multiplication_3x3()}`);
  }
  
  return code.join("\n");
}

function s_box_all(): string {
  return `
            // S-box all elements
            ${single_box("state0")}
            ${single_box("state1")}
            ${single_box("state2")}`;
}

function single_box(var_name: string): string {
  return `
            {
                let intr := ${var_name}
                ${var_name} := mulmod(intr, intr, PRIME)
                ${var_name} := mulmod(${var_name}, ${var_name}, PRIME)
                ${var_name} := mulmod(${var_name}, intr, PRIME)
            }`;
}



function matrix_multiplication_3x3(): string {
  return `
            {
                // MDS matrix multiplication (3x3)
                let t0 := mulmod(${mds_matrix[0][0]}, state0, PRIME)
                t0 := addmod(t0, mulmod(${mds_matrix[0][1]}, state1, PRIME), PRIME)
                t0 := addmod(t0, mulmod(${mds_matrix[0][2]}, state2, PRIME), PRIME)
                
                let t1 := mulmod(${mds_matrix[1][0]}, state0, PRIME)
                t1 := addmod(t1, mulmod(${mds_matrix[1][1]}, state1, PRIME), PRIME)
                t1 := addmod(t1, mulmod(${mds_matrix[1][2]}, state2, PRIME), PRIME)
                
                let t2 := mulmod(${mds_matrix[2][0]}, state0, PRIME)
                t2 := addmod(t2, mulmod(${mds_matrix[2][1]}, state1, PRIME), PRIME)
                t2 := addmod(t2, mulmod(${mds_matrix[2][2]}, state2, PRIME), PRIME)
                
                state0 := t0
                state1 := t1
                state2 := t2
            }`;
}

