import { CommonUtils, FileManage } from "onchain-sdk";
import { FileSelf } from "../sdk/types";
import { Filesystem } from "../filesystem";

export default class Downloader {
  data: FileSelf[];
  common: CommonUtils;
  filesystem: Promise<Filesystem<FileSelf>[]>;
  constructor(data: FileSelf[], common: CommonUtils) {
    this.data = data;
    this.common = common;
    this.filesystem = Filesystem.generate(common, data);
  }

  async run() {
    const filesystem = await this.filesystem;
    for (const fsy of filesystem) {
      const res = await fsy.manage.download();
      await Bun.write(fsy.saveAddress, res);
      for (const attFsy of fsy.attachments || []) {
        const res = await attFsy.manage.download();
        await Bun.write(attFsy.saveAddress, res);
      }
    }
  }

  async runDownloadDraw() {
    const filesystem = await this.filesystem;
    for (const fsy of filesystem) {
      const res = await fsy.manage.download();
      await Bun.write(fsy.saveAddressWithDateAndVersion, res);
      for (const attFsy of fsy.attachments || []) {
        const res = await attFsy.manage.download();
        await Bun.write(attFsy.saveAddressWithDateAndVersion, res);
      }
    }
  }
}
