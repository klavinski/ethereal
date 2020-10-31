export const frameToLayers = ( frame: number[] ) => {

    const Ethernet = frame.slice( 0, 14 );

    if  ( frame[ 12 ] !== 8 || frame[ 13 ] !== 0 ) // protocol is not IPv4

        return { Ethernet };

    const totalLength = frame[ 16 ] * 256 + frame[ 17 ];

    if ( totalLength !== frame.length - Ethernet.length ) {

        console.log( `The frame minus the Ethernet header is ${ frame.length - Ethernet.length } bytes long, whereas its IP header declares it to be ${ totalLength } bytes.` );
        return { Ethernet };

    }

    const IPLength = frame[ 14 ] % 16 * 4;

    const IP = frame.slice( 14, 14 + IPLength );

    if ( frame[ 23 ] !== 6 ) // protocol is not TCP

        return { Ethernet, IP };

    const TCPLength = Math.floor( frame[ 14 + IPLength + 12 ] / 16 ) * 4;
    const TCP = frame.slice( 14 + IPLength, 14 + IPLength + TCPLength );

    const maybeHTTP = frame.slice( 14 + IPLength + TCPLength )
                           .map( dec => String.fromCharCode( dec ) ).join( "" );

    const methods = [ "GET", "HEAD", "POST", "PUT", "DELETE", "TRACE", "OPTIONS", "CONNECT", "HTTP" ];

    if ( methods.some( method => maybeHTTP.startsWith( method ) ) ) // protocol is HTTP

        return { Ethernet, IP, TCP, HTTP: maybeHTTP };

    return { Ethernet, IP, TCP };
    
};