exports.hasEmptyFields = (obj, ...fields) => {
    for (let key of fields) {
        if (obj[key] === undefined || obj[key] === '' || obj[key] === null) 
            return true;
    }

    return false;
};