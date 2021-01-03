import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as commands from './commands';

export function activate(context: vscode.ExtensionContext) {
    const subscriptions = [];

    subscriptions.push(
        vscode.commands.registerCommand(
            'vscode-open-files-in-directory.currentDirFiles',
            commands.openCurrentDirectoryFiles,
        ),
    );
    subscriptions.push(
        vscode.commands.registerCommand(
            'vscode-open-files-in-directory.currentDirFilesRecursively',
            commands.openCurrentDirectoryFilesRecursively,
        ),
    );

    context.subscriptions.push(...subscriptions);
}

export function deactivate() {}
