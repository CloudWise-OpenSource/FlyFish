import { Select } from '@chaoswise/ui';
import _ from 'lodash';
import selectOptionsRender from './selectOptionsRender';
import styleName from '../../utils/styleName';
const types = [
  { label: 'string', value: 'string' },
  { label: 'number', value: 'number' },
  { label: 'integer', value: 'integer' },
  { label: 'boolean', value: 'boolean' },
  { label: 'object', value: 'object' },
  { label: 'array', value: 'array' }
]
const getOldValue = (valueObj) => {
  if (valueObj.type === 'object') {
    return valueObj.properties
  }
  if (valueObj.type === 'array') {
    return valueObj.items
  }
  return valueObj.default
}
const setNewValue = (type, root) => {
  let rootType = root.type
  if (type === 'object') {
    let newValue = {
      ...root, type: 'object'
    }
    if (rootType == 'object' || rootType == 'array') {
      newValue.properties = {
        ...getOldValue(root)
      }
    } else {
      newValue.properties = {}
    }
    delete newValue.default
    return newValue
  }
  if (type === 'array') {
    let newValue = {
      ...root, type: 'array', isNew: true, items: []
    }
    if (rootType == 'object') {
      let arr = []
      for (const i in root.properties) {
        arr.push(root.properties[i])
      }

      delete newValue.properties
      newValue.items = arr

    } else {
      newValue.items = [{
        type: "string",
        default:root.default
      }]
    }
    return newValue
  }
  if (type === 'number' || type === 'integer') {
    return {
      ...root, type: type, default: isNaN(Number(getOldValue(root))) ? 0 : Number(getOldValue(root))
    }
  }
  if (type === 'boolean') {
    return {
      ...root, type: 'boolean', default: getOldValue(root) ? true : false
    }
  }
  let newValue=getOldValue(root)
  let newNormalType = { ...root, type: type, default:Array.isArray(newValue)?JSON.stringify(newValue.map(item=>item.default)):JSON.stringify(getOldValue(root)) }
  delete newNormalType.items
  delete newNormalType.properties
  return newNormalType
}
function SelectType(props) {
  const { root, onChange } = props
  const { id, type } = root;
  function onSelectChange(type) {
    onChange(setNewValue(type, root))
    // updateNodeFormValueByType({id, type: value})
    // updateNodeSchemaJsonByType({id, root, type: value})
  }
  return (
    <div className={styleName('select-type')} onClick={(e) => e.stopPropagation()}>
      <Select value={type} onChange={onSelectChange}>
        {selectOptionsRender(types)}
      </Select>
    </div>)
}



export default SelectType
