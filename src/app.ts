import Sdk from "./sdk";
import Downloader from "./downloader";
import Convertor from "./convertor";
import Uploader from "./uploader";


export async function transform(params: TransformArgument) {
  const sdk = new Sdk(params);
  const data = await sdk.getAffectFiles(params.insId);
  const downloader = new Downloader(data, sdk.common);
  await downloader.run();
  const filesystem = await downloader.filesystem;
  const convertor = new Convertor(filesystem);
  await convertor.run();
  const uploader = new Uploader(filesystem, sdk.common);
  await uploader.run();
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
