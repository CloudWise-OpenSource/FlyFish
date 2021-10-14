import React from "react";
import { ComponentOptionsSetting } from "datavi-editor/templates";

import { merge } from "data-vi/helpers";
import { formatFunctionsToOption } from "../utils";

import {
	BallText,
  Ripple,
  Outer,
	recursionOptions,
} from '@cloudwise-fe/chart-panel'

export default class OptionsSetting extends ComponentOptionsSetting {
  enableLoadCssFile = true

  constructor(props) {
    super(props);
  }
  handleOptionsChange = (options) => {
    this.updateOptions(options);
  };
  getTabs() {
    const {
      nameTextStyle = {},
      valueTextStyle = {},
      textRectStyle = {},
      textShow,
      formatterValue,
      formatterName,
      waterNumber,
      waterDirection,
      waterColor,
      waterOpacity,
      waterShadowBlur,
      waterShadowColor,
      waterSize,
      outlineBorderWidth,
      ballShape,
      ballBackgoundColor,
      isOuterRaceShow,
      outerRaceColor,
      outerRaceWidth,
      progressColor,
      isOuterTickShow,
      outerTickColor,
      outerTickRadius,
      outerTickSplitNum,
      outerTickLength,
      outerTickWidth
    } = merge(
      {},
      recursionOptions(this.props.options, true),
      formatFunctionsToOption(this.props.options.functions)
    );
    const rippleValues = {
      waterNumber,
      waterDirection,
      waterColor,
      waterOpacity,
      waterShadowBlur,
      waterShadowColor,
      waterSize,
      outlineBorderWidth,
      ballShape,
      ballBackgoundColor,
    };
    const textValues = {
      nameTextStyle,
      valueTextStyle,
      textShow,
      formatterName,
      formatterValue,
      textRectStyle
    };
    const outerValue = {
      isOuterRaceShow,
      outerRaceColor,
      outerRaceWidth,
      progressColor,
      isOuterTickShow,
      outerTickColor,
      outerTickRadius,
      outerTickSplitNum,
      outerTickLength,
      outerTickWidth,
    };
    console.log(this.props.options);
    return {
      ballText: {
        label: "文本",
        content: () => (
          <BallText
            values={textValues}
            onChange={(changeValues) => this.handleOptionsChange(changeValues)}
          />
        ),
      },
      ripple: {
        label: "水波",
        content: () => (
          <Ripple
            values={rippleValues}
            onChange={(changeValues) => this.handleOptionsChange(changeValues)}
          />
        ),
      },
      Outer: {
        label: "外环与刻度",
        content: () => (
          <Outer
            values={outerValue}
            onChange={(changeValues) => this.handleOptionsChange(changeValues)}
          />
        ),
      },
    };
  }
}
