import type { ElementType, ComponentType, SystemType } from "./types/types";
import _ from 'lodash';

// Finds the line numbers where an object with a specific key-value pair is located in a JSON string
export const nthLinesInJSON = (jsonObj: any, topKey: string, searchKey: string, searchValue: string) => {
    const json: any = { ...jsonObj};
            
    const itemIndex = json[topKey]
                        .findIndex((item: any) => item[searchKey] === searchValue);

    const itemJsonLength = JSON.stringify(json[topKey][itemIndex], null, 2)
                                    .split('\n').length;
    json[topKey] = json[topKey].slice(0, itemIndex);
    const toAdd = json[topKey].length === 0 ? 1 : 0;
    deleteKeysAfter(json, topKey);
    const lineNo = JSON.stringify(json, null, 2).split('\n').length + toAdd - 1;
    return [lineNo, lineNo + itemJsonLength];
}

const deleteKeysAfter = (json: { [key: string]: any }, key: string): void => {
    const keys = _.keys(json);
    const startIndex = _.indexOf(keys, key);
    if (startIndex !== -1) {
        const keysToDelete = _.slice(keys, startIndex + 1);
        _.forEach(keysToDelete, k => {
            delete json[k];
        });
    }
}

export const isNameValid = (name: string) => {
    return (
        (name !== "") && (!name.includes("'")) && (!name.includes('"')) &&
        (!name.includes("`")) && (!name.includes("\\")) && (!name.includes("/")) &&
        (!name.includes("\n")) && (!name.includes("\t")) && (!name.includes("."))
    )
}

export const isNameUnique = (name: string, items: ElementType[] | ComponentType[] | SystemType[]) => {
    const cleanedName = name.toUpperCase().replaceAll(" ", "");
    return !items.map(item => item.name.toUpperCase().replaceAll(" ", "")).includes(cleanedName);
}