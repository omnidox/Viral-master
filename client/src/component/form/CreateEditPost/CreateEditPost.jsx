import axios from "axios";
import { useState } from 'react';
import { Alert, Col, Form, Row } from 'react-bootstrap';
import { isEmpty } from "../../../util";
import { formDataToObj } from "../../../util/form";
import { stateHelper } from "../../../util/state";
import IconButton from '../../ui/button/IconButton';
import MarkdownTextArea from '../../ui/textfield/MarkdownTextArea';
import { previewMarkdownState } from "../../ui/textfield/MarkdownTextArea/MarkdownTextArea";
import style from './CreateEditPost.module.css'

// `editId` is provided if editing a post instead of creating a post
const CreateEditPost = ({ onSuccess, editId, title = '', content = '' }) => {
    const [ formState, setFormState ] = useState({
        error: '',
        // Markdown Preview
        preview: previewMarkdownState.Editing,
        // input
        title,
        content,
    });

    const setFormStateHelper = entry => stateHelper(setFormState, entry);
    // const titleChangeHandler = event => setFormStateHelper({ title: event.target.value.trim() });
    const titleChangeHandler = event => setFormStateHelper({ title: event.target.value });
    const contentChangeHandler = event => setFormStateHelper({ content: event.target.value });
    // Content TextArea
    const previewHandler = () => {
        let isPreviewing = formState.preview.isPreviewing;
        setFormStateHelper({
            preview: isPreviewing ? previewMarkdownState.Editing : previewMarkdownState.Previewing,
        })
    };

    // Form
    // Submission of post to server
    const submitPostHandler = event => {
        event.preventDefault();
        let form = event.currentTarget;
        let title = formState.title.trim();
        let content = formState.content.trim();

        if (isEmpty(title)) {
            setFormStateHelper({ error: 'Title for post is not filled' });
        } else if (isEmpty(content)) {
            setFormStateHelper({ error: 'Content for post is not filled' });
        } else {
            let path = `/api/v1/post/${editId ?? ''}`;
            let request = editId ? axios.patch : axios.post;

            request(path, formDataToObj(form)).then(res => {
                onSuccess(res.data);
            }).catch(error => {
                setFormStateHelper({ error: `Server Error: ${error.message}`});
            })
        }
    }

    return (
        <Form onSubmit={submitPostHandler} className='pb-2'>
            <div className={`rounded-3 fit-content border pt-1 ${style.previewBox}`}>
                <div className={`position-sticky bg-white p-2 border-bottom ${style.controlsBox}`}>
                    <Row className='justify-content-between '>
                        <Col className='col-auto'>
                            <IconButton onClick={previewHandler} type='button' className='w-100' icon='fa-brands fa-markdown me-2' text={formState.preview.message} />
                        </Col>
                        <Col className='col-auto'>
                            <IconButton className='w-100' type='submit' icon='fa-solid fa-pen' text={editId ? 'Edit' : 'Post'} tip={`${editId ? 'Edit' : 'Submit'} Post`} pillVariant />
                        </Col>
                    </Row>
                    {formState.error &&
                        <Alert variant='danger' className='fw-bold mt-2 mb-0 py-2 px-3 border-0'>
                            <i className="fa-solid fa-circle-exclamation me-2" />
                            {formState.error}
                        </Alert>}
                </div>
                <div className='m-1'>
                    <Form.Control value={formState.title} onChange={titleChangeHandler} type="text" name='title' placeholder="Type your post title here" className='border-0 fw-bold text-theme' autoFocus />
                </div>
                <hr className='m-0' />
                <div className='m-1'>
                    <MarkdownTextArea value={formState.content} onChange={contentChangeHandler} showMarkdown={formState.preview.isPreviewing} name='content' rows={9} className={style.textarea} placeholder='Type your post content here' />
                </div>
            </div>
        </Form>
    );
};

export default CreateEditPost;
