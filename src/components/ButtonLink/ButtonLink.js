import React from 'react';
import {Link} from 'react-router-dom';
import {Button} from '@material-ui/core';

function ButtonLinkComponent({navigate, children, ...rest}) {
	// Don't pass the navigation function down to the <a>
	return <Button {...rest}>{children}</Button>;
}

export function ButtonLink({children, ...rest}) {
	return <Link {...rest} component={ButtonLinkComponent}>{children}</Link>;
}