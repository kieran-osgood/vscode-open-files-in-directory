import * as vscode from 'vscode';
import * as commands from './commands';


export function activate(context: vscode.ExtensionContext) {
    const subscriptions = [];

    subscriptions.push(
        vscode.commands.registerCommand(
            commands.createCommandName('currentDirFiles'),
            commands.openCurrentDirectoryFiles,
        ),
    );

    subscriptions.push(
        vscode.commands.registerCommand(
            commands.createCommandName('currentDirFilesRecursively'),
            commands.openCurrentDirectoryFilesRecursively,
        ),
    );
    /**
     * Add config options to enable/disable certain options?
     *
     */
    context.subscriptions.push(...subscriptions);
}

export function deactivate() {}
