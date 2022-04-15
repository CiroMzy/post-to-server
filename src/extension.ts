// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import axios from "axios";
const fs = require("fs");
import * as vscode from "vscode";

let timer: any = null;
interface requestParam {
  config?: any; // axios配置
  currentFile: any; // 当前文件内容
  curFilePath: any; // 当前文件的相对路径
}

function getConfig(projectPath: any) {
  const configPath = `${projectPath}/.post-to-setver.json`;
  const configFile = fs.readFileSync(configPath, "utf8");

  let config = null;
  try {
    config = JSON.parse(configFile);
  } catch (err) {
    vscode.window.showErrorMessage(".post-to-setver.json 文件读取失败");
  }
  return config;
}

function isIgnoreFile(curFilePath: string, ignore: any) {
  let fileName = "";
  curFilePath.replace(/\/([^\/]+)$/, function ($0, $1): any {
    fileName = $1;
  });
  return ignore.some((i: any) => i === fileName);
}

function request(params: requestParam) {
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
        vscode.window.showInformationMessage("success");
      }
    })
    .catch((err) => {
      vscode.window.showErrorMessage(`请求失败 ${err}`);
    });
}

function triggerUpdate(watcherPath: any, config: any, projectPath: any) {
  const currentFile = fs.readFileSync(watcherPath, "utf8");
  const curFilePath = watcherPath?.replace(projectPath, "");
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

export function activate(context: vscode.ExtensionContext) {
  const projectPath = vscode.workspace.rootPath || "";

  const config = getConfig(projectPath);
  if (!config) return;

  const watcher = vscode.workspace.createFileSystemWatcher("**/**");

  watcher.onDidChange((e) => {
    triggerUpdate(e.path, config, projectPath);
  });
  watcher.onDidCreate((e) => {
    triggerUpdate(e.path, config, projectPath);
  });
}

export function deactivate() {}
