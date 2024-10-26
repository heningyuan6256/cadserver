import { Filesystem } from "../filesystem";
import { FileSelf } from "../sdk/types";

export default class Convertor {
  filesystem: Filesystem<FileSelf>[];
  constructor(filesystem: Filesystem<FileSelf>[]) {
    this.filesystem = filesystem;
  }
  async run() {
    
  }
}