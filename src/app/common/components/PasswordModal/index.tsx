import { useState } from 'react';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
    Button,
    FormControl,
    IconButton,
    InputAdornment,
    Modal,
    OutlinedInput,
    Paper,
    Typography,
} from '@mui/material';

export default function PasswordModal({
    open,
    setOpen,
    onSubmit,
    title = 'Enter your Password to Continue',
    buttonTitle = 'Submit',
}) {
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleCancel = () => {
        setOpen(false);
        setPassword('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password.length === 0) setPasswordError(true);
        else {
            setPasswordError(false);
            onSubmit(password);
            handleCancel();
        }
    };

    return (
        <Modal open={open} onClose={handleCancel} aria-label={title}>
            <Paper
                component="form"
                className="absolute flex flex-col gap-4 w-full max-w-xs md:max-w-sm top-1/4 left-1/2 p-4"
                sx={{
                    backgroundColor: 'background.paper',
                    transform: 'translate(-50%,-50%)',
                }}
                onSubmit={handleSubmit}
            >
                <Typography>{title}</Typography>
                <FormControl margin="dense" error={passwordError} required>
                    <OutlinedInput
                        id="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (e.target.value.length === 0) setPasswordError(true);
                            else setPasswordError(false);
                        }}
                        fullWidth
                        autoComplete="on"
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
                <div className="flex flex-row justify-between">
                    <Button variant="outlined" color="error" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button variant="contained" type="submit" color="primary">
                        {buttonTitle}
                    </Button>
                </div>
            </Paper>
        </Modal>
    );
}