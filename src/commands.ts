import { Settings } from './types';
import * as vscode from 'vscode';
import * as path from 'path';
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

type ReadDirectory = Thenable<[string, vscode.FileType][]>;
type ReadDirectorySuccess = Parameters<ReadDirectory['then']>[0];
type ReadDirectoryFailure = Parameters<ReadDirectory['then']>[1];

async function openAllFiles(
    uri: vscode.Uri,
    recursive: boolean = false,
    depth = 0,
    fileCount = 0,
) {
    if (depth > config.maxRecursiveDepth) {
        vscode.window.showErrorMessage(`config.maxRecursiveDepth`);
    }
    if (fileCount > config.maxFiles) {
        vscode.window.showErrorMessage(`config.maxFiles`);
    }

    const onSuccess: ReadDirectorySuccess = (files) => {
        for (let [fileName, fileType] of files) {
            const filePath = vscode.Uri.joinPath(uri, fileName);

            if (fileType === vscode.FileType.Directory && recursive) {
                openAllFiles(filePath, true, ++depth, ++fileCount);
                // early return avoids openTextDocument on directory
                continue;
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
                    console.log(`Can't open file. Error: ${error?.message}`);
                }
            };

            vscode.workspace
                .openTextDocument(filePath)
                .then(onFulfilled, onRejected);
        }
    };

    const onFailure: ReadDirectoryFailure = (reason: any) => {
        if (reason instanceof Error) {
            vscode.window.showErrorMessage(
                `Can't read Directory. Error: ${reason.message}`,
            );
        } else {
            vscode.window.showErrorMessage(`Unknown Error with: ${reason}`);
        }
    };

    vscode.workspace.fs.readDirectory(uri).then(onSuccess, onFailure);
}
