import axios from "axios";
import { useState } from "react";
import { Alert, Col, Form, Row } from "react-bootstrap";
import { previewMarkdownState } from "../../ui/textfield/MarkdownTextArea/MarkdownTextArea";
import { stateHelper } from "../../../util/state";
import { formDataToObj, formInputHandler } from "../../../util/form";
import IconButton from "../../ui/button/IconButton";
import MarkdownTextArea from "../../ui/textfield/MarkdownTextArea";
import SmallIconButton from "../../ui/button/SmallIconButton";

const ChangeBiography = ({ userId, bio, onSuccess }) => {
    const [ formState, setFormState ] = useState({
        // If the form was checked for validating input
        validated: false,
        // If an error occurred with form submission
        error: '',
        preview: previewMarkdownState.Editing,
        // input
        bio: bio?? '',
    });

    const setFormStateHelper = entry => stateHelper(setFormState, entry);
    const inputHandler = event => formInputHandler(event, setFormState);
    const previewHandler = () => {
        let isPreviewing = formState.preview.isPreviewing;
        setFormStateHelper({
            preview: isPreviewing ? previewMarkdownState.Editing : previewMarkdownState.Previewing,
        })
    };
    const submitHandler = event => {
        event.preventDefault();
        const form = event.currentTarget;

        setFormStateHelper({ validated: true });
        if (form.checkValidity() === false) {
            event.stopPropagation();
            return;
        }

        axios.patch(`/api/v1/user/${userId}`, formDataToObj(form)).then(() => {
            onSuccess(`Biography updated`);
        }).catch(error => {
            setFormStateHelper({ error: `Server Error: ${error.message}` });
        })
    };

    return (
        <Form onSubmit={submitHandler} validated={formState.validated} noValidate>
            <SmallIconButton onClick={previewHandler} icon='fa-brands fa-markdown' text={formState.preview.message} />
            {formState.error &&
                <Alert variant='danger' className='fw-bold mb-2 py-2 px-3 border-0'>
                    <i className="fa-solid fa-circle-exclamation me-2" />
                    {formState.error}
                </Alert>}
            <Row className='gy-2 pb-3'>
                <Form.Group as={Col} xxl={12}>
                    <MarkdownTextArea showMarkdown={formState.preview.isPreviewing} value={formState.bio} onChange={inputHandler} name='bio' />
                </Form.Group>
            </Row>
            <IconButton type='submit' icon='fa-solid fa-pen' text='Update Biography' pillVariant />
        </Form>
    );
};

export default ChangeBiography;
