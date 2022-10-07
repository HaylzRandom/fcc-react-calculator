import React, { useReducer } from 'react';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';

import './styles.css';

export const ACTIONS = {
	ADD_DIGIT: 'add-digit',
	CHOOSE_OPERATION: 'choose-operation',
	CLEAR: 'clear',
	DELETE_DIGIT: 'delete-digit',
	EVALUATE: 'evalulate',
};

const reducer = (state, { type, payload }) => {
	switch (type) {
		case ACTIONS.ADD_DIGIT:
			if (state.overwrite) {
				return {
					...state,
					currentOperand: payload.digit,
					overwrite: false,
				};
			}
			if (payload.digit === '0' && state.currentOperand === '0') {
				return state;
			}
			if (payload.digit === '.' && state.currentOperand?.includes('.')) {
				return state;
			}

			return {
				...state,
				currentOperand: `${state.currentOperand || ''}${payload.digit}`,
			};
		case ACTIONS.CHOOSE_OPERATION:
			if (state.currentOperand == null && state.previousOperand == null) {
				return state;
			}

			if (state.currentOperand == null) {
				return {
					...state,
					operation: payload.operation,
				};
			}

			if (state.previousOperand == null) {
				return {
					...state,
					operation: payload.operation,
					previousOperand: state.currentOperand,
					currentOperand: null,
				};
			}

			return {
				...state,
				previousOperand: evaluate(state),
				operation: payload.operation,
				currentOperand: null,
			};
		case ACTIONS.CLEAR:
			return {
				...state,
				currentOperand: '0',
				previousOperand: null,
			};
		case ACTIONS.DELETE_DIGIT:
			if (state.overwrite) {
				return {
					...state,
					overwrite: false,
					currentOperand: null,
				};
			}
			if (state.currentOperand == null) return state;
			if (state.currentOperand.length === 1) {
				return { ...state, currentOperand: null };
			}

			return {
				...state,
				currentOperand: state.currentOperand.slice(0, -1),
			};
		case ACTIONS.EVALUATE:
			if (
				state.operation == null ||
				state.currentOperand == null ||
				state.previousOperand == null
			) {
				return state;
			}

			return {
				...state,
				overwrite: true,
				previousOperand: null,
				operation: null,
				currentOperand: evaluate(state),
			};
		default:
			return state;
	}
};

const evaluate = ({ currentOperand, previousOperand, operation }) => {
	const prev = parseFloat(previousOperand);
	const current = parseFloat(currentOperand);

	if (isNaN(prev) || isNaN(current)) return '';

	let computation = '';

	switch (operation) {
		case '+':
			computation = prev + current;
			break;
		case '-':
			computation = prev - current;
			break;
		case '*':
			computation = prev * current;
			break;
		case '/':
			computation = prev / current;
			break;
		default:
			return;
	}

	if (computation === Number.POSITIVE_INFINITY) {
		computation = '0';
	}

	return computation.toString();
};

const INTEGER_FORMATTER = new Intl.NumberFormat('en', {
	maximumFractionDigits: 0,
});

const formatOperand = (operand) => {
	if (operand == null) return;

	const [integer, decimal] = operand.split('.');

	if (decimal == null) return INTEGER_FORMATTER.format(integer);

	return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
};

const App = () => {
	const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
		reducer,
		{}
	);

	return (
		<div className='calculator-grid'>
			<div className='output'>
				<div className='previous-operand'>
					{formatOperand(previousOperand)} {operation}
				</div>
				<div id='display' className='current-operand'>
					{formatOperand(currentOperand)}
				</div>
			</div>
			<button
				id='clear'
				className='span-two'
				onClick={() => dispatch({ type: ACTIONS.CLEAR })}
			>
				AC
			</button>
			<button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
				DEL
			</button>
			<OperationButton id='divide' operation='/' dispatch={dispatch} />
			<DigitButton id='one' digit='1' dispatch={dispatch} />
			<DigitButton id='two' digit='2' dispatch={dispatch} />
			<DigitButton id='three' digit='3' dispatch={dispatch} />
			<OperationButton id='multiply' operation='*' dispatch={dispatch} />
			<DigitButton id='four' digit='4' dispatch={dispatch} />
			<DigitButton id='five' digit='5' dispatch={dispatch} />
			<DigitButton id='six' digit='6' dispatch={dispatch} />
			<OperationButton id='add' operation='+' dispatch={dispatch} />
			<DigitButton id='seven' digit='7' dispatch={dispatch} />
			<DigitButton id='eight' digit='8' dispatch={dispatch} />
			<DigitButton id='nine' digit='9' dispatch={dispatch} />
			<OperationButton id='subtract' operation='-' dispatch={dispatch} />
			<DigitButton id='decimal' digit='.' dispatch={dispatch} />
			<DigitButton id='zero' digit='0' dispatch={dispatch} />
			<button
				className='span-two'
				onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
				id='equals'
			>
				=
			</button>
		</div>
	);
};

export default App;
