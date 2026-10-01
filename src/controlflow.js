const {
  OPCODES,
} = require("./bytecode/opcodes");

function getJumpTarget(
  instruction,
  programCounter
) {
  if (
    !instruction ||
    typeof instruction.sbx !== "number"
  ) {
    return null;
  }

  return (
    programCounter +
    1 +
    instruction.sbx
  );
}

function collectJumpTargets(
  instructions
) {
  if (!Array.isArray(instructions)) {
    throw new TypeError(
      "Instructions must be an array."
    );
  }

  const targets = new Set();

  for (
    let index = 0;
    index < instructions.length;
    index++
  ) {
    const instruction =
      instructions[index];

    if (
      instruction.opcode === OPCODES.JMP ||
      instruction.opcode === OPCODES.FORPREP ||
      instruction.opcode === OPCODES.FORLOOP
    ) {
      const target =
        getJumpTarget(
          instruction,
          index
        );

      if (
        target !== null &&
        target >= 0 &&
        target < instructions.length
      ) {
        targets.add(target);
      }
    }
  }

  return [...targets].sort(
    (a, b) => a - b
  );
}

function findBlockBoundaries(
  instructions
) {
  if (!Array.isArray(instructions)) {
    throw new TypeError(
      "Instructions must be an array."
    );
  }

  const boundaries =
    new Set([0]);

  const jumpTargets =
    collectJumpTargets(
      instructions
    );

  for (const target of jumpTargets) {
    boundaries.add(target);
  }

  for (
    let index = 0;
    index < instructions.length;
    index++
  ) {
    const opcode =
      instructions[index].opcode;

    if (
      opcode === OPCODES.JMP ||
      opcode === OPCODES.RETURN ||
      opcode === OPCODES.TAILCALL
    ) {
      if (
        index + 1 <
        instructions.length
      ) {
        boundaries.add(index + 1);
      }
    }
  }

  return [...boundaries].sort(
    (a, b) => a - b
  );
}

function buildBasicBlocks(
  instructions
) {
  const boundaries =
    findBlockBoundaries(
      instructions
    );

  const blocks = [];

  for (
    let index = 0;
    index < boundaries.length;
    index++
  ) {
    const start =
      boundaries[index];

    const next =
      boundaries[index + 1] ??
      instructions.length;

    blocks.push({
      id: blocks.length,
      start,
      end: next - 1,
      instructions:
        instructions.slice(
          start,
          next
        ),
    });
  }

  return blocks;
}

module.exports = {
  getJumpTarget,
  collectJumpTargets,
  findBlockBoundaries,
  buildBasicBlocks,
};