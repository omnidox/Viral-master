import axios from "axios";
import { useContext, useState } from "react";
import { Card, Col, Row } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import { Role, UserVoteState } from "../../../const/user";
import { stateHelper } from "../../../util/state";
import { formatDate } from "../../../util";
import userContext from "../../../store/userContext";
import IconButton from '../button/IconButton';
import LinkButton from "../button/LinkButton";
import LoginSignupModal from "../modal/LoginSignupModal";
import style from './PostSnip.module.css';

const PostSnip = ({
    id,
    title,
    date,
    poster,
    posterRole,
    upVotes,
    downVotes,
    comments,
    children,
    voteStatus,
    bookmark,
    picture,
    link,
    isStretchedLink = true
}) => {
    const user = useContext(userContext);
    const isGuest = user.userRole === Role.Guest;
    const hasChildren = children !== undefined;
    const navigate = useNavigate();
    const [ postSnipState, setPostSnipState ] = useState({
        upVotes,
        downVotes,
        // If the user has bookmarked the post
        bookmark,
        // User vote status, whether the user has up or down voted the post
        voteStatus,
        // If the user is not logged in and wants to reply
        loginPrompt: {
            show: false,
            message: '',
        },
    });

    const setPostSnipStateHelper = entry => stateHelper(setPostSnipState, entry);
    const loginPromptHandler = message => {
        if (isGuest) setPostSnipStateHelper({ loginPrompt: {
            show: true,
            message,
        }});
        return isGuest;
    }
    const closeLoginPromptHandler = () => setPostSnipStateHelper({ loginPrompt: { show: false } });
    const upVoteHandler = () => {
        if (loginPromptHandler('Please login to upvote posts')) return;

        const isUpVoted = postSnipState.voteStatus.state === UserVoteState.UpVote;
        const isDownVoted = postSnipState.voteStatus.state === UserVoteState.DownVote;
        // Set new vote state
        const state = isUpVoted ? UserVoteState.None : UserVoteState.UpVote;
        // Set new counts
        const voteCounts = {
            upVotes: isUpVoted ? postSnipState.upVotes - 1 : postSnipState.upVotes + 1,
            downVotes: isDownVoted ? postSnipState.downVotes - 1 : postSnipState.downVotes,
        }

        const voteId = postSnipState.voteStatus.id;
        if (voteId && state === UserVoteState.None) {
            // Remove current vote
            axios.delete(`/api/v1/votes/${voteId}`).then(() => {
                setPostSnipStateHelper({
                    voteStatus: { state },
                    ...voteCounts,
                })
            });
        } else if (voteId && state === UserVoteState.UpVote) {
            // Update upvote
            axios.patch(`/api/v1/votes/${voteId}`, { type: 'upvote' }).then(res => {
                setPostSnipStateHelper({
                    voteStatus: { state, ...res.data },
                    ...voteCounts,
                })
            });
        } else {
            // Create new vote
            const data = {
                UserId: user.id,
                PostId: id,
                type: 'upvote',
            }
            axios.post(`/api/v1/votes`, data).then(res => {
                setPostSnipStateHelper({
                    voteStatus: { state, ...res.data },
                    ...voteCounts,
                })
            });
        }
    }
    const downVoteHandler = () => {
        if (loginPromptHandler('Please login to downvote posts')) return;

        const isUpVoted = postSnipState.voteStatus.state === UserVoteState.UpVote;
        const isDownVoted = postSnipState.voteStatus.state === UserVoteState.DownVote;
        const state = isDownVoted ? UserVoteState.None : UserVoteState.DownVote;
        const voteCounts = {
            upVotes: isUpVoted ? postSnipState.upVotes - 1 : postSnipState.upVotes,
            downVotes: isDownVoted ? postSnipState.downVotes - 1 : postSnipState.downVotes + 1,
        };

        const voteId = postSnipState.voteStatus.id;
        if (voteId && state === UserVoteState.None) {
            // Remove current vote
            axios.delete(`/api/v1/votes/${voteId}`).then(() => {
                setPostSnipStateHelper({
                    voteStatus: { state },
                    ...voteCounts,
                })
            });
        } else if (voteId && state === UserVoteState.DownVote) {
            // Update upvote
            axios.patch(`/api/v1/votes/${voteId}`, { type: 'downvote' }).then(res => {
                setPostSnipStateHelper({
                    voteStatus: { state, ...res.data },
                    ...voteCounts,
                })
            });
        } else {
            // Create new vote
            const data = {
                UserId: user.id,
                PostId: id,
                type: 'downvote',
            }
            axios.post(`/api/v1/votes`, data).then(res => {
                setPostSnipStateHelper({
                    voteStatus: { state, ...res.data },
                    ...voteCounts,
                })
            });
        }
    }
    const commentHandler = () => {
        navigate(`/post/${id}`);
    }
    const bookmarkHandler = () => {
        if (loginPromptHandler('Please login to bookmark posts')) return;
        else if (postSnipState.bookmark.isBookmarked) {
            axios.delete(`/api/v1/bookmarks/${postSnipState.bookmark.id}`).then(() => {
                setPostSnipStateHelper({ bookmark: { isBookmarked: false } });
            })
        } else {
            const data = {
                PostId: id,
                UserId: user.id,
            };
            axios.post(`/api/v1/bookmarks/`, data).then(res => {
                setPostSnipStateHelper({
                    bookmark: {
                        isBookmarked: true,
                        ...res.data,
                    }
                });
            })
        }
    };
    const shareHandler = () => {
        const location = window.location;
        const url = `${location.protocol}//${location.host}/post/${id}`
        navigator.clipboard.writeText(url);
    }

    return (
        <Card className={style.card}>
            <LoginSignupModal
                show={postSnipState.loginPrompt.show}
                message={postSnipState.loginPrompt.message}
                onClose={closeLoginPromptHandler}
            />
            <Card.Header className={`bg-white ${hasChildren ? '' : 'border-0'}`}>
                <Link to={link ? link : `/post/${id}`} className={isStretchedLink ? 'stretched-link' : ''}></Link>
                <Card.Subtitle>
                    <small className='d-flex align-items-center my-1'>
                        <span className='me-1'>Posted by</span>
                        <LinkButton
                            link={poster ? `/@${poster}` : 'deleted'}
                            text={poster ? `@${poster}` : 'deleted'}
                            disabled={!poster}
                            picture={picture}
                            icon={posterRole === Role.Admin ? 'fa-solid fa-shield-halved' : ''}
                            className={style.clickable}
                        />
                        <span className='ms-1'>・ {formatDate(date)}</span>
                    </small>
                </Card.Subtitle>
                <Card.Title>
                    <h3>{title}</h3>
                </Card.Title>
            </Card.Header>
            {hasChildren
                ?
                <Card.Body className='px-3 py-1'>
                    {children}
                </Card.Body>
                :
                <></>
            }
            <Card.Footer className='bg-white'>
                <Row className='gx-2'>
                    <Col className='col-auto'>
                        <IconButton
                            onClick={upVoteHandler}
                            filled={postSnipState.voteStatus.state === UserVoteState.UpVote}
                            icon='fa-solid fa-arrow-up' text={postSnipState.upVotes}
                            tip='Upvote'
                            className={style.clickable}
                        />
                    </Col>
                    <Col className='col-auto'>
                        <IconButton
                            onClick={downVoteHandler}
                            filled={postSnipState.voteStatus.state === UserVoteState.DownVote}
                            icon='fa-solid fa-arrow-down' text={postSnipState.downVotes}
                            tip='Downvote'
                            className={style.clickable}
                        />
                    </Col>
                    <Col className='col-auto'>
                        <IconButton
                            onClick={commentHandler}
                            icon='fa-regular fa-message'
                            text={comments}
                            tip='Comments'
                            className={style.clickable}
                        />
                    </Col>
                    <Col className='col-auto'>
                        <IconButton
                            onClick={bookmarkHandler}
                            filled={postSnipState.bookmark.isBookmarked}
                            confirmation={postSnipState.bookmark.isBookmarked ? 'Removed from Bookmarks' : 'Added to Bookmarks'}
                            icon='fa-regular fa-bookmark' tip='Bookmark'
                            className={style.clickable}
                        />
                    </Col>
                    <Col className='col-auto'>
                        <IconButton
                            onClick={shareHandler}
                            confirmation='Link Copied'
                            icon='fa-regular fa-share-from-square'
                            tip='Copy Link'
                            className={style.clickable}
                        />
                    </Col>
                </Row>
            </Card.Footer>
        </Card>
    );
};

export default PostSnip;
