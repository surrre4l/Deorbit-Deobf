function getConstant(prototype, index) {
  if (
    !prototype ||
    !Array.isArray(prototype.constants)
  ) {
    throw new TypeError(
      "A prototype with constants is required."
    );
  }

  if (
    !Number.isInteger(index) ||
    index < 0 ||
    index >= prototype.constants.length
  ) {
    return {
      type: "unknown",
      value: undefined,
    };
  }

  return prototype.constants[index];
}

function constantToLua(constant) {
  if (!constant || typeof constant !== "object") {
    return "nil";
  }

  switch (constant.type) {
    case "nil":
      return "nil";

    case "boolean":
      return constant.value
        ? "true"
        : "false";

    case "number":
      if (
        typeof constant.value !== "number" ||
        !Number.isFinite(constant.value)
      ) {
        return "0";
      }

      return String(constant.value);

    case "string":
      return quoteLuaString(
        constant.value
      );

    default:
      return "nil";
  }
}

function quoteLuaString(value) {
  const text =
    typeof value === "string"
      ? value
      : String(value ?? "");

  return `"${text
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\r/g, "\\r")
    .replace(/\n/g, "\\n")
    .replace(/\t/g, "\\t")}"`;
}

function resolveConstant(
  prototype,
  index
) {
  return constantToLua(
    getConstant(
      prototype,
      index
    )
  );
}

module.exports = {
  getConstant,
  constantToLua,
  quoteLuaString,
  resolveConstant,
};