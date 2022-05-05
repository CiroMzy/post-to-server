// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import axios from "axios";
const fs = require("fs");
var path = require('path');
import * as vscode from "vscode";

let timer= null;

function getConfig(projectPath) {
  const configPath = `${projectPath}/.post-to-server.json`;
  const configFile = fs.readFileSync(configPath, "utf8");

  let config = null;
  try {
    config = JSON.parse(configFile);
  } catch (err) {
    vscode.window.showErrorMessage(".post-to-server.json 文件读取失败");
  }
  return config;
}

function isIgnoreFile(curFilePath, ignore) {
  let fileName = "";
  curFilePath.replace(/\/([^\/]+)$/, function ($0, $1) {
    fileName = $1;
  });
  return ignore.some((i) => i === fileName);
}

function request(params) {
  const { config, currentFile, curFilePath } = params;
  axios({
    method: config.method || "post",
    url: config.url,
    headers: {
      ...config.headers,
    },
    data: {
      key: curFilePath,
      value: currentFile,
    },
  })
    .then((res) => {
      if (config.tipsOnSuccess) {
        vscode.window.showInformationMessage(`success ${config.url}`);
      }
    })
    .catch((err) => {
      vscode.window.showErrorMessage(`请求失败 ${err}`);
    });
}

function triggerUpdate(watcherPath, projectPath) {
  const config = getConfig(projectPath);
  const currentFile = vscode.window.activeTextEditor.document.getText()
  const currentFullPath = vscode.window.activeTextEditor.document.fileName

  let curFilePath = currentFullPath?.replace(projectPath, "");
  let normal = path.normalize(curFilePath)
  curFilePath = normal.replace(/\\/g, '/')
  if (isIgnoreFile(curFilePath, config.ignore)) {
    return;
  }

  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(() => {
    request({
      config,
      currentFile,
      curFilePath,
    });
  }, 500);
}

export function activate(context) {
  const projectPath = vscode.workspace.rootPath || "";

  const config = getConfig(projectPath);
  if (!config) return;

  const watcher = vscode.workspace.createFileSystemWatcher("**/**");

  watcher.onDidChange((e) => {
    triggerUpdate(e.path, projectPath);
  });
  watcher.onDidCreate((e) => {
    triggerUpdate(e.path, projectPath);
  });
}

export function deactivate() {}