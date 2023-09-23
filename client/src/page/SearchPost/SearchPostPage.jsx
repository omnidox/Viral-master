import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import Loading from "../../component/ui/Loading";
import { Col, Container, Row } from "react-bootstrap";
import { isEmpty } from "../../util";
import InfiniteScroll from "../../component/ui/InfiniteScroll";
import PostSnipList from "../../component/ui/PostSnipList";
import Error from "../Error";

const SearchPostPage = () => {
    const { query } = useParams();

    const resultsQuery = useInfiniteQuery(
        ['search', query],
        ({ pageParam = '' }) => axios
            .get(`/api/v1/post/search?title=${query}&cursor=${pageParam}`)
            .then(res => res.data),
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
            <Container fluid={`md`} className='d-flex flex-column my-4'>
                <InfiniteScroll onEnd={fetchNextPageHandler}>
                    <Row className='d-flex align-items-center flex-row gx-2 mb-3'>
                        <Col className='col-auto me-3'>
                            <h3 className='m-0'>Results for {query}</h3>
                        </Col>
                    </Row>
                    <PostSnipList posts={resultsQuery.data.pages.flatMap(page => page.posts)} className='mx-0' />
                </InfiniteScroll>
                {isEmpty(resultsQuery.data.pages[0].posts) &&
                    <Error message='No posts found' />}
            </Container>
        );
};

export default SearchPostPage;
