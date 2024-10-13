import { endpointUrl } from "@/utils/constants";

export async function fetchData<UrlParamsKey extends string>(
  urlParams: Map<UrlParamsKey, string>,
) {
  const urlParamsString = Array.from(urlParams)
    .map(([key, value]) => {
      if (!value) {
        return "";
      }
      return `${key}=${encodeURIComponent(value)}`;
    })
    .filter((param) => param) // 空のパラメータを除外
    .join("&");

  const response = await fetch(`${endpointUrl}?${urlParamsString}`);
  if (!response.ok) {
    const errorMessage = await response.json();
    throw new Error(
      `HTTP status ${response.status} ${response.statusText}: ${errorMessage.message}`,
    );
  }
  return await response.text();
}

export async function handleOnClickFetchData(
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  urlParams: Map<string, string>,
  setReturnedData: React.Dispatch<React.SetStateAction<string>>,
  setReturnedDataFileFormat: React.Dispatch<React.SetStateAction<string>>,
  setFetchError: React.Dispatch<React.SetStateAction<string | null>>,
) {
  if (
    urlParams.size === 2 &&
    urlParams.has("fileFormat") &&
    urlParams.has("endpointName")
  ) {
    setFetchError("1つ以上のパラメータを指定してください。");
    return;
  }
  setIsLoading(true);
  try {
    const data = await fetchData(urlParams);
    setReturnedData(data);
    setReturnedDataFileFormat(urlParams.get("fileFormat") || "");
    setFetchError(null);
    setIsLoading(false);
  } catch (error) {
    if (error instanceof Error) {
      setFetchError(error.message);
      setIsLoading(false);
    }
  }
}
