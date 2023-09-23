import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Fragment, useContext, useState } from "react";
import { Row, Col, Card } from 'react-bootstrap';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { addCommentsField } from "../../../util/comment";
import { addVoteStateField } from "../../../util/vote";
import { addIsBookmarkedField } from "../../../util/bookmark";
import UserContext from "../../../store/userContext";
import PostSnip from '../PostSnip';
import Loading from "../Loading";

const Placeholder = () => {
    return (
        <Card className='pb-5 mb-1'>
            <Card.Body className='pb-5'>
                <Loading />
            </Card.Body>
        </Card>
    )
}

const PostSnipList = ({ posts, className }) => {
    const postIds = posts.map(post => post.id?? null);
    const user = useContext(UserContext);
    // Avoids scrolling to top of page
    const [ postsUsers, setPostsUsers ] = useState({});
    const [ postsVotesCount, setPostsVotesCount ] = useState({});
    const [ postsCommentCount, setPostsCommentCount ] = useState({});
    const [ postsVoteStatus, setPostsVoteStatus ] = useState({});
    const [ postsBookmarked, setPostsBookmarked ] = useState({});

    // Retrieve poster information
    useQuery([`postsUsers`, postIds], () => (
        axios.post(`/api/v1/user/multusers`, { ids: posts.map(post => post.UserId) }).then(res => res.data)
    ),{
        initialData: {},
        onSettled: data => setPostsUsers(data),
    });

    // Retrieve up and down vote counts for the post
    useQuery([`postsVoteCount`, postIds], () => (
        axios.post(`/api/v1/votes/post/count`, { postIds }).then(res => res.data)
    ),{
        initialData: {},
        onSettled: data => setPostsVotesCount(data),
    });

    // Retrieve the comment count for the post
    useQuery([`postsCommentCount`, postIds], () => (
        axios.post(`/api/v1/comments/post/count`, { postIds }).then(res => res.data)
    ),{
        initialData: {},
        onSettled: data => setPostsCommentCount(addCommentsField(postIds, data)),
    });

    // Retrieve if the posts are up or down voted by the current logged-in user
    useQuery([`postsVoteStatus`, postIds, user.id], () => (
        axios.post(`/api/v1/votes/post/${user.id}/check`, { postIds }).then(res => res.data)
    ),{
        initialData: {},
        onSettled: data => setPostsVoteStatus(addVoteStateField(postIds, data)),
    });

    // Retrieve if the posts are bookmarks by the current logged-in user
    useQuery([`postsBookmarked`, postIds, user.id], () => (
        axios.post(`/api/v1/bookmarks/post/${user.id}/check`, { postIds }).then(res => res.data)
    ),{
        initialData: addIsBookmarkedField(postIds, {}),
        onSettled: data => setPostsBookmarked(addIsBookmarkedField(postIds, data)),
    });

    return (
        <Row className={className}>
            {posts.map((post, index) => {
                const key = `p_${post.id}_${index}`;

                if (!postsUsers[post.UserId]
                    || !postsVotesCount[post.id]
                    || !postsCommentCount[post.id]
                    || !postsBookmarked[post.id]
                    || !postsVoteStatus[post.id]) {
                    return <Fragment key={key}><Placeholder/></Fragment>
                }

                const poster = postsUsers[post.UserId];
                const postVoteCount = postsVotesCount[post.id];
                const postCommentCount = postsCommentCount[post.id];
                const postBookmarked = postsBookmarked[post.id];
                const postVoteStatus = postsVoteStatus[post.id];

                return (<Col className='g-1 col-12' key={`p_${post.id}_${postVoteStatus.state}_${postBookmarked.isBookmarked}_${index}`}>
                    <PostSnip
                        id={post.id}
                        title={post.title}
                        date={post.createdAt}
                        poster={poster.username}
                        posterRole={poster.role}
                        picture={poster.profilePicture}
                        upVotes={postVoteCount.upvotes ?? 0}
                        downVotes={postVoteCount.downvotes ?? 0}
                        comments={postCommentCount.comments ?? 0}
                        bookmark={postBookmarked}
                        voteStatus={postVoteStatus}
                        link={post.link}
                    >
                        {post.children && <ReactMarkdown className='markdown' children={post.children} remarkPlugins={[remarkGfm]} />}
                    </PostSnip>
                </Col>)
            })}
        </Row>
    )
}

export default PostSnipList;
