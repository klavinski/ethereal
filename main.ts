import { fileToFrames } from "./read.ts";
import { frameToLayers } from "./layers.ts";
import { layerToEthernet } from "./ethernet.ts";
import { write } from "./write.ts";

if ( Deno.args[ 0 ] ) {

    const frames = await fileToFrames( Deno.args[ 0 ] );

    const layers = frames.map( frameToLayers )
        .map( ( { Ethernet, IP, TCP, HTTP } ) => ( {

        ...( Ethernet ? layerToEthernet( Ethernet ) : null )

    } ) );

    write( layers );

} else

    console.log( "Usage : deno run --allow-read --unstable index.ts <trace.txt> [ > <output.txt> ]" );