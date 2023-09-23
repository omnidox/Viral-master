import { Container } from "react-bootstrap";
import style from './Error.module.css';

const Error = ({ title, message }) => {
    return (
        <Container className='d-flex flex-column flex-grow-1 justify-content-center align-items-center mb-5'>
            <h1 className={`text-theme ${style.error}`}>{title}</h1>
            <h2 className='mb-5'>{message}</h2>
        </Container>
    );
};

export default Error;
