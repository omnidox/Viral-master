import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <div className={`bg-theme py-3 ${styles.footer}`}>
            <Container className='justify-content-between text-white text-center'>
                <Row>
                    <Col md={4}>
                        <p><b>Viral ・</b> The <b>viral</b> social media platform</p>
                    </Col>
                    <Col md={4}>
                        <Link to='https://github.com/DevinSterling/Viral' className={`text-decoration-none text-white fw-bold ${styles.link}`}>
                            <i className='fa-brands fa-github me-2'></i>
                            <p className='d-inline'>GitHub</p>
                        </Link>
                    </Col>
                    <Col md={4}>
                        <p className='fw-bold'>2023</p>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Footer;
