import React from 'react';
import Modal from '@material-ui/core/Modal';
import {useSelector, useDispatch} from 'react-redux';
import WrongChainModal from './layouts/worngChainModal';


const ModalPopup = () => {

    let isOpen = useSelector(state => state.modalReducer.isOpen);
    let modalType = useSelector(state => state.modalReducer.modalType);

    return (
        <Modal open={isOpen}>
            { modalType == 'SHOW_WRONG_CHAIN_MODAL' ? <WrongChainModal /> : "" }
        </Modal>
    )
    
}

export default ModalPopup;

