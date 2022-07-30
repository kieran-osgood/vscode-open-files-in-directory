import { Settings } from './types';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { extensionName } from './const';

const config = vscode.workspace
    .getConfiguration()
    .get(extensionName) as Settings;

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

const checkPathIsDirectory = (path: string) => fs.statSync(path).isDirectory();

function openAllFiles(
    uri: vscode.Uri,
    recursive: boolean = false,
    depth = 0,
    fileCount = 0,
) {
    const isDirectory = checkPathIsDirectory(uri.fsPath);
    let { dir: parentDir } = path.parse(uri.path);

    if (depth > config.maxRecursiveDepth) return;
    if (fileCount > config.maxFiles) return;

    if (isDirectory) {
        parentDir = uri.fsPath;
    }

    fs.readdir(parentDir, (err, files: string[]) => {
        if (err instanceof Error) {
            return vscode.window.showErrorMessage(
                `Can't read Directory. Error: ${err?.message}`,
            );
        }

        files.forEach((file) => {
            const filePath = vscode.Uri.joinPath(
                uri,
                vscode.Uri.file(file).fsPath,
            );
            const isDirectory = checkPathIsDirectory(filePath.fsPath);

            if (isDirectory) {
                if (recursive) {
                    openAllFiles(
                        vscode.Uri.file(filePath.fsPath),
                        true,
                        ++depth,
                        ++fileCount,
                    );
                }
                // early return avoids openTextDocument on directory
                return;
            }

            type OnTextDocumentOpenedThenable = Parameters<
                Thenable<vscode.TextDocument>['then']
            >;

            const onFulfilled: OnTextDocumentOpenedThenable[0] = (doc) => {
                fileCount++;
                vscode.window.showTextDocument(doc, { preview: false });
            };

            const onRejected: OnTextDocumentOpenedThenable[1] = (error) => {
                if (error instanceof Error) {
                    // vscode.window.showErrorMessage(
                    //     `Can't open file. Error: ${error?.message}`,
                    // );
                    console.log(`Can't open file. Error: ${error?.message}`);
                }
            };

            vscode.workspace
                .openTextDocument(filePath)
                .then(onFulfilled, onRejected);
        });
    });
}
