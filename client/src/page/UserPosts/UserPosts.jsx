import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import { isEmpty } from "../../util";
import PostSnipList from "../../component/ui/PostSnipList";
import InfiniteScroll from "../../component/ui/InfiniteScroll";
import Loading from "../../component/ui/Loading";

const UserPosts = () => {
    let { userData } = useOutletContext()

    const userPostQuery = useInfiniteQuery(
        ['userPosts', userData.id],
        ({ pageParam = '' }) => axios.get(`/api/v1/post/user/${userData.id}?cursor=${pageParam}`).then(res => res.data),
        {
            getNextPageParam: (lastPage) => lastPage.cursor ?? undefined,
        },
    );

    // Used for infinite scrolling
    const fetchNextPageHandler = () => {
        userPostQuery.fetchNextPage();
    }

    if (userPostQuery.isLoading) return <Loading />;
    else if (userPostQuery.error) return <p>{`${userPostQuery.error}`}</p>
    else return (
        <>
            <h4><span className='text-theme'>{userData.username}</span>'s Posts</h4>
            <InfiniteScroll onEnd={fetchNextPageHandler}>
                <PostSnipList posts={userPostQuery.data.pages.flatMap(page => page.posts)} className='mx-0' />
            </InfiniteScroll>
            {isEmpty(userPostQuery.data.pages[0].posts) &&
                <h2 className='d-flex justify-content-center align-items-center flex-grow-1'>
                    <span className='text-theme me-2'>{userData.username}</span>
                    currently has no posts
                </h2>}
        </>
    );
};

export default UserPosts;
