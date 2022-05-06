import fs from "fs";
import AdmZip from "adm-zip";
import { TemplateScaffoldingOptions } from "./models/TemplateScaffoldingOptions";
import path from "path";

export default class FileWriter {
  TEMP_FOLDER = ".unzipped";
  options: TemplateScaffoldingOptions;

  constructor(options: TemplateScaffoldingOptions) {
    this.options = options;
  }

  write = (zip: AdmZip) => {
    const newFolder = this.options.localOptions?.folderUrl;
    const subFolder = this.options.subFolder;

    if(!newFolder && !subFolder) {
      zip.extractAllTo(__dirname);
    }
    else {
      this.extractToTempFolder(zip);
      this.moveToExpectedFolder(newFolder, subFolder);
    }
  };

  private extractToTempFolder = (zip: AdmZip) => {
    if (fs.existsSync(this.TEMP_FOLDER)) {
      fs.rmSync(this.TEMP_FOLDER, { recursive: true, force: true });
    }
    fs.mkdirSync(this.TEMP_FOLDER);
    zip.extractAllTo(this.TEMP_FOLDER);
  };

  private moveToExpectedFolder = (
    newFolder: string | undefined, 
    subFolder: string | undefined
  ) => {
    if(newFolder && subFolder) {
      const subfolderInsideTemp = path.join(this.TEMP_FOLDER, subFolder);
      fs.mkdirSync(newFolder,{recursive: true});
      fs.renameSync(subfolderInsideTemp, newFolder);
    }
    else if (newFolder) {
      fs.mkdirSync(newFolder,{recursive: true});
      fs.renameSync(this.TEMP_FOLDER, newFolder);
    }
    else {
      fs.cpSync(this.TEMP_FOLDER, __dirname,{recursive: true});
    }
    fs.rmSync(this.TEMP_FOLDER, { recursive: true, force: true });
  }
}
