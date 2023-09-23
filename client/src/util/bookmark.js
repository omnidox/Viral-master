export const addIsBookmarkedField = (postIds, bookmark_entries) => {
    return postIds.reduce((map, postId) => {
        const bookmark_entry = bookmark_entries[postId];
        map[postId] = {
            ...bookmark_entry,
            isBookmarked: Boolean(bookmark_entry),
        };
        return map;
    }, {})
}
