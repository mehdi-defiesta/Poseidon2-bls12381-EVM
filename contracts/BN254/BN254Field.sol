// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.8;

library BN254Field {
    type Type is uint256;

    // BN256 scalar field
    uint256 constant PRIME = 0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001;
    uint256 constant PRIME_DIV_2 = 0x183227397098d014dc2822db40c0ac2e9419f4243cdcb848a1f0fac9f8000000;

    function checkField(BN254Field.Type a) internal pure {
        require(BN254Field.Type.unwrap(a) < PRIME, "Field: input is too large");
    }

    function toFieldUnchecked(uint256 a) internal pure returns (BN254Field.Type b) {
        b = BN254Field.Type.wrap(a);
    }

    function toField(uint256 a) internal pure returns (BN254Field.Type b) {
        b = BN254Field.Type.wrap(a);
        checkField(b);
    }

    function toFieldUnchecked(bytes32 a) internal pure returns (BN254Field.Type b) {
        assembly {
            b := a
        }
    }

    function toField(bytes32 a) internal pure returns (BN254Field.Type b) {
        assembly {
            b := a
        }
        checkField(b);
    }

    function toBytes32(BN254Field.Type a) internal pure returns (bytes32 b) {
        assembly {
            b := a
        }
    }

    function toUint256(BN254Field.Type a) internal pure returns (uint256 b) {
        assembly {
            b := a
        }
    }

    function toAddress(BN254Field.Type a) internal pure returns (address b) {
        require(BN254Field.Type.unwrap(a) < (1 << 160), "Field: input is too large");
        assembly {
            b := a
        }
    }

    function toArr(BN254Field.Type a) internal pure returns (bytes32[] memory b) {
        b = new bytes32[](1);
        b[0] = toBytes32(a);
    }

    function toField(address a) internal pure returns (BN254Field.Type b) {
        assembly {
            b := a
        }
    }

    function toField(int256 a) internal pure returns (BN254Field.Type) {
        if (a < 0) {
            require(uint256(-a) < PRIME, "Field: input is too large");
            return BN254Field.Type.wrap(PRIME - uint256(-a));
        } else {
            require(uint256(a) < PRIME, "Field: input is too large");
            return BN254Field.Type.wrap(uint256(a));
        }
    }

    function into(BN254Field.Type[] memory a) internal pure returns (bytes32[] memory b) {
        assembly {
            b := a
        }
    }

    function add(BN254Field.Type a, BN254Field.Type b) internal pure returns (BN254Field.Type c) {
        assembly {
            c := addmod(a, b, PRIME)
        }
    }

    function mul(BN254Field.Type a, BN254Field.Type b) internal pure returns (BN254Field.Type c) {
        assembly {
            c := mulmod(a, b, PRIME)
        }
    }

    function add(BN254Field.Type a, uint256 b) internal pure returns (BN254Field.Type c) {
        assembly {
            c := addmod(a, b, PRIME)
        }
    }

    function mul(BN254Field.Type a, uint256 b) internal pure returns (BN254Field.Type c) {
        assembly {
            c := mulmod(a, b, PRIME)
        }
    }

    function eq(BN254Field.Type a, BN254Field.Type b) internal pure returns (bool c) {
        assembly {
            c := eq(a, b)
        }
    }

    function isZero(BN254Field.Type a) internal pure returns (bool c) {
        assembly {
            c := eq(a, 0)
        }
    }

    function signed(BN254Field.Type a) internal pure returns (bool positive, uint256 scalar) {
        uint256 raw = BN254Field.Type.unwrap(a);
        if (raw > PRIME_DIV_2) {
            return (false, PRIME - raw);
        } else {
            return (true, raw);
        }
    }

    function neg(BN254Field.Type a) internal pure returns (BN254Field.Type) {
        if (BN254Field.Type.unwrap(a) == 0) {
            return a;
        } else {
            return BN254Field.Type.wrap(PRIME - BN254Field.Type.unwrap(a));
        }
    }

    function sub(BN254Field.Type a, BN254Field.Type b) internal pure returns (BN254Field.Type c) {
        assembly {
            c := addmod(a, sub(PRIME, b), PRIME)
        }
    }

    function sub(BN254Field.Type a, uint256 b) internal pure returns (BN254Field.Type c) {
        assembly {
            c := addmod(a, sub(PRIME, b), PRIME)
        }
    }

    function pow(BN254Field.Type a, uint256 exponential) internal pure returns (BN254Field.Type c) {
        c = BN254Field.Type.wrap(1);
        BN254Field.Type base = a;
        uint256 exponent = exponential;

        while (exponent > 0) {
            if (exponent & 1 == 1) {
                c = mul(c, base);
            }
            base = mul(base, base);
            exponent = exponent >> 1;
        }
    }
}