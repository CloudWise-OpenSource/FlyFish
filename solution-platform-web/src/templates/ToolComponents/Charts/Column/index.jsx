/**
 * Created by willem on 18-1-22.
 */
import PropTypes from 'prop-types';

import HighChart from '../HighChart';
import T from 'utils/T';

@T.decorator.propTypes({
    option: PropTypes.object.isRequired
})
export default class Column extends HighChart {
    buildChartOptions() {
        return T.lodash.defaultsDeep(this.props.option, {
            chart: {
                type: 'xy'
            },
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                allowDecimals: false,
                labels: {
                    formatter: function () {
                        return this.value; // clean, unformatted number for year
                    }
                }
            },
            yAxis: {
                title: {
                    text: ''
                },
                labels: {
                    formatter: function () {
                        return this.value / 1000 + 'k';
                    }
                }
            },
            plotOptions: {
                area: {
                    pointStart: 1940,
                    marker: {
                        enabled: false,
                        symbol: 'circle',
                        radius: 2,
                        states: {
                            hover: {
                                enabled: true
                            }
                        }
                    }
                }
            }
        })
    }
}
