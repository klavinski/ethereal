import { fileToFrames } from "./read.ts";

if ( Deno.args[ 0 ] ) {

    const frames = await fileToFrames( Deno.args[ 0 ] );
    console.log( frames );
}
else
    console.log( "Usage : deno run --allow-read index.ts <trace.txt>");

// Lecture du fichier

// Conversion en hexadécimal

// Séparer par protocole