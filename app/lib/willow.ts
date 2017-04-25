import * as questions from "@unumux/ux-questions";

import { npm } from "./npm";

const AVAILABLE_THEMES = [
    {
        "name": "theme-coloniallife-default",
        "value": "@unumux/theme-coloniallife-default"
    },
    {
        "name": "theme-unum-default",
        "value": "@unumux/theme-unum-default"
    },
    {
        "name": "theme-enterprise-default",
        "value": "@unumux/theme-enterprise-default"
    }
];

export async function promptForInstall() {
    const shouldInstallWillow = await questions.yesNo("Install the Willow UI Components library?");
    if(!shouldInstallWillow) {
        return;
    }

    const themeToInstall = await questions.list("Select a theme to install", AVAILABLE_THEMES);
    
    npm.add({ name: themeToInstall, version: "*" });
}