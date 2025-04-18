import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { ListIcon } from '../../icons';

const actions = [
    { icon: <ListIcon />, name: 'Quick Note', path: "/notes" },
    { icon: <SaveIcon />, name: 'Save', path: "/notes" },
    { icon: <PrintIcon />, name: 'Print', path: "/notes" },
    { icon: <ShareIcon />, name: 'Share', path: "/notes" },
];

export default function SpeedDialExample() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <Box sx={{ height: 330, transform: 'translateZ(0px)', flexGrow: 1, position: 'fixed', bottom: 20, right: 20 }}>
            <Backdrop open={open} />
            <SpeedDial
                ariaLabel="SpeedDial tooltip example"
                sx={{ position: 'absolute', bottom: 16, right: 16 }}
                icon={<SpeedDialIcon />}
                onClose={handleClose}
                onOpen={handleOpen}
                open={open}
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        tooltipOpen
                        onClick={() => {
                            navigate(action.path);
                            handleClose();
                        }}
                    />
                ))}
            </SpeedDial>
        </Box>
    );
}