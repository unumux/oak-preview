import * as fs from "fs";
import * as fse from "fs-extra";
import * as debug from "@unumux/ux-debug";

export function fileExists(filename: string) {
    return new Promise((resolve, reject) => {
        fs.access(filename, (err) => {
            if(err) {
                return resolve(false);
            }
            resolve(true);
        });
    });
}

export function readFile(filename: string) {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, (err, data) => {
            if(err) {
                return reject(err);
            }

            resolve(data);
        });
    });
}

export function readdir(dirname: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
        fs.readdir(dirname, (err, files) => {
            if(err) {
                return reject(err);
            }

            resolve(files);
        });
    });
}

export function copydir(src: string, dest: string) {
    return new Promise((resolve, reject) => {
        debug.log(`Preparing to run fsp.copydir(src: ${src}, dest: ${dest})`);
        fse.copy(src, dest, (err) => {
            if(err) {
                debug.error(`Error running fsp.copydir: ${err}`);
                return reject(err);
            }
            debug.log(`Successfully ran fsp.copydir(src: ${src}, dest: ${dest})`);
            resolve();
        });
    });
}

export function readJSON(filename: string) {
    return readFile(filename).then(JSON.parse);
}