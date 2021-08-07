import {Card, Cards, CardTitle} from '../../Cards/Cards';
import {ButtonWhitePurpleDark} from '../../Buttons/ButtonWhitePurpleDark';
import {Typography} from '@material-ui/core';
import reduxActions from '../../../features/redux/actions';
import {useDispatch} from 'react-redux';
import {networkSetup} from '../../../config/config';

const WrongChainModal = () => {

    const dispatch = useDispatch();

    function closeModal() {
        dispatch(reduxActions.modal.hideModal());
    }

    function switchToNetwork(networdIdentifier) {
        networkSetup(networdIdentifier).catch((e) => {
            console.error(e)
          }).then(
            dispatch(reduxActions.modal.hideModal())
          );
    }

    return (
        <Cards>
			<Card variant="purpleDark" style={{marginTop: '100px'}}>
			    <CardTitle align="center" variant="purpleDark">Unsupported Network Selected</CardTitle>
			    <Typography align="center">Please set your network to BSC</Typography>
                <ButtonWhitePurpleDark onClick={ () => switchToNetwork('bsc')} style={{margin: '24px auto 0 auto', width: '90%'}}>Switch to BSC network</ButtonWhitePurpleDark>
                <ButtonWhitePurpleDark onClick={ () => closeModal()} style={{margin: '24px auto 0 auto', padding: '4px 12px'}}>Dismiss</ButtonWhitePurpleDark>
			</Card>
		</Cards>  
    )
}

export default WrongChainModal;