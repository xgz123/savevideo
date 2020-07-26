const { spawn } = require("cross-spawn");
const is = require("electron-is");

const download = (url, output, onData, onError, onClose) => {
  const proxy = window.proxy ? `-x 127.0.0.1:1080` : "";
  const dl = spawn(
    is.windows() ? "cmd" : "bash",
    [is.windows() ? "/c" : "-c", `you-get -o ${output} ${proxy} ${url}`],
    {
      windowsHide: true,
    }
  );

  dl.stdout.on("data", (data) => {
    onData(String(data));
  });

  dl.stderr.on("data", (data) => {
    onError(String(data));
  });

  dl.on("close", (code) => {
    onClose(code);
  });
};

module.exports = {
  download,
};
