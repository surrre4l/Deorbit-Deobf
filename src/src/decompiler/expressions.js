const {
  OPCODES,
} = require("../bytecode/opcodes");

const {
  constantExpression,
  registerExpression,
  operandExpression,
} = require("../bytecode/expressions");

function binaryExpression(
  operator,
  left,
  right
) {
  return `(${left} ${operator} ${right})`;
}

function unaryExpression(
  operator,
  value
) {
  return `(${operator}${value})`;
}

function buildInstructionExpression(
  instruction,
  prototype
) {
  const {
    opcode,
    a,
    b,
    c,
  } = instruction;

  switch (opcode) {
    case OPCODES.LOADK:
      return {
        target: registerExpression(a),
        expression:
          constantExpression(
            prototype,
            instruction.bx
          ),
      };

    case OPCODES.MOVE:
      return {
        target: registerExpression(a),
        expression:
          registerExpression(b),
      };

    case OPCODES.GETGLOBAL:
      return {
        target: registerExpression(a),
        expression:
          constantExpression(
            prototype,
            instruction.bx
          ),
      };

    case OPCODES.GETTABLE:
      return {
        target: registerExpression(a),
        expression:
          `${registerExpression(b)}[${operandExpression(
            prototype,
            c
          )}]`,
      };

    case OPCODES.ADD:
      return {
        target: registerExpression(a),
        expression: binaryExpression(
          "+",
          operandExpression(
            prototype,
            b
          ),
          operandExpression(
            prototype,
            c
          )
        ),
      };

    case OPCODES.SUB:
      return {
        target: registerExpression(a),
        expression: binaryExpression(
          "-",
          operandExpression(
            prototype,
            b
          ),
          operandExpression(
            prototype,
            c
          )
        ),
      };

    case OPCODES.MUL:
      return {
        target: registerExpression(a),
        expression: binaryExpression(
          "*",
          operandExpression(
            prototype,
            b
          ),
          operandExpression(
            prototype,
            c
          )
        ),
      };

    case OPCODES.DIV:
      return {
        target: registerExpression(a),
        expression: binaryExpression(
          "/",
          operandExpression(
            prototype,
            b
          ),
          operandExpression(
            prototype,
            c
          )
        ),
      };

    case OPCODES.MOD:
      return {
        target: registerExpression(a),
        expression: binaryExpression(
          "%",
          operandExpression(
            prototype,
            b
          ),
          operandExpression(
            prototype,
            c
          )
        ),
      };

    case OPCODES.POW:
      return {
        target: registerExpression(a),
        expression: binaryExpression(
          "^",
          operandExpression(
            prototype,
            b
          ),
          operandExpression(
            prototype,
            c
          )
        ),
      };

    case OPCODES.UNM:
      return {
        target: registerExpression(a),
        expression: unaryExpression(
          "-",
          registerExpression(b)
        ),
      };

    case OPCODES.NOT:
      return {
        target: registerExpression(a),
        expression: unaryExpression(
          "not ",
          registerExpression(b)
        ),
      };

    case OPCODES.LEN:
      return {
        target: registerExpression(a),
        expression: unaryExpression(
          "#",
          registerExpression(b)
        ),
      };

    case OPCODES.CONCAT:
      return {
        target: registerExpression(a),
        expression: binaryExpression(
          "..",
          registerExpression(b),
          registerExpression(c)
        ),
      };

    default:
      return null;
  }
}

module.exports = {
  binaryExpression,
  unaryExpression,
  buildInstructionExpression,
};