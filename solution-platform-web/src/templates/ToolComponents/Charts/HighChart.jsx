/**
 * @description
 * @author vision <vision.shi@tianjishuju.com>
 * @license www.tianjishuju.com/license
 */
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import HighchartMore from 'highcharts/highcharts-more.src';

const Highcharts = require('highcharts/highcharts.src');
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/offline-exporting')(Highcharts);

import T from 'utils/T';

HighchartMore(Highcharts);

@T.decorator.propTypes({
    height: PropTypes.number.isRequired
})
export default class HighChart extends PureComponent {
    static defaultProps = {
        height: 0
    };

    constructor(props) {
        super(props);

        this.chart = null;
    }

    componentDidMount() {
        this.drawChart();
    }

    componentDidUpdate(nextProps) {
        if (nextProps.option) {
            this.drawChart();
            this.update();
        }
    }

    getOptions() {
        return Object.assign(this.buildBaseOptions(), {
            credits: {
                enabled: false
            },
            exporting: {
                enabled: false
            }
        }, this.buildChartOptions());
    }

    buildBaseOptions() {
        return {};
    }

    buildChartOptions() {
        return {};
    }

    drawChart() {
        if (this.wrapper) {
            this.chart = Highcharts.chart(this.wrapper, this.getOptions());
            const self = this;
            $('#chart-info-box').resize(function () {
                self.chart.reflow();
            });
        }
    }

    update() {
        this.chart.update(this.getOptions());
    }

    render() {
        // let height = this.props.height;

        return (
            <div className="chart">
                <div className="chart-content"
                    // style={{ width: '100%', height: height }}
                    style={{ width: '100%' }}
                    ref={wrapper => (this.wrapper = wrapper)}
                />
            </div>
        );
    }
}
