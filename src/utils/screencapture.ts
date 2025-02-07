import { exec } from "child_process";
import os from "os";
import fs from "fs";
import path from "path";
import getDisplayBounds from "./electron/getDisplayBounds";
import getDisplayPosition from "./electron/getDisplayPosition";
import getPrimaryMonitor from "./electron/getPrimaryMonitor";
import getPublicPath from "./electron/getPublicPath";

function captureCommand(filePath: string) {
  // freeware nircmd http://www.nirsoft.net/utils/nircmd.html
  const nircmdc = path.join(getPublicPath(), "extra", "nircmdc.exe");

  switch (os.platform()) {
    case "win32":
      return `"${nircmdc}" sendkeypress Ctrl+printscreen & "${nircmdc}" cmdwait 100 clipboard saveimage ${filePath}`;
    case "darwin":
      return `screencapture -i ${filePath}`;
    case "linux":
      return `import ${filePath}`;
    default:
      throw new Error("unsupported platform");
  }
}

function capture(filePath: string, callback: any) {
  exec(captureCommand(filePath), (err) => {
    // console.error(err);
    // nircmd always exits with err even though it works
    if (err && os.platform() !== "win32") callback(err);

    // eslint-disable-next-line consistent-return
    if (fs.existsSync(filePath)) {
      callback(null, filePath);
    } else {
      callback(new Error("Screenshot failed"));
    }
  });
}

/*
   Capture a screenshot and resolve with the image path

   @param {String} [filePath]
   @param {Function} callback
*/
export default function screencapture(
  filePath: string,
  callback: (err: any, imagePath: string) => void
) {
  capture(filePath, (err: any, imagePath: string) => {
    const pos = getDisplayPosition(getDisplayBounds());
    const size = getPrimaryMonitor().bounds;
    // eslint-disable-next-line global-require
    const { nativeImage } = require("electron");

    const image = nativeImage.createFromPath(filePath).crop({
      x: pos.x,
      y: pos.y,
      width: size.width,
      height: size.height,
    });
    fs.writeFile(filePath, image.toPNG(), {}, () => {
      callback(err, imagePath);
    });
  });
}
