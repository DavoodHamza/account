import { Area } from '@ant-design/charts';

const SalesGraph = (props: any) => {

  const config = {
    data:props?.data,
    xField: 'label',
    yField: 'data',
    line: {
      style: {
        stroke: 'orange',
      },
    },
    smooth: true,
    style: {
      fill: 'rgb(238 224 196)',
      fillOpacity: 0.5,
      strokeOpacity: 0.5,
      cursor: 'pointer',
      strokeColor: 'rgb(238 224 196)',
      stroke: 'dotted',
    },
    point: {
      size: 4,
      style: {
        fill: 'orange',
        stroke: 'white',
        lineWidth: 2,
      },
    },
    tooltip:false,
    height: 300,
  };

  return <Area {...config} />;
};

export default SalesGraph;
