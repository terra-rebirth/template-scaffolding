import AdmZip from "adm-zip";
import { TemplateScaffoldingOptions } from "./models/TemplateScaffoldingOptions";

export default class DataParser {
  options: TemplateScaffoldingOptions;

  prefix: string;

  suffix: string;

  constructor(options: TemplateScaffoldingOptions) {
    this.options = options;
    this.prefix = options.replace?.prefix ? options.replace.prefix : "{{";
    this.suffix = options.replace?.suffix ? options.replace.suffix : "}}";
  }

  parse = (zip: AdmZip): AdmZip => {
    const templateTags = this.prepareTemplateTags();

    for (const zipEntry of zip.getEntries()) {
      if (this.shouldReplaceTags(zipEntry.entryName)) {
        let text = zip.readAsText(zipEntry);

        if (text.includes(this.prefix)) {
          for (const property in templateTags) {
            const regex = new RegExp(property, "g");
            const value = templateTags[property as keyof object];

            text = text.replace(regex, value);
          }
        }
        zip.updateFile(zipEntry, Buffer.from(text));
      }
    }

    return zip;
  };

  private prepareTemplateTags = (): object => {
    const entries = this.options.replace?.entries;
    const parsedEntities: any = {};

    for (const key in entries) {
      const parsedKey = this.prefix + key + this.suffix;
      parsedEntities[parsedKey] = entries[key as keyof object];
    }

    return parsedEntities;
  };

  private shouldReplaceTags = (entryName: string): boolean => {
    if (!!this.options?.subFolder) {
      return entryName.includes(this.options.subFolder);
    }

    return true;
  }
}
