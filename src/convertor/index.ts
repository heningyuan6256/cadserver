import { Filesystem } from "../filesystem";
import { Attachment, FileSelf } from "../sdk/types";

export default class Convertor {
  filesystem: Filesystem<FileSelf>[];
  constructor(filesystem: Filesystem<FileSelf>[]) {
    this.filesystem = filesystem;
  }
  run() {
    for (const fsy of this.filesystem) {
      const proc = Bun.spawnSync([
        "OnChainSW_Extension.exe",
        `-updateattr "${this.getFileAddress(fsy)}" ${fsy.data.approvalNodeInfo}`,
      ]);
      this.convertAttachments(fsy.attachments || []);
    }
  }

  convertAttachments(attachments: Filesystem<Attachment>[]) {
    for (const att of attachments) {
      const proc = Bun.spawnSync([
        "OnChainSW_Extension.exe",
        `-pdf "${this.getFileAddress(att)}"`,
      ]);
    }
  }

  private getFileAddress(fsy: Filesystem<any>) {
    return `${process.cwd()}${fsy.localAddress.replace("./", "\\")}\\${fsy.filename}`;
  }
}