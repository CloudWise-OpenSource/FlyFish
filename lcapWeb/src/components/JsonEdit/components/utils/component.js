import componentMapping from "../componentMapping";

export const getComponent = (item) => {
    if (item.type &&!item.isDisable&& Object.prototype.hasOwnProperty.call(componentMapping, item.type)) {
        return componentMapping[item.type];
    }
    return () => { return "" };
};
