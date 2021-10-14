import { PAGESIZE } from './constant';

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄(可能是实岁也可能是虚岁)',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
  }
]

const dataSource = new Array(11).fill({
  name: 'Edward King 0',
  age: '32',
  address: 'London, Park Lane no. 0.London, Park Lane no. 0.London, Park Lane no. 0.London, Park Lane no. 0',
}).map((v, i) => ({ key: i, ...v }))

export default {
  current: 1,
  pageSize: PAGESIZE,
  total: 10,
  data: {
    columns,
    dataSource
  }
}