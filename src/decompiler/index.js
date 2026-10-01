const {
  readBytecode,
} = require("../bytecode/prototype");

const {
  reconstructPrototypeTree,
} = require("./function");

const {
  createDeorbitOutput,
} = require("../output");

function decompileBytecode(data) {
  if (!Buffer.isBuffer(data)) {
    throw new TypeError(
      "Deorbit expects Lua bytecode as a Buffer."
    );
  }

  const parsed =
    readBytecode(data);

  const source =
    reconstructPrototypeTree(
      parsed.root
    );

  return {
    header: parsed.header,
    root: parsed.root,
    source: createDeorbitOutput(
      source
    ),
    bytesRead: parsed.bytesRead,
    bytesRemaining:
      parsed.bytesRemaining,
  };
}

module.exports = {
  decompileBytecode,
};