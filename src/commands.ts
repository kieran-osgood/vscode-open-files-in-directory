import * as vscode from 'vscode';
import { openAllFiles } from './commands/OpenAllFiles';

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
