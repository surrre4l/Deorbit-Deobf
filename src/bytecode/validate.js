const { OPCODE_NAMES } = require("./opcodes");

function validateHeader(header) {
  const errors = [];

  if (!header || typeof header !== "object") {
    return ["A bytecode header is required."];
  }

  if (header.signature !== "\x1bLua") {
    errors.push("Invalid Lua bytecode signature.");
  }

  if (header.version !== 0x51) {
    errors.push(
      `Unsupported Lua bytecode version: 0x${Number(
        header.version
      ).toString(16)}. This reader currently targets Lua 5.1.`
    );
  }

  if (header.format !== 0) {
    errors.push(
      `Unsupported bytecode format: ${header.format}.`
    );
  }

  if (![4, 8].includes(header.intSize)) {
    errors.push(
      `Unsupported integer size: ${header.intSize}.`
    );
  }

  if (![4, 8].includes(header.sizeSize)) {
    errors.push(
      `Unsupported size field: ${header.sizeSize}.`
    );
  }

  if (header.instructionSize !== 4) {
    errors.push(
      `Unsupported instruction size: ${header.instructionSize}.`
    );
  }

  if (![4, 8].includes(header.numberSize)) {
    errors.push(
      `Unsupported number size: ${header.numberSize}.`
    );
  }

  return errors;
}

function validatePrototype(prototype, options = {}) {
  const errors = [];
  const maxInstructions = options.maxInstructions ?? 100000;
  const maxConstants = options.maxConstants ?? 100000;
  const maxChildren = options.maxChildren ?? 10000;

  if (!prototype || typeof prototype !== "object") {
    return ["Invalid prototype object."];
  }

  const instructions = prototype.instructions;
  const constants = prototype.constants;
  const children = prototype.children;

  if (!Array.isArray(instructions)) {
    errors.push("Prototype instructions must be an array.");
  } else {
    if (instructions.length > maxInstructions) {
      errors.push("Prototype exceeds the instruction limit.");
    }

    instructions.forEach((instruction, index) => {
      if (
        !instruction ||
        !Number.isInteger(instruction.opcode) ||
        !Object.prototype.hasOwnProperty.call(
          OPCODE_NAMES,
          instruction.opcode
        )
      ) {
        errors.push(
          `Instruction ${index + 1} has an unknown opcode.`
        );
      }
    });
  }

  if (!Array.isArray(constants)) {
    errors.push("Prototype constants must be an array.");
  } else if (constants.length > maxConstants) {
    errors.push("Prototype exceeds the constant limit.");
  }

  if (!Array.isArray(children)) {
    errors.push("Prototype children must be an array.");
  } else if (children.length > maxChildren) {
    errors.push("Prototype exceeds the child-function limit.");
  }

  if (
    !Number.isInteger(prototype.parameters) ||
    prototype.parameters < 0
  ) {
    errors.push("Invalid parameter count.");
  }

  if (
    !Number.isInteger(prototype.maxStack) ||
    prototype.maxStack < 0
  ) {
    errors.push("Invalid maximum stack size.");
  }

  return errors;
}

function validatePrototypeTree(prototype, options = {}) {
  const errors = [];

  function visit(current, path) {
    const currentErrors =
      validatePrototype(current, options);

    for (const error of currentErrors) {
      errors.push(`${path}: ${error}`);
    }

    if (Array.isArray(current?.children)) {
      current.children.forEach((child, index) => {
        visit(child, `${path}.children[${index}]`);
      });
    }
  }

  visit(prototype, "root");
  return errors;
}

function validateBytecode(parsed, options = {}) {
  if (!parsed || typeof parsed !== "object") {
    return {
      valid: false,
      errors: ["Parsed bytecode is required."],
    };
  }

  const errors = [
    ...validateHeader(parsed.header),
    ...validatePrototypeTree(parsed.root, options),
  ];

  if (
    Number.isInteger(parsed.bytesRemaining) &&
    parsed.bytesRemaining !== 0
  ) {
    errors.push(
      `Unexpected trailing data: ${parsed.bytesRemaining} byte(s).`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

module.exports = {
  validateHeader,
  validatePrototype,
  validatePrototypeTree,
  validateBytecode,
};