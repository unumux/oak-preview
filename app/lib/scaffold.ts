import * as path from "path";
import * as _ from "lodash";
import * as debug from "@unumux/ux-debug";
import * as globLib from "glob";
import * as fse from "fs-extra";
import { promisify } from "util";

const glob = promisify(globLib)

export interface TemplateValues {
    styleImports: string[];
}

const DEFAULT_TEMPLATE_VALUES: TemplateValues = {
    styleImports: []
}

export async function scaffold(scaffoldName: string, dest: string, templateValues?: TemplateValues) {
    const allTemplateValues = {...DEFAULT_TEMPLATE_VALUES, ...templateValues};
    const scaffoldDir = path.join(__dirname, "../../", "scaffolds", scaffoldName);
    const files = await glob("**/*", {cwd: scaffoldDir, nodir: true});
    const copyPromises = files.map(async (filePath) => {
        debug.log(`Processing scaffold file: ${filePath}`);
        const absoluteFilePath = path.join(scaffoldDir, filePath);
        const fileDest = path.join(dest, filePath);
        const destPath = path.dirname(fileDest);
        const mkdirPromise = fse.mkdirp(destPath, null);        
        let fileContents = (await fse.readFile(absoluteFilePath)).toString();
        fileContents = processTemplate(fileContents, allTemplateValues);
        debug.log(`Preparing to copy scaffolded file to: ${fileDest}`);
        await mkdirPromise;
        return fse.writeFile(fileDest, fileContents);
    });
    return Promise.all(copyPromises);
}

function processTemplate(fileContents: string, values) {
    const compiled = _.template(fileContents);
    return compiled(values);
}