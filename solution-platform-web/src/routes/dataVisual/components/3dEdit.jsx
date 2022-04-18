import { PureComponent } from 'react';

export default class BigScreen extends PureComponent {
  render() {
    return <iframe style={{ width: '100%', height: 'calc(100vh - 50px)', border: 'none' }} src="http://10.2.2.236:5566/index3d.html"></iframe>;
  }
}