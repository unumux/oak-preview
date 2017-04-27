import * as fs from "fs";
import * as fse from "fs-extra";
import * as globLib from "glob";
import * as mkdirpLib from "mkdirp";

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

export function writeFile(filename: string, contents: string) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filename, contents, (err, data) => {
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

export function glob(globString: string, options = {}): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
        globLib(globString, options, (err, files) => {
            if(err) {
                return reject(err);
            }

            resolve(files);
        });
    });
}

export function mkdirp(dir: string) {
    return new Promise((resolve, reject) => {
        mkdirpLib(dir, (err) => {
            debug.log(`Attempting to make directory: ${dir}`);
            if(err) {
                debug.err(err);
                return reject(err);
            }
            debug.log(`Finished making directory: ${dir}`);
            resolve();
        });
    })
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