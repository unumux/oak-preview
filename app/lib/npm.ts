import * as _ from "lodash";
import * as debug from "@unumux/ux-debug";
import * as depCheck from "./dep-check";
import * as fse from "fs-extra";
import {getVersionForPackage} from "./npm-registry";
import {exec} from "./exec";
 
interface Package {
    name: string;
    version?: string | Promise<string>;
    main?: string
}

class NPM {
    packages: Package[] = [];
    devPackages: Package[] = [];

    add(newPackage: Package) {
        if(!newPackage.version) {
            newPackage.version = getVersionForPackage(newPackage.name);
        }
        this.packages.push(newPackage);
    }

    addDev(newPackage: Package) {
        if(!newPackage.version) {
            newPackage.version = getVersionForPackage(newPackage.name);
        }
        this.devPackages.push(newPackage);
    }

    async saveToPackageJson() {
        const packageJSON = fse.readJson("./package.json");
        const devDependencies = this.devPackages.reduce(async (previousValue, currentValue) => {
            return {...previousValue, [currentValue.name]: await currentValue.version};
        }, {});

        const dependencies = this.packages.reduce(async (previousValue, currentValue) => {
            return {...previousValue, [currentValue.name]: await currentValue.version};
        }, {});

        const newPackageJSON = Object.assign({}, await packageJSON, { dependencies: await dependencies, devDependencies: await devDependencies });
        await fse.writeFile("./package.json", JSON.stringify(newPackageJSON));
    }

    async install() {
        await this.loadPackagesFromJson();
        if(await depCheck.shouldInstallNPMPackages(_.merge([], this.devPackages, this.packages))) {
            console.log("Installing NPM Packages...");
            
            await exec(`npm install`);
        }
    }
    
    async loadPackagesFromJson() {
        const packageJSON = await fse.readJson("./package.json");

        // load dev packages
        const newDevPackages = _.map(packageJSON.devDependencies, (value, key) => { 
            return { name: key, version: value }
        });
        this.devPackages = _.merge([], this.devPackages, newDevPackages);

        // load prod packages
        const newPackages = _.map(packageJSON.dependencies, (value, key) => { 
            return { name: key, version: value }
        });
        this.packages = _.merge([], this.packages, newPackages);
    }
}


export const npm = new NPM();