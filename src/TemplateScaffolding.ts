import {TemplateScaffoldingOptions} from "./models/TemplateScaffoldingOptions";
import Repository from "./Repository";
import DataParser from "./DataParser";
import FileWriter from "./FileWriter";

export class TemplateScaffolding {
  static from = async (options: TemplateScaffoldingOptions) => {
    const file = await new Repository(options.remoteUrl).getZip();

    const parsedFile = new DataParser(options.replace).parse(file);

    new FileWriter(options.localOptions).write(parsedFile);
  };
}
