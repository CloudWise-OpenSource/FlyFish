export const dataSearchTypeMappings = {
  basic: {
    id: 1,
    key: "basic",
    maxItem: 0,
    label: {
      id: "pages.dataSearch.types.basic",
      defaultValue: "基础查询",
    },
  },
  singleValueGroup: {
    id: 2,
    key: "singleValueGroup",
    maxItem: 20,
    label: {
      id: "pages.dataSearch.types.singleValueGroup",
      defaultValue: "单值组合",
    },
    desc: {
      id: "pages.dataSearch.types.singleValueGroupDesc",
      defaultValue:
        "每个基础查询的结果必须只有一个数据，将每个查询的结果，组合成一个数据表，该组合常见于生成饼图。",
    },
  },
  multipleValueRowGroup: {
    id: 3,
    key: "multipleValueRowGroup",
    maxItem: 10,
    label: {
      id: "pages.dataSearch.types.multipleValueRowGroup",
      defaultValue: "多行值组合",
    },
    desc: {
      id: "pages.dataSearch.types.multipleValueRowGroupDesc",
      defaultValue:
        "将各个基础查询的数据表表头按照被选择顺序组合，相同列合并，每行数据不合并，没有数据的列为空，该组合常见于生成条形统计图。",
    },
  },
  multipleValueColGroup: {
    id: 4,
    key: "multipleValueColGroup",
    maxItem: 10,
    label: {
      id: "pages.dataSearch.types.multipleValueColGroup",
      defaultValue: "多值组合",
    },
    desc: {
      id: "pages.dataSearch.types.multipleValueColGroupDesc",
      defaultValue:
        "将第一个基础查询的首列数据作为主列，该列最好为唯一值，需确保每个查询的数据表都有该列，然后将各个数据表的表头做并集，按照基础查询的排列顺序将表头排序。",
    },
  },
  timeSeriesValueGroup: {
    id: 5,
    key: "timeSeriesValueGroup",
    maxItem: 10,
    label: {
      id: "pages.dataSearch.types.timeSeriesValueGroup",
      defaultValue: "时序值组合",
    },
    desc: {
      id: "pages.dataSearch.types.timeSeriesValueGroupDesc",
      defaultValue: "单值组合",
    },
  },
};

export const dataSearchTypeEnums = [
  dataSearchTypeMappings.basic,
  dataSearchTypeMappings.singleValueGroup,
  dataSearchTypeMappings.multipleValueRowGroup,
  dataSearchTypeMappings.multipleValueColGroup,
  dataSearchTypeMappings.timeSeriesValueGroup,
];

export const dataSearchGroupTypeEnums = [
  dataSearchTypeMappings.singleValueGroup,
  {
    id: 3,
    key: "multipleValueGroup",
    label: {
      id: "pages.dataSearch.types.multipleValueGroup",
      defaultValue: "多值组合",
    },
    desc: {
      id: "pages.dataSearch.types.multipleValueGroupDesc",
      defaultValue:
        "每个基础查询得到一个数据表，多个数据表之间可以进行组合，组合方式分为按行组合和按列组合两种。",
    },
  },
  dataSearchTypeMappings.timeSeriesValueGroup,
];
