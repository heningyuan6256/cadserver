// CO000212 test环境
import {
  CommonUtils,
  BasicsAuthority,
  utility,
  IBaseInstance,
  IRowInstance,
} from "onchain-sdk";
import { BasicsAttribute } from "onchain-sdk/lib/src/utils/attribute";
import { Attachment, FileInfo, FileSelf } from "./types";
import { Filesystem } from "../filesystem";

export default class Sdk {
  common: CommonUtils;
  fileSuffix = [".SLDPRT", ".SLDASM"];
  attachmentSuffix = [".SLDDRW"];
  constructor(params: SdkBasicInfo) {
    this.common = new CommonUtils({
      baseUrl: "http://192.168.0.62:8017/api/plm",
      fetch,
      ...params,
    });
  }

  async getAffectFiles(insId: string) {
    const change = await this.common.getInstanceById(insId);
    const affectFileTab = await change.getTabByApicode({
      apicode: "AffectFiles",
    });
    if (affectFileTab) {
      const affectFiles = await affectFileTab.getTabData();
      // 过滤文件
      const instanceList = await this.getInstances(
        this.filterSuffix(affectFiles)
      );
      for (const instance of instanceList) {
        const urlAttr: BasicsAttribute | undefined = utility.getAttrOf(
          instance.BasicAttrs,
          "FileUrl"
        );
        this.initializeFileInfo(instance, {
          fileId: instance.basicReadInstanceInfo.insId,
          fileName: instance.basicReadInstanceInfo.insDesc,
          fileUrl: this.getFileUrl(instance, urlAttr),
        });
        const attachmentTab = await instance.getTabByApicode({
          apicode: "Attachments",
        });
        if (attachmentTab) {
          let attachments = (await attachmentTab.getTabData()) as Attachment[];
          attachments.forEach((attachment) => {
            const attachmentName =
              attachment.getAttrValue({
                tab: attachmentTab,
                attrApicode: "FileName",
              }) || "";
            this.initializeFileInfo(attachment, {
              fileId: attachment.rowId,
              fileName: attachmentName,
              fileUrl: this.getFileUrl(attachment, urlAttr),
            });
            attachment.isTransform = this.attachmentSuffix.some((suffix) =>
              attachmentName.endsWith(suffix)
            );
          });
          instance.attachments = attachments;
        } else {
          instance.attachments = [];
        }
      }
      return instanceList;
    } else {
      return [];
    }
  }

  filterSuffix(data: IRowInstance[]) {
    return data.filter((row) =>
      this.fileSuffix.some(
        (suffix) =>
          row.insDesc.endsWith(suffix) && !BasicsAuthority.isMosaic(row.insId)
      )
    );
  }

  getInstances(data: IRowInstance[]) {
    return Promise.all(
      data.map((row) => this.common.getInstanceById<FileSelf>(row.insId))
    );
  }

  private getFileUrl(
    instance: IBaseInstance | IRowInstance,
    attr?: BasicsAttribute
  ) {
    let fileUrl: string = "";
    if (attr) {
      if (this.isInstance(instance)) {
        fileUrl = instance.basicReadInstanceInfo.attributes[attr.id];
      } else {
        fileUrl = instance.attributes[attr.id];
      }
      if (BasicsAuthority.isMosaic(fileUrl)) {
        fileUrl = "";
      }
    }
    return fileUrl;
  }

  private isInstance(ins: any): ins is IBaseInstance {
    return !!ins.basicReadInstanceInfo;
  }

  private initializeFileInfo(
    instance: IBaseInstance | IRowInstance,
    info: FileInfo
  ) {
    Object.assign(instance, info);
  }

  async updateFile(filesystem: Filesystem<FileSelf>[]) {
    for (const fsy of filesystem) {
    }
    await this.uploadAttachment(filesystem);
  }

  private async uploadAttachment(filesystem: Filesystem<FileSelf>[]) {
    const files = filesystem
      .filter((fsy) => fsy.attachments?.length)
      .map((fsy) => {
        return {
          fileInsId: fsy.data.fileId,
          attachments: fsy.attachments!.map((att) => {
            return {
              rowId: att.data.fileId,
              url: att.data.uploadURL! || att.data.fileUrl,
              mark: att.data.uploadURL ? "true" : "failed",
            };
          }),
        };
      });
    const data = {
      tenantId: filesystem[0].manage.tenantId,
      files,
    };
    return data;
  }
}
