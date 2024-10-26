import { readdir } from "node:fs/promises";
import path from "path";
import AdmZip from "adm-zip";

export async function compressFolder(inputDir: string, outputFilePath: string) {
  const zip = new AdmZip();
  const items = await readdir(inputDir);
  items.forEach((item) => {
    // const stats = fs.statSync(fullPath);
    zip.addLocalFile(item, "./files");
    // if (stats.isDirectory()) {
    //     const folder = zip.addFile(`${zipFolder}/${item}/`);
    //     addFolderToZip(fullPath, `${zipFolder}/${item}`);
    // } else {
    //     zip.addLocalFile(fullPath, zipFolder);
    // }
  });
  zip.writeZip(outputFilePath);
  console.log(`压缩完成：${outputFilePath}`);
}
