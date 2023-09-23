import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Col, Row } from 'react-bootstrap';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Role, UserVoteState } from "../../../const/user";
import { stateHelper } from "../../../util/state";
import { formatDate } from "../../../util";
import userContext from "../../../store/userContext";
import CommentList from '../CommentList';
import LinkButton from '../button/LinkButton';
import SmallIconButton from '../button/SmallIconButton';
import WriteComment from '../../form/WriteComment';
import LoginSignupModal from "../modal/LoginSignupModal";

import style from './Comment.module.css'

export const scrollToComment = (commentId, {classes = [style.notify], scroll = true} = {}) => {
    const element = document.getElementById(commentId)
    if (element) {
        if (scroll) element.scrollIntoView({ behavior: 'smooth' });
        element.classList.add(...classes);
    }
}

const Comment = ({ id, PostId, content, upVotes, downVotes, replies, createdAt, poster, voteStatus }) => {
    const user = useContext(userContext);
    const isGuest = user.userRole === Role.Guest;

    const [ commentState, setCommentState ] = useState({
        upVotes,
        downVotes,
        // User vote status, whether the user has up or down voted the post
        voteStatus,
        replies,
        // If the user is not logged in and wants to reply
        loginPrompt: {
            show: false,
            message: '',
        },
        // If user is writing a reply
        isWritingReply: false,
        // Reply to comment given by user
        writtenReply: {},
    })
    const hasReplies = commentState.replies.length > 0;
    const commentId = `c_${id}`;
    // Highlight the comment if provided in the url
    const hashId = window.location.hash.slice(1);
    const isHighlight = commentId === hashId;

    const setCommentStateHelper = entry => stateHelper(setCommentState, entry);
    const loginPromptHandler = message => {
        if (isGuest) setCommentStateHelper({ loginPrompt: {
            show: true,
            message,
        }});
        return isGuest;
    }
    const closeLoginPromptHandler = () => setCommentStateHelper({ loginPrompt: { show: false } });
    const upVoteHandler = () => {
        if (loginPromptHandler('Please login to upvote comments')) return;

        const isUpVoted = commentState.voteStatus.state === UserVoteState.UpVote;
        const isDownVoted = commentState.voteStatus.state === UserVoteState.DownVote;
        // Set new vote state
        const state = isUpVoted ? UserVoteState.None : UserVoteState.UpVote;
        // Set new counts
        const voteCounts = {
            upVotes: isUpVoted ? commentState.upVotes - 1 : commentState.upVotes + 1,
            downVotes: isDownVoted ? commentState.downVotes - 1 : commentState.downVotes,
        }

        const voteId = commentState.voteStatus.id;
        if (voteId && state === UserVoteState.None) {
            // Remove current vote
            axios.delete(`/api/v1/votes/${voteId}`).then(() => {
                setCommentStateHelper({
                    voteStatus: { state },
                    ...voteCounts,
                })
            });
        } else if (voteId && state === UserVoteState.UpVote) {
            // Update upvote
            axios.patch(`/api/v1/votes/${voteId}`, { type: 'upvote' }).then(res => {
                setCommentStateHelper({
                    voteStatus: { state, ...res.data },
                    ...voteCounts,
                })
            });
        } else {
            // Create new vote
            const data = {
                UserId: user.id,
                CommentId: id,
                type: 'upvote',
            }
            axios.post(`/api/v1/votes`, data).then(res => {
                setCommentStateHelper({
                    voteStatus: { state, ...res.data },
                    ...voteCounts,
                })
            });
        }
    }
    const downVoteHandler = () => {
        if (loginPromptHandler('Please login to downvote comments')) return;

        const isUpVoted = commentState.voteStatus.state === UserVoteState.UpVote;
        const isDownVoted = commentState.voteStatus.state === UserVoteState.DownVote;
        const state = isDownVoted ? UserVoteState.None : UserVoteState.DownVote;
        const voteCounts = {
            upVotes: isUpVoted ? commentState.upVotes - 1 : commentState.upVotes,
            downVotes: isDownVoted ? commentState.downVotes - 1 : commentState.downVotes + 1,
        };

        const voteId = commentState.voteStatus.id;
        if (voteId && state === UserVoteState.None) {
            // Remove current vote
            axios.delete(`/api/v1/votes/${voteId}`).then(() => {
                setCommentStateHelper({
                    voteStatus: { state },
                    ...voteCounts,
                })
            });
        } else if (voteId && state === UserVoteState.DownVote) {
            // Update upvote
            axios.patch(`/api/v1/votes/${voteId}`, { type: 'downvote' }).then(res => {
                setCommentStateHelper({
                    voteStatus: { state, ...res.data },
                    ...voteCounts,
                })
            });
        } else {
            // Create new vote
            const data = {
                UserId: user.id,
                CommentId: id,
                type: 'downvote',
            }
            axios.post(`/api/v1/votes`, data).then(res => {
                setCommentStateHelper({
                    voteStatus: { state, ...res.data },
                    ...voteCounts,
                })
            });
        }
    }
    const shareHandler = () => {
        const location = window.location;
        const url = `${location.protocol}//${location.host}${location.pathname}`
        navigator.clipboard.writeText(`${url}#c_${id}`);
    }

    // Open a comment window to send a reply
    const replyHandler = () => {
        if (loginPromptHandler('Please login to reply')) return;
        setCommentStateHelper({isWritingReply: true});
    };
    // Cancel the reply
    const closeReplyHandler = () => setCommentStateHelper({ isWritingReply: false });
    // Add the submitted reply to the comments list
    const addReplyHandler = comment => {
        closeReplyHandler();
        setCommentStateHelper({
            replies: [comment, ...commentState.replies],
            writtenReply: comment,
        });
    };
    // Scroll to inserted reply
    useEffect(() => {
        if (commentState.writtenReply) scrollToComment(`c_${commentState.writtenReply.id}`, { scroll: false });
    }, [commentState.writtenReply]);

    useEffect(() => {
        if (isHighlight) scrollToComment(commentId, { classes: [] });
    }, [hashId, commentId, isHighlight]);

    return (
        <>
            <LoginSignupModal show={commentState.loginPrompt.show} message={commentState.loginPrompt.message} onClose={closeLoginPromptHandler}/>
            <div id={commentId} className={`px-2 py-1 ${isHighlight ? `markdown-white ${style.highlight}` : ''}`}>
                <small className='d-flex align-items-center py-1'>
                    <LinkButton
                        link={poster.username ? `/@${poster.username}` : 'deleted'}
                        text={poster.username ? `@${poster.username}` : 'deleted'}
                        disabled={!poster.username}
                        picture={poster.profilePicture}
                        icon={poster.role === Role.Admin ? 'fa-solid fa-shield-halved' : ''}
                    />
                    <span className='ms-1'>・ {formatDate(createdAt)}</span>
                </small>
                <ReactMarkdown className='markdown' children={content} remarkPlugins={[remarkGfm]} />
                <Row className='gx-2 pt-2'>
                    <Col className='col-auto'>
                        <SmallIconButton
                            onClick={upVoteHandler}
                            filled={commentState.voteStatus.state === UserVoteState.UpVote} icon='fa-solid fa-arrow-up'
                            text={commentState.upVotes}
                            tip='Upvote'
                        />
                    </Col>
                    <Col className='col-auto'>
                        <SmallIconButton
                            onClick={downVoteHandler}
                            filled={commentState.voteStatus.state === UserVoteState.DownVote} icon='fa-solid fa-arrow-down'
                            text={commentState.downVotes}
                            tip='Downvote'
                        />
                    </Col>
                    <Col className='col-auto'>
                        <SmallIconButton onClick={replyHandler} icon='fa-regular fa-message' tip='Reply' />
                    </Col>
                    <Col className='col-auto'>
                        <SmallIconButton onClick={shareHandler} icon='fa-regular fa-share-from-square' tip='Copy Link' confirmation='Link Copied' />
                    </Col>
                </Row>
            </div>
            {commentState.isWritingReply ?
                <WriteComment onSubmit={addReplyHandler} onCancel={closeReplyHandler} commentId={id} postId={PostId} title={`Reply to @${poster.username}`} isReply />
                :
                <></>}
            <hr className='my-0' />
            {hasReplies
                ?
                <div className='d-flex justify-items-stretch'>
                    <div className='vr p-2'/>
                    <CommentList comments={commentState.replies} />
                </div>
                :
                <></>
            }
        </>
    );
}

export default Comment;
