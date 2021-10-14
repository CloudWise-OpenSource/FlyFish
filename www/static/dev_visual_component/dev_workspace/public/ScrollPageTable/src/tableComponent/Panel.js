import React from 'react';
import { noop } from '../utils';

const Panel = ({ className, children, forwardRef = noop }) => <div ref={ref => forwardRef(ref)} className={className}>{children}</div>

export default Panel;