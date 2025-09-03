import { Area } from '@ant-design/charts';

const PurchaseGraph = (props: any) => {
 
  const config = {
    data:props?.data,
    xField: 'label',
    yField: 'data',
    line: {
      style: {
        stroke: 'green',
      },
    },
    smooth: true,
    style: {
      fill: 'lightGreen',
      fillOpacity: 0.5,
      strokeOpacity: 0.5,
      cursor: 'pointer',
      strokeColor:'lightGreen',
      stroke:'dotted'
    },
    point: {
      size: 4,
      style: {
        fill: 'green',
        stroke: 'white',
        lineWidth: 2,
      },
    },
    height: 300,
    tooltip:false
  };
  return <Area {...config} />;
};

export default PurchaseGraph;
