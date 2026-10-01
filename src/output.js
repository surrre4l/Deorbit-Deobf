const DEORBIT_HEADER = [
  "-- [( Deobfuscated by Deorbit)]",
  "-- [ By surrre4L ]",
  "",
].join("\n");

function createDeorbitOutput(source) {
  if (typeof source !== "string") {
    throw new Error("Deorbit output must be a string.");
  }

  return DEORBIT_HEADER + source.trim() + "\n";
}

module.exports = {
  DEORBIT_HEADER,
  createDeorbitOutput,
};