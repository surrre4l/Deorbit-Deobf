const {
  OPCODES,
} = require("../bytecode/opcodes");

const {
  registerExpression,
  operandExpression,
} = require("../bytecode/expressions");

const {
  buildInstructionExpression,
} = require("./expressions");

function buildStatement(
  instruction,
  prototype
) {
  const expression =
    buildInstructionExpression(
      instruction,
      prototype
    );

  if (expression) {
    return `${expression.target} = ${expression.expression}`;
  }

  switch (instruction.opcode) {
    case OPCODES.SETGLOBAL:
      return [
        `${constantName(
          prototype,
          instruction.bx
        )} = ${registerExpression(
          instruction.a
        )}`,
      ].join("");

    case OPCODES.SETUPVAL:
      return [
        `-- set upvalue `,
        registerExpression(
          instruction.a
        ),
      ].join("");

    case OPCODES.SETTABLE:
      return [
        `${registerExpression(
          instruction.a
        )}[${operandExpression(
          prototype,
          instruction.b
        )}] = ${operandExpression(
          prototype,
          instruction.c
        )}`,
      ].join("");

    case OPCODES.NEWTABLE:
      return `${registerExpression(
        instruction.a
      )} = {}`;

    case OPCODES.RETURN:
      if (instruction.b === 1) {
        return "return";
      }

      return `return ${registerExpression(
        instruction.a
      )}`;

    case OPCODES.CLOSE:
      return "-- close registers";

    case OPCODES.JMP:
      return `-- jump ${instruction.sbx}`;

    case OPCODES.EQ:
      return `-- equality test ${instruction.a}`;

    case OPCODES.LT:
      return `-- less-than test ${instruction.a}`;

    case OPCODES.LE:
      return `-- less-or-equal test ${instruction.a}`;

    case OPCODES.TEST:
      return `-- test ${registerExpression(
        instruction.a
      )}`;

    case OPCODES.TESTSET:
      return `-- testset ${registerExpression(
        instruction.a
      )}`;

    case OPCODES.CALL:
      return `${registerExpression(
        instruction.a
      )} = ${registerExpression(
        instruction.a
      )}(...)`;

    case OPCODES.TAILCALL:
      return `return ${registerExpression(
        instruction.a
      )}(...)`;

    case OPCODES.VARARG:
      return `${registerExpression(
        instruction.a
      )} = ...`;

    default:
      return `-- ${instruction.name || "UNKNOWN"} ` +
        `A=${instruction.a} ` +
        `B=${instruction.b} ` +
        `C=${instruction.c}`;
  }
}

function constantName(
  prototype,
  index
) {
  if (
    !prototype ||
    !Array.isArray(
      prototype.constants
    )
  ) {
    return `GLOBAL_${index}`;
  }

  const constant =
    prototype.constants[index];

  if (
    constant &&
    constant.type === "string"
  ) {
    return constant.value;
  }

  return `GLOBAL_${index}`;
}

function buildStatements(
  instructions,
  prototype
) {
  if (!Array.isArray(instructions)) {
    throw new TypeError(
      "Instructions must be an array."
    );
  }

  return instructions.map(
    (instruction) =>
      buildStatement(
        instruction,
        prototype
      )
  );
}

module.exports = {
  buildStatement,
  buildStatements,
};