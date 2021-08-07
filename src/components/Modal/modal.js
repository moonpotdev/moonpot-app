import React from 'react';
import Modal from '@material-ui/core/Modal';
import {useSelector, useDispatch} from 'react-redux';
import reduxActions from '../../features/redux/actions';

import WrongChainModal from './layouts/worngChainModal';

import {Card, Cards, CardTitle} from '../../components/Cards/Cards';
import {ButtonWhitePurpleDark} from '../../components/Buttons/ButtonWhitePurpleDark';
import {Container, makeStyles, Typography} from '@material-ui/core';


const ModalPopup = () => {

    const dispatch = useDispatch();

    let isOpen = useSelector(state => state.modalReducer.isOpen);

    function closeModal() {
        dispatch(reduxActions.modal.hideModal());
    }

    return (
        <Modal open={isOpen}>
            <WrongChainModal /> 
        </Modal>
    )
    
}

export default ModalPopup;

