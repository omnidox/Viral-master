import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { DefaultProfilePicture } from "../../../../const/user";


const LinkButton = ({ link, text, className, picture, icon, disabled }) => {
    return (
        <Button variant='light' className='p-0' disabled={disabled}>
            <Link className={`d-flex align-items-center p-1 text-decoration-none fw-bold text-theme ${className}`} to={link}>
                <img src={picture ?? DefaultProfilePicture} height={25} className='rounded-5 me-1' alt='User Profile'/>
                {text}
                {icon && <i className={`ms-1 text-theme ${icon}`} />}
            </Link>
        </Button>
    );
}

export default LinkButton;
