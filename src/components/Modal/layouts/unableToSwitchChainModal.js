import {Card, Cards, CardTitle} from '../../Cards/Cards';
import {ButtonWhitePurpleDark} from '../../Buttons/ButtonWhitePurpleDark';
import {Typography} from '@material-ui/core';
import reduxActions from '../../../features/redux/actions';
import {useDispatch} from 'react-redux';

const UnableToSwitchChainModal = () => {

    const dispatch = useDispatch();

    function closeModal() {
        dispatch(reduxActions.modal.hideModal());
    }

    return (
        <Cards>
			<Card variant="purpleDark" style={{marginTop: '100px'}}>
			    <CardTitle align="center" variant="purpleDark">Unable to automatically switch chains</CardTitle>
			    <Typography align="center">Please manually set your network to BSC</Typography>
                <ButtonWhitePurpleDark onClick={ () => closeModal()} style={{margin: '24px auto 0 auto', padding: '4px 12px'}}>Dismiss</ButtonWhitePurpleDark>
			</Card>
		</Cards>  
    )
}

export default UnableToSwitchChainModal;