export interface LocalOptions {
  /**
   * Path where data will be stored can be both relative
   * or absolute, if path is not defined the data will be
   * stored in '.' directory.
   */
  folderUrl?: string;

  /**
   * Sometimes the files compressed to zip are under a folder
   * in case you want to move all these files to the folderUrl
   * defined previously without any folder in between set
   * this boolean to true.
   */
  toRootFolderUrl?: boolean;
}

export interface ReplaceOptions {
  /**
   * If property is not defined "{{" will be assigned
   */
  prefix?: string;

  /**
   * If property is not defined "}}" will be assigned
   */
  suffix?: string;

  /**
   * Data to replace. Normally this should look something like;
   * {
   *      "key": "value",
   *      "key": "value",
   *      ...
   * }
   */
  entries: object;
}

export interface TemplateScaffoldingOptions {
  /**
   * Any remote url is acceptable it only require a
   * zipped file to be downloaded.
   */
  remoteUrl: string;

  /**
   * How to store data locally
   */
  localOptions?: LocalOptions;

  /**
   * How to replace placeholders
   */
  replace: ReplaceOptions;
}
