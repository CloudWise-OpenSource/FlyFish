import React, { useEffect, useState, useImperativeHandle, forwardRef, useRef } from 'react';
import FormPanel from './components/FormPanel'
import { jsonTosShemaJson, schemaJsonToJson, checkSchema } from './components/utils';
function JSONSCHEMA(props, ref) {
  const { schema, schemaJson, tableId, isZabbix } = props
  let newSchema = JSON.parse(schema)
  let newSchemaJson = JSON.parse(schemaJson)

  useImperativeHandle(ref, () => ({
    getObjValue,
    readyCheck
  }));
  const [value, setValue] = useState({})
  const dataRef = useRef()
  const [errorState, setErrorState] = useState(false)
  const [isCheck, setIsCheck] = useState(false)
  const [cb, setcb] = useState(() => {
    const initalCallback = () => { }
    return initalCallback
  })
  useEffect(() => {
    dataRef.current = errorState
  }, [errorState])
  useEffect(() => {
    setTimeout(() => {
      const myeditorJsonValue = dataRef.current ? false : schemaJsonToJson('', value)
      typeof cb === 'function' && cb(myeditorJsonValue)
    }, 10)

  }, [cb])
  useEffect(() => {
    setIsCheck(false)
    try {
      if (newSchema === null) {
        setValue({})
      } else {
        const schema1 = JSON.parse(schema)
        checkSchema(schema1.properties)
        setValue(schema1)
      }

      if (schemaJson && !newSchema) {
        setTimeout(() => {
          setValue(jsonTosShemaJson(newSchemaJson, newSchema, newSchema?.title || ''))
        }, 100);
      }
      if (schemaJson && newSchema) {
        setValue(jsonTosShemaJson(newSchemaJson, newSchema, newSchema?.title || ''))
      }

    } catch (error) {
    }
  }, [tableId])
  useEffect(() => {
    try {
      if (newSchema === null) {
        setValue({})
      } else {
        const schema1 = JSON.parse(schema)
        checkSchema(schema1.properties)
        setValue(schema1)
      }

    } catch (error) {
    }

  }, [schema])
  useEffect(() => {
    //zabbix的schema和json获取不同步
    if (schemaJson && !newSchema) {
      setTimeout(() => {
        setValue(jsonTosShemaJson(newSchemaJson, newSchema, newSchema?.title || ''))
      }, 100);
    }
    if (schemaJson && newSchema) {
      setValue(jsonTosShemaJson(newSchemaJson, newSchema, newSchema?.title || ''))
    }
  }, [schemaJson])
  const readyCheck = (callback) => {
    setIsCheck(true)
    setcb(() => {
      const initalCallback = callback
      return initalCallback
    })
  }
  const getObjValue = () => {
    return errorState ? false : schemaJsonToJson('', value)

  }
  return <FormPanel value={value} onChange={(newValue) => { setValue(newValue) }} isCheck={isCheck} setErrorState={setErrorState} />
}
export default forwardRef(JSONSCHEMA);