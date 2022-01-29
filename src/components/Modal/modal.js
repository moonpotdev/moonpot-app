import React from 'react';
import Modal from '@material-ui/core/Modal';
import { useSelector } from 'react-redux';
import WrongChainModal from './layouts/wrongChainModal';
import UnableToSwitchChainModal from './layouts/unableToSwitchChainModal';

function renderSwitch(type) {
  //Check payload for modal layout
  switch (type) {
    case 'WRONG_CHAIN_MODAL':
      return <WrongChainModal />;
    case 'UNABLE_TO_SWITCH_CHAIN_MODAL':
      return <UnableToSwitchChainModal />;
    default:
      return <></>;
  }
}

const ModalPopup = () => {
  let isOpen = useSelector(state => state.modal.isOpen);
  let modalType = useSelector(state => state.modal.modalType);

  return <Modal open={isOpen}>{renderSwitch(modalType)}</Modal>;
};

export default ModalPopup;
