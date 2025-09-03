const payHeadType = [
  {
    label: "Earnings",
    value: "Earnings",
  },
  {
    label: "Deductions",
    value: "Deductions",
  },
];

const calcTypes = [
  {
    label: "Flat rate",
    value: "flat_rate",
  },
  {
    label: "Computed value",
    value: "computed_value",
  },
  {
    label: "On attendance",
    value: "on_attendance",
  },
  {
    label: "On production",
    value: "on_production",
  },
 ];

 const periods = [
  {label:'Weekly',value:1},
  {label:'Monthly',value:2},
  {label:'Yearly',value:3}
]

const computation_methods = [
  {
    label: "On current deduction total",
    value: "on_deduction_total",
  },
  {
    label: "On current earnings total",
    value: "on_earnings_total",
  },
  {
    label: "On current subtotal",
    value: "on_subtotal",
  },
  {
    label: "Specified formula",
    value: "specified_formula",
  },
 ];


export { payHeadType,calcTypes,periods,computation_methods };
