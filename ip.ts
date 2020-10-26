import { IPProtocolToName, DSCPToName } from "./names.ts";

export const layerToIP = ( layer: number[] ) => {

    const version = Math.floor( layer[ 0 ] / 16 );
    const headerLength = layer[ 0 ] % 16;
    const DSCP = Math.floor( layer[ 1 ] / 4 );
    const explicitCongestionNotification = layer[ 1 ] % 4;
    const totalLength = layer[ 2 ] * 256 + layer[ 3 ];
    const identification = layer[ 4 ] * 256 + layer[ 5 ];
    const reservedBit = Math.floor( layer[ 6 ] / 128 );
    const dontFragment = Math.floor( layer[ 6 ] / 64 ) % 2;
    const moreFragments = Math.floor( layer[ 6 ] / 32 ) % 2;
    const fragmentOffset = layer[ 6 ] * 256 % 32 + layer[ 7 ];
    const timeToLive = layer[ 8 ];
    const protocol = layer[ 9 ];
    const headerChecksum = layer[ 10 ] * 256 + layer[ 11 ];
    const source =layer[ 12 ] + "." + layer[ 13 ] + "." + layer[ 14 ] + "." + layer[ 15 ];
    const destination = layer[ 16 ] + "." + layer[ 17 ] + "." + layer[ 18 ] + "." + layer[ 19 ];

    return {

        Version: `0x${ version.toString( 16 ) } (${ version })`,
        "Header length": `0x${ headerLength.toString( 16 ) } (${ headerLength * 4 } bytes)`,
        "Differentiated services field": {

            "Differentiated services codepoint": `${ DSCP.toString( 2 ).padStart( 6, "0" ) }.. (${ DSCPToName( DSCP ) })`,
            "Explicit congestion notification": [

                "......00 Non ECN-Capable Transport",
                "......01 ECN Capable Transport",
                "......10 ECN Capable Transport",
                "......11 Congestion Encountered"

            ][ explicitCongestionNotification ]

        },
        "Total length": `0x${ totalLength.toString( 16 ).padStart( 4, "0" ) } (${ totalLength })`,
        Identification: `0x${ identification.toString( 16 ).padStart( 4, "0" ) } (${ identification })`,
        Flags: {

            "Reserved bit": reservedBit ? "1.. (Set)" : "0.. (Not set)",
            "Don't fragment": dontFragment ? ".1. (Set)" : ".0. (Not set)",
            "More fragments": moreFragments ? "..1 (Set)" : "..0 (Not set)"

        },
        "Fragment offset": `0x${ fragmentOffset.toString( 16 ) } (${ fragmentOffset })`,
        "Time to live": `0x${ timeToLive.toString( 16 ).padStart( 2, "0" ) } (${ timeToLive })`,
        Protocol: `0x${ protocol.toString( 16 ).padStart( 2, "0" ) } (${ IPProtocolToName( protocol ) })`,
        "Header checksum": `0x${ headerChecksum.toString( 16 ) } (${ headerChecksum })`,
        Source: source,
        Destination: destination,
        Options: {},
    };
    
};