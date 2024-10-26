interface SdkBasicInfo {
  userId: string;
  tenantId: string;
  token?: string;
}

interface TransformArgument extends SdkBasicInfo {
  insId: string
}