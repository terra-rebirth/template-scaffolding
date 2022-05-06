import {TemplateScaffoldingOptions} from "./models/TemplateScaffoldingOptions";
import Repository from "./Repository";
import DataParser from "./DataParser";
import FileWriter from "./FileWriter";

export class TemplateScaffolding {
  static from = async (options: TemplateScaffoldingOptions) => {
    const file = await new Repository(options.remoteUrl).getZip();

    const parsedFile = new DataParser(options).parse(file);

    new FileWriter(options).write(parsedFile);
  };
}
