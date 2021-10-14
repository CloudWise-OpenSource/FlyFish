import { FONTWEIGHT, FONTSTYLE } from './index'
export const NAMESTYLE = {
	color: '#B1E8FC',
	fontSize: 24,
	fontStyle: Object.keys(FONTSTYLE)[0],
	fontWeight: Object.keys(FONTWEIGHT)[0],
	lineHeight: 1.5,
	fontFamily: 'sans-serif',
}
export const VALUESTYLE = {
	color: '#70f4f8',
	fontSize: 32,
	fontStyle: Object.keys(FONTSTYLE)[0],
	fontWeight: Object.keys(FONTWEIGHT)[0],
	lineHeight: 1.5,
	fontFamily: 'sans-serif',
}
export const RECTSTYLE = {
	top: '-50%',
	left: '-50%',
}

export function formatter(value) {
	return value
}
