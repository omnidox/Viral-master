import { UserVoteState } from "../const/user";

export const buildCommentHierarchy = (raw_comments, comment_vote_counts, comment_vote_status, comment_users) => {
    let temp = raw_comments.reduce((map, comment) => {
        const comment_votes = comment_vote_counts[comment.id];
        const comment_status = comment_vote_status[comment.id]?? {};
        let state;

        switch (comment_status?.type) {
            case 'upvote':
                state = UserVoteState.UpVote;
                break;
            case 'downvote':
                state = UserVoteState.DownVote;
                break;
            default:
                state = UserVoteState.None;
        }

        map[comment.id] = {
            poster: comment_users[comment.UserId]?? {},
            upVotes: comment_votes?.upvotes?? 0,
            downVotes: comment_votes?.downvotes?? 0,
            voteStatus: {
                state,
                ...comment_status
            },
            replies: [],
            ...comment
        };

        return map;
    }, {});

    let commentHierarchy = [];

    // Create Hierarchy tree
    for (let comment in temp) {
        comment = temp[comment];
        const commentId = comment.CommentId;
        pushSortByUpVotes(commentId ? temp[commentId].replies : commentHierarchy, comment);
    }

    return commentHierarchy;
}

const pushSortByUpVotes = (list, entry) => {
    const entryRatio = calculateRatio(entry.upVotes, entry.downVotes);
    let index = 0;

    for (index; index < list.length; index++) {
        const indexEntry = list[index];
        const indexRatio = calculateRatio(indexEntry.upVotes, indexEntry.downVotes);

        if (indexRatio <= entryRatio) {
            break;
        }
    }
    list.splice(index, 0, entry);
}

const calculateRatio = (upVotes, downVotes) => {
    const isShunned = downVotes > upVotes ? -1 : 1;
    const dividend = isShunned < 0 ? downVotes : upVotes;
    const divisor = isShunned < 0 ? upVotes : downVotes;
    return downVotes ? isShunned * (dividend / divisor) : upVotes + 1;
}

// Adds the comment field for posts that have no comments,
// sets `comments` to 0.
export const addCommentsField = (postIds, comment_entries) => {
    return postIds.reduce((map, postId) => {
        const comment_entry = comment_entries[postId];
        map[postId] = {
            comments: comment_entry?.comments ?? 0,
        };
        return map;
    }, {})
}

