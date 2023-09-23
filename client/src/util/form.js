export const formInputHandler = (event, setInput, trim = false) => {
    let value = event.target.value;
    if (trim) value = value.trim()

    setInput(state => ({
        ...state,
        [event.target.name]: value,
    }))
};

export const formDataToObj = form => {
    let object = {};
    const formData = new FormData(form);
    formData.forEach((value, key) => object[key] = value);
    return object;
};
