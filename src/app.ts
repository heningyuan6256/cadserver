import Sdk from "./sdk";
import Downloader from "./downloader";
import Convertor from "./convertor";
import Uploader from "./uploader";


export async function transform(params: TransformArgument) {
  const sdk = new Sdk(params);
  const data = await sdk.getAffectFiles(params.insId);
  const downloader = new Downloader(data, sdk.common);
  console.log('下载')
  await downloader.run();
  const filesystem = await downloader.filesystem;
  const convertor = new Convertor(filesystem);
  console.log('转换')
  await convertor.run();
  const uploader = new Uploader(filesystem, sdk.common);
  console.log('上传')
  await uploader.run();
  console.log('更新')
  await sdk.updateFile(filesystem);
}

export async function downloadDraw(params: TransformArgument) {
  const sdk = new Sdk(params);
  const data = await sdk.getStructureTab(params.insId);
  const downloader = new Downloader(data, sdk.common);
  await downloader.run();
  const filesystem = await downloader.filesystem;
  const convertor = new Convertor(filesystem);
  await convertor.run();
}
