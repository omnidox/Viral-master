import axios from "axios";
import { useContext, useState } from "react";
import { Alert, Col, Form, Row } from "react-bootstrap";
import { formDataToObj, formInputHandler } from "../../../util/form";
import { stateHelper } from "../../../util/state";
import userContext from "../../../store/userContext";
import IconButton from "../../ui/button/IconButton";

const ChangeUserPicture = ({ userId, onSuccess, profilePicture }) => {
    const user = useContext(userContext);
    const [ formState, setFormState ] = useState({
        // If the form was checked for validating input
        validated: false,
        // If an error occurred with form submission
        error: '',
        // input
        profilePicture: profilePicture?? '',
    });

    const setFormStateHelper = entry => stateHelper(setFormState, entry);
    const inputHandler = event => formInputHandler(event, setFormState);
    const submitHandler = event => {
        event.preventDefault();
        const form = event.currentTarget;

        setFormStateHelper({ validated: true });
        if (form.checkValidity() === false) {
            event.stopPropagation();
            return;
        }

        axios.patch(`/api/v1/user/${userId}`, formDataToObj(form)).then(() => {
            onSuccess(`Profile Picture updated`);
            // If an admin is not modifying someone else's data
            if (user.id === userId) user.setProfilePicture(formState.profilePicture);
        }).catch(error => {
            setFormStateHelper({ error: `Server Error: ${error.message}` });
        })
    };

    return (
        <Form onSubmit={submitHandler} validated={formState.validated} noValidate>
            {formState.error &&
                <Alert variant='danger' className='fw-bold mb-2 py-2 px-3 border-0'>
                    <i className="fa-solid fa-circle-exclamation me-2" />
                    {formState.error}
                </Alert>}
            <Row className='gy-2 pb-3'>
                <Form.Group as={Col} xxl={12}>
                    <Form.Control value={formState.profilePicture} onChange={inputHandler} type='text' name='profilePicture' placeholder='New Profile Picture Link' />
                </Form.Group>
            </Row>
            <IconButton type='submit' icon='fa-solid fa-pen' text='Update Profile Picture' pillVariant />
        </Form>
    );
};

export default ChangeUserPicture;
