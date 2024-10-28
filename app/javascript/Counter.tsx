import React from "react";
import { connect } from "react-redux";

const Counter = ({ counter, increment, decrement }) => {
	return (
		<div>
			<p className="counter_title">Counter: {counter.counter}</p>
			<button className="button" onClick={increment}>
				Increment
			</button>
			<button className="button" onClick={decrement}>
				Decrement
			</button>
		</div>
	);
};

const mapStateToProps = (state) => ({
	counter: state.counter,
});

const mapDispatchToProps = (dispatch) => ({
	increment: () => dispatch({ type: "INCREMENT" }),
	decrement: () => dispatch({ type: "DECREMENT" }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
