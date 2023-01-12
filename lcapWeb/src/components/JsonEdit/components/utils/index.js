import { typeMappings } from "../../common/config/types";
function checkObk(obj) {
    if (!obj['properties']) {
        return checkObk()
    }else{
        return obj
    }
}
export function checkSchema(properties) {
    Object.keys(properties).forEach(key => {
        if (properties[key].type === 'array' && !Array.isArray(properties[key].items)&&properties[key].items['type']!=='object') {
            if (Array.isArray(properties[key].default)) {
                properties[key].items = properties[key].default.map(element => {
                    return { default: element, type: typeof element }
                })
            }
        }
        if (properties[key].type === 'object' ){
           return checkSchema(properties[key].properties)
        }
    })
}
function setDefautValue(obj = {}, key, value) {
    if (key) {
        obj[key] = value;
        return obj;
    }
    return value;
}

export const schemaJsonToJson = (key, schemaObj, isInsideFlag) => {
    if (schemaObj == null) {
        return null;
    }
    let obj = {};

    if (schemaObj.type === typeMappings.object.key) {
        let childObj = {};
        const keys = Object.keys(schemaObj.properties || {});
        if (keys && keys.length > 0) {
            for (const key of keys) {
                if (
                    Object.prototype.hasOwnProperty.call(
                        schemaObj.properties,
                        key
                    ) && !schemaObj.properties[key].isDisable
                ) {
                    childObj = Object.assign(
                        childObj,
                        schemaJsonToJson(key, schemaObj.properties[key], true)
                    );
                }
            }
        }
        obj = isInsideFlag ? setDefautValue(obj, key || schemaObj.title, childObj) : setDefautValue(obj, null, childObj)
    } else if (schemaObj.type === typeMappings.array.key) {
        if (Array.isArray(schemaObj.items)) {
            obj = setDefautValue(
                obj,
                key || schemaObj.title,
                schemaObj.items.map((item) => {
                    return schemaJsonToJson("", item);
                })
            );
        } else {
            obj = setDefautValue(
                obj,
                key || schemaObj.title,
                schemaObj.default
            );
        }
    } else {
        obj = setDefautValue(obj, key || schemaObj.title, schemaObj.default || '');
    }


    return obj;
};

export const jsonTosShemaJson = (value, schema, key) => {
    if (value == null) {
        return null;
    }
    let obj = {};
    const type = typeof value;

    if (type === "object" && !Array.isArray(value)) {
        let childObj = {};
        const keys = Object.keys(value || {});
        if (keys && keys.length > 0) {
            for (const key of keys) {
                childObj[key] = jsonTosShemaJson(value[key], schema ? schema : null, key);
            }
        }
        //根节点
        if (Object.keys(childObj)[0] === schema?.title) {
            obj = {
                ...schema,
                type: type,
                title: schema.title,
                properties: childObj[Object.keys(childObj)[0]].properties,
            }

        } else {
            let schemaold = schema?.['properties'][key]
            if (key && key == schema?.title) {
                obj = {
                    ...schemaold,
                    required: schema?.required || [],
                    title: schema.title,
                    type: type,
                    properties: childObj,
                }
            } else {
                obj = {
                    required: schema?.required || [],
                    ...schemaold,
                    type: type,
                    properties: childObj,
                }
            }

        }

    } else if (Array.isArray(value)) {
        let schemaold = schema?.['properties'][key]
        if (schemaold) {
            obj = {
                ...schemaold,
                default: value
            };
        } else {
            obj = {
                type: typeMappings.array.key,
                items: value.map((item) => {
                    return jsonTosShemaJson(item, schema);
                }),
                default: value,
            };
        }
    } else {

        let schemaold = schema?.['properties'][key]
        obj = {
            ...schemaold,
            isRequired: schema?.['required'] && schema['required'].includes(key) ? true : false,
            type: type,
            default: value,
        };
    }
    return obj;
};




export const diffShemaJson = (newJson, oldJson) => {
    if (newJson == null || oldJson == null) {
        return newJson;
    }

    if (newJson && oldJson == null) {
        newJson.isNew = true;
    }

    if (
        newJson.type !== typeMappings.number.key &&
        newJson.type !== typeMappings.integer.key &&
        newJson.type !== oldJson.type
    ) {
        return newJson;
    }

    if (newJson.type === typeMappings.object.key) {
        const keys = Object.keys(newJson.properties || {});
        if (keys && keys.length > 0) {
            for (const key of keys) {
                if (
                    Object.prototype.hasOwnProperty.call(
                        newJson.properties || {},
                        key
                    ) &&
                    Object.prototype.hasOwnProperty.call(
                        oldJson.properties || {},
                        key
                    )
                ) {
                    newJson.properties[key] = diffShemaJson(
                        newJson.properties[key],
                        oldJson.properties[key]
                    );
                } else if (
                    Object.prototype.hasOwnProperty.call(
                        newJson.properties || {},
                        key
                    ) &&
                    !Object.prototype.hasOwnProperty.call(
                        oldJson.properties || {},
                        key
                    )
                ) {
                    newJson.properties[key] = Object.assign(
                        { isNew: true },
                        newJson.properties[key]
                    );
                }
            }
        }
    } else if (newJson.type === typeMappings.array.key) {
        if (Array.isArray(newJson.items) && Array.isArray(oldJson.items)) {
            const items = newJson.items.map((item, index) => {
                return diffShemaJson(item, oldJson.items[index]);
            });
            newJson = Object.assign({}, oldJson, newJson, {
                items: items,
            });
            // if (Object.prototype.hasOwnProperty.call(newJson, "default")) {
            //     delete newJson.default;
            // }
        } else if (
            !Array.isArray(oldJson.items) &&
            Array.isArray(newJson.items) &&
            newJson.items.length === 1
        ) {
            const newItems = newJson.items[0];
            const oldItems = oldJson.items;
            oldJson.items.properties = Object.assign(
                {},
                newItems.properties || {},
                oldItems.properties || {}
            );
            newJson.items = oldJson.items;
            newJson = Object.assign({}, oldJson, newJson);
        } else {
            newJson = Object.assign({}, oldJson, newJson);
            // if (Object.prototype.hasOwnProperty.call(newJson, "default")) {
            //     delete newJson.default;
            // }
        }
    } else {
        if (
            newJson.type === typeMappings.number.key ||
            newJson.type === typeMappings.integer.key
        ) {
            newJson = Object.assign({}, oldJson, newJson, {
                type: oldJson.type,
            });
        } else {
            newJson = Object.assign({}, oldJson, newJson);
        }
    }
    return newJson;
};
