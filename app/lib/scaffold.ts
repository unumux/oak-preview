import * as path from "path";
import * as _ from "lodash";
import * as debug from "@unumux/ux-debug";
import * as fsp from "./fsp";

export interface TemplateValues {
    styleImports: string[];
}

const DEFAULT_TEMPLATE_VALUES: TemplateValues = {
    styleImports: []
}

export async function scaffold(scaffoldName: string, dest: string, templateValues?: TemplateValues) {
    const allTemplateValues = {...DEFAULT_TEMPLATE_VALUES, ...templateValues};
    const scaffoldDir = path.join(__dirname, "../../", "scaffolds", scaffoldName);
    const files = await fsp.glob("**/*", {cwd: scaffoldDir, nodir: true});
    const copyPromises = files.map(async (filePath) => {
        debug.log(`Processing scaffold file: ${filePath}`);
        const absoluteFilePath = path.join(scaffoldDir, filePath);
        const fileDest = path.join(dest, filePath);
        const destPath = path.dirname(fileDest);
        const mkdirPromise = fsp.mkdirp(destPath);        
        let fileContents = (await fsp.readFile(absoluteFilePath)).toString();
        fileContents = processTemplate(fileContents, allTemplateValues);
        debug.log(`Preparing to copy scaffolded file to: ${fileDest}`);
        await mkdirPromise;
        return fsp.writeFile(fileDest, fileContents);
    });
    return Promise.all(copyPromises);
}

function processTemplate(fileContents: string, values) {
    const compiled = _.template(fileContents);
    return compiled(values);
}