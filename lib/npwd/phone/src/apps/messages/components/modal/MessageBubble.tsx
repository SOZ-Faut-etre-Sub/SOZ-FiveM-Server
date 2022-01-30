import {Box, IconButton, Paper} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {makeStyles} from '@mui/styles';
import React, {useState} from 'react';
import {Message, MessageEvents} from '@typings/messages';
import {PictureResponsive} from '@ui/components/PictureResponsive';
import {PictureReveal} from '@ui/components/PictureReveal';
import {useMyPhoneNumber} from '@os/simcard/hooks/useMyPhoneNumber';
import MessageBubbleMenu from './MessageBubbleMenu';
import {useSetSelectedMessage} from '../../hooks/state';
import {fetchNui} from "@utils/fetchNui";
import {ServerPromiseResp} from "@typings/common";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import {blue} from "@mui/material/colors";

const useStyles = makeStyles((theme) => ({
    mySms: {
        float: 'right',
        margin: theme.spacing(1),
        padding: '6px 16px',
        height: 'auto',
        width: 'auto',
        minWidth: '60%',
        maxWidth: '85%',
        background: '#1be73e',
        color: theme.palette.text.primary,
        borderRadius: '20px',
        textOverflow: 'ellipsis',
        border: "none",
    },
    sms: {
        float: 'left',
        margin: theme.spacing(1),
        padding: '6px 12px',
        width: 'auto',
        minWidth: '60%',
        maxWidth: '85%',
        height: 'auto',
        background: 'rgba(255, 255, 255,.1)',
        color: theme.palette.text.primary,
        borderRadius: '15px',
        textOverflow: 'ellipsis',
        border: "none",
    },
    message: {
        wordBreak: 'break-word',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
}));

const isImage = (url) => {
    return /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|png|jpeg|gif)/g.test(url);
};

const isPosition = (url) => {
    return /vec2\((-?[0-9.]+),(-?[0-9.]+)\)/g.test(url);
};

interface MessageBubbleProps {
    message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({message}) => {
    const classes = useStyles();
    const [menuOpen, setMenuOpen] = useState(false);

    const setSelectedMessage = useSetSelectedMessage();
    const myNumber = useMyPhoneNumber();
    const openMenu = () => {
        setMenuOpen(true);
        setSelectedMessage(message);
    };
    const setWaypoint = () => {
        let position = /vec2\((-?[0-9.]+),(-?[0-9.]+)\)/g.exec(message.message);

        fetchNui<ServerPromiseResp<void>>(MessageEvents.SET_WAYPOINT, {
            x: position[1],
            y: position[2],
        })
    };

    const isMine = message.author === myNumber;

    return (
        <>
            <Paper className={isMine ? classes.mySms : classes.sms} variant="outlined">
                <Box className={classes.message}>
                    {isImage(message.message) && (
                        <PictureReveal>
                            <PictureResponsive src={message.message} alt="message multimedia"/>
                        </PictureReveal>
                    )}
                    {isPosition(message.message) && (
                        <span style={{cursor: "pointer", color: blue["300"]}} onClick={setWaypoint}>
              <AddLocationAltIcon/> Position
            </span>
                    )}
                    {!isImage(message.message) && !isPosition(message.message) && (
                        <>{message.message}</>
                    )}
                    {isMine && (
                        <IconButton onClick={openMenu}>
                            <MoreVertIcon/>
                        </IconButton>
                    )}
                </Box>
            </Paper>
            <MessageBubbleMenu open={menuOpen} handleClose={() => setMenuOpen(false)}/>
        </>
    );
};
