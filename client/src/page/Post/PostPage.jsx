import axios from 'axios';
import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Role } from "../../const/user";
import { stateHelper } from "../../util/state";
import { buildCommentHierarchy } from "../../util/comment";
import { addIsBookmarkedField } from "../../util/bookmark";
import { addVoteStateField } from "../../util/vote";
import userContext from "../../store/userContext";
import LoginSignupModal from "../../component/ui/modal/LoginSignupModal";
import ConfirmationModal from "../../component/ui/modal/ConfirmationModal";
import Loading from '../../component/ui/Loading';
import Post from '../../component/ui/Post';
import CommentList from "../../component/ui/CommentList";
import PostSnipList from "../../component/ui/PostSnipList";
import IconButton from "../../component/ui/button/IconButton";
import WriteComment from '../../component/form/WriteComment';
import { scrollToComment } from '../../component/ui/Comment/Comment';
import style from './PostPage.module.css'
import Error from "../Error";

const PostPage = () => {
    const user = useContext(userContext);
    const isGuest = user.userRole === Role.Guest;

    const { id } = useParams();
    // User post details
    // const [ _post, _setPost ] = useState({});
    // Other recommended posts
    // Post comments
    const [ postState, setPostState ] = useState({
        comments: undefined,
        // If the user is not logged in and wants to comment,
        loginPrompt: {
            show: false,
            message: '',
        },
        // If user is writing a comment
        isWritingComment: false,
        // Comment given by user
        writtenComment: {},
        confirmationPrompt: {
            show: false,
        }
    });

    // Queries
    // Retrieve post details
    const postIds = [id];
    const postQuery = useQuery([`post`, id], () =>
        axios.get(`/api/v1/post/${id}`).then(res => res.data),
    );

    const postUserQuery = useQuery([`postUser`, id], () => (
        axios.get(`/api/v1/user/${postQuery.data.UserId}`).then(res => res.data)
    ), {
        enabled: !!postQuery.data,
    });

    // Retrieve up and down vote counts for the post
    const postVotesCountQuery = useQuery([`postVoteCount`, id], () => (
        axios.post(`/api/v1/votes/post/count`, { postIds }).then(res => res.data)
    ), {
        enabled: !!postQuery.data,
    });

    // Retrieve if the posts are up or down voted by the current logged-in user
    const postVoteStatusQuery = useQuery([`postVoteStatus`, id, user.id], () => (
        axios.post(`/api/v1/votes/post/${user.id}/check`, { postIds }).then(res => res.data)
    ));

    // Retrieve if the posts are bookmarks by the current logged-in user
    const postBookmarkQuery = useQuery([`postBookmarked`, id, user.id], () => (
        axios.post(`/api/v1/bookmarks/post/${user.id}/check`, { postIds }).then(res => res.data)
    ));

    // Retrieve post comments
    const commentsQuery = useQuery(['comments', id], () =>
        axios.get(`/api/v1/comments/post/${id}`).then(res => res.data),
    );

    // Retrieve up and down vote counts for each comment
    const commentIds = commentsQuery.data?.map(comment => comment.id);
    const commentsVotesCountQuery = useQuery(['commentsVotesCount', id], () => (
        axios.post(`/api/v1/votes/comments/count`, { commentIds }).then(res => res.data)
    ), {
        enabled: !!commentsQuery.data,
    });

    // Retrieve if the comments are up or down voted by the current logged-in user
    const commentsVotesStatusQuery = useQuery(['commentsVotesStatus', id, user.id], () => (
        axios.post(`/api/v1/votes/comments/${user.id}/check`, { commentIds }).then(res => res.data)
    ), {
        enabled: !!commentsQuery.data,
    });

    // Retrieve comment user information
    const userIds = commentsQuery.data?.map(comment => comment.UserId);
    const commentsUserQuery = useQuery(['commentsUsers', id], () => (
        axios.post('/api/v1/user/multusers', { ids: userIds }).then(res => res.data)
    ), {
        enabled: !!commentsQuery.data,
    });

    const recommendedQuery = useQuery(['recommended'], () =>
        axios.get('/api/v1/post/cursor').then(res => res.data),
    );

    // Functions
    const setPostStateHelper = entry => stateHelper(setPostState, entry);
    const loginPromptHandler = message => {
        if (isGuest) setPostStateHelper({ loginPrompt: {
            show: true,
            message,
        }});
        return isGuest;
    }
    const closeLoginPromptHandler = () => setPostStateHelper({ loginPrompt: { show: false }} );
    const closeConfirmationPromptHandler = () => setPostStateHelper({ confirmationPrompt: { show: false }} );
    // Show new comment form
    const newCommentHandler = () => {
        if (loginPromptHandler('Please login to comment')) return;
        setPostStateHelper({ isWritingComment: true })
    };
    // Close new comment form
    const closeNewCommentHandler = () => setPostStateHelper({ isWritingComment: false });
    // Show new comment in comments list upon submit
    const addNewCommentHandler = comment => {
        closeNewCommentHandler();
        setPostStateHelper({
            comments: [comment, ...postState.comments],
            writtenComment: comment,
        })
    };
    const deletePostConfirmationHandler = () => {
        let confirmationData = {
            show: true,
            title: 'Delete Post',
            message: 'This post will be permanently deleted',
        };

        const onClick = () => {
            axios.delete(`/api/v1/post/${id}`)
            .then(() => {
                setPostStateHelper({
                    confirmationPrompt: {
                        ...confirmationData,
                        disabled: true,
                        message: '',
                        alert: {
                            variant: 'success',
                            message: 'Post has been deleted',
                        },
                    }
                });
                postQuery.refetch();
            })
            .catch(error => {
                setPostStateHelper({
                    confirmationPrompt: {
                        ...confirmationData,
                        alert: {
                            variant: 'danger',
                            message: `Failure: ${error.toString()}`,
                        },
                    }
                });
            });
        };

        setPostStateHelper({
            confirmationPrompt: {
                onClick,
                ...confirmationData,
            }
        });
    }

    // Scroll to written comment
    useEffect(() => {
        if (postState.writtenComment) scrollToComment(`c_${postState.writtenComment.id}`, { scroll: false });
    }, [postState.writtenComment]);

    // Set page title
    useEffect(() => {
        if (postQuery.data?.title) document.title = postQuery.data.title;
    }, [postQuery.data?.title]);

    // Set initial Commentary State
    useEffect(() => {
        if (commentsQuery.data && commentsVotesCountQuery.data && commentsVotesStatusQuery.data && commentsUserQuery.data) {
            setPostStateHelper({
                comments: buildCommentHierarchy(
                    commentsQuery.data,
                    commentsVotesCountQuery.data,
                    commentsVotesStatusQuery.data,
                    commentsUserQuery.data,
                ),
            });
        }
    },
    [
        commentsQuery.data,
        commentsVotesCountQuery.data,
        commentsVotesStatusQuery.data,
        commentsUserQuery.data,
    ]);

    return <>
        <ConfirmationModal
            show={postState.confirmationPrompt.show}
            title={postState.confirmationPrompt.title}
            message={postState.confirmationPrompt.message}
            alert={postState.confirmationPrompt.alert}
            disabled={postState.confirmationPrompt.disabled}
            onClick={postState.confirmationPrompt.onClick}
            onClose={closeConfirmationPromptHandler}
        />
        <LoginSignupModal
            show={postState.loginPrompt.show}
            message={postState.loginPrompt.message}
            onClose={closeLoginPromptHandler}
        />
        {!postQuery.isLoading && !postQuery.data ?
            <Error title={404} message='Post not found' />
            :
            <Container className='d-flex flex-column flex-grow-1'>
                <Row className='flex-grow-1'>
                    <Col lg={6} className='my-4 d-flex flex-column '>
                        {postVotesCountQuery.isLoading || postVoteStatusQuery.isLoading || postUserQuery.isLoading || postBookmarkQuery.isLoading ?
                            <Loading />
                            :
                            <>
                                {(postQuery.data.UserId === user.id || user.userRole === Role.Admin) &&
                                    <Card className='mb-3'>
                                        <Card.Body className='p-2'>
                                            <IconButton to={`/post/${id}/edit`} icon='fa-solid fa-pen' text='Edit' />
                                            <IconButton onClick={deletePostConfirmationHandler} icon='fa-solid fa-circle-xmark' text='Delete' />
                                        </Card.Body>
                                    </Card>}
                                <Post
                                    id={id}
                                    title={postQuery.data.title}
                                    content={postQuery.data.content}
                                    date={postQuery.data.createdAt}
                                    poster={postUserQuery.data.username}
                                    posterRole={postUserQuery.data.role}
                                    picture={postUserQuery.data.profilePicture}
                                    upVotes={postVotesCountQuery.data[id].upvotes}
                                    downVotes={postVotesCountQuery.data[id].downvotes}
                                    comments={commentsQuery.data ? commentsQuery.data.length : 0}
                                    bookmark={addIsBookmarkedField([id], postBookmarkQuery.data)[id]}
                                    voteStatus={addVoteStateField([id], postVoteStatusQuery.data)[id]}
                                />
                            </>}
                        <h4 className='mt-4'>Other Posts</h4>
                        {recommendedQuery.isLoading ?
                            <Loading />
                            :
                            <PostSnipList posts={recommendedQuery.data.posts} className='mx-0' />}
                    </Col>
                    <Col lg={6}>
                        <div className={`d-flex flex-column ${style.scroll}`}>
                            <Row className={`mb-2 pt-4 gx-3 align-items-center`}>
                                <Col className='col-auto'>
                                    <h4 className='m-0'>Comments</h4>
                                </Col>
                                <Col className='col-auto'>
                                    <IconButton onClick={newCommentHandler} icon='fa-solid fa-pen' text='Write a Comment' pillVariant />
                                </Col>
                            </Row>
                            {postState.isWritingComment ?
                                <>
                                    <WriteComment onSubmit={addNewCommentHandler} onCancel={closeNewCommentHandler} postId={id} title='Write a comment' />
                                    <hr className='mt-0' />
                                </>
                                :
                                <></>
                            }
                            {postState.comments ?
                                <CommentList comments={postState.comments} className={style.comments} />
                                :
                                <Loading />}
                        </div>
                    </Col>
                </Row>
            </Container>}
    </>;
};

export default PostPage;
