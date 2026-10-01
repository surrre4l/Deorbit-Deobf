const {
  resolveConstant,
} = require("./constants");

function registerName(index) {
  if (!Number.isInteger(index) || index < 0) {
    return "R?";
  }

  return `R${index}`;
}

function registerExpression(index) {
  return registerName(index);
}

function constantExpression(
  prototype,
  index
) {
  return resolveConstant(
    prototype,
    index
  );
}

function operandExpression(
  prototype,
  operand,
  options = {}
) {
  const {
    constantBit = 1 << 8,
  } = options;

  if (
    typeof operand !== "number" ||
    !Number.isInteger(operand)
  ) {
    return "nil";
  }

  if ((operand & constantBit) !== 0) {
    const constantIndex =
      operand & (constantBit - 1);

    return constantExpression(
      prototype,
      constantIndex
    );
  }

  return registerExpression(
    operand
  );
}

function instructionTarget(
  programCounter,
  signedOffset
) {
  if (
    !Number.isInteger(programCounter) ||
    !Number.isInteger(signedOffset)
  ) {
    return null;
  }

  return (
    programCounter +
    1 +
    signedOffset
  );
}

module.exports = {
  registerName,
  registerExpression,
  constantExpression,
  operandExpression,
  instructionTarget,
};