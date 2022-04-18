/**
 * Created by willem on 18-1-22.
 */
import PropTypes from 'prop-types';

import HighChart from '../HighChart';
import T from 'utils/T';

@T.decorator.propTypes({
	option: PropTypes.object.isRequired
})
export default class Area extends HighChart {
	buildChartOptions() {
		return T.lodash.defaultsDeep(this.props.option, {
			chart: {
				type: 'area',
                height: 250,
                showAxes: true  // 空数据显示坐标轴
			},
            colors: ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
			title: {
				text: ''
			},
			subtitle: {
				text: ''
			},
			xAxis: {
                crosshair: {
                    width: 1,
                    color: '#000'
                }, // 十字准心
                tickmarkPlacement: 'on', // 刻度线显示在轴标签上方
			},
			yAxis: {
				title: {
					text: ''
				}
			},
            plotOptions: {
                area: {
                    marker: {
                        enabled: true,
                        symbol: 'circle',
                        radius: 2,
                        states: {
                            hover: {
                                enabled: true
                            }
                        },
                        fillColor: '#FFFFFF',
                        lineWidth: 2,
                        lineColor: null
                    }
                }
            },
            legend: {
                align: 'center',
                verticalAlign: 'top',
            },
            tooltip: {
                shared: true
            },
		});
	}
}
