import React, { useEffect, useState } from 'react';
import { Input } from '@chaoswise/ui';

export default ({ value, onBlur, ...props }) => {
  const [innerValue, setInnerValue] = useState(value);

  useEffect(() => {
    if (innerValue !== value) {
      setInnerValue(value);
    }
  }, [value]);
  return (
    <Input
      {...props}
      value={innerValue}
      onChange={(e) => {
        const newValue = e.target.value;
        if (newValue === '' || /^[a-zA-Z]+[\d\w]*$/.test(newValue)) {
          setInnerValue(newValue);
        }
      }}
      onBlur={() => {
        onBlur && onBlur(innerValue);
      }}
    />
  );
};
