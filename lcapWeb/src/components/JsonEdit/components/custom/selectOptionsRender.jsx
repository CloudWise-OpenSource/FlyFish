  import { createElement, ReactNode } from 'react';
  import { Select } from '@chaoswise/ui';

  /* 渲染select的下拉框 */
  function selectOptionsRender(options) {
    return options.map((item, index) => {
      let label = Object.prototype.toString.call(item) === '[object Object]'?item.label:item
      let value = Object.prototype.toString.call(item) === '[object Object]'?item.value:item
      return <Select.Option key={ `${ index }` } value={ value }>{ label }</Select.Option>;
    });
  }

  export default selectOptionsRender;