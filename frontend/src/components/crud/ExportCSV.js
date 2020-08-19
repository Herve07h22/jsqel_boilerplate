import React from "react";

import { Button } from "antd";
import FileExcelOutlined from "@ant-design/icons/FileExcelOutlined";

const download = (text, fileName) => {
  const link = document.createElement("a");
  link.setAttribute("href", `data:text/csv;charset=utf-8,${encodeURIComponent(text)}`);
  link.setAttribute("download", fileName);
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const ExportCSV = ({ columns, dataSource }) => {
  const handleClick = () => {
    console.log("columns:", columns);
    console.log("dataSource:", dataSource);
    const columnTitles = columns.map((column) => column.title);
    const columnNames = columns.map((column) => column.dataIndex);
    const header = columnTitles.join(";") + "\n";
    const data = dataSource.map((row) => columnNames.map((name) => row[name]).join(";")).join("\n");
    download(header + data, "export.csv");
  };

  return (
    <Button style={{ marginLeft: "1rem" }} icon={<FileExcelOutlined />} onClick={handleClick}>
      Export CSV
    </Button>
  );
};

export default ExportCSV;
