import * as vscode from 'vscode';

export type Settings = {
    maxRecursiveDepth: number;
    maxFiles: number;
};

type ReadDirectory = Parameters<Thenable<[string, vscode.FileType][]>['then']>;
export type ReadDirectoryFulfilled = ReadDirectory[0];
export type ReadDirectoryRejected = ReadDirectory[1];

type OpenTextDocument = Parameters<Thenable<vscode.TextDocument>['then']>;
export type OpenTextDocumentFulfilled = OpenTextDocument[0];
export type OpenTextDocumentRejected = OpenTextDocument[1];
