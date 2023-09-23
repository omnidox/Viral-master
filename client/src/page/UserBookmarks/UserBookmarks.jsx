import axios from "axios";
import { useOutletContext } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { isEmpty } from "../../util";
import Loading from "../../component/ui/Loading";
import InfiniteScroll from "../../component/ui/InfiniteScroll";
import PostSnipList from "../../component/ui/PostSnipList";
import {useState} from "react";

const UserBookmarks = () => {
    let { userData } = useOutletContext()
    const [ bookmarks, setBookmarks ] = useState([]);

    const userBookmarksQuery = useInfiniteQuery(
        ['userBookmarks', userData.id],
        ({ pageParam = '' }) => axios.get(`/api/v1/bookmarks/user/${userData.id}?cursor=${pageParam}`).then(res => res.data),
        {
            getNextPageParam: (lastPage) => lastPage.cursor ?? undefined,
            onSettled: data => {
                setBookmarks(data.pages.flatMap(page => (
                    page.bookmarks
                        .flatMap(bookmark => bookmark.Post)
                        // Filter out posts with deleted users
                        .filter(post => post.UserId)
                )));
            },
        },
    );

    // Used for infinite scrolling
    const fetchNextPageHandler = () => {
        userBookmarksQuery.fetchNextPage();
    }

    if (userBookmarksQuery.isLoading) return <Loading />;
    else if (userBookmarksQuery.error) return <p>{`${userBookmarksQuery.error}`}</p>
    else return (
        <>
            <h4><span className='text-theme'>{userData.username}</span>'s Bookmarks</h4>
            <InfiniteScroll onEnd={fetchNextPageHandler}>
                <PostSnipList posts={bookmarks} className='mx-0' />
            </InfiniteScroll>
            {isEmpty(bookmarks) &&
                <h2 className='d-flex justify-content-center align-items-center flex-grow-1'>
                    <span className='text-theme me-2'>{userData.username}</span>
                    currently has no bookmarks
                </h2>}
        </>
    );
};

export default UserBookmarks;
