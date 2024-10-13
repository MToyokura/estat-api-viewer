"use client";

import { ApiFilterInfo } from "@/app/(viewers)/common/apiFilterInfo";
import {
  Input,
  generateOnChangeHandler,
} from "@/app/common/components/customInput";
import { InfoDisplay } from "@/app/common/components/infoDisplay";
import { InfoIcon } from "@/app/common/components/infoIcon";
import { constructPreviewRequestUrl } from "@/app/common/constructPreviewRequestUrl";
import { handleOnClickFetchData } from "@/app/common/fetchData";
import { handleDownload } from "@/app/common/handleDownload";
import { validateIsNumber } from "@/utils/validations";
import { useState } from "react";
import styles from "./styles.module.css";

type UrlParamsKey =
  | "endpointName"
  | "fileFormat"
  | "lang"
  | "dataSetId"
  | "dataSetId"
  | "statsDataId"
  | "lvTab"
  | "cdTab"
  | "cdTabFrom"
  | "cdTabTo"
  | "lvTime"
  | "cdTime"
  | "cdTimeFrom"
  | "cdTimeTo"
  | "lvArea"
  | "cdArea"
  | "cdAreaFrom"
  | "cdAreaTo"
  | "lvCat01"
  | "cdCat01"
  | "cdCat01From"
  | "cdCat01To"
  | "startPosition"
  | "limit"
  | "metaGetFlg"
  | "cntGetFlg"
  | "explanationGetFlg"
  | "annotationGetFlg"
  | "replaceSpChar"
  | "callback"
  | "sectionHeaderFlg";

export default function GetStatsData() {
  const [returnedData, setReturnedData] = useState<string>("");
  const [returnedDataFileFormat, setReturnedDataFileFormat] =
    useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [urlParams, setUrlParams] = useState<Map<string, string>>(
    new Map([
      ["endpointName", "statsData"],
      ["fileFormat", "json"],
    ]),
  );
  const [fieldsWithError, setFieldsWithErrors] = useState<Set<string>>(
    new Set(),
  );
  const [additionalFields, setAdditionalFields] = useState<
    Array<[string, string]>
  >([]);

  // ファイル形式が指定されていない場合はデフォルトで JSON を指定
  if (!urlParams.get("fileFormat")) {
    setUrlParams((prev) => new Map(prev).set("fileFormat", "json"));
  }

  return (
    <div className="main-content">
      <div className="vertical-center">
        <h1>統計データ取得</h1>
        <div className="page-subtitle">getStatsData</div>
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
          <div>dataSetId</div>
          <div>データセットID ※1,2</div>
          <div>△</div>
          <div>
            「データセット登録」で登録したデータセットID です。
            <div>
              ※1 データセットID 又は 統計表ID
              <br />
              のいずれか一方を必ず指定して下さい。どちらも指定しない場合や両方指定した場合はエラーとなります。
            </div>
            <div>
              ※2 データセットID
              <br />
              を指定した場合、そのデータセットに登録されている絞り込み条件を元にデータを取得します。
              <br />
              データセットIDと絞り込み条件を指定した場合は、データセットに登録されている条件から更に絞り込むことができます。
            </div>
          </div>
          <div>本サイトでは指定できません。</div>
        </div>
        <div className="table-row">
          <div>statsDataId</div>
          <div>統計表ID ※1</div>
          <div>△</div>
          <div>
            「統計表情報取得」で得られる統計表IDです。
            <div>
              ※1 データセットID 又は 統計表ID
              <br />
              のいずれか一方を必ず指定して下さい。どちらも指定しない場合や両方指定した場合はエラーとなります。
            </div>
          </div>
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
      </div>
      <div className={styles.table_separator_info}>
        <div>絞り込み条件</div>
        <div>
          ※2 データセットID
          を指定した場合、そのデータセットに登録されている絞り込み条件を元にデータを取得します。
          データセットIDと絞り込み条件を指定した場合は、データセットに登録されている条件から更に絞り込むことができます。
        </div>
      </div>
      <div className="table">
        <div className="table-row">
          <div>lvTab</div>
          <div>表章事項 階層レベル</div>
          <div>－</div>
          <div>
            以下のいずれかの形式で指定して下さい。
            <br /> (Xは「メタ情報取得」で得られる各メタ情報の階層レベル)
            <br />
            ・X：指定階層レベルのみで絞り込み
            <br />
            ・X-X：指定階層レベルの範囲で絞り込み
            <br />
            ・-X：階層レベル1 から指定階層レベルの範囲で絞り込み
            <br />
            ・X-：指定階層レベルから階層レベル 9 の範囲で絞り込み
          </div>
          <div>
            <Input
              error={fieldsWithError.has("lvTab")}
              value={urlParams.get("lvTab") || ""}
              onChange={generateOnChangeHandler(
                "lvTab",
                setUrlParams,
                setFieldsWithErrors,
              )}
            />
          </div>
        </div>
        <div className="table-row">
          <div>cdTab</div>
          <div>表章事項 単一コード ※3</div>
          <div>－</div>
          <div>
            特定の項目コードでの絞り込み
            <br />
            「メタ情報取得」で得られる各メタ情報の項目コードを指定して下さい。
            <br />
            コードはカンマ区切りで100個まで指定可能です。
            <br />
            ※3 以下の特別なキーワードを指定可能です。 min：最小値 max：最大値
            min及びmaxはそれぞれ該当事項に属する項目コード値の最小値及び最大値を表します。
            単一コードでmin又はmaxを使用する場合には、カンマ区切りによる複数の項目コード指定はできません。
          </div>
          <div>
            <Input
              error={fieldsWithError.has("cdTab")}
              value={urlParams.get("cdTab") || ""}
              onChange={generateOnChangeHandler(
                "cdTab",
                setUrlParams,
                setFieldsWithErrors,
              )}
            />
          </div>
        </div>
        <div className="table-row">
          <div>cdTabFrom</div>
          <div>表章事項 コード From ※3</div>
          <div>－</div>
          <div>
            項目コードの範囲で絞り込み
            <br />
            絞り込む範囲の開始位置の項目コードを指定して下さい。
            <br />
            ※3 以下の特別なキーワードを指定可能です。 min：最小値 max：最大値
            min及びmaxはそれぞれ該当事項に属する項目コード値の最小値及び最大値を表します。
            単一コードでmin又はmaxを使用する場合には、カンマ区切りによる複数の項目コード指定はできません。
          </div>
          <div>
            <Input
              error={fieldsWithError.has("cdTabFrom")}
              value={urlParams.get("cdTabFrom") || ""}
              onChange={generateOnChangeHandler(
                "cdTabFrom",
                setUrlParams,
                setFieldsWithErrors,
              )}
            />
          </div>
        </div>
        <div className="table-row">
          <div>cdTabTo</div>
          <div>表章事項 コード To ※3</div>
          <div>－</div>
          <div>
            項目コードの範囲で絞り込み
            <br />
            絞り込む範囲の終了位置の項目コードを指定して下さい。
            <br />
            ※3 以下の特別なキーワードを指定可能です。 min：最小値 max：最大値
            min及びmaxはそれぞれ該当事項に属する項目コード値の最小値及び最大値を表します。
            単一コードでmin又はmaxを使用する場合には、カンマ区切りによる複数の項目コード指定はできません。
          </div>
          <div>
            <Input
              error={fieldsWithError.has("cdTabTo")}
              value={urlParams.get("cdTabTo") || ""}
              onChange={generateOnChangeHandler(
                "cdTabTo",
                setUrlParams,
                setFieldsWithErrors,
              )}
            />
          </div>
        </div>
        <div className="table-row">
          <div>lvTime</div>
          <div>時間軸事項 階層レベル</div>
          <div>－</div>
          <div>表章事項の階層レベルと同様です。</div>
          <div>
            <Input
              error={fieldsWithError.has("lvTime")}
              value={urlParams.get("lvTime") || ""}
              onChange={generateOnChangeHandler(
                "lvTime",
                setUrlParams,
                setFieldsWithErrors,
              )}
            />
          </div>
        </div>
        <div className="table-row">
          <div>cdTime</div>
          <div>時間軸事項 単一コード</div>
          <div>－</div>
          <div>表章事項の単一コードと同様です。</div>
          <div>
            <Input
              error={fieldsWithError.has("cdTime")}
              value={urlParams.get("cdTime") || ""}
              onChange={generateOnChangeHandler(
                "cdTime",
                setUrlParams,
                setFieldsWithErrors,
              )}
            />
          </div>
        </div>
        <div className="table-row">
          <div>cdTimeFrom</div>
          <div>時間軸事項 コード From</div>
          <div>－</div>
          <div>表章事項のコード Fromと同様です。</div>
          <div>
            <Input
              error={fieldsWithError.has("cdTimeFrom")}
              value={urlParams.get("cdTimeFrom") || ""}
              onChange={generateOnChangeHandler(
                "cdTimeFrom",
                setUrlParams,
                setFieldsWithErrors,
              )}
            />
          </div>
        </div>
        <div className="table-row">
          <div>cdTimeTo</div>
          <div>時間軸事項 コード To</div>
          <div>－</div>
          <div>表章事項のコード Toと同様です。</div>
          <div>
            <Input
              error={fieldsWithError.has("cdTimeTo")}
              value={urlParams.get("cdTimeTo") || ""}
              onChange={generateOnChangeHandler(
                "cdTimeTo",
                setUrlParams,
                setFieldsWithErrors,
              )}
            />
          </div>
        </div>
        <div className="table-row">
          <div>lvArea</div>
          <div>地域事項 階層レベル</div>
          <div>－</div>
          <div>表章事項の階層レベルと同様です。</div>
          <div>
            <Input
              error={fieldsWithError.has("lvArea")}
              value={urlParams.get("lvArea") || ""}
              onChange={generateOnChangeHandler(
                "lvArea",
                setUrlParams,
                setFieldsWithErrors,
              )}
            />
          </div>
        </div>
        <div className="table-row">
          <div>cdArea</div>
          <div>地域事項 単一コード</div>
          <div>－</div>
          <div>表章事項の単一コードと同様です。</div>
          <div>
            <Input
              error={fieldsWithError.has("cdArea")}
              value={urlParams.get("cdArea") || ""}
              onChange={generateOnChangeHandler(
                "cdArea",
                setUrlParams,
                setFieldsWithErrors,
              )}
            />
          </div>
        </div>
        <div className="table-row">
          <div>cdAreaFrom</div>
          <div>地域事項 コード From</div>
          <div>－</div>
          <div>表章事項のコード Fromと同様です。</div>
          <div>
            <Input
              error={fieldsWithError.has("cdAreaFrom")}
              value={urlParams.get("cdAreaFrom") || ""}
              onChange={generateOnChangeHandler(
                "cdAreaFrom",
                setUrlParams,
                setFieldsWithErrors,
              )}
            />
          </div>
        </div>
        <div className="table-row">
          <div>cdAreaTo</div>
          <div>地域事項 コード To</div>
          <div>－</div>
          <div>表章事項のコード Toと同様です。</div>
          <div>
            <Input
              error={fieldsWithError.has("cdAreaTo")}
              value={urlParams.get("cdAreaTo") || ""}
              onChange={generateOnChangeHandler(
                "cdAreaTo",
                setUrlParams,
                setFieldsWithErrors,
              )}
            />
          </div>
        </div>
        <div className="table-row">
          <div>lvCat01</div>
          <div>分類事項 階層レベル</div>
          <div>－</div>
          <div>表章事項の階層レベルと同様です。</div>
          <div>
            <Input
              error={fieldsWithError.has("lvCat01")}
              value={urlParams.get("lvCat01") || ""}
              onChange={generateOnChangeHandler(
                "lvCat01",
                setUrlParams,
                setFieldsWithErrors,
              )}
            />
          </div>
        </div>
        <div className="table-row">
          <div>cdCat01</div>
          <div>分類事項 単一コード</div>
          <div>－</div>
          <div>表章事項の単一コードと同様です。</div>
          <div>
            <Input
              error={fieldsWithError.has("cdCat01")}
              value={urlParams.get("cdCat01") || ""}
              onChange={generateOnChangeHandler(
                "cdCat01",
                setUrlParams,
                setFieldsWithErrors,
              )}
            />
          </div>
        </div>
        <div className="table-row">
          <div>cdCat01From</div>
          <div>分類事項 コード From</div>
          <div>－</div>
          <div>表章事項のコード Fromと同様です。</div>
          <div>
            <Input
              error={fieldsWithError.has("cdCat01From")}
              value={urlParams.get("cdCat01From") || ""}
              onChange={generateOnChangeHandler(
                "cdCat01From",
                setUrlParams,
                setFieldsWithErrors,
              )}
            />
          </div>
        </div>
        <div className="table-row">
          <div>cdCat01To</div>
          <div>分類事項 コード To</div>
          <div>－</div>
          <div>表章事項のコード Toと同様です。</div>
          <div>
            <Input
              error={fieldsWithError.has("cdCat01To")}
              value={urlParams.get("cdCat01To") || ""}
              onChange={generateOnChangeHandler(
                "cdCat01To",
                setUrlParams,
                setFieldsWithErrors,
              )}
            />
          </div>
        </div>
        {additionalFields.map(([key, value], index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: This is fine 🔥
          <div className="table-row" key={index}>
            <div>
              <input
                value={additionalFields[index][0]}
                onChange={(e) => {
                  setAdditionalFields((prev) => {
                    const deepCopy = prev.map<[string, string]>((pair) => [
                      ...pair,
                    ]);
                    deepCopy[index][0] = e.target.value;
                    return deepCopy;
                  });
                }}
              />
            </div>
            <div>分類事項</div>
            <div>－</div>
            <div>分類事項01と同様です。</div>
            <div className={styles.additional_fields_input}>
              <input
                value={additionalFields[index][1]}
                onChange={(e) => {
                  setAdditionalFields((prev) => {
                    const deepCopy = prev.map<[string, string]>((pair) => [
                      ...pair,
                    ]);
                    deepCopy[index][1] = e.target.value;
                    return deepCopy;
                  });
                }}
              />
              <button
                type="button"
                onClick={() => {
                  setAdditionalFields((prev) => {
                    return prev.filter((_, i) => i !== index);
                  });
                }}
              >
                削除
              </button>
            </div>
          </div>
        ))}
        <div className="table-row">
          <div>・・・</div>
          <div>分類事項02 ～ 15</div>
          <div>－</div>
          <div>分類事項01と同様です。</div>
          <div>
            <button
              type="button"
              onClick={() => {
                setAdditionalFields((prev) => {
                  return prev.concat([["", ""]]);
                });
              }}
            >
              分類項目を追加する
            </button>
            <div className="tooltip-container">
              <InfoIcon />
              <div className="tooltip-text">
                重複するパラメータ名を指定した場合、最後に指定した値が使用されます（本サイトでの仕様）
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.table_separator_info}>その他の条件</div>
      <div className="table">
        <div className="table-row">
          <div>startPosition</div>
          <div>データ取得開始位置</div>
          <div>－</div>
          <div>
            データの取得開始位置（1から始まる行番号）を指定して下さい。
            <br /> 省略時は先頭から取得します。
            <br />
            統計データを複数回に分けて取得する場合等、継続データを取得する開始位置を指定するために指定します。
            <br /> 前回受信したデータのタグの値を指定します。
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
          <div>metaGetFlg</div>
          <div>メタ情報有無</div>
          <div>－</div>
          <div>
            統計データと一緒にメタ情報を取得するか否かを以下のいずれかから指定して下さい。
            <ul>
              <li>Y：取得する (省略値)</li>
              <li>N：取得しない</li>
            </ul>
            CSV形式のデータ呼び出しの場合、本パラメータは無効（N：取得しない）です。
          </div>
          <div>
            <select
              value={urlParams.get("metaGetFlg") || ""}
              onChange={(e) =>
                setUrlParams((prev) =>
                  new Map(prev).set("metaGetFlg", e.target.value),
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
          <div>cntGetFlg</div>
          <div>件数取得フラグ</div>
          <div>－</div>
          <div>
            指定した場合、件数のみ取得できます。metaGetFlg=Yの場合は、メタ情報も同時に返却されます。
            <ul>
              <li>Y：件数のみ取得する。統計データは取得しない。</li>
              <li>N：件数及び統計データを取得する。(省略値)</li>
            </ul>
            CSV形式のデータ呼び出しの場合、本パラメータは無効（N：件数及び統計データを取得する）です。
          </div>
          <div>
            <select
              value={urlParams.get("cntGetFlg") || ""}
              onChange={(e) =>
                setUrlParams((prev) =>
                  new Map(prev).set("cntGetFlg", e.target.value),
                )
              }
            >
              <option value="">未指定</option>
              <option value="Y">件数のみ取得する</option>
              <option value="N">件数及び統計データを取得する</option>
            </select>
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
          <div>annotationGetFlg</div>
          <div>注釈情報有無</div>
          <div>－</div>
          <div>
            数値データの注釈を取得するか否かを以下のいずれかから指定して下さい。
            <ul>
              <li>Y：取得する (省略値)</li>
              <li>N：取得しない</li>
            </ul>
          </div>
          <div>
            <select
              value={urlParams.get("annotationGetFlg") || ""}
              onChange={(e) =>
                setUrlParams((prev) =>
                  new Map(prev).set("annotationGetFlg", e.target.value),
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
          <div>replaceSpChar</div>
          <div>特殊文字の置換</div>
          <div>－</div>
          <div>
            特殊文字を置換するか否かを設定します。
            <ul>
              <li>置換しない：0（デフォルト）</li>
              <li>0（ゼロ）に置換する：1</li>
              <li>NULL（長さ0の文字列、空文字)に置換する：2</li>
              <li>NA（文字列）に置換する：3</li>
            </ul>
          </div>
          <div>
            <select
              value={urlParams.get("replaceSpChar") || ""}
              onChange={(e) =>
                setUrlParams((prev) =>
                  new Map(prev).set("replaceSpChar", e.target.value),
                )
              }
            >
              <option value="">未指定</option>
              <option value="0">置換しない</option>
              <option value="1">0（ゼロ）に置換する</option>
              <option value="2">NULL（長さ0の文字列、空文字)に置換する</option>
              <option value="3">NA（文字列）に置換する</option>
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
          <div>sectionHeaderFlg</div>
          <div>セクションヘッダフラグ</div>
          <div>－</div>
          <div>
            CSV形式のデータ呼び出しの場合に有効なパラメータです。
            <ul>
              <li>1：セクションヘッダを出力する (省略値)</li>
              <li>2：セクションヘッダを取得しない</li>
            </ul>
          </div>
          <div>
            <select
              value={urlParams.get("sectionHeaderFlg") || ""}
              onChange={(e) =>
                setUrlParams((prev) =>
                  new Map(prev).set("sectionHeaderFlg", e.target.value),
                )
              }
            >
              <option value="">未指定</option>
              <option value="1">セクションヘッダを出力する</option>
              <option value="2">セクションヘッダを取得しない</option>
            </select>
          </div>
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
            mergeUrlParamsWithAdditionalFields(urlParams, additionalFields),
          )}
        </code>
      </div>
      <div className="get-save-buttons">
        <button
          className="primary-button"
          type="button"
          onClick={() => {
            const urlParamsWithAdditionalFields =
              mergeUrlParamsWithAdditionalFields(urlParams, additionalFields);
            handleOnClickFetchData(
              setIsLoading,
              urlParamsWithAdditionalFields,
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
    return "json/getStatsData";
  }
  if (urlParams.get("fileFormat") === "csv") {
    return "getSimpleStatsData";
  }
  return "";
}

function mergeUrlParamsWithAdditionalFields(
  urlParams: Map<string, string>,
  additionalFields: Array<[string, string]>,
) {
  // additionalFields 内で key が重複している場合は、最後に指定された値を優先する
  // urlParams と additionalFields とで key が重複している場合は、additionalFields の値を優先する
  const urlParamsWithAdditionalFields = new Map(urlParams);
  for (const [key, value] of additionalFields) {
    urlParamsWithAdditionalFields.set(key, value);
  }
  return urlParamsWithAdditionalFields;
}
