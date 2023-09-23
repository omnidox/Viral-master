import { useLayoutEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import autosize from 'autosize';

export const previewMarkdownState = {
    Editing: {
        message: 'Preview Markdown',
        isPreviewing: false,
    },
    Previewing: {
        message: 'Stop Previewing',
        isPreviewing: true,
    },
}

const MarkdownTextArea = ({ onChange, name, value, placeholder, className, showMarkdown = false, rows = 3, required = false }) => {
    // TextArea
    const textareaRef = useRef(null);
    useLayoutEffect(() => {
        if (textareaRef) {
            autosize(textareaRef.current)
        }
    }, [textareaRef]);

    return (
        <>
            <textarea ref={textareaRef} value={value} onChange={onChange} name={name} placeholder={placeholder} className={`form-control ${className}`} rows={rows} hidden={showMarkdown} required={required} />
            {showMarkdown && <ReactMarkdown className='markdown border rounded-2 p-2' children={value} remarkPlugins={[remarkGfm]} />}
        </>
    );
};

export default MarkdownTextArea;
