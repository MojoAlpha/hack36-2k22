const { BrowserWindow } = require("electron");

const defaultProps = {
  width: 600,
  height: 400,
  show: false,

  // update for electron V5+
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
    enableRemoteModule: true,
  },
};

class Window extends BrowserWindow {
  constructor({ file, showDevTools, ...windowSettings }) {
    // calls new BrowserWindow with these props
    super({ ...defaultProps, ...windowSettings });

    // load the html and open devtools
    this.loadFile(file);
    if (showDevTools) this.webContents.openDevTools();

    // gracefully show when ready to prevent flickering
    this.once("ready-to-show", () => {
      this.show();
    });
  }
}

module.exports = Window;
