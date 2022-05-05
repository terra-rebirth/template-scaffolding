import request from "request";
import AdmZip from "adm-zip";

export default class Repository {
  url: string;

  constructor(url: string) {
    this.url = url;
  }

  getZip = async (): Promise<AdmZip> =>
    new Promise((resolve, reject) => {
      request.get({ url: this.url, encoding: null }, (err, res, body) => {
        if (err) {
          return reject(err);
        }

        resolve(new AdmZip(body));
      });
    });
}
