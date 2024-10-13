import type { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridReact } from "ag-grid-react";
import Papa from "papaparse";
import { memo } from "react";
import { JSONTree } from "react-json-tree";

export const InfoDisplay = memo(function InfoDisplay(props: {
  returnedData: string;
  returnedDataFileFormat: string;
  endpointName: string;
}) {
  if (props.returnedData && props.returnedDataFileFormat === "json") {
    return (
      <div className="json-tree-wrapper">
        <JSONTree data={JSON.parse(props.returnedData)} />
      </div>
    );
  }
  if (props.returnedData && props.returnedDataFileFormat === "csv") {
    const separator = getSeparatorForEndpoint(props.endpointName);
    if (!separator) {
      return <pre>{props.returnedData}</pre>;
    }
    const splitData = props.returnedData.split(separator, 2);
    if (splitData.length !== 2) {
      return <pre>{props.returnedData}</pre>;
    }
    const csvInfo = `${splitData[0]}${separator}`;
    const csvData = splitData[1];
    const parsedCsv = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
    });
    const headers = parsedCsv.meta.fields;
    return (
      <div>
        <pre>{csvInfo}</pre>
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
      </div>
    );
  }
});

export function getSeparatorForEndpoint(endpointName: string): string {
  switch (endpointName) {
    case "statsList":
      return '"STAT_INF"\n';
    case "metaInfo":
      return '"CLASS_INF"\n';
    case "statsData":
      return '"VALUE"\n';
    default:
      return "";
  }
}
