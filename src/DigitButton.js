import React from 'react';

import { ACTIONS } from './App';

const DigitButton = ({ dispatch, digit, id }) => {
	return (
		<button
			id={id}
			onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } })}
		>
			{digit}
		</button>
	);
};

export default DigitButton;
