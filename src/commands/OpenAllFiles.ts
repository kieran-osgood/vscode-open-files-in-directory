import {
    OpenTextDocumentFulfilled,
    OpenTextDocumentRejected,
    ReadDirectoryFulfilled,
    ReadDirectoryRejected,
    Settings,
} from '../types';
import * as vscode from 'vscode';
import { extensionName } from '../const';

const config = vscode.workspace
    .getConfiguration()
    .get(extensionName) as Settings;

export async function openAllFiles(
    uri: vscode.Uri,
    recursive: boolean = false,
    depth = 0,
    fileCount = 0,
) {
    if (depth > config.maxRecursiveDepth) {
        // vscode.window.showErrorMessage(`config.maxRecursiveDepth`);
        console.log(
            `Reached recursion limit depth: ${depth} maxRecursiveDepth: ${config.maxRecursiveDepth}`,
        );
        return;
    }
    if (fileCount > config.maxFiles) {
        // vscode.window.showErrorMessage(`config.maxFiles`);
        console.log(`Reached maxFiles limit: ${depth}`);
        return;
    }

    const onReadDirectoryFulfilled = createOnReadDirectoryFulfilled(
        uri,
        recursive,
        depth,
        fileCount,
    );

    vscode.workspace.fs
        .readDirectory(uri)
        .then(onReadDirectoryFulfilled, onReadDirectoryRejected);
}

const createOnReadDirectoryFulfilled = (
    uri: vscode.Uri,
    recursive: boolean = false,
    depth = 0,
    fileCount = 0,
): ReadDirectoryFulfilled => {
    return (files) => {
        for (let [fileName, fileType] of files) {
            const filePath = vscode.Uri.joinPath(uri, fileName);

            if (fileType === vscode.FileType.Directory && recursive) {
                openAllFiles(filePath, true, ++depth, ++fileCount);
                // avoid vscode.openTextDocument on directory
                continue;
            }

            const onOpenTextDocumentFulfilled: OpenTextDocumentFulfilled = (
                doc,
            ) => {
                fileCount++;
                vscode.window.showTextDocument(doc, { preview: false });
            };

            const onOpenTextDocumentRejected: OpenTextDocumentRejected = (
                error,
            ) => {
                if (error instanceof Error) {
                    // binary files can't be opened in the editor and error
                    console.log(
                        `Can't open [${fileName}]. Error: ${error?.message}`,
                    );
                }
            };

            vscode.workspace
                .openTextDocument(filePath)
                .then(onOpenTextDocumentFulfilled, onOpenTextDocumentRejected);
        }
    };
};

const onReadDirectoryRejected: ReadDirectoryRejected = (reason: any) => {
    if (reason instanceof Error) {
        vscode.window.showErrorMessage(
            `Can't read Directory. Error: ${reason.message}`,
        );
    } else {
        vscode.window.showErrorMessage(`Unknown Error: ${reason}`);
    }
};
