import { typeMappings } from "../common/config/types";
import FormObject from "./FormObject";
import FormArray from "./FormArray";
import FormString from "./FormString";
import FormNumber from "./FormNumber";
import FormInteger from "./FormInteger";
import FormBoolean from "./FormBoolean";

export default {
    get [typeMappings.object.key]() {
        return FormObject;
    },
    get [typeMappings.array.key]() {
        return FormArray;
    },
    [typeMappings.string.key]: FormString,
    [typeMappings.number.key]: FormNumber,
    [typeMappings.integer.key]: FormInteger,
    [typeMappings.boolean.key]: FormBoolean,
};

/*
    key,
    value,
    onChange(value, key),
    isNew
    isVisible,


    object,
    array



    Text: 
    TextNUmber
    onBlur
*/
