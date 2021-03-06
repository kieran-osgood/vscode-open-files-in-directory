import { Settings } from './types';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { extensionName } from './const';

export const openCurrentDirectoryFiles = (uri: vscode.Uri) => {
    if (typeof uri === 'undefined') {
        vscode.window.showErrorMessage('Open a file to open its sibling files');
        return;
    }
    openAllFiles(uri);
};

export const openCurrentDirectoryFilesRecursively = (uri: vscode.Uri) => {
    if (typeof uri === 'undefined') {
        vscode.window.showErrorMessage('Open a file to open its sibling files');
        return;
    }
    openAllFiles(uri, true);
};

function openAllFiles(
    uri: vscode.Uri,
    recursive: boolean = false,
    depth = 0,
    fileCount = 0,
) {
    const isDirectory = fs.statSync(uri.path).isDirectory();
    let { dir: parentDir } = path.parse(uri.path);
    const config = vscode.workspace
        .getConfiguration()
        .get(extensionName) as Settings;

    if (depth > config.maxRecursiveDepth) return;
    console.log('depth: ', depth);
    if (fileCount > config.maxFiles) return;
    console.log('fileCount: ', fileCount);

    if (isDirectory) {
        parentDir = uri.path;
    }

    fs.readdir(parentDir, (err, files: string[]) => {
        if (err) {
            return vscode.window.showErrorMessage(
                `Can't read Directory. Error: ${err?.message}`,
            );
        }

        files.forEach((file) => {
            const filePath = `${parentDir}/${vscode.Uri.file(file).path}`;
            const isDirectory = fs.statSync(filePath).isDirectory();
            if (isDirectory) {
                if (recursive) {
                    openAllFiles(
                        vscode.Uri.file(filePath),
                        true,
                        ++depth,
                        ++fileCount,
                    );
                }
                // early return avoids openTextDocument on directory
                return;
            }

            vscode.workspace.openTextDocument(filePath).then((doc) => {
                fileCount++;
                vscode.window.showTextDocument(doc, { preview: false });
            });
        });
    });
}
