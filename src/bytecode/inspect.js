const {
  getOpcodeName,
} = require("./opcodes");

function inspectPrototype(prototype) {
  if (!prototype || typeof prototype !== "object") {
    throw new TypeError(
      "A prototype object is required."
    );
  }

  const instructions =
    Array.isArray(prototype.instructions)
      ? prototype.instructions
      : [];

  const constants =
    Array.isArray(prototype.constants)
      ? prototype.constants
      : [];

  const children =
    Array.isArray(prototype.children)
      ? prototype.children
      : [];

  const opcodeCounts = {};

  for (const instruction of instructions) {
    const name =
      getOpcodeName(
        instruction.opcode
      );

    opcodeCounts[name] =
      (opcodeCounts[name] || 0) + 1;
  }

  return {
    id: prototype.id,
    source: prototype.source,
    lineStart: prototype.lineStart,
    lineEnd: prototype.lineEnd,

    parameters:
      prototype.parameters ?? 0,

    upvalues:
      prototype.upvalues ?? 0,

    maxStack:
      prototype.maxStack ?? 0,

    instructionCount:
      instructions.length,

    constantCount:
      constants.length,

    childCount:
      children.length,

    localCount:
      Array.isArray(prototype.locals)
        ? prototype.locals.length
        : 0,

    upvalueNameCount:
      Array.isArray(
        prototype.upvalueNames
      )
        ? prototype.upvalueNames.length
        : 0,

    opcodeCounts,
  };
}

function inspectPrototypeTree(prototype) {
  const result = [];

  function visit(current, depth) {
    const summary =
      inspectPrototype(current);

    result.push({
      depth,
      ...summary,
    });

    for (const child of current.children || []) {
      visit(child, depth + 1);
    }
  }

  visit(prototype, 0);

  return result;
}

function formatPrototypeInspection(
  prototype
) {
  const tree =
    inspectPrototypeTree(
      prototype
    );

  return tree
    .map((item) => {
      const prefix =
        "  ".repeat(item.depth);

      return [
        `${prefix}Function #${item.id}`,
        `${prefix}  Instructions: ${item.instructionCount}`,
        `${prefix}  Constants: ${item.constantCount}`,
        `${prefix}  Children: ${item.childCount}`,
        `${prefix}  Parameters: ${item.parameters}`,
        `${prefix}  Upvalues: ${item.upvalues}`,
        `${prefix}  Max stack: ${item.maxStack}`,
      ].join("\n");
    })
    .join("\n\n");
}

module.exports = {
  inspectPrototype,
  inspectPrototypeTree,
  formatPrototypeInspection,
};