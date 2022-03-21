import React, { Component } from 'react';
import math from 'mathjs';
import { Transition } from 'react-transition-group';
import classnames from 'classnames';
import { calcPercentage } from 'utils/math';
import { opacifyNumber } from 'helpers/opacify';
import { formatToCurrency } from 'utils/currency';

class PriceRow extends Component {
	state = {
		inProp: false,
	};

	UNSAFE_componentWillUpdate(nextProp) {
		const {
			record: [, amount],
		} = this.props;
		if (!math.equal(nextProp.record[1], amount)) {
			this.setState((prevState) => ({
				...prevState,
				inProp: !prevState.inProp,
			}));
		}
	}

	render() {
		const {
			side,
			increment_price,
			increment_size,
			onPriceClick,
			onAmountClick,
			maxCumulative,
			isBase,
			record,
		} = this.props;

		const { inProp } = this.state;
		const [price, amount, cumulative, cumulativePrice] = record;
		const ACCFillClassName = `fill fill-${side}`;
		const ACCFillStyle = {
			backgroundSize: `${calcPercentage(cumulative, maxCumulative)}% 100%`,
		};

		const fillClassName = `fill fill-${side}`;
		const fillStyle = {
			backgroundSize: `${calcPercentage(amount, maxCumulative)}% 100%`,
		};
		const totalAmount = isBase ? cumulative : cumulativePrice;

		return (
			<div
				className={classnames('price-row-wrapper', ACCFillClassName)}
				style={ACCFillStyle}
			>
				<Transition in={inProp} timeout={1000}>
					{(state) => (
						<div
							className={classnames(
								'd-flex value-row align-items-center',
								fillClassName,
								state
							)}
							style={fillStyle}
						>
							<div
								className={`f-1 trade_orderbook-cell trade_orderbook-cell-price pointer`}
								onClick={onPriceClick(price)}
							>
								{formatToCurrency(price, increment_price)}
							</div>
							<div
								className="f-1 trade_orderbook-cell trade_orderbook-cell-amount pointer"
								onClick={onAmountClick(amount)}
							>
								{opacifyNumber(formatToCurrency(amount, increment_size))}
							</div>
							<div
								className="f-1 trade_orderbook-cell trade_orderbook-cell_total pointer"
								onClick={onAmountClick(totalAmount)}
							>
								{isBase
									? formatToCurrency(cumulative, increment_size)
									: formatToCurrency(cumulativePrice, increment_price)}
							</div>
						</div>
					)}
				</Transition>
			</div>
		);
	}
}

export default PriceRow;