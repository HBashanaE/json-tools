import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "json-tools.sortJson",
    function () {
      // Get the active text editor
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        const document = editor.document;
        const selection = editor.selection;

        // Get the word within the selection
        const jsonString = document.getText(selection);
        if (isJsonString(jsonString)) {
          let parsedJson = JSON.parse(jsonString);
          let text = sortJson(parsedJson);
          if (Array.isArray(parsedJson)) {
            parsedJson = parsedJson.sort(function (a, b) {
              let x = a[Object.keys(a)[0]];
              let y = b[Object.keys(b)[0]];
              return x < y ? -1 : x > y ? 1 : 0;
            });
          }
          editor.edit((editBuilder) => {
            editBuilder.replace(selection, JSON.stringify(text, null, '\t'));
          });
        } else {
          vscode.window.showInformationMessage('Not a valid JSON string!');
        }
      }
    }
  );

  context.subscriptions.push(disposable);
}

const isJsonString = function (str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

const sortJson = (data: Object):Object => {
  return Object.keys(data)
    .sort()
    .reduce((obj, key) => {
      //@ts-ignore
      let a = data[key];
      if (!Array.isArray(a) && typeof a === "object") {
        a = sortJson(a);
      }
      //@ts-ignore
      obj[key] = a;
      return obj;
    }, {});
};

export function deactivate() {}
