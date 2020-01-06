export interface IVersion {
    major: number;
    minor: number;
    patch: number;
}

/** turns a string into an object with major, minor, and patch */
function parseVersionString( versionString: string ): IVersion {
    const intParts = versionString.split( '.' ).map( part => parseInt(part) );
    return {
        major: intParts[0],
        minor: intParts[1],
        patch: intParts[2]
    };
}

/** returns the greater of two versions */
function maxVersion( verA: IVersion, verB: IVersion ): IVersion {
    return versionCmp( verA, verB ) > 0 ? verA : verB;
}

/** returns the smaller of two versions */
function minVersion( verA: IVersion, verB: IVersion ): IVersion {
    return versionCmp( verA, verB ) < 0 ? verA : verB;
}

/**
 * Returns:
 *  <0 if verA < verB
 *  0 if verA == verB
 *  >0 if verA > verB
 */
function versionCmp( verA: IVersion, verB: IVersion ): number {
    if ( verA.major === verB.major ) {
        if ( verA.minor === verB.minor ) {
            return verA.patch - verB.patch;
        }
        return verA.minor - verB.minor;
    }
    return verA.major - verB.major;
}

export {
    parseVersionString as parseVersionString,
    maxVersion as maxVersion,
    minVersion as minVersion,
    versionCmp as versionCmp
}
