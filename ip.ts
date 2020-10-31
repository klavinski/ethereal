import { IPProtocolToName, DSCPToName } from "./names.ts";

const formatIP = ( bytes: number[] ) =>

    "0x"
        + bytes.map( dec => dec.toString( 16 ).padStart( 2, "0" ) ).join( "" )
        + " (" + bytes.join( "." ) + ")";

const formatTimeStamp = ( bytes: number[] ) => 

    "0x"
    + bytes.map( dec => dec.toString( 16 ).padStart( 2, "0" ) ).join( "" )
    + " (" + new Date( bytes.reduce( ( acc, cur ) => 256 * acc + cur, 0 ) * 1000 ).toISOString() + ")";

const groupIPs = ( bytes: number[] ): string[] =>

    bytes.length === 0
    ? []
    : [
        formatIP( bytes.slice( 0, 4 ) ),
        ...groupIPs( bytes.slice( 4 ) )
    ]
;

const groupTimeStamps = ( bytes: number[] ): string[] =>

    bytes.length === 0
    ? []
    : [
        formatTimeStamp( bytes.slice( 0, 4 ) ),
        ...groupTimeStamps( bytes.slice( 4 ) )
    ]
;

const groupIPsAndTimeStamps = ( bytes: number[] ): string[] =>

    bytes.length === 0
        ? []
        : [
            formatIP( bytes.slice( 0, 4 ) ) + " at " +
            formatTimeStamp( bytes.slice( 4, 8 ) ),
            ...groupIPsAndTimeStamps( bytes.slice( 8 ) )
        ]
    ;

const parseOptions = ( bytes: number[] ): { [ key: string ]: string | string[] | { Name: string, "Copy on fragmentation": string, Class: string, Number: string } }[] => {

    if ( bytes.length === 0 )

        return [];

    switch ( bytes[ 0 ] ) {

        case 0:

            return [ {
                
                Type: {
                    
                    Name: "0x00 (End Of Options List)",
                    "Copy on fragmentation": "0... .... (No)",
                    Class: ".00. .... (Control)",
                    Number: `...0 0000 (0)`

                }

            } ];
        
         case 1:

            return [ {
                
                Type: {
                    
                    Name: "0x01 (No Operation)",
                    "Copy on fragmentation": "0... .... (No)",
                    Class: ".00. .... (Control)",
                    Number: `...0 0001 (1)`

                } },
                ...parseOptions( bytes.slice( 1 ) )

            ];

        case 131: {

            const [ type, length, pointer ] = bytes;

            return [ {

                Type: {
                    
                    Name: "0x83 (Loose Source Route)",
                    "Copy on fragmentation": "1... .... (Yes)",
                    Class: ".00. .... (Control)",
                    Number: `...0 0011 (3)`

                },
                Length: `0x${ length.toString( 16 ).padStart( 2, "0" ) } (${ length } bytes)`,
                Pointer: `0x${ pointer.toString( 16 ).padStart( 2, "0" ) } (${ pointer })`,
                Route: groupIPs( bytes.slice( 4, pointer ) )

                },
                ...parseOptions( bytes.slice( length ) )

            ];
        }

        case 68: {

            const [ type, length, pointer, overflowFlag ] = bytes;
            const overflow = Math.floor( overflowFlag / 8 );
            const flag = overflowFlag % 8;

            return [ {

                Type: {
                    
                    Name: "0x44 (Time Stamp)",
                    "Copy on fragmentation": "0... .... (No)",
                    Class: ".10. .... (Debugging and measurement)",
                    Number: `...0 0100 (4)`

                },
                Length: `0x${ length.toString( 16 ).padStart( 2, "0" ) } (${ length } bytes)`,
                Pointer: `0x${ pointer.toString( 16 ).padStart( 2, "0" ) } (${ pointer })`,
                Overflow: `${ overflow.toString( 2 ).padStart( 4, "0" ) } .... (${ overflow })`,
                Flag: `${ flag.toString( 2 ).padStart( 4, "0" ) } .... (${ flag })`,
                TimeStamps: ( flag === 0 ? groupTimeStamps : groupIPsAndTimeStamps )( bytes.slice( 4, pointer ) )

                },
                ...parseOptions( bytes.slice( length ) )

            ];
        }

        case 134: {

            const length = bytes[ 1 ];
            const DOI = 256 ** 3 * bytes[ 2 ] + 256 ** 2 * bytes[ 3 ] + 256 * bytes[ 4 ] + bytes[ 5 ]

            return [ {

                Type: {
                    
                    Name: "0x86 (Commercial security)",
                    "Copy on fragmentation": "1... .... (Yes)",
                    Class: ".00. .... (Control)",
                    Number: `...0 0110 (6)`

                },
                Length: `0x${ length.toString( 16 ).padStart( 2, "0" ) } (${ length } bytes)`,
                DOI: `0x${ DOI.toString( 16 ).padStart( 2, "0" ) } (${ DOI })`,
                Tags: "0x" + bytes.slice( 6, length ).map( dec => dec.toString( 16 ).padStart( 2, "0" ) ).join( "" )

                },
                ...parseOptions( bytes.slice( length ) )

            ];
        }

        case 7: {

            const [ type, length, pointer ] = bytes;

            return [ {

                Type: {
                    
                    Name: "0x07 (Record Route)",
                    "Copy on fragmentation": "0... .... (No)",
                    Class: ".00. .... (Control)",
                    Number: `...0 0111 (7)`

                },
                Length: `0x${ length.toString( 16 ).padStart( 2, "0" ) } (${ length } bytes)`,
                Pointer: `0x${ pointer.toString( 16 ).padStart( 2, "0" ) } (${ pointer })`,
                Route: groupIPs( bytes.slice( 4, pointer ) )

                },
                ...parseOptions( bytes.slice( length ) )

            ];

        }

        case 136: {

            const length = bytes[ 1 ];
            const streamID = bytes.slice( 2, length ).reduce( ( acc, cur ) => 256 * acc + cur, 0 );

            return [ {

                Type: {
                    
                    Name: "0x6c (Stream Identifier)",
                    "Copy on fragmentation": "1... .... (Yes)",
                    Class: ".00. .... (Control)",
                    Number: `...0 1000 (8)`

                },
                Length: `0x${ length.toString( 16 ).padStart( 2, "0" ) } (${ length } bytes)`,
                "Stream ID": `0x${ streamID.toString( 16 ).padStart( 2, "0" ) } (${ streamID })`

                },
                ...parseOptions( bytes.slice( length ) )

            ];

        }

        case 137: {

            const [ type, length, pointer ] = bytes;

            return [ {

                Type: {
                    
                    Name: "0x89 (Strict Source Route)",
                    "Copy on fragmentation": "1... .... (Yes)",
                    Class: ".00. .... (Control)",
                    Number: `...0 1001 (9)`

                },
                Length: `0x${ length.toString( 16 ).padStart( 2, "0" ) } (${ length } bytes)`,
                Pointer: `0x${ pointer.toString( 16 ).padStart( 2, "0" ) } (${ pointer })`,
                Route: groupIPs( bytes.slice( 4, pointer ) )

                },
                ...parseOptions( bytes.slice( length ) )

            ];

        }

        case 148: {

            const value = bytes[ 2 ] * 256 + bytes[ 3 ];
            const valueHex = value.toString( 2 ).padStart( 4, "0" );

            return [ {

                Type: {
                    
                    Name: "0x94 (Router Alert)",
                    "Copy on fragmentation": "1... .... (Yes)",
                    Class: ".00. .... (Control)",
                    Number: `...1 0100 (20)`

                },
                Length: "0x04 (4 bytes)",
                Value: value === 0
                    ? "0x0000 (Router shall examine packet)"
                    : value < 33
                    ? `0x${ valueHex } (Aggregated Reservation Nesting Level)`
                    : value < 65
                    ? `0x${ valueHex } (QoS NSLP Aggregation Levels 0-31)`
                    : value < 66
                    ? "0x41 (NSIS NATFW NSLP)"
                    : value < 65503
                    ? `0x${ valueHex } (Unassigned)`
                    : value < 65535
                    ? `0x${ valueHex } (Reserved for experimental use)`
                    : "0xff Reserved"
                },
                ...parseOptions( bytes.slice( 4 ) )

            ];

        }

        default:

            console.log( "Invalid option." );
            return [];

    }

};

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
        Source: formatIP( layer.slice( 12, 16 ) ),
        Destination: formatIP( layer.slice( 16, 20 ) ),
        Options: parseOptions( layer.slice( 20 ) ),
    };
    
};