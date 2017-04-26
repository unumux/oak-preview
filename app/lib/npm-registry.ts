import * as rp from "request-promise";

function encodeUriSegment(val) {
    return val
        .replace(/\//gi, '%2f');
}

export async function getVersionForPackage(packageName: string) {
    const escapedPackageName = encodeUriSegment(packageName);
    const packageInfo = JSON.parse(await rp(`https://registry.npmjs.org/-/package/${escapedPackageName}/dist-tags`));
    
    return packageInfo.latest;
}