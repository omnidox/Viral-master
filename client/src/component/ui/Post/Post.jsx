import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PostSnip from '../PostSnip';

const Post = (props) => {
    const { content } = props;

    return (
        <PostSnip {...props} isStretchedLink={false}>
            <ReactMarkdown className='markdown' children={content} remarkPlugins={[remarkGfm]} />
        </PostSnip>
    );
}

export default Post;
