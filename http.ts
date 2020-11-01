const lookuphttp = [
    "Response Version",
    "Status Code",
    "Response Phrase"
];

const lookupother = [
    "Request Method",
    "Request URI",
    "Request Version"
];

export const layerToHTTP = ( layer: string ) => {

    const [ head, ...tail ] = layer.split( "\n" );

    const headP = head.split( " " );

    const headFields = head[0].startsWith( "HTTP" )
        ? headP.map( ( field, i ) => lookuphttp[ i ] + ": " + field )
        : headP.map( ( field, i ) => lookupother[ i ] + ": " + field );

    return [
        head,
        headFields.map( string => "\t" + string ),
        ...tail.slice( 0, tail.length - 2 )
    ];
};
