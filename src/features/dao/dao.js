import * as React from 'react';
import {Container} from '@material-ui/core';
import {Launch} from './components/Launch/Launch';

const Dao = () => {
	return (
		<React.Fragment>
			<Container maxWidth="xl">
				<Launch/>
			</Container>
		</React.Fragment>
	);
};

export default Dao;
