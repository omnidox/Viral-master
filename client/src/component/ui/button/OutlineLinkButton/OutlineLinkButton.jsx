import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import style from './OutlineLinkButton.module.css'

const OutlineLinkButton = ({ to, text }) => {
    let isSelected = window.location.pathname.endsWith(to);

    return (
        <Link to={to} className={`text-decoration-none ${isSelected ? style.selected : ''}`}>
            <Button variant='danger' className={`p-0 rounded-5 bg-transparent ${style.button}`}>
                    <p className={`px-3 py-2 ${style.text}`}>{text}</p>
            </Button>
        </Link>
    );
};

export default OutlineLinkButton;
