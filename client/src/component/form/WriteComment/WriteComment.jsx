import axios from 'axios';
import { useContext, useState } from 'react';
import { Alert, Col, Form, Row } from 'react-bootstrap';
import { isEmpty } from '../../../util';
import { stateHelper } from '../../../util/state';
import userContext from '../../../store/userContext';
import SmallIconButton from '../../ui/button/SmallIconButton';
import IconButton from '../../ui/button/IconButton';
import MarkdownTextArea from "../../ui/textfield/MarkdownTextArea";
import { previewMarkdownState } from "../../ui/textfield/MarkdownTextArea/MarkdownTextArea";
import style from './WriteComment.module.css';
import {UserVoteState} from "../../../const/user";

// `Title` is the title of the form
// `commentId` marks whether the written comment is a reply.
const WriteComment = ({ onCancel, onSubmit, title, postId, commentId }) => {
    // Retrieve user details
    const user = useContext(userContext);
    const [ formState, setFormState ] = useState({
        error: '',
        // Markdown Preview
        preview: previewMarkdownState.Editing,
        // input
        content: '',
    });

    const setFormStateHelper = entry => stateHelper(setFormState, entry);
    // TextArea
    const contentChangeHandler = event => setFormStateHelper({ content: event.target.value });
    const previewHandler = () => {
        let isPreviewing = formState.preview.isPreviewing;
        setFormStateHelper({
            preview: isPreviewing ? previewMarkdownState.Editing : previewMarkdownState.Previewing,
        })
    };

    // Form
    // Submission of comment to server
    const submitCommentHandler = event => {
        event.preventDefault();

        const content = formState.content.trim();

        if (isEmpty(content)) {
            setFormStateHelper({ error: 'Comment is empty' });
        } else {
            // Create object to send to server
            const data = {
                CommentId: commentId,
                PostId: postId,
                UserId: user.id,
                content, // Content typed by user
            };

            axios.post('/api/v1/comments', data).then(res => {
                onSubmit({
                    poster: {
                        username: user.username,
                        role: user.userRole,
                        profilePicture: user.profilePicture,
                    },
                    voteStatus: {
                        state: UserVoteState.None,
                    },
                    replies: [],
                    upVotes: 0,
                    downVotes: 0,
                    ...res.data,
                });
            }).catch(error => {
                setFormStateHelper({error: `Server Error: ${error.message}`});
            })
        }
    }
    const cancelCommentHandler = event => {
        if (event) event.preventDefault();
        onCancel();
    }

    return (
        <Form onSubmit={submitCommentHandler} className='px-2 pb-2'>
            <Row className='pb-1 gx-2 align-items-baseline'>
                <Col className='col-auto'>
                    <h5>{title}</h5>
                </Col>
                <Col className='col-auto'>
                    <SmallIconButton onClick={previewHandler} icon='fa-brands fa-markdown' text={formState.preview.message} />
                </Col>
            </Row>
            {formState.error &&
                <Alert variant='danger' className='fw-bold mb-2 py-2 px-3 border-0'>
                    <i className="fa-solid fa-circle-exclamation me-2" />
                    {formState.error}
                </Alert>}
            <MarkdownTextArea value={formState.content} onChange={contentChangeHandler} name='content' showMarkdown={formState.preview.isPreviewing} className={style.textarea} />
            <Row className='pt-2 gx-2'>
                <Col className='col-auto'>
                    <IconButton type='submit' icon='fa-solid fa-pen' text='Comment' tip='Submit Comment' pillVariant />
                </Col>
                <Col className='col-auto'>
                    <IconButton onClick={cancelCommentHandler} icon='fa-solid fa-xmark' text='Cancel' tip='Cancel Comment' />
                </Col>
            </Row>
        </Form>
    );
};

export default WriteComment;
