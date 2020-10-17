export const frameToLayers = ( frame: number[] ) => {

    return {

        Ethernet: frame.slice( 0, 14 ),
        TCP: [],
        IP: [],
        HTTP: []

    };
    
};