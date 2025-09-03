import React, { Component } from "react";

function ResultComponent(props: any) {
  let { result } = props;

  return (
    <div className="calculator-result">
      <p>{result}</p>
    </div>
  );
}
export default ResultComponent;
