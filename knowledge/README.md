
# Deorbit Knowledge Base

Deorbit is a Discord-based Lua source analysis and standard Lua bytecode inspection assistant.

## Features

### Lua source tools

- `/deorbit format` — Format supplied Lua source.
- `/deorbit analyze` — Display basic source statistics.
- `/diagnose` — Check for obvious syntax issues.
- `/metrics` — Display source metrics.

### Bytecode tools

- `/bytecode` — Parse and disassemble supported standard Lua bytecode.
- Display instruction names and operands.
- Inspect function prototypes, constants, and nested functions.
- Validate parsed structures before disassembly.

## Bytecode support

The current reader targets standard Lua 5.1-style bytecode.

It is not a universal Lua or Luau bytecode reader. Other versions, modified formats, and custom virtual machines may not be supported.

## Limitations

- Disassembly is not the same as recovering original source code.
- Original variable names, comments, formatting, and some control-flow structure may not be recoverable.
- The current reconstruction layer supports only a subset of instructions and may produce incomplete or approximate Lua-like output.
- Validation cannot prove that a bytecode file is safe or valid in every Lua runtime.
- Obfuscator-specific virtual machines and protection bypasses are outside the scope of this generic parser.

## Output

Generated source output uses the Deorbit header:

    -- [( Deobfuscated by Deorbit)]
    -- [ By surreal something ]

This label identifies the output tool; it does not guarantee that the source is fully deobfuscated or executable.

## Development

Deorbit uses Node.js and discord.js.

Install dependencies:

    npm install

Start the bot:

    npm start

Configure the required environment variables using `.env`:

- `DISCORD_TOKEN`
- `CLIENT_ID`
- `GUILD_ID`

Do not commit `.env` or expose bot credentials.

## Project status

Deorbit is under development. Treat generated source and analysis as preliminary, and review output before using it in your own projects.
