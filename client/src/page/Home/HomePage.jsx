import axios from 'axios';
import { useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useInfiniteQuery } from "@tanstack/react-query";
import PostSnipList from '../../component/ui/PostSnipList';
import Loading from '../../component/ui/Loading';
import InfiniteScroll from "../../component/ui/InfiniteScroll";
import OutlineLinkButton from "../../component/ui/button/OutlineLinkButton";
import { isEmpty } from "../../util";
import Error from "../Error";

const PostType = {
    Recent: {
        icon: 'fa-solid fa-clock-rotate-left',
        name: 'Recent',
        link: '/api/v1/post/cursor',
    },
    Popular: {
        icon: 'fa-solid fa-arrow-trend-up',
        name: 'Popular',
        link: '/api/v1/post/popular',
    }
}

const HomePage = ({ popular }) => {
    const type = popular ? PostType.Popular : PostType.Recent;

    const resultsQuery = useInfiniteQuery(
        [type.name],
        ({ pageParam = '' }) => axios.get(`${type.link}?cursor=${pageParam}`).then(res => res.data),
        {
            getNextPageParam: (lastPage) => lastPage.cursor ?? undefined,
        },
    );

    // Used for infinite scrolling
    const fetchNextPageHandler = () => {
        resultsQuery.fetchNextPage();
    }

    useEffect(() => {
        document.title = 'Viral';
    }, []);

    if (resultsQuery.isLoading) return <Loading />;
    else if (resultsQuery.error) return <p>{`${resultsQuery.error}`}</p>
    else return (
        <Container fluid={`md`} className='my-4'>
            <InfiniteScroll onEnd={fetchNextPageHandler}>
                <Row className='d-flex align-items-center flex-row gx-2 mb-3'>
                    <Col className='col-auto me-3'>
                        <h3 className='m-0'><span className='h4'><i className={`${type.icon} mx-2`}/></span>{type.name}</h3>
                    </Col>
                    <Col className='col-auto'>
                        <OutlineLinkButton to='/recent' text='Recent' />
                    </Col>
                    <Col className='col-auto'>
                        <OutlineLinkButton to='/popular' text='Popular' />
                    </Col>
                </Row>
                <PostSnipList posts={resultsQuery.data.pages.flatMap(page => page.posts)} className='mx-0' />
            </InfiniteScroll>
            {isEmpty(resultsQuery.data.pages[0].posts) &&
                <Error message='No posts found' />}
        </Container>
    );
};

export default HomePage;
