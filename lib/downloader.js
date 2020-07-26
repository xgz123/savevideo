const { spawn } = require("cross-spawn");
const is = require("electron-is");

const download = (url, output, onData, onError, onClose) => {
  const dl = spawn(
    is.windows() ? "cmd" : "bash",
    [is.windows() ? "/c" : "-c", `you-get -o ${output} ${url}`],
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
