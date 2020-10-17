import { fileToFrames } from "./read.ts";
if ( Deno.args[ 0 ] ) {

    fileToFrames( Deno.args[ 0 ] );
}
else
    console.log( "Usage : deno run --allow-read index.ts <trace.txt>");

// Lecture du fichier

// Conversion en hexadécimal

// Séparer par protocole