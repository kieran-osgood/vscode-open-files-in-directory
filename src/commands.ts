import * as vscode from 'vscode';
import { openAllFiles } from './commands/OpenAllFiles';
const path = require('node:path');

export const createCommandName = (s: string) =>
    `vscode-open-files-in-directory.${s}`;

const getActiveEditorParentDirectory = () => {
    const uri = vscode.window.activeTextEditor?.document.uri;
    if (!uri) {
        return null;
    }
    const fsPath = path.dirname(uri.fsPath);
    return vscode.Uri.parse(fsPath);
};

const handleOpenFiles = async (uri: vscode.Uri, recursive: boolean) => {
    if (typeof uri === 'undefined') {
        const activeEditorDir = getActiveEditorParentDirectory();
        if (!activeEditorDir) {
            return vscode.window.showErrorMessage(
                'Open a file to open its sibling files',
            );
        }
        return openAllFiles(activeEditorDir, recursive);
    }

    return openAllFiles(uri, recursive);
};

export const openCurrentDirectoryFiles = async (uri: vscode.Uri) => {
    return handleOpenFiles(uri, false);
};

export const openCurrentDirectoryFilesRecursively = async (uri: vscode.Uri) => {
    return handleOpenFiles(uri, true);
};
