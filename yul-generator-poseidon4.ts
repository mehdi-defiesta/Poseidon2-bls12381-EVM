import { round_constant, mds_matrix } from "./constants-poseidon4";

console.log(yul_generate());

function yul_generate() {
  return `// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0;

contract Poseidon4Yul {
    fallback() external {
        assembly {
            let PRIME := 0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001

            // Initialize state as [0, input1, input2, input3, input4]
            let state0 := 0                    // Capacity element (always 0)
            let state1 := calldataload(0)     // First input
            let state2 := calldataload(0x20)  // Second input
            let state3 := calldataload(0x40)  // Third input
            let state4 := calldataload(0x60)  // Fourth input
            
            let round_counter := 0
            
            // First half of full rounds (4 rounds)
            ${generate_first_full_rounds()}
            
            // Partial rounds (56 rounds)
            ${generate_partial_rounds()}
            
            // Second half of full rounds (4 rounds)
            ${generate_second_full_rounds()}
            
            // Return first element
            mstore(0, state0)
            return(0, 32)
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
            state3 := add(state3, ${round_constant[round_counter++]})
            state4 := add(state4, ${round_constant[round_counter++]})
            
            // S-box all elements
            ${s_box_all()}
            
            // MDS matrix multiplication
            ${matrix_multiplication_5x5()}`);
  }
  return code.join("\n");
}

function generate_partial_rounds(): string {
  let round_counter = 20; // 4 rounds * 5 constants = 20
  let code: string[] = [];
  for (let i = 0; i < 56; i++) {
    code.push(`
            // Partial round ${4 + i}
            // Add round constants
            state0 := add(state0, ${round_constant[round_counter++]})
            state1 := add(state1, ${round_constant[round_counter++]})
            state2 := add(state2, ${round_constant[round_counter++]})
            state3 := add(state3, ${round_constant[round_counter++]})
            state4 := add(state4, ${round_constant[round_counter++]})
            
            // S-box only first element
            ${single_box("state0")}
            
            // MDS matrix multiplication
            ${matrix_multiplication_5x5()}`);
  }
  return code.join("\n");
}

function generate_second_full_rounds(): string {
  let round_counter = 20 + (56 * 5); // 20 + 280 = 300
  let code: string[] = [];
  for (let i = 0; i < 4; i++) {
    code.push(`
            // Full round ${60 + i}
            // Add round constants
            state0 := add(state0, ${round_constant[round_counter++]})
            state1 := add(state1, ${round_constant[round_counter++]})
            state2 := add(state2, ${round_constant[round_counter++]})
            state3 := add(state3, ${round_constant[round_counter++]})
            state4 := add(state4, ${round_constant[round_counter++]})
            
            // S-box all elements
            ${s_box_all()}
            
            // MDS matrix multiplication
            ${matrix_multiplication_5x5()}`);
  }
  return code.join("\n");
}

function s_box_all(): string {
  return `
            // S-box all elements
            ${single_box("state0")}
            ${single_box("state1")}
            ${single_box("state2")}
            ${single_box("state3")}
            ${single_box("state4")}`;
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

function matrix_multiplication_5x5(): string {
  return `
            {
                // Proper 5x5 MDS matrix multiplication
                // Row 0
                let t0 := mulmod(${mds_matrix[0][0]}, state0, PRIME)
                t0 := addmod(t0, mulmod(${mds_matrix[0][1]}, state1, PRIME), PRIME)
                t0 := addmod(t0, mulmod(${mds_matrix[0][2]}, state2, PRIME), PRIME)
                t0 := addmod(t0, mulmod(${mds_matrix[0][3]}, state3, PRIME), PRIME)
                t0 := addmod(t0, mulmod(${mds_matrix[0][4]}, state4, PRIME), PRIME)
                
                // Row 1
                let t1 := mulmod(${mds_matrix[1][0]}, state0, PRIME)
                t1 := addmod(t1, mulmod(${mds_matrix[1][1]}, state1, PRIME), PRIME)
                t1 := addmod(t1, mulmod(${mds_matrix[1][2]}, state2, PRIME), PRIME)
                t1 := addmod(t1, mulmod(${mds_matrix[1][3]}, state3, PRIME), PRIME)
                t1 := addmod(t1, mulmod(${mds_matrix[1][4]}, state4, PRIME), PRIME)
                
                // Row 2
                let t2 := mulmod(${mds_matrix[2][0]}, state0, PRIME)
                t2 := addmod(t2, mulmod(${mds_matrix[2][1]}, state1, PRIME), PRIME)
                t2 := addmod(t2, mulmod(${mds_matrix[2][2]}, state2, PRIME), PRIME)
                t2 := addmod(t2, mulmod(${mds_matrix[2][3]}, state3, PRIME), PRIME)
                t2 := addmod(t2, mulmod(${mds_matrix[2][4]}, state4, PRIME), PRIME)
                
                // Row 3
                let t3 := mulmod(${mds_matrix[3][0]}, state0, PRIME)
                t3 := addmod(t3, mulmod(${mds_matrix[3][1]}, state1, PRIME), PRIME)
                t3 := addmod(t3, mulmod(${mds_matrix[3][2]}, state2, PRIME), PRIME)
                t3 := addmod(t3, mulmod(${mds_matrix[3][3]}, state3, PRIME), PRIME)
                t3 := addmod(t3, mulmod(${mds_matrix[3][4]}, state4, PRIME), PRIME)
                
                // Row 4
                let t4 := mulmod(${mds_matrix[4][0]}, state0, PRIME)
                t4 := addmod(t4, mulmod(${mds_matrix[4][1]}, state1, PRIME), PRIME)
                t4 := addmod(t4, mulmod(${mds_matrix[4][2]}, state2, PRIME), PRIME)
                t4 := addmod(t4, mulmod(${mds_matrix[4][3]}, state3, PRIME), PRIME)
                t4 := addmod(t4, mulmod(${mds_matrix[4][4]}, state4, PRIME), PRIME)
                
                state0 := t0
                state1 := t1
                state2 := t2
                state3 := t3
                state4 := t4
            }`;
}

