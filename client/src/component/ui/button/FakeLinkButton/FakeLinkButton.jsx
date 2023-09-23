const FakeLinkButton = ({ text, onClick }) => {
    return (
        <button onClick={onClick} className='bg-transparent border-0 p-0 text-decoration-underline text-theme'>
            {text}
        </button>
    );
};

export default FakeLinkButton;
