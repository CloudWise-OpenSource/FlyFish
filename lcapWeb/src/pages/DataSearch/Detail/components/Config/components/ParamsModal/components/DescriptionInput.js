import React, { useEffect, useState } from 'react';
import { Input, Tooltip } from '@chaoswise/ui';

export default ({ value, onBlur, ...props }) => {
  const [innerValue, setInnerValue] = useState(value);

  useEffect(() => {
    if (innerValue !== value) {
      setInnerValue(value);
    }
  }, [value]);
  return (
    <Tooltip title={innerValue}>
      <Input
        {...props}
        value={innerValue}
        onChange={(e) => {
          const newValue = e.target.value;
          setInnerValue(newValue);
        }}
        onBlur={() => {
          onBlur && onBlur(innerValue);
        }}
      />
    </Tooltip>
  );
};
