import { readLines } from "https://deno.land/std@0.74.0/io/mod.ts";

/** Read a file into lines */
const fileToLines = async ( filename: string ): Promise<string[]> => {

    let lines: string[] = [];
    const file = await Deno.open( filename );

    for await ( const line of readLines( file ) )
        lines = [ ...lines, line ];
    
    Deno.close( file.rid );
    return lines;
};

const getOffset = ( line: string ): number | typeof NaN => {

    const hexOffset = /^[\dA-Fa-f]+/.exec( line );

    if ( hexOffset === null )
            return NaN;

    return parseInt( hexOffset[ 0 ], 16 );    
}

const linesToFrames = ( lines: string[] ) => {

    lines.map( ( line, lineNumber ) => {

        const offset = getOffset( line );

        if ( isNaN( offset ) ) {

            console.log( "Line", lineNumber, "has no valid offset." );
            return [];

        }

        console.log( offset );

        if ( lineNumber === 0 && offset !== 0 ) {

            console.log( "The trace file does not begin with a null offset." );
        }
        

    } )
}

export const fileToFrames = async ( filename: string ) => linesToFrames( await fileToLines( filename ) );

const regExp = /\d+ [0-9a-fA-F]{2} /;