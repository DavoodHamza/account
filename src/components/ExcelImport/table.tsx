
import { Table as AntTable, Tooltip } from "antd";

function Table({ data, columns }: any) {
  const col = columns.map((item: any) => {
    return {
      title: item,
      dataIndex: item,
      key: item,
      render: (text: any, record: any) => {
        const hasError = record?._errors && record._errors[item]; 
        const displayText = hasError ? "This field is required" : text; 
      
        return (
          <div
            style={{
              color: hasError ? "red" : "inherit", 
              padding: "5px",
            }}
          >
            {hasError ? (
              <Tooltip title="This field is required">
                <span>{displayText}</span>
              </Tooltip>
            ) : (
              <span>{text}</span>
            )}
          </div>
        );
      },
    };
  });

  return <AntTable dataSource={data} columns={col} scroll={{ x: true }} />;
}

export default Table;
