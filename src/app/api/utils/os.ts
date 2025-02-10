import chromium from "@sparticuz/chromium";
import os from "os";
export const getExecutablePath =async () => {
    if (os.platform() === "win32") {
      return "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
    } else if (os.platform() === "darwin") {
      return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
    } else {
      return await chromium.executablePath() || "/usr/bin/chromium";
    }
  };