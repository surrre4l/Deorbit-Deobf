class BytecodeReader {
  constructor(data) {
    if (!Buffer.isBuffer(data)) {
      throw new TypeError("BytecodeReader expects a Buffer.");
    }

    this.data = data;
    this.position = 0;
    this.littleEndian = true;
    this.intSize = 4;
    this.sizeSize = 4;
  }

  ensure(length) {
    if (this.position + length > this.data.length) {
      throw new Error("Unexpected end of bytecode.");
    }
  }

  byte() {
    this.ensure(1);

    return this.data[this.position++];
  }

  bytes(length) {
    this.ensure(length);

    const value = this.data.subarray(
      this.position,
      this.position + length
    );

    this.position += length;

    return value;
  }

  int(size = this.intSize) {
    const data = this.bytes(size);

    return this.littleEndian
      ? Number(data.readUIntLE(0, size))
      : Number(data.readUIntBE(0, size));
  }

  readInt() {
    return this.int(this.intSize);
  }

  readSize() {
    return this.int(this.sizeSize);
  }

  readNumber() {
    const data = this.bytes(8);

    return this.littleEndian
      ? data.readDoubleLE(0)
      : data.readDoubleBE(0);
  }

  readString() {
    const length = this.readSize();

    if (!length) {
      return null;
    }

    const stringLength = length - 1;

    const value = this.bytes(stringLength);

    this.byte();

    return value.toString("utf8");
  }

  readHeader() {
    const signature = this.bytes(4).toString("latin1");

    if (signature !== "\x1bLua") {
      throw new Error("Invalid Lua bytecode signature.");
    }

    const version = this.byte();
    const format = this.byte();
    const endian = this.byte();

    this.littleEndian = endian === 1;
    this.intSize = this.byte();
    this.sizeSize = this.byte();

    const instructionSize = this.byte();
    const numberSize = this.byte();
    const integralFlag = this.byte();

    return {
      signature,
      version,
      format,
      littleEndian: this.littleEndian,
      intSize: this.intSize,
      sizeSize: this.sizeSize,
      instructionSize,
      numberSize,
      integralFlag,
    };
  }

  get offset() {
    return this.position;
  }

  get remaining() {
    return this.data.length - this.position;
  }
}

module.exports = {
  BytecodeReader,
};