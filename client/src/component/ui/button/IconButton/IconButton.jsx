import { Fragment, useState } from "react";
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import style from './IconButton.module.css';
import {Link} from "react-router-dom";

const IconButton = ({ to, onClick, confirmation, icon, text, className, tip, type, form, filled = false, pillVariant = false }) => {
    const defaultState = {
        isClicked: false,
        tipMessage: tip,
        tipTrigger: ['hover', 'focus'],
        tipShowDelay: 750,
    }
    const [ clickStatus, setClickStatus ] = useState(defaultState);
    const blurHandler = () => setClickStatus(defaultState);
    const clickHandler = event  => {
        if (confirmation && tip) {
            setClickStatus({
                isClicked: true,
                tipMessage: confirmation,
                tipTrigger: 'focus',
                tipShowDelay: 0,
            });
        }
        if (onClick) {
            onClick(event);
        }
    };

    // Optional Link
    const LinkWrapper = to ? Link : Fragment;
    const linkWrapperProps = to ? { to } : undefined;

    // Optional Tooltip and props
    const ToolTipWrapper = tip ? OverlayTrigger : Fragment;
    const toolTipWrapperProps = tip ? {
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
        <LinkWrapper {...linkWrapperProps}>
            <ToolTipWrapper {...toolTipWrapperProps}>
                <Button type={type} form={form} onClick={clickHandler} onBlur={blurHandler} className={`rounded-5 border-0 ${className} ${style.button} ${filled ? style.filled : '' } ${pillVariant ? style.pillVariant : ''}`}>
                    {icon && <i className={icon} />}
                    {text !== undefined && <b className={icon ? 'ms-2' : ''}>{text}</b>}
                </Button>
            </ToolTipWrapper>
        </LinkWrapper>
    );
}

export default IconButton;
