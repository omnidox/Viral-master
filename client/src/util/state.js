export const stateHelper = (setState, entry) => {
    setState(state => ({
        ...state,
        ...entry,
    }));
}
