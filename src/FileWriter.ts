import fs from "fs";
import AdmZip from "adm-zip";
import { LocalOptions } from "./models/TemplateScaffoldingOptions";

export default class FileWriter {
  TEMP_DIR = ".unzipped";

  folderUrl: string | undefined;

  toRootFolderUrl: boolean;

  constructor(options?: LocalOptions) {
    this.folderUrl = options?.folderUrl;
    this.toRootFolderUrl = !!options?.toRootFolderUrl;
  }

  write = (zip: AdmZip) => {
    if (this.toRootFolderUrl) {
      this.extractToTempFolder(zip);
    } else {
      zip.extractAllTo(".");
    }
  };

  private extractToTempFolder = (zip: AdmZip) => {
    const folderUrl = this?.folderUrl ? this.folderUrl : ".";
    if (fs.existsSync(this.TEMP_DIR)) {
      fs.rmSync(this.TEMP_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(this.TEMP_DIR);
    zip.extractAllTo(this.TEMP_DIR);

    const tempDirContent = fs.readdirSync(this.TEMP_DIR);
    const tempFolderUrl = `${this.TEMP_DIR}/${tempDirContent[0]}`;
    fs.mkdirSync(folderUrl,{recursive: true});
    fs.renameSync(tempFolderUrl, folderUrl);
    fs.rmSync(this.TEMP_DIR, { recursive: true, force: true });
  };
}
