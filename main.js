const path = require("path");
const os = require("os");
const { app } = require("electron").remote;
const { download } = require("./lib/downloader");

const $url = document.querySelector('input[name="url"]');
const $btn = document.querySelector("button");
const $output = document.querySelector('input[name="output"]');
const $info = document.querySelector("#info");
const $progress = document.querySelector("#progress");
const $err = document.querySelector("#err");
const $done = document.querySelector("#done");

let downloading = false;

$btn.addEventListener("click", () => {
  clear();
  clearInfo();

  if (downloading) {
    alert("正在处理中，不要重复点击");
    return;
  }

  const dir = getPath($output) || app.getPath("downloads");
  if (!dir) {
    alert("无法获取下载目录");
    return;
  }

  const url = $url.value.replace(/\s/g, "");
  if (!/^https?:\/\//.test(url)) {
    alert("网址格式不正确");
    return;
  }

  let failed = false;
  downloading = true;
  disableBtn();

  const onData = (progress) => {
    if (failed) return;
    if (/title/.test(progress)) {
      const text = progress
        .split("\n")
        .filter((t) => /(site|title)/.test(t))
        .join("\n");
      $info.innerText = text;
      return;
    }

    $progress.innerText = progress;
  };

  const onErr = (err) => {
    failed = true;
    downloading = false;
    enableBtn();
    clear();
    if (/file already exists/.test(err)) {
      $err.innerText = "文件已存在, 清除缓存后重新下载";
    } else {
      $err.innerText = err;
    }
  };

  const onEnd = (code) => {
    if (failed) return;
    clear();
    $done.innerText = code === 0 ? "下载完成" : "未知错误";
  };

  try {
    download(url, dir, onData, onErr, onEnd);
  } catch (e) {
    onErr(e.message || "未知异常");
    downloading = false;
    enableBtn();
    failed = false;
  }
});

$output.addEventListener("change", (event) => {});

function clear() {
  $err.innerText = "";
  $progress.innerText = "";
  $done.innerText = "";
}

function clearInfo() {
  $info.innerText = "";
}

function disableBtn() {
  $btn.classList.add("disable");
  $btn.innerText = "下载中";
}

function enableBtn() {
  $btn.classList.remove("disable");
  $btn.innerText = "开始";
}

function getPath(input) {
  if (!input.files.length) return "";
  const file = input.files[0].path;
  const dir = path.dirname(file);
  return dir;
}
