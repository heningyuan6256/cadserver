import { CommonUtils } from "onchain-sdk";
import { Attachment, FileSelf } from "../sdk/types";
import { Filesystem } from "../filesystem";
import { FileUploadInfo } from "./type";

export default class Uploader {
  filesystem: Filesystem<FileSelf>[];
  common: CommonUtils;

  constructor(filesystem: Filesystem<FileSelf>[], common: CommonUtils) {
    this.filesystem = filesystem;
    this.common = common;
  }
  async run() {
    for (const fsy of this.filesystem) {
      await this.upload(fsy);
    }
  }

  private async upload(fsy: Filesystem<FileSelf>) {
    const { file, attachments, filesystem } = await fsy.readFile();
    await this.basicsUpload(filesystem, file);
    for (const att of attachments) {
      await this.basicsUpload(att.filesystem, att.file);
    }
  }

  private async basicsUpload(
    filesystem: Filesystem<FileSelf | Attachment>,
    file: FileUploadInfo
  ) {
    const result = await filesystem.manage.upload({ file });
    const success = result.successful[0];
    const uploadURL = success
      ? `${result.successful[0].uploadURL}?name=${success.name}&size=${success.size}&extension=${success.extension}`
      : "";
    filesystem.data.uploadURL = uploadURL;
    return uploadURL;
  }
}
