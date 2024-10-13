export function constructPreviewRequestUrl(
  endpoint: string,
  urlParams: Map<string, string>,
) {
  const urlParamsForPreviewUrl = new Map(urlParams);

  // "endpointName" と "fileFormat" はカスタマイズしたバックエンドでのみ使用されるため
  // プレビュー用の URL から除外する
  urlParamsForPreviewUrl.delete("endpointName");
  urlParamsForPreviewUrl.delete("fileFormat");

  const paramsString = Array.from(urlParamsForPreviewUrl)
    .map(([key, value]) => {
      if (!value) {
        return "";
      }
      return `${key}=${encodeURIComponent(value)}`;
    })
    .filter((param) => param)
    .join("&");

  return `https://api.e-stat.go.jp/rest/3.0/app/${endpoint}?appId=<アプリケーションID>${paramsString.length > 0 ? "&" : ""}${paramsString}`;
}
