import { Col } from "react-bootstrap";
import Comment from "../Comment";

const CommentList = ({ comments, className }) => {
    return (
        <div className={`d-flex flex-column w-100 ${className}`}>
            {comments.map(comment =>
                <Col className='g-1 col-12' key={`c_${comment.voteStatus.state}${comment.id}`}>
                    <Comment {...comment} />
                </Col>
            )}
        </div>
    );
};

export default CommentList;
