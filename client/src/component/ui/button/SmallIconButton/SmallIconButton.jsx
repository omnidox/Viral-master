import { Fragment, useState } from "react";
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import style from './SmallIconButton.module.css';

const SmallIconButton = ({ onClick, confirmation, icon, text, className, tip, filled = false }) => {
    const defaultState = {
        isClicked: false,
        tipMessage: tip,
        tipTrigger: ['hover', 'focus'],
        tipShowDelay: 750,
    }
    const [ clickStatus, setClickStatus ] = useState(defaultState);
    const blurHandler = () => setClickStatus(defaultState);
    const clickHandler = ()  => {
        if (confirmation) {
            setClickStatus({
                isClicked: true,
                tipMessage: confirmation,
                tipTrigger: 'focus',
                tipShowDelay: 0,
            });
        }
        if (onClick) {
            onClick();
        }
    };

    // Optional Tooltip and props
    const Wrapper = tip ? OverlayTrigger : Fragment;
    const wrapperProps = tip ? {
        trigger: clickStatus.tipTrigger,
        delay: { hide: 0, show: clickStatus.tipShowDelay },
        placement: 'bottom',
        overlay: (props) => (
            <Tooltip {...props}>
                {clickStatus.tipMessage}
            </Tooltip>
        )
    } : undefined;

    return (
        <Wrapper {...wrapperProps}>
            <Button onClick={clickHandler} onBlur={blurHandler} className={`rounded-5 bg-transparent p-1 ${className} ${style.button} ${filled ? style.filled : '' }`}>
                <i className={icon} />
                {text !== undefined && <small className='ms-2'>{text}</small>}
            </Button>
        </Wrapper>
);
}

export default SmallIconButton;
