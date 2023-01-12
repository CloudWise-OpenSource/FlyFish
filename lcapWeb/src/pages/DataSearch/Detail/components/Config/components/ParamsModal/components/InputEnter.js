import React, { useState } from 'react';
import { Input } from '@chaoswise/ui';

export default ({ onPressEnter, validValue, ...props }) => {
  const [value, setValue] = useState('');

  return (
    <Input
      {...props}
      value={value}
      maxlength={20}
      onChange={(e) => setValue(e.target.value)}
      onPressEnter={(e) => {
        if (validValue && validValue(value)) {
          onPressEnter && onPressEnter(value);
          setValue('');
        }
      }}
    />
  );
};
