import { Filesystem } from "../filesystem";
import { Attachment, FileSelf } from "../sdk/types";

export default class Convertor {
  filesystem: Filesystem<FileSelf>[];
  constructor(filesystem: Filesystem<FileSelf>[]) {
    this.filesystem = filesystem;
  }
  async run() {
    for (const fsy of this.filesystem) {
      const fsyPath = this.getFileAddress(fsy);
      const proc = Bun.spawn([
        "./OnChainSW_Extension.exe",
        "-updateattr",
        fsyPath,
        ...fsy.data.approvalNodeInfo,
      ]);
      const editCode = await proc.exited;
      const result = await new Response(proc.stdout).text();
      console.log(
        { editCode, result, fsyPath, params: fsy.data.approvalNodeInfo },
        "fsy"
      );
      if (result == "success") {
        fsy.dimension = "modify";
      }
      await this.convertAttachments(fsy.attachments || []);
    }
  }

  async convertAttachments(attachments: Filesystem<Attachment>[]) {
    for (const att of attachments) {
      const attPath = this.getFileAddress(att);
      const proc = Bun.spawn(["./OnChainSW_Extension.exe", "-pdf", attPath]);
      const editCode = await proc.exited;
      const result = await new Response(proc.stdout).text();
      console.log({ editCode, result, attPath }, "attachments");
      if (result == "success") {
        att.dimension = "modify";
      }
    }
  }

  private getFileAddress(fsy: Filesystem<any>) {
    return `"${process.cwd()}${fsy.localAddress.replace("./", "\\")}\\${
      fsy.filename
    }"`.replace(/[\r\n]*/g, "");
  }
}
