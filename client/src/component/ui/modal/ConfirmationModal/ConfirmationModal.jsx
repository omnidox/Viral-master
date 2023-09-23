import { Alert, Col, Modal, Row } from "react-bootstrap";
import IconButton from "../../button/IconButton";

const ConfirmationModal = ({ show, onClose, onClick, alert, title, message, disabled }) => {
    return (
        <Modal size='md' show={show} onHide={onClose} backdropClassName='backdrop-theme' centered>
            <Modal.Header className='border-0' closeButton>
                <Modal.Title className='d-flex align-content-baseline fw-bold text-theme'>
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='py-0'>
                {alert &&
                    <Alert variant={alert.variant} className='fw-bold mb-3 py-2 px-3 border-0'>
                        <i className="fa-solid fa-circle-info me-2" />
                        {alert.message}
                    </Alert>}
                <b>{message}</b>
            </Modal.Body>
            {!disabled && <Modal.Footer className='border-0 p-3'>
                <Row className='m-0 w-100 gx-1'>
                    <Col sm={6}>
                        <IconButton onClick={onClick} icon='' className='m-0 w-100' text='Confirm' pillVariant/>
                    </Col>
                    <Col sm={6}>
                        <IconButton onClick={onClose} icon='' className='m-0 w-100' text='Cancel' pillVariant/>
                    </Col>
                </Row>
            </Modal.Footer>}
        </Modal>
    );
};

export default ConfirmationModal;
