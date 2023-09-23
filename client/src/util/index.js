export const isEmpty = (...arrays) => {
    return arrays.find(array => !array?.length) !== undefined;
}

export const formatDate = datetime => new Date(datetime).toLocaleDateString();