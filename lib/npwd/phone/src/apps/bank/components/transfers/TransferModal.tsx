import React, { useState } from 'react';
import Modal from '../../../../ui/components/Modal';
import { Button, List, ListItem } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useBankModal } from '../../hooks/useBankModal';
import { BankEvents } from '@typings/bank';
import { useNuiRequest } from 'fivem-nui-react-lib';
import { TextField } from '@ui/components/Input';

const useStyles = makeStyles((theme) => ({
  input: {
    width: '60%',
    margin: 'auto',
  },
  modalInput: {
    fontSize: 20,
  },
  modalInputCenter: {
    fontSize: 20,
    textAlign: 'center',
  },
  transferButton: {
    background: '#2E7D32',
    width: 120,
    padding: 5,
    margin: 'auto',
    fontSize: 16,
    marginBottom: 30,
  },
}));

export const TransferModal = () => {
  const Nui = useNuiRequest();
  const classes = useStyles();

  const [targetID, setTargetID] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const { showBankModal, setShowBankModal } = useBankModal();

  const _handleClose = () => {
    setShowBankModal(false);
  };

  const addTransfer = () => {
    const transferAmount = parseInt(amount);
    Nui.send(BankEvents.ADD_TRANSFER, {
      targetID,
      transferAmount,
      message,
    });
    setShowBankModal(false);
  };

  return (
    <Modal visible={showBankModal} handleClose={_handleClose}>
      <List style={{ marginTop: 20 }}>
        <ListItem>
          <TextField
            inputProps={{ className: classes.modalInputCenter }}
            fullWidth
            type="number"
            placeholder="ID"
            value={targetID}
            onChange={(e) => setTargetID(e.target.value)}
          />
        </ListItem>
        <ListItem>
          <TextField
            inputProps={{ className: classes.modalInputCenter }}
            placeholder="Amount"
            fullWidth
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </ListItem>
        <ListItem>
          <TextField
            inputProps={{ className: classes.modalInput }}
            placeholder="Message"
            fullWidth
            value={message}
            multiline
            onChange={(e) => setMessage(e.target.value)}
          />
        </ListItem>
      </List>
      <Button className={classes.transferButton} onClick={addTransfer}>
        Transfer
      </Button>
    </Modal>
  );
};
