import React, { Component } from 'react';
import { Col } from '@chaoswise/ui';

import SummaryCard from './SummaryCard';
import { getComputedStyle } from '@/utils/common';

import styles from './index.scss';

class SummaryCards extends Component {
    constructor() {
        super();
        this.state = {
            summaryCards: []
        };
        this.summaryCardsRef = React.createRef();
    }

    //计算生成card的宽度，然后赋值。
    // eslint-disable-next-line
    getRenderSummary = (items, colorId) => {
        const cardsElement = this.summaryCardsRef.current;
        let cardsStyle = getComputedStyle(cardsElement);
        let cardsWidth = cardsStyle.width ? parseFloat(cardsStyle.width) : 1024;
        let { style = {} } = this.props;
        let summaryCards = [];

        if (items instanceof Array) {
            let length = items.length;
            let width = length > 0 ? (cardsWidth - (length - 1) * 15) / length : 0;

            //宽度：默认用传入的宽度，如果没有，则采用自动计算的。
            items.forEach((item, index) => {
                if (index < (length - 1)) {
                    summaryCards.push(
                        <Col span={8} key={index} style={{ paddingRight: '8px' }}><SummaryCard {...item} styles={{ width: style.width || (width + "px") }} key={index} /></Col>
                    );
                } else {
                    summaryCards.push(
                        <Col span={8} key={index}><SummaryCard {...item} styles={{ width: style.width || (width + "px") }} key={index} /></Col>
                    );
                }

            });
        }

        return summaryCards;
    }

    componentDidMount() {
        let summaryCards = this.getRenderSummary(this.props.items, this.props.colorId);
        this.setState({
            summaryCards
        });
    }

  // eslint-disable-next-line
    UNSAFE_componentWillUpdate(nextProps, nextState) {
        if (this.props.items != nextProps.items) {
            let summaryCards = this.getRenderSummary(nextProps.items, nextProps.colorId);
            this.setState({
                summaryCards
            });
        }
    }

    render() {

        return (
            <div className={styles['summary-cards']} ref={this.summaryCardsRef}>
                {this.state.summaryCards}
            </div>
        );
    }
}

export default SummaryCards;
