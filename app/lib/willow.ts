import * as questions from "@unumux/ux-questions";
import * as rp from "request-promise";

import { npm } from "./npm";

const THEME_LIST_URL = "https://registry.npmjs.org/-/v1/search?text=%40unumux%2Ftheme&size=50";
const AVAILABLE_THEMES = getAvailableThemes();

export async function promptForInstall() {
    const shouldInstallWillow = await questions.yesNo("Install the Willow UI Components library?");
    if(!shouldInstallWillow) {
        return;
    }

    const themeToInstall = await questions.list("Select a theme to install", await AVAILABLE_THEMES);
    
    npm.add({ name: themeToInstall });
}

export async function getAvailableThemes() {
    const availableThemes = JSON.parse(await rp(THEME_LIST_URL)).objects;
    return availableThemes.map((theme) => {
        return {
            name: theme.package.name,
            value: theme.package.name
        };
    });
}