const lookupTCPOptions = [
        "End of options list",
        "No operation",
        "Maximum Segment Size",
        "WSOPT - Window Scale",
        "SACK Permitted",
        "SACK (Selective ACK)",
        "Echo",
        "Echo Reply",
        "TSOPT - Time Stamp Option",
        "Partial Order Connection Permitted",
        "Partial Order Service Profile",
        "CC",
        "CC.NEW",
        "CC.ECHO",
        "TCP Alternate Checksum Request",
        "TCP Alternate Checksum Data"
];

const parseOptions = ( bytes: number[] ): { [ key: string ]: string }[] => {

    if ( bytes.length === 0 )

        return [];

    if ( bytes[ 0 ] === 0 )

        return [ { Kind: "0x00 (End of options list)" } ];

    if ( bytes[ 0 ] === 1 )

        return [ { Kind: "0x01 (No operation)" }, {}, ...parseOptions( bytes.slice( 1 ) ) ];

    if ( bytes[ 0 ] === 2 )

        return [ {

            Kind: "0x02 (Maximum Segment Size)",
            Length: "0x04 (4)",
            "MSS Value": "0x" + bytes.slice( 2, 4 ).map( dec => dec.toString( 16 ).padStart( 2, "0" ) ).join( "" ) + " (" + parseInt(bytes.slice( 2, 4 ).map( dec => dec.toString( 16 ).padStart( 2, "0" ) ).join( "" ), 16) + ")"

        },{} , ...parseOptions( bytes.slice( 4 ) ) ];

    if ( bytes[ 0 ] === 3 )

        return [ {

            Kind: "0x03 (WSOPT - Window Scale)",
            Length: "0x03 (3)",
            "Shift count": "0x" + bytes[3].toString( 16 ).padStart( 2, "0" ) + " (" + bytes[3] + ")"

        }, {}, ...parseOptions( bytes.slice( 3 ) ) ];


    if ( bytes[ 0 ] === 4 )

        return [ {

            Kind: "0x04 (Selective Acknowledgement permitted)",
            Length: "0x02 (2)"

        }, {}, ...parseOptions( bytes.slice( 2 ) ) ];

    if ( bytes[ 0 ] === 5 )

        return [ {

            Kind: "0x05 (SACK - Selective ACK)",
            Length: "0x" + bytes[ 1 ].toString( 16 ).padStart( 2, "0" ) + " (" + bytes[ 1 ] + ")",
            "left edge": "0x" + bytes.slice( 2, ( 1 + (bytes[1])/2 ) ).map( dec => dec.toString( 16 ).padStart( 2, "0" ) ).join( "" ),
            "right edge": "0x" + bytes.slice( 1 + (bytes[1])/2, bytes[ 1 ] ).map( dec => dec.toString( 16 ).padStart( 2, "0" ) ).join( "" )

        }, {}, ...parseOptions( bytes.slice( bytes[ 1 ] ) ) ];

    if ( bytes[ 0 ] === 8 )

        return [ {

            Kind: "0x08 (TSOPT - Time Stamp Option)",
            Length: "0x0A (10)",
            "Timestamp value": "0x" + bytes.slice( 2, 6 ).map( dec => dec.toString( 16 ).padStart( 2, "0" ) ).join( "" ) + " (" + parseInt(bytes.slice( 2, 6 ).map( dec => dec.toString( 16 ).padStart( 2, "0" ) ).join( "" ), 16) + ")",
            "Timestamp echo reply": "0x" + bytes.slice( 6, 10 ).map( dec => dec.toString( 16 ).padStart( 2, "0" ) ).join( "" ) + " (" + parseInt(bytes.slice( 6, 10 ).map( dec => dec.toString( 16 ).padStart( 2, "0" ) ).join( "" ), 16) + ")"

        }, {}, ...parseOptions( bytes.slice( 10 ) ) ];

    return [ {

        Kind: "0x" + bytes[ 0 ].toString( 16 ).padStart( 2, "0" ) + " (" + lookupTCPOptions[ bytes[ 0 ] ] + ")",
        Length: "0x" + bytes[ 1 ].toString( 16 ).padStart( 2, "0" ) + " (" + bytes[ 1 ] + ")",
        Data: "0x" + bytes.slice( 2, bytes[ 1 ] ).map( dec => dec.toString( 16 ).padStart( 2, "0" ) ).join( "" )

    }, {}, ...parseOptions( bytes.slice( bytes[ 1 ] ) ) ];

};

export const layerToTCP = ( layer: number[] ) => {

    const hexLayer = layer.map( byte => byte.toString( 16 ) );

    const sourcePort = "0x" + (hexLayer[0] + hexLayer[1]) + " (" + parseInt((hexLayer[0] + hexLayer[1]), 16) + ")";

    const destinationPort = "0x" + (hexLayer[2] + hexLayer[3]) + " (" + parseInt((hexLayer[2] + hexLayer[3]), 16) + ")";

    const sequenceNumber = "0x" + (hexLayer[4] + hexLayer[5] + hexLayer[6] + hexLayer[7]) + " (" + parseInt((hexLayer[4] + hexLayer[5] + hexLayer[6] + hexLayer[7]), 16) + ")";

    const acknowledgementNumber = "0x" + (hexLayer[8] + hexLayer[9] + hexLayer[10] + hexLayer[11]) + " (" + parseInt((hexLayer[8] + hexLayer[9] + hexLayer[10] + hexLayer[11]), 16) + ")";

    const headerLength = parseInt((hexLayer[12][0]), 16)*4;

    const flagsNotProcessed = (parseInt((hexLayer[12][1] + hexLayer[13]), 16).toString(2)).padStart(12, '0');

    const flags = {
        'Reserved': flagsNotProcessed[0] + flagsNotProcessed[1] + flagsNotProcessed[2] + ". .... .... " + ((flagsNotProcessed[0] + flagsNotProcessed[1] + flagsNotProcessed[2]) === "000"?"Not Set":"Set"),
        'Nonce': "..." + flagsNotProcessed[3] + " .... .... " + (flagsNotProcessed[3] === "1"?"Set":"Not Set"),
        'Congestion Window Reduced (CWR)': ".... " + flagsNotProcessed[4] + "... .... " + (flagsNotProcessed[4] === "1"?"Set":"Not Set"),
        'ECN-Echo': ".... ." + flagsNotProcessed[5] + ".. .... " + (flagsNotProcessed[5] === "1"?"Set":"Not Set"),
        'Urgent': ".... .." + flagsNotProcessed[6] + ". .... " + (flagsNotProcessed[6] === "1"?"Set":"Not Set"),
        'Acknoledgement': ".... ..." + flagsNotProcessed[7] + " .... " + (flagsNotProcessed[7] === "1"?"Set":"Not Set"),
        'Push': ".... ...." + flagsNotProcessed[8] + "... " + (flagsNotProcessed[8] === "1"?"Set":"Not Set"),
        'Reset': ".... .... ." + flagsNotProcessed[9] + ".. " + (flagsNotProcessed[9] === "1"?"Set":"Not Set"),
        'Syn': ".... .... .." + flagsNotProcessed[10] + ". " + (flagsNotProcessed[10] === "1"?"Set":"Not Set"),
        'Fin': ".... .... ..." + flagsNotProcessed[11] + " " + (flagsNotProcessed[11] === "1"?"Set":"Not Set")
    };

    const windowSize = "0x" + (hexLayer[14] + hexLayer[15]) + " (" + parseInt((hexLayer[14] + hexLayer[15]), 16) + ")";

    const checkSum = "0x" + (hexLayer[16] + hexLayer[17]);

    const urgentPointer = "0x" + (hexLayer[18] + hexLayer[19]) + " (" + parseInt((hexLayer[18] + hexLayer[19]), 16) + ")";

    const optionsBytes = layer.slice( 20 );

    return {
        'Source Port': sourcePort,
        'Destination Port': destinationPort,
        'Sequence number (raw)': sequenceNumber,
        'Acknowledgement number (raw)': acknowledgementNumber,
        'Header Length': headerLength + ' bytes' +' (' +'0b'+ parseInt((hexLayer[12][0]), 16) + ')',
        ['Flags ('+'0x'+ parseInt((hexLayer[12][1] + hexLayer[13]), 16) +')']: flags,
        'Window size value': windowSize,
        'Checksum': checkSum,
        'Urgent pointer': urgentPointer,
        'Options': parseOptions( optionsBytes )
    };
}
