const {
  getOpcodeName,
  isKnownOpcode,
} = require("./opcodes");

function disassemblePrototype(prototype, options = {}) {
  if (!prototype || typeof prototype !== "object") {
    throw new TypeError("A prototype object is required.");
  }

  const indent = options.indent ?? "";
  const instructions = Array.isArray(prototype.instructions)
    ? prototype.instructions
    : [];

  const lines = [
    `${indent}Function #${prototype.id ?? "?"}`,
    `${indent}Parameters: ${prototype.parameters ?? 0}`,
    `${indent}Upvalues: ${prototype.upvalues ?? 0}`,
    `${indent}Max stack: ${prototype.maxStack ?? 0}`,
    `${indent}Instructions:`,
  ];

  instructions.forEach((instruction, index) => {
    const opcode = instruction.opcode;
    const name = getOpcodeName(opcode);
    const status = isKnownOpcode(opcode) ? "" : " [unknown]";

    lines.push(
      `${indent}  ${String(index + 1).padStart(4, "0")}  ` +
      `${name}${status}  ` +
      `A=${instruction.a} ` +
      `B=${instruction.b} ` +
      `C=${instruction.c} ` +
      `Bx=${instruction.bx} ` +
      `sBx=${instruction.sbx}`
    );
  });

  const children = Array.isArray(prototype.children)
    ? prototype.children
    : [];

  for (const child of children) {
    lines.push("");
    lines.push(
      disassemblePrototype(child, {
        ...options,
        indent: `${indent}  `,
      })
    );
  }

  return lines.join("\n");
}

function disassembleBytecode(parsed) {
  if (!parsed || !parsed.root) {
    throw new TypeError("Parsed bytecode with a root prototype is required.");
  }

  const header = parsed.header ?? {};

  return [
    "Deorbit Bytecode Disassembly",
    "============================",
    `Version: ${header.version ?? "unknown"}`,
    `Format: ${header.format ?? "unknown"}`,
    `Endian: ${header.littleEndian ? "Little" : "Big"}`,
    "",
    disassemblePrototype(parsed.root),
  ].join("\n");
}

module.exports = {
  disassemblePrototype,
  disassembleBytecode,
};