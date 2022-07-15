export const ArrToObj = (data) => {
    return data.reduce(function (total, currentValue) {
        if(currentValue.type==='Int'||currentValue.type==='Double'){
            total[currentValue.name] = Number(currentValue.default);
        }
        if(currentValue.type==='String'){
            total[currentValue.name] = String(currentValue.default);
        }
        if(currentValue.type==='Boolean'){
            total[currentValue.name] = Boolean(currentValue.default);
        }
        return total;
    }, {});
};
