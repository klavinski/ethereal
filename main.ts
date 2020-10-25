import { fileToFrames } from "./read.ts";
import { frameToLayers } from "./layers.ts";
import { layerToEthernet } from "./ethernet.ts";
import { write } from "./write.ts";

if ( Deno.args[ 0 ] ) {

    const frames = await fileToFrames( Deno.args[ 0 ] );

    const layers = frames.map( frameToLayers )
        .map( ( { Ethernet, IP, TCP, HTTP } ) => ( {

        Ethernet: layerToEthernet( Ethernet ),
        IP: IP,
        TCP: TCP,
        HTTP: HTTP

    } ) );

    if ( Deno.args[ 1 ] )

        write( layers )

    else
    
        console.log( layers );

} else

    console.log( "Usage : deno run --allow-read --unstable index.ts <trace.txt> [ <output.txt> ]" );