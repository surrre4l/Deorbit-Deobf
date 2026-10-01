const {
  getOpcodeName,
  isKnownOpcode,
} = require("./opcodes");

function decodeInstruction(instruction) {
  if (!instruction || typeof instruction !== "object") {
    throw new TypeError(
      "decodeInstruction expects an instruction object."
    );
  }

  const {
    raw,
    opcode,
    a,
    b,
    c,
    bx,
    sbx,
  } = instruction;

  return {
    raw,
    opcode,
    name: getOpcodeName(opcode),
    known: isKnownOpcode(opcode),

    operands: {
      A: a,
      B: b,
      C: c,
      Bx: bx,
      sBx: sbx,
    },
  };
}

function decodeInstructions(instructions) {
  if (!Array.isArray(instructions)) {
    throw new TypeError(
      "decodeInstructions expects an instruction array."
    );
  }

  return instructions.map(
    decodeInstruction
  );
}

function formatInstruction(instruction, index = 0) {
  const decoded =
    decodeInstruction(instruction);

  const {
    name,
    operands,
  } = decoded;

  return [
    `${String(index + 1).padStart(4, "0")}:`,
    name.padEnd(10, " "),
    `A=${operands.A}`,
    `B=${operands.B}`,
    `C=${operands.C}`,
    `Bx=${operands.Bx}`,
    `sBx=${operands.sBx}`,
  ].join(" ");
}

function formatInstructions(instructions) {
  return decodeInstructions(instructions)
    .map((instruction, index) =>
      formatInstruction(
        instruction,
        index
      )
    )
    .join("\n");
}

module.exports = {
  decodeInstruction,
  decodeInstructions,
  formatInstruction,
  formatInstructions,
};