import { UserVoteState } from "../const/user";

export const addVoteStateField = (postIds, vote_entries) => {
    return postIds.reduce((map, postId) => {
        const vote_entry = vote_entries[postId];
        let state;

        switch (vote_entry?.type) {
            case 'upvote':
                state = UserVoteState.UpVote;
                break;
            case 'downvote':
                state = UserVoteState.DownVote;
                break;
            default:
                state = UserVoteState.None;
        }

        map[postId] = {
            ...vote_entry,
            state,
        };
        return map;
    }, {})
}
