import { existsSync } from "https://deno.land/std@0.74.0/fs/mod.ts";
import { readLines } from "https://deno.land/std@0.74.0/io/mod.ts";

/** Read a file into lines */
const fileToLines = async ( filename: string ): Promise<string[]> => {

    let lines: string[] = [];
    if ( existsSync( filename ) ) {

        const file = await Deno.open( filename );

        for await ( const line of readLines( file ) )
            lines = [ ...lines, line ];
    
        Deno.close( file.rid );
    } else
        console.log( filename, "does not exist." );

    return lines;
};

const getOffset = ( line: string ): number | typeof NaN => {

    const hexOffset = line.match( /^[\da-fA-F]+/ );

    if ( hexOffset )
        return parseInt( hexOffset[ 0 ], 16 );

    return NaN;
}

const linesToFrames = ( lines: string[] ): number[][] => {

    let frames: number[][] = [];
    let frame: number[] = [];

    lines.forEach( ( line, lineNumber ) => {

        const offset = getOffset( line );

        if ( isNaN( offset ) ) {

            console.log( "Line", lineNumber, "has no valid offset." );
            return [];

        }

        if ( lineNumber === 0 && offset !== 0 ) {

            console.log( "Line 1 does not begin with a null offset." );
            return [];
        }

        const hex = line.match( /^[0-9a-fA-F]+ +([0-9a-fA-F]{2}( [0-9a-fA-F]{2})*) / );
        if ( hex === null ) {

            console.log( "Line", lineNumber, "has no valid hexadecimal data." );
            return [];
        }
            
        const bytes = hex[ 1 ].split( " " ).map( hex => parseInt( hex, 16 ) );
        // Check the number of bytes!
        frame = [ ...frame, ...bytes ];

        if ( lineNumber === lines.length - 1 || getOffset( lines[ lineNumber + 1 ] ) === 0 ) {

            frames = [ ...frames, frame ];
            frame = [];
        }

    } );

    return frames;
}

export const fileToFrames = async ( filename: string ) => linesToFrames( await fileToLines( filename ) );