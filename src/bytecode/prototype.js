const {
  BytecodeReader,
} = require("./reader");

const OPCODE_MASK = 0x3f;
const A_MASK = 0xff;
const B_MASK = 0x1ff;
const C_MASK = 0x1ff;
const BX_MASK = 0x3ffff;

const SBX_BIAS = 131071;

let functionId = 0;

function readInstruction(reader) {
  const raw = reader.readInt();

  const opcode =
    raw & OPCODE_MASK;

  const a =
    (raw >>> 6) & A_MASK;

  const c =
    (raw >>> 14) & C_MASK;

  const b =
    (raw >>> 23) & B_MASK;

  const bx =
    (raw >>> 14) & BX_MASK;

  return {
    raw,
    opcode,
    a,
    b,
    c,
    bx,
    sbx: bx - SBX_BIAS,
  };
}

function readConstant(reader) {
  const type = reader.byte();

  switch (type) {
    case 0:
      return {
        type: "nil",
      };

    case 1:
      return {
        type: "boolean",
        value: reader.byte() !== 0,
      };

    case 3:
      return {
        type: "number",
        value: reader.readNumber(),
      };

    case 4:
      return {
        type: "string",
        value: reader.readString(),
      };

    default:
      return {
        type: "unknown",
        rawType: type,
      };
  }
}

function readPrototype(reader, parent = null) {
  const id = ++functionId;

  const prototype = {
    id,
    parent,

    source: reader.readString(),

    lineStart: reader.readInt(),
    lineEnd: reader.readInt(),

    upvalues: reader.byte(),
    parameters: reader.byte(),
    vararg: reader.byte(),
    maxStack: reader.byte(),

    instructions: [],
    constants: [],
    children: [],
    locals: [],
    upvalueNames: [],
  };

  const instructionCount =
    reader.readInt();

  for (
    let index = 0;
    index < instructionCount;
    index++
  ) {
    prototype.instructions.push(
      readInstruction(reader)
    );
  }

  const constantCount =
    reader.readInt();

  for (
    let index = 0;
    index < constantCount;
    index++
  ) {
    prototype.constants.push(
      readConstant(reader)
    );
  }

  const childCount =
    reader.readInt();

  for (
    let index = 0;
    index < childCount;
    index++
  ) {
    prototype.children.push(
      readPrototype(reader, prototype)
    );
  }

  const lineInfoCount =
    reader.readInt();

  for (
    let index = 0;
    index < lineInfoCount;
    index++
  ) {
    reader.readInt();
  }

  const localCount =
    reader.readInt();

  for (
    let index = 0;
    index < localCount;
    index++
  ) {
    prototype.locals.push({
      name: reader.readString(),
      start: reader.readInt(),
      end: reader.readInt(),
    });
  }

  const upvalueNameCount =
    reader.readInt();

  for (
    let index = 0;
    index < upvalueNameCount;
    index++
  ) {
    prototype.upvalueNames.push(
      reader.readString()
    );
  }

  return prototype;
}

function resetPrototypeIds() {
  functionId = 0;
}

function readBytecode(data) {
  const reader =
    new BytecodeReader(data);

  const header =
    reader.readHeader();

  resetPrototypeIds();

  const root =
    readPrototype(reader);

  return {
    header,
    root,
    bytesRead: reader.offset,
    bytesRemaining: reader.remaining,
  };
}

module.exports = {
  readBytecode,
  readPrototype,
  readInstruction,
  readConstant,
  resetPrototypeIds,
};