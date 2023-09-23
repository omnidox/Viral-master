import { Fragment } from "react";
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import style from './FlatButton.module.css';

const FlatButton = ({ to, onClick, icon, text, className, isHighlight = false}) => {
    const Wrapper = to ? Link : Fragment;
    const wrapperProps = to ? {
        to,
        className: 'd-flex text-decoration-none'
    } : undefined;

    return (
        <Wrapper {...wrapperProps}>
            <Button onClick={onClick} variant='danger' className={`d-flex flex-grow-1 align-items-baseline border-0 ${className} ${style.button} ${isHighlight ? style.highlight : ''}`}>
                <i className={`${icon} ${style.text}`} />
                <p className={`ms-3 ${style.text}`}>{text}</p>
            </Button>
        </Wrapper>
    );
}

export default FlatButton;
