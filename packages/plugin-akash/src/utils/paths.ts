import * as path from 'path';
import { fileURLToPath } from 'url';
import { venusLogger } from "@venusos/core";
import { existsSync } from 'fs';
import { getConfig } from '../environment';

export const getPluginRoot = (importMetaUrl: string) => {
    // venusLogger.info("=== Starting Plugin Root Resolution ===", {
    //     importMetaUrl,
    //     isFileProtocol: importMetaUrl.startsWith('file://'),
    //     urlSegments: importMetaUrl.split('/')
    // });

    const currentFileUrl = importMetaUrl;
    const currentFilePath = fileURLToPath(currentFileUrl);
    const currentDir = path.dirname(currentFilePath);

    // Find plugin-akash directory by walking up until we find it
    let dir = currentDir;
    while (dir && path.basename(dir) !== 'plugin-akash' && dir !== '/') {
        dir = path.dirname(dir);
    }

    if (!dir || dir === '/') {
        venusLogger.error("Could not find plugin-akash directory", {
            currentFilePath,
            currentDir,
            searchPath: dir
        });
        throw new Error("Could not find plugin-akash directory");
    }

    // venusLogger.info("Plugin Root Path Details", {
    //     currentFilePath,
    //     currentDir,
    //     pluginRoot: dir,
    //     exists: existsSync(dir),
    //     parentDir: path.dirname(dir),
    //     parentExists: existsSync(path.dirname(dir)),
    //     parentContents: existsSync(path.dirname(dir)) ? fs.readdirSync(path.dirname(dir)) : []
    // });

    return dir;
};

export const getSrcPath = (importMetaUrl: string) => {
    // venusLogger.info("=== Resolving Src Path ===");
    const pluginRoot = getPluginRoot(importMetaUrl);
    const srcPath = path.join(pluginRoot, 'src');

    // venusLogger.info("Src Path Details", {
    //     pluginRoot,
    //     srcPath,
    //     exists: existsSync(srcPath),
    //     contents: existsSync(srcPath) ? fs.readdirSync(srcPath) : [],
    //     absolutePath: path.resolve(srcPath),
    //     relativeToCwd: path.relative(process.cwd(), srcPath)
    // });

    return srcPath;
};

export const getCertificatePath = (importMetaUrl: string) => {
    const srcPath = getSrcPath(importMetaUrl);
    const certPath = path.join(srcPath, '.certificates', 'cert.json');

    // venusLogger.debug("Certificate Path Resolution", {
    //     srcPath,
    //     certPath,
    //     exists: existsSync(certPath)
    // });

    return certPath;
};

export const getDefaultSDLPath = (importMetaUrl: string) => {
    // venusLogger.info("=== Resolving SDL Path ===");
    const pluginRoot = getPluginRoot(importMetaUrl);
    const srcPath = getSrcPath(importMetaUrl);
    const config = getConfig(process.env.AKASH_ENV);
    const sdlFileName = config.AKASH_SDL;
    const sdlPath = path.join(srcPath, 'sdl', sdlFileName);
    // const sdlDir = path.dirname(sdlPath);

    // Only log if file doesn't exist as a warning
    if (!existsSync(sdlPath)) {
        // venusLogger.warn("SDL file not found at expected path", {
        //     sdlPath,
        //     exists: false
        // });
    }

    // Try to find SDL file in nearby directories
    const searchPaths = [
        sdlPath,
        path.join(srcPath, sdlFileName),
        path.join(pluginRoot, sdlFileName),
        path.join(pluginRoot, 'sdl', sdlFileName),
        path.join(pluginRoot, 'src', 'sdl', sdlFileName)
    ];

    // Only log if we find the file
    for (const searchPath of searchPaths) {
        if (existsSync(searchPath)) {
            // venusLogger.info("Found SDL file at", { path: searchPath });
            return searchPath;
        }
    }

    return sdlPath;
};

// Helper function to ensure a path includes plugin-akash
export const ensurePluginPath = (filePath: string, importMetaUrl: string) => {
    if (!filePath.includes('plugin-akash')) {
        const srcPath = getSrcPath(importMetaUrl);
        return path.join(srcPath, path.basename(filePath));
    }
    return filePath;
};

export function getDeploymentsPath(importMetaUrl: string): string {
    const srcPath = getSrcPath(importMetaUrl);
    const deploymentsPath = path.join(srcPath, 'deployments');

    // venusLogger.debug("Deployments Path Resolution", {
    //     srcPath,
    //     deploymentsPath,
    //     exists: existsSync(deploymentsPath)
    // });

    return deploymentsPath;
}