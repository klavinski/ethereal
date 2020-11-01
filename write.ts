type displayable = string | number | displayable[] | { [ key: string ]: displayable };

const indentIfMultiLine = ( paragraph: string ) =>

    paragraph.includes( "\n" )
    ? "\n" + paragraph.split( "\n" ).map( line => "\t" + line ).join( "\n" )
    : paragraph

;

const formatJSON = ( object: displayable ): string => {

    if ( Array.isArray( object ) )
        
        return object.map( formatJSON ).join( "\n" );

    if ( typeof object === "object" )

        return Object.entries( object )
                     .map( ( [ key, value ] ) => `${ key }: ${ indentIfMultiLine( formatJSON( value ) ) }` )
                     .join( "\n" );

    if ( typeof object === "number" )

        return object.toString();

    return object;

};

export const write = ( object: displayable ) =>

    console.log( formatJSON( object ) );