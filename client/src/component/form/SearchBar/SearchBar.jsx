import { useState } from "react";
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { isEmpty } from "../../../util";
import style from './SearchBar.module.css'

const SearchBar = ({ className }) => {
    const navigate = useNavigate();
    const [ query, setQuery ] = useState('');

    const submitQueryHandler = event => {
        event.preventDefault();
        if (!isEmpty(query.trim())) navigate(`/search/post/${query}`);
    }

    return (
        <div className={`bg-dark border-solid rounded-5 col-md-5 ${style.bar} ${className}`}>
            <Form onSubmit={submitQueryHandler} className="d-flex flex-row" role='search'>
                <Form.Control value={query} onChange={event => setQuery(event.target.value)} type='search' className='me-2 rounded-5 bg-transparent border-0 text-light' placeholder='Search' aria-label='Search' />
                <Button type='submit' variant='dark' className={`rounded-5 border-0 ${style.searchButton}`}>
                    <i className="fa-solid fa-magnifying-glass text-theme" />
                </Button>
            </Form>
        </div>
    );
}

export default SearchBar;
