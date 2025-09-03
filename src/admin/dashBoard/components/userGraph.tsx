import { Area } from "@ant-design/charts";

const UserGraph = (props: any) => {
  const config = {
    data: props?.data,
    xField: "label",
    yField: "data",
    line: {
      style: {
        stroke: props?.lineColor,
      },
    },
    smooth: true,
    style: {
      fill: props?.mainColor,
      fillOpacity: 0.5,
      strokeOpacity: 0.5,
      cursor: "pointer",
      strokeColor: props?.mainColor,
      stroke: "dotted",
    },
    point: {
      size: 4,
      style: {
        fill: props?.pointColor,
        stroke: "white",
        lineWidth: 2,
      },
    },
    tooltip: false,
    height: 300,
  };

  return <Area {...config} />;
};

export default UserGraph;
