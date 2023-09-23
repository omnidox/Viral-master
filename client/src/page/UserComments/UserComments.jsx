import axios from "axios";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { isEmpty } from "../../util";
import Loading from "../../component/ui/Loading";
import InfiniteScroll from "../../component/ui/InfiniteScroll";
import PostSnipList from "../../component/ui/PostSnipList";

const UserComments = () => {
    const { userData } = useOutletContext();
    const [ postComments, setPostComments ] = useState([]);

    const userCommentsQuery = useInfiniteQuery(
        ['userComments', userData.id],
        ({ pageParam = '' }) => axios.get(`/api/v1/comments/user/${userData.id}?cursor=${pageParam}`).then(res => res.data),
        {
            getNextPageParam: (lastPage) => lastPage.cursor ?? undefined,
        },
    );

    const comments = userCommentsQuery.data?.pages.flatMap(page => page.comments);
    const ids = comments?.map(comment => comment.PostId);
    const postsQuery = useQuery(
        ['postsQuery', ids],
        () => axios.post('/api/v1/post/multposts', { ids }).then(res => res.data),
        {
            enabled: !!userCommentsQuery.data,
            onSettled: data => {
                // Update rendered comments
                setPostComments(
                    comments
                        .map(comment => ({
                            children: comment.content,
                            commentId: comment.id,
                            link: `/post/${comment.PostId}#c_${comment.id}`,
                            ...data[comment.PostId],
                        }))
                        // Filter out posts with deleted users
                        .filter(post => post.UserId)
                )
            }
        },
    );

    // Used for infinite scrolling
    const fetchNextPageHandler = () => {
        userCommentsQuery.fetchNextPage();
    }

    if (!postComments) return <Loading />;
    else if (userCommentsQuery.error || postsQuery.error) return <p>{`${postsQuery.error}${userCommentsQuery.error}`}</p>
    else return <>
        <h4><span className='text-theme'>{userData.username}</span>'s Comments</h4>
        <InfiniteScroll onEnd={fetchNextPageHandler}>
            <PostSnipList posts={postComments} className='mx-0' />
        </InfiniteScroll>
        {postsQuery.isFetched && isEmpty(postComments) &&
            <h2 className='d-flex justify-content-center align-items-center flex-grow-1'>
                <span className='text-theme me-2'>{userData.username}</span>
                currently has no comments
            </h2>}
    </>;
};

export default UserComments;
