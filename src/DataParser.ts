import AdmZip from "adm-zip";
import { ReplaceOptions } from "./models/TemplateScaffoldingOptions";

export default class DataParser {
  options: ReplaceOptions;

  prefix: string;

  suffix: string;

  constructor(options: ReplaceOptions) {
    this.options = options;
    this.prefix = options.prefix ? options.prefix : "{{";
    this.suffix = options.suffix ? options.suffix : "}}";
  }

  parse = (zip: AdmZip): AdmZip => {
    const entries = this.prepareEntries();

    for (const zipEntry of zip.getEntries()) {
      let text = zip.readAsText(zipEntry);

      if (text.includes(this.prefix)) {
        for (const property in entries) {
          const regex = new RegExp(property, "g");
          const value = entries[property as keyof object];

          text = text.replace(regex, value);
        }
      }
      zip.updateFile(zipEntry, Buffer.from(text));
    }

    return zip;
  };

  private prepareEntries = (): object => {
    const { entries } = this.options;
    const parsedEntities: any = {};

    for (const key in entries) {
      const parsedKey = this.prefix + key + this.suffix;
      parsedEntities[parsedKey] = entries[key as keyof object];
    }

    return parsedEntities;
  };
}
