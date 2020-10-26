import oui from "https://cdn.skypack.dev/oui";
import { getProtocolNameFromOctet } from "https://jspm.dev/ethertypes";

const dataToMac = ( mac: number[] ) => {

    const hexMac = mac.map( dec => dec.toString( 16 ) );
    const vendor = oui( hexMac.join( ":" ) );
    return vendor + "_" + hexMac.slice( 3, 6 ).join( ":" ) + " (" + hexMac.join( ":" ) + ")";

};

const dataToType = ( type: number[] ) => {

    return `0x${ type.map( dec => dec.toString( 16 ).padStart( 2, "0" ) ).join( "" ) } (${ getProtocolNameFromOctet( type[ 0 ] * 256 + type[ 1 ] ) })`;

};

export const layerToEthernet = ( layer: number[] ) => {

    const source = layer.slice( 0, 6 );
    const destination = layer.slice( 6, 12 );
    const type = layer.slice( 12, 14 );
    
    return {

        Destination: dataToMac( destination ),
        Source: dataToMac( source ),
        Type: dataToType( type )

    };

};