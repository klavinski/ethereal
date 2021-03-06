# Ethereal

![Project banner](./image.png)

## An Ethernet frame analyser by Kamil Szczerba and Emmanuel Ajuelos

Explanatory video [on YouTube](https://www.youtube.com/watch?v=q9IsAYpqCO4) (French).

1. Download and extract the [latest version from the releases tab](https://github.com/klavinski/ethereal/releases/latest).

2. Run Ethereal on Windows with

```bash
deno run --allow-read --unstable main.ts <trace.txt> [ > <output.txt> ]
```

or on Unix systems with

```bash
./deno run --allow-read --unstable main.ts <trace.txt> [ > <output.txt> ]
```

replacing `<trace.txt>` with the name of the trace file.
