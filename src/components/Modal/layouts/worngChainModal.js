import {Card, Cards, CardTitle} from '../../../components/Cards/Cards';
import {ButtonWhitePurpleDark} from '../../../components/Buttons/ButtonWhitePurpleDark';
import {Container, makeStyles, Typography} from '@material-ui/core';
import reduxActions from '../../../features/redux/actions';
import {useDispatch} from 'react-redux';
import { networkSetup } from '../../../networkSetup';

const WrongChainModal = () => {

    const dispatch = useDispatch();

    function closeModal() {
        dispatch(reduxActions.modal.hideModal());
    }

    function switchToBSC() {
        networkSetup(56).catch((e) => {
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
                <div style={{display: 'flex'}}>
                    <ButtonWhitePurpleDark onClick={switchToBSC} style={{margin: '24px auto 0 auto'}}>Switch to BSC network</ButtonWhitePurpleDark>
                    <ButtonWhitePurpleDark onClick={closeModal} style={{margin: '24px auto 0 auto'}}>Dismiss</ButtonWhitePurpleDark>
                </div>

			</Card>
		</Cards>  
    )
}

export default WrongChainModal;