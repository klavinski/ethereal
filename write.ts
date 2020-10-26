type primitive = string | number | primitive[] | { [ key: string ]: primitive };

const indentIfMultiLine = ( paragraph: string ) =>

    paragraph.includes( "\n" )
    ? "\n" + paragraph.split( "\n" ).map( line => "\t" + line ).join( "\n" )
    : paragraph

;

const formatJSON = ( object: primitive ): string => {

    if ( Array.isArray( object ) )
        
        return object.map( formatJSON ).join( "\n" );

    if ( typeof object === "object" )

        return Object.entries( object )
                     .filter( ( [ _, value ] ) => typeof value !== "undefined" )
                     .map( ( [ key, value ] ) => `${ key }: ${ indentIfMultiLine( formatJSON( value ) ) }` )
                     .join( "\n" );

    if ( typeof object === "number" )

        return object.toString();

    return object;

};

export const write = ( object: primitive ) =>

    console.log( formatJSON( object ) );