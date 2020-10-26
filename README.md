# Ethereal

## An Ethernet frame analyser by Kamil Szczerba and Emmanuel Ajuelos

1. Clone the repository with

```bash
git clone https://github.com/klavinski/ethereal
```

2. Download the [latest version of Deno](https://github.com/denoland/deno/releases/latest), a portable TypeScript runtime.

3. Extract the Deno executable into the repository folder.

4. Run Ethereal on Windows with

```bash
deno run --allow-read --unstable index.ts <trace.txt> [ > <output.txt> ]
```

or on Unix systems with

```bash
./deno run --allow-read --unstable index.ts <trace.txt> [ > <output.txt> ]
```

replacing `<trace.txt>` with the name of the trace file.
