import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as commands from './commands';

export const openCurrentDirectoryFiles = (uri: vscode.Uri) => {
    if (typeof uri === 'undefined') {
        vscode.window.showErrorMessage('Open a file to open its sibling files');
        return;
    }
    openAllFiles(uri);
};

function openAllFiles(uri: vscode.Uri) {
    const isDirectory = fs.statSync(uri.path).isDirectory();
    let { dir: parentDir } = path.parse(uri.path);

    if (isDirectory) {
        parentDir = uri.path;
    }

    fs.readdir(parentDir, (err, files: string[]) => {
        if (err) {
            return vscode.window.showErrorMessage(`Error: ${err?.message}`);
        }

        files.forEach((file) => {
            vscode.workspace
                .openTextDocument(`${parentDir}/${vscode.Uri.file(file).path}`)
                .then((doc) => {
                    vscode.window.showTextDocument(doc, { preview: false });
                });
        });
    });
}
