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
import {
  validateIsNumber,
  validateOpenYears,
  validateStatsCode,
  validateStatsField,
  validateSurveyYears,
  validateUpdatedDate,
} from "@/utils/validations";
import { useState } from "react";

type UrlParamsKey =
  | "endpointName"
  | "fileFormat"
  | "lang"
  | "surveyYears"
  | "openYears"
  | "statsField"
  | "statsCode"
  | "searchWord"
  | "searchKind"
  | "collectArea"
  | "explanationGetFlg"
  | "statsNameList"
  | "startPosition"
  | "limit"
  | "updatedDate"
  | "callback";

export default function GetStatsList() {
  const [returnedData, setReturnedData] = useState<string>("");
  const [returnedDataFileFormat, setReturnedDataFileFormat] =
    useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [urlParams, setUrlParams] = useState<Map<string, string>>(
    new Map([
      ["endpointName", "statsList"],
      ["fileFormat", "json"],
    ]),
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
        <h1>統計表情報取得</h1>
        <div className="page-subtitle">getStatsList</div>
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
          <div>surveyYears</div>
          <div>調査年月</div>
          <div>－</div>
          <div>
            以下のいずれかの形式で指定して下さい。
            <ul>
              <li>yyyy：単年検索</li>
              <li>yyyymm：単月検索</li>
              <li>yyyymm-yyyymm：範囲検索</li>
            </ul>
          </div>
          <div>
            <Input
              error={fieldsWithError.has("surveyYears")}
              value={urlParams.get("surveyYears") || ""}
              onChange={generateOnChangeHandler(
                "surveyYears",
                setUrlParams,
                setFieldsWithErrors,
                validateSurveyYears,
              )}
            />
          </div>
        </div>
        <div className="table-row">
          <div>openYears</div>
          <div>公開年月</div>
          <div>－</div>
          <div>調査年月と同様です。</div>
          <div>
            <Input
              error={fieldsWithError.has("openYears")}
              value={urlParams.get("openYears") || ""}
              onChange={generateOnChangeHandler(
                "openYears",
                setUrlParams,
                setFieldsWithErrors,
                validateOpenYears,
              )}
            />
          </div>
        </div>
        <div className="table-row">
          <div>statsField</div>
          <div>統計分野</div>
          <div>－</div>
          <div>
            以下のいずれかの形式で指定して下さい。
            <ul>
              <li>数値2桁：統計大分類で検索</li>
              <li>数値4桁：統計小分類で検索</li>
            </ul>
          </div>
          <div>
            <Input
              error={fieldsWithError.has("statsField")}
              value={urlParams.get("statsField") || ""}
              onChange={generateOnChangeHandler(
                "statsField",
                setUrlParams,
                setFieldsWithErrors,
                validateStatsField,
              )}
            />
          </div>
        </div>
        <div className="table-row">
          <div>statsCode</div>
          <div>政府統計コード</div>
          <div>－</div>
          <div>
            以下のいずれかの形式で指定して下さい。
            <ul>
              <li>数値5桁：作成機関で検索</li>
              <li>数値8桁：政府統計コードで検索</li>
            </ul>
          </div>
          <div>
            <Input
              error={fieldsWithError.has("statsCode")}
              value={urlParams.get("statsCode") || ""}
              onChange={generateOnChangeHandler(
                "statsCode",
                setUrlParams,
                setFieldsWithErrors,
                validateStatsCode,
              )}
            />
          </div>
        </div>
        <div className="table-row">
          <div>searchWord</div>
          <div>検索キーワード</div>
          <div>－</div>
          <div>
            任意の文字列
            <br />
            表題やメタ情報等に含まれている文字列を検索します。
            <br />
            AND、OR 又は NOT を指定して複数ワードでの検索が可能です。 (東京 AND
            人口、東京 OR 大阪 等)
          </div>
          <div>
            <Input
              error={fieldsWithError.has("searchWord")}
              value={urlParams.get("searchWord") || ""}
              onChange={generateOnChangeHandler(
                "searchWord",
                setUrlParams,
                setFieldsWithErrors,
              )}
            />
          </div>
        </div>
        <div className="table-row">
          <div>searchKind</div>
          <div>検索データ種別</div>
          <div>－</div>
          <div>
            検索するデータの種別を指定して下さい。
            <ul>
              <li>1：統計情報(省略値)</li>
              <li>2：小地域・地域メッシュ</li>
            </ul>
          </div>
          <div>
            <select
              value={urlParams.get("searchKind") || ""}
              onChange={(e) =>
                setUrlParams((prev) =>
                  new Map(prev).set("searchKind", e.target.value),
                )
              }
            >
              <option value="">未指定</option>
              <option value="1">統計情報</option>
              <option value="2">小地域・地域メッシュ</option>
            </select>
          </div>
        </div>
        <div className="table-row">
          <div>collectArea</div>
          <div>集計地域区分</div>
          <div>－</div>
          <div>
            検索するデータの集計地域区分を指定して下さい。
            <ul>
              <li>1：全国</li>
              <li>2：都道府県</li>
              <li>3：市区町村</li>
            </ul>
            ※検索データ種別=2（小地域・地域メッシュ）の場合は、無効になります。
          </div>
          <div>
            <select
              value={urlParams.get("collectArea") || ""}
              onChange={(e) =>
                setUrlParams((prev) =>
                  new Map(prev).set("collectArea", e.target.value),
                )
              }
            >
              <option value="">未指定</option>
              <option value="1">全国</option>
              <option value="2">都道府県</option>
              <option value="3">市区町村</option>
            </select>
          </div>
        </div>
        <div className="table-row">
          <div>explanationGetFlg</div>
          <div>解説情報有無</div>
          <div>－</div>
          <div>
            統計表及び、提供統計、提供分類の解説を取得するか否かを以下のいずれかから指定して下さい。
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
          <div>statsNameList</div>
          <div>統計調査名指定</div>
          <div>－</div>
          <div>
            統計表情報でなく、統計調査名の一覧を取得する場合に指定して下さい。
            <ul>
              <li>Y：統計調査名一覧</li>
            </ul>
            statsNameListパラメータを省略した場合、又はY以外の値を設定した場合は統計表情報を出力します。
          </div>
          <div>
            <select
              value={urlParams.get("statsNameList") || ""}
              onChange={(e) =>
                setUrlParams((prev) =>
                  new Map(prev).set("statsNameList", e.target.value),
                )
              }
            >
              <option value="">未指定</option>
              <option value="Y">統計調査名一覧</option>
            </select>
          </div>
        </div>
        <div className="table-row">
          <div>startPosition</div>
          <div>データ取得開始位置</div>
          <div>－</div>
          <div>
            データの取得開始位置（1から始まる行番号）を指定して下さい。省略時は先頭から取得します。
            <br />
            統計データを複数回に分けて取得する場合等、継続データを取得する開始位置を指定するために指定します。
            <br />
            前回受信したデータの&lt;NEXT_KEY&gt;タグの値を指定します。
          </div>
          <div>
            <Input
              error={fieldsWithError.has("startPosition")}
              value={urlParams.get("startPosition") || ""}
              onChange={generateOnChangeHandler(
                "startPosition",
                setUrlParams,
                setFieldsWithErrors,
                validateIsNumber,
              )}
            />
          </div>
        </div>
        <div className="table-row">
          <div>limit</div>
          <div>データ取得件数</div>
          <div>－</div>
          <div>
            データの取得行数を指定して下さい。省略時は10万件です。
            <br />
            データ件数が指定したlimit値より少ない場合、全件を取得します。データ件数が指定したlimit値より多い場合（継続データが存在する）は、受信したデータの&lt;NEXT_KEY&gt;タグに継続データの開始行が設定されます。
          </div>
          <div>
            <Input
              error={fieldsWithError.has("limit")}
              value={urlParams.get("limit") || ""}
              onChange={generateOnChangeHandler(
                "limit",
                setUrlParams,
                setFieldsWithErrors,
                validateIsNumber,
              )}
            />
          </div>
        </div>
        <div className="table-row">
          <div>updatedDate</div>
          <div>更新日付</div>
          <div>－</div>
          <div>
            更新日付を指定します。指定された期間で更新された統計表の情報を提供します。以下のいずれかの形式で指定して下さい。
            <ul>
              <li>yyyy：単年検索</li>
              <li>yyyymm：単月検索</li>
              <li>yyyymmdd：単日検索</li>
              <li>yyyymmdd-yyyymmdd：範囲検索</li>
            </ul>
          </div>
          <div>
            <Input
              error={fieldsWithError.has("updatedDate")}
              value={urlParams.get("updatedDate") || ""}
              onChange={generateOnChangeHandler(
                "updatedDate",
                setUrlParams,
                setFieldsWithErrors,
                validateUpdatedDate,
              )}
            />
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
      {fetchError && <div>{fetchError}</div>}
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
    return "json/getStatsList";
  }
  if (urlParams.get("fileFormat") === "csv") {
    return "getSimpleStatsList";
  }
  return "";
}
