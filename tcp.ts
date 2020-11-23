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

    return {
        'Source Port': sourcePort,
        'Destination Port': destinationPort,
        'Sequence number (raw)': sequenceNumber,
        'Acknowledgement number (raw)': acknowledgementNumber,
        'Header Length': headerLength + ' bytes' +' (' +'0b'+ parseInt((hexLayer[12][0]), 16) + ')',
        ['Flags ('+'0x'+ parseInt((hexLayer[12][1] + hexLayer[13]), 16) +')']: flags,
        'Window size value': windowSize,
        'Checksum': checkSum,
        'Urgent pointer': urgentPointer
    };
}
