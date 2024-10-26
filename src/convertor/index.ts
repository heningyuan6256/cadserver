import { Filesystem } from "../filesystem";
import { Attachment, FileSelf } from "../sdk/types";

export default class Convertor {
  filesystem: Filesystem<FileSelf>[];
  constructor(filesystem: Filesystem<FileSelf>[]) {
    this.filesystem = filesystem;
  }
  run() {
    for (const fsy of this.filesystem) {
      const fsyPath = this.getFileAddress(fsy);
      const proc = Bun.spawnSync([
        "./OnChainSW_Extension.exe",
        "-updateattr",
        fsyPath,
        ...fsy.data.approvalNodeInfo,
      ]);
      const result = proc.stdout.toString();
      console.log({ result, fsyPath }, "fsy");
      if (result == "success") {
        fsy.dimension = "modify";
      }
      this.convertAttachments(fsy.attachments || []);
    }
  }

  convertAttachments(attachments: Filesystem<Attachment>[]) {
    for (const att of attachments) {
      const attPath = this.getFileAddress(att);
      const proc = Bun.spawnSync([
        "./OnChainSW_Extension.exe",
        "-pdf",
        attPath,
      ]);
      const result = proc.stdout.toString();
      console.log({ result, attPath }, "attachments");
      if (result == "success") {
        att.dimension = "modify";
      }
    }
  }

  private getFileAddress(fsy: Filesystem<any>) {
    return `"${process.cwd()}${fsy.localAddress.replace("./", "\\")}\\${
      fsy.filename
    }"`;
  }
}
