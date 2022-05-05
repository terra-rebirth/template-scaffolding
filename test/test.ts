import AdmZip from "adm-zip";
import fs from "fs";
import {
  LocalOptions,
  ReplaceOptions,
} from "../src/models/TemplateScaffoldingOptions";
import DataParser from "../src/DataParser";
import FileWriter from "../src/FileWriter";

describe("parse files", () => {
  test("with default template placeholder", async () => {
    // GIVEN
    const zip = new AdmZip("./test/mocks/base-mock.zip");
    const options: ReplaceOptions = {
      entries: {
        "replace-me": "World",
        "should-i-replace": "With whatever",
      },
    };

    // WHEN
    const parsedZip = await new DataParser(options).parse(zip);

    // THEN
    expect(parsedZip.readAsText("base-mock/index.template")).toBe(
      "World world!\n\nLorem ipsum dolor sit amet, World..."
    );

    expect(parsedZip.readAsText("base-mock/not-an-index.template")).toBe(
      "With whatever world!\n\nLorem ipsum dolor sit amet, World..."
    );
  });

  test("with custom template placeholder", async () => {
    // GIVEN
    const zip = new AdmZip("./test/mocks/custom-placeholders-mock.zip");
    const options: ReplaceOptions = {
      prefix: "{{{",
      suffix: "}}}",
      entries: {
        "replace-me": "World",
        "should-i-replace": "With whatever",
      },
    };

    // WHEN
    const parsedZip = await new DataParser(options).parse(zip);

    // THEN
    expect(
      parsedZip.readAsText("custom-placeholders-mock/index.template")
    ).toBe("World world!\n\nLorem ipsum dolor sit amet, World...");

    expect(
      parsedZip.readAsText("custom-placeholders-mock/not-an-index.template")
    ).toBe("With whatever world!\n\nLorem ipsum dolor sit amet, World...");
  });
});

describe("unzip files", () => {
  test("with default name", async () => {
    // GIVEN
    const zip = new AdmZip("./test/mocks/base-mock.zip");
    const options: LocalOptions = {};

    // WHEN
    await new FileWriter(options).write(zip);

    // THEN
    expect(fs.existsSync("./base-mock"));
    expect(fs.existsSync("./base-mock/index.template"));
    expect(fs.existsSync("./base-mock/not-an-index.template"));
  });

  test("with default name", async () => {
    // GIVEN
    const zip = new AdmZip("./test/mocks/base-mock.zip");
    const options: LocalOptions = {
      folderUrl: "folder-name",
      toRootFolderUrl: true,
    };

    // WHEN
    await new FileWriter(options).write(zip);

    // THEN
    expect(fs.existsSync("./folder-name"));
    expect(fs.existsSync("./folder-name/index.template"));
    expect(fs.existsSync("./folder-name/not-an-index.template"));
  });

  afterAll(() => {
    fs.rmdirSync("base-mock", { recursive: true });
    fs.rmdirSync("folder-name", { recursive: true });
  });
});
