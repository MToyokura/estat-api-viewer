"use client";
import { GtihubIcon } from "@/app/common/components/githubIcon";
import { sampleCsv } from "@/app/sampleCsv";
import { sampleJson } from "@/app/sampleJson";
import type { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridReact } from "ag-grid-react";
import Link from "next/link";
import Papa from "papaparse";
import { useState } from "react";
import { JSONTree } from "react-json-tree";
import styles from "./styles.module.css";

export default function Home() {
  const [viewerType, setViewerType] = useState<"json" | "csv">("json");

  function toggler() {
    if (viewerType === "json") {
      setViewerType("csv");
    }
    if (viewerType === "csv") {
      setViewerType("json");
    }
  }

  return (
    <div className="main-content">
      <div className="vertical-center">
        <h1 className={styles.home_h1}>e-Stat API Viewer</h1>
        <div>
          ブラウザ上で e-Stat API からデータを取得・閲覧することができます
        </div>
        <SampleToggle viewerType={viewerType} toggler={toggler} />
      </div>
      <div>
        {viewerType === "json" && (
          <div>
            <div className="json-tree-wrapper">
              <JSONTree data={sampleJson} />
            </div>
          </div>
        )}
        {viewerType === "csv" && (
          <div>
            <SampleCsvViewer />
          </div>
        )}
      </div>
      <div className="vertical-center">
        <div className={styles.panels_container}>
          <Link href="/getStatsList" className={styles.panel}>
            <div>統計表情報取得</div>
            <div className={styles.panel_subtitle}>getStatsList</div>
          </Link>
          <Link href="/getMetaInfo" className={styles.panel}>
            <div>メタ情報取得</div>
            <div className={styles.panel_subtitle}>getMetaInfo</div>
          </Link>
          <Link href="/getStatsData" className={styles.panel}>
            <div>統計データ取得</div>
            <div className={styles.panel_subtitle}>getStatsData</div>
          </Link>
        </div>
        <div className={styles.github_repo}>
          <div>GitHub リポジトリ</div>
          <a href="https://github.com/MToyokura/estat-api-viewer">
            <GtihubIcon height="1.5em" width="1.5em" />
          </a>
        </div>
        <div className={styles.disclamer}>
          このサイトのサービスは、政府統計総合窓口(e-Stat)のAPI機能を使用していますが、サービスの内容は国によって保証されたものではありません。
        </div>
      </div>
    </div>
  );
}

function SampleCsvViewer() {
  const parsedCsv = Papa.parse(sampleCsv, {
    header: true,
    skipEmptyLines: true,
  });
  const headers = parsedCsv.meta.fields;

  return (
    <div
      className="ag-theme-quartz"
      style={{
        height: "500px",
        width: "100%",
      }}
    >
      {headers && (
        <AgGridReact
          columnDefs={headers.map(
            (header) =>
              ({
                field: header,
              }) as ColDef,
          )}
          rowData={parsedCsv.data}
        />
      )}
    </div>
  );
}

function SampleToggle(props: {
  viewerType: "json" | "csv";
  toggler: () => void;
}) {
  return (
    <div className={styles.sample_toggle}>
      <button
        className={
          props.viewerType === "json"
            ? `${styles.json_button} ${styles.sample_toggle_active}`
            : `${styles.json_button} ${styles.sample_toggle_inactive}`
        }
        type="button"
        onClick={() => props.toggler()}
        onKeyDown={() => props.toggler()}
      >
        JSON
      </button>
      <button
        className={
          props.viewerType === "csv"
            ? `${styles.csv_button} ${styles.sample_toggle_active}`
            : `${styles.csv_button} ${styles.sample_toggle_inactive}`
        }
        type="button"
        onClick={() => props.toggler()}
        onKeyDown={() => props.toggler()}
      >
        CSV
      </button>
    </div>
  );
}
