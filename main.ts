import { fileToFrames } from "./read.ts";
import { frameToLayers } from "./layers.ts";
import { layerToEthernet } from "./ethernet.ts";
import { layerToIP } from "./ip.ts";
import { layerToHTTP } from "./http.ts";
import { layerToTCP } from "./tcp.ts";
import { write } from "./write.ts";

if ( Deno.args[ 0 ] ) {

    const frames = await fileToFrames( Deno.args[ 0 ] );

    const layers = frames.map( frameToLayers )
    .map( ( { Ethernet, IP, TCP, HTTP } ) => ( {

        ...( Ethernet ? { Ethernet: layerToEthernet( Ethernet ) } : null ),
        ...( IP ? { IP: layerToIP( IP ) } : null ),
        ...( HTTP ? { HTTP: layerToHTTP( HTTP ) } : null ),
        ...( TCP ? { TCP: layerToTCP( TCP ) } : null )

    } ) );

    write( layers );

} else

    console.log( "Usage : deno run --allow-read --unstable main.ts <trace.txt> [ > <output.txt> ]" );