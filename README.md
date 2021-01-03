# vscode-open-files-in-directory 

A vscode extension to open a directory-load of files. 

## Features

This extension adds the option to the file explorer (and the command options, accessed with ctrl + shift + p, or cmd + shift + p on mac), to open all the files in the directory. If the selected item is a file it selects the parent directory, if its a directory it'll use that directory.


Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.



## Extension Settings

* `vscode-open-files-in-directory.maxRecursiveDepth` - Maximum depth to traverse through subfolders: ` default: 1`
* `vscode-open-files-in-directory.maxFiles` - Maximum number of files to open in one action: `default: 10`

## Known Issues

None currently 👀

## Release Notes

### 1.0.0

Initial release of vscode-open-files-in-directory. 
Adds ability to open all files within a directory, both recursively and non. 

-----------------------------------------------------------------------------------------------------------

## Working with Markdown

**Note:** You can author your README using Visual Studio Code.  Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux)
* Toggle preview (`Shift+CMD+V` on macOS or `Shift+Ctrl+V` on Windows and Linux)
* Press `Ctrl+Space` (Windows, Linux) or `Cmd+Space` (macOS) to see a list of Markdown snippets

### For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
