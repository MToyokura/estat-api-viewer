"use client";

import { ApiFilterInfo } from "@/app/(viewers)/common/apiFilterInfo";
import {
  Input,
  generateOnChangeHandler,
} from "@/app/common/components/customInput";
import { InfoDisplay } from "@/app/common/components/infoDisplay";
import { constructPreviewRequestUrl } from "@/app/common/constructPreviewRequestUrl";
import { handleOnClickFetchData } from "@/app/common/fetchData";
import { handleDownload } from "@/app/common/handleDownload";
import { validateIsNumber } from "@/utils/validations";
import { useState } from "react";

type UrlParamsKey =
  | "endpointName"
  | "fileFormat"
  | "lang"
  | "statsDataId"
  | "explanationGetFlg"
  | "callback";

export default function GetMetaInfo() {
  const [returnedData, setReturnedData] = useState<string>("");
  const [returnedDataFileFormat, setReturnedDataFileFormat] =
    useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [urlParams, setUrlParams] = useState<Map<string, string>>(
    new Map([["endpointName", "metaInfo"]]),
  );
  const [fieldsWithError, setFieldsWithErrors] = useState<Set<string>>(
    new Set(),
  );

  // ファイル形式が指定されていない場合はデフォルトで JSON を指定
  if (!urlParams.get("fileFormat")) {
    setUrlParams((prev) => new Map(prev).set("fileFormat", "json"));
  }

  return (
    <div className="main-content">
      <div className="vertical-center">
        <h1>メタ情報取得</h1>
        <div className="page-subtitle">getMetaInfo</div>
        <ApiFilterInfo />
      </div>
      <div className="table">
        <div className="table-header">
          <div>パラメータ名</div>
          <div>意味</div>
          <div>必須</div>
          <div>設定内容・設定可能値</div>
          <div>入力欄</div>
        </div>
        <div className="table-row">
          <div>appId</div>
          <div>アプリケーションID</div>
          <div>〇</div>
          <div>取得したアプリケーションIDを指定して下さい。</div>
          <div>
            自身のアプリケーションでAPIを使用する場合はここで指定する必要があります。
            本サイトでは、本サイトに与えられたアプリケーションIDが自動で指定されます。
          </div>
        </div>
        <div className="table-row">
          <div>lang</div>
          <div>言語</div>
          <div>－</div>
          <div>
            取得するデータの言語を 以下のいずれかを指定して下さい。
            <ul>
              <li>J：日本語 (省略値)</li>
              <li>E：英語</li>
            </ul>
          </div>
          <div>
            <select
              value={urlParams.get("lang") || ""}
              onChange={(e) =>
                setUrlParams((prev) =>
                  new Map(prev).set("lang", e.target.value),
                )
              }
            >
              <option value="">未指定</option>
              <option value="J">日本語</option>
              <option value="E">英語</option>
            </select>
          </div>
        </div>
        <div className="table-row">
          <div>statsDataId</div>
          <div>統計表ID</div>
          <div>〇</div>
          <div>「統計表情報取得」で得られる統計表IDです。</div>
          <div>
            <Input
              error={fieldsWithError.has("statsDataId")}
              value={urlParams.get("statsDataId") || ""}
              onChange={generateOnChangeHandler(
                "statsDataId",
                setUrlParams,
                setFieldsWithErrors,
                validateIsNumber,
              )}
            />
          </div>
        </div>
        <div className="table-row">
          <div>explanationGetFlg</div>
          <div>解説情報有無</div>
          <div>－</div>
          <div>
            統計表及び、提供統計、提供分類、各事項の解説を取得するか否かを以下のいずれかから指定して下さい。
            <ul>
              <li>Y：取得する (省略値)</li>
              <li>N：取得しない</li>
            </ul>
          </div>
          <div>
            <select
              value={urlParams.get("explanationGetFlg") || ""}
              onChange={(e) =>
                setUrlParams((prev) =>
                  new Map(prev).set("explanationGetFlg", e.target.value),
                )
              }
            >
              <option value="">未指定</option>
              <option value="Y">取得する</option>
              <option value="N">取得しない</option>
            </select>
          </div>
        </div>
        <div className="table-row">
          <div>callback</div>
          <div>コールバック関数</div>
          <div>△</div>
          <div>
            JSONP形式のデータ呼出の場合は必須パラメータです。
            <br />
            コールバックされる関数名を指定して下さい。
          </div>
          <div>本サイトでは指定できません。</div>
        </div>
        <div className="table-row">
          <div />
          <div>ファイル形式</div>
          <div />
          <div />
          <div>
            <select
              value={urlParams.get("fileFormat") || ""}
              onChange={(e) =>
                setUrlParams((prev) =>
                  new Map(prev).set("fileFormat", e.target.value),
                )
              }
            >
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
            </select>
          </div>
        </div>
      </div>
      <div className="get-request-url">
        <div>GET リクエストの URL</div>
        <code>
          {constructPreviewRequestUrl(
            determineEndpointForPreviewUrl(urlParams),
            urlParams,
          )}
        </code>
      </div>
      <div className="get-save-buttons">
        <button
          className="primary-button"
          type="button"
          onClick={() => {
            handleOnClickFetchData(
              setIsLoading,
              urlParams,
              setReturnedData,
              setReturnedDataFileFormat,
              setFetchError,
            );
          }}
        >
          取得
        </button>
        {returnedData && !isLoading && (
          <button
            className="primary-button"
            type="button"
            onClick={() => {
              handleDownload(returnedData, returnedDataFileFormat);
            }}
          >
            ダウンロード
          </button>
        )}
      </div>
      {isLoading && <div>取得中...</div>}
      {fetchError && <div>{fetchError}</div>}{" "}
      <InfoDisplay
        returnedData={returnedData}
        returnedDataFileFormat={returnedDataFileFormat}
        endpointName={urlParams.get("endpointName") || ""}
      />
    </div>
  );
}

function determineEndpointForPreviewUrl(urlParams: Map<string, string>) {
  if (urlParams.get("fileFormat") === "json") {
    return "json/getMetaInfo";
  }
  if (urlParams.get("fileFormat") === "csv") {
    return "getSimpleMetaInfo";
  }
  return "";
}
