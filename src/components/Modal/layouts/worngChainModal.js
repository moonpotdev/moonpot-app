import {Card, Cards, CardTitle} from '../../../components/Cards/Cards';
import {ButtonWhitePurpleDark} from '../../../components/Buttons/ButtonWhitePurpleDark';
import {Container, makeStyles, Typography} from '@material-ui/core';
import reduxActions from '../../../features/redux/actions';
import {useDispatch} from 'react-redux';

const WrongChainModal = () => {

    const dispatch = useDispatch();

    function closeModal() {
        dispatch(reduxActions.modal.hideModal());
    }

    return (
        <Cards>
			<Card variant="purpleDark" style={{marginTop: '100px'}}>
			    <CardTitle align="center" variant="purpleDark">Error</CardTitle>
			    <Typography align="center">Looks like you are lost in space</Typography>
			    <ButtonWhitePurpleDark onClick={closeModal} style={{margin: '24px auto 0 auto'}}>Close</ButtonWhitePurpleDark>
			</Card>
		</Cards>  
    )
}

export default WrongChainModal;