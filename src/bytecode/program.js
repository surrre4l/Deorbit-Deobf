const {
  describeInstruction,
} = require("./instructions");

const {
  inspectPrototype,
} = require("./inspect");

function buildProgram(prototype) {
  if (!prototype || typeof prototype !== "object") {
    throw new TypeError(
      "A root prototype is required."
    );
  }

  const instructions =
    Array.isArray(prototype.instructions)
      ? prototype.instructions
      : [];

  return {
    id: prototype.id,

    source:
      prototype.source || null,

    lineStart:
      prototype.lineStart ?? 0,

    lineEnd:
      prototype.lineEnd ?? 0,

    parameters:
      prototype.parameters ?? 0,

    upvalues:
      prototype.upvalues ?? 0,

    maxStack:
      prototype.maxStack ?? 0,

    instructions:
      instructions.map(
        (instruction, index) => ({
          index,
          ...describeInstruction(
            instruction
          ),
        })
      ),

    constants:
      Array.isArray(prototype.constants)
        ? prototype.constants
        : [],

    children:
      Array.isArray(prototype.children)
        ? prototype.children.map(
            buildProgram
          )
        : [],

    locals:
      Array.isArray(prototype.locals)
        ? prototype.locals
        : [],

    upvalueNames:
      Array.isArray(
        prototype.upvalueNames
      )
        ? prototype.upvalueNames
        : [],

    inspection:
      inspectPrototype(prototype),
  };
}

function buildProgramTree(prototype) {
  return buildProgram(prototype);
}

module.exports = {
  buildProgram,
  buildProgramTree,
};