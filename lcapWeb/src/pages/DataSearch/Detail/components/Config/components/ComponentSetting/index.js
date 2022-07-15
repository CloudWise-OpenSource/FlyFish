import React, { Component } from "react";
import styles from "./assets/style.less";
import { getScreenHTML, MESSAGE_TYPES } from "./assets/screen";
import _ from "lodash";
import { Button, Icon, Tooltip } from "@chaoswise/ui";
import { FormattedMessage } from "react-intl";
import Loading from "@/components/Loading";
class ComponentSetting extends Component {
  constructor(props) {
    super(props);
    this.iframeRef = React.createRef();
    this.receiveMessage = this.receiveMessage.bind(this);
    this.state = {
      isLoading: false,
      config: props.config || {},
    };
  }

  componentDidMount() {
    if (this.iframeRef && this.iframeRef.current) {
      window.addEventListener("message", this.receiveMessage);
    }
    this.generateScreen();
  }

  componentDidUpdate(prev) {
    const { id: prevComponentId } = prev.activeComponent || {};
    const { id: componentId } = this.props.activeComponent || {};
    if (prevComponentId !== componentId) {
      this.generateScreen();
    }
  }

  componentWillUnmount() {
    if (this.iframeRef && this.iframeRef.current) {
      window.removeEventListener("message", this.receiveMessage);
    }
  }

  receiveMessage(e) {
    if (e.data && typeof e.data === "string") {
      try {
        const message = JSON.parse(e.data);
        if (message.type === MESSAGE_TYPES.update) {
          this.setState({
            config: message.data,
          });
        } else if (message.type === MESSAGE_TYPES.loaded) {
          this.setState({
            isLoading: false,
          });
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    }
  }

  generateScreen() {
    let { activeComponent, data } = this.props;
    let { config } = this.state;
    if (!activeComponent || !activeComponent.id) {
      return;
    }

    this.setState({
      isLoading: true,
    });

    setTimeout(() => {
      let screenHtmlStr = getScreenHTML(
        activeComponent,
        data,
        config,
        getCollectionFields(data || [])
      );
      if (this.iframeRef && this.iframeRef.current) {
        const frameDocument =
          this.iframeRef.current.contentDocument ||
          this.iframeRef.current.contentWindow.document;
        frameDocument.open();
        frameDocument.write(screenHtmlStr);
        frameDocument.close();
      }
    }, 0);
  }

  render() {
    let { isLoading } = this.state;
    return (
      <div className={styles.ComponentSetting}>
        <div
          className={styles.header}
          onClick={() => {
            this.props.backToComponentList && this.props.backToComponentList();
          }}
        >
          <Icon type="left" />
          <Tooltip
            title={`${
              this.props.activeComponent ? this.props.activeComponent.name : ""
            }设置`}
          >
            {`${
              this.props.activeComponent ? this.props.activeComponent.name : ""
            }设置`}
          </Tooltip>
        </div>
        <iframe ref={this.iframeRef} className={styles.content} />
        {isLoading && (
          <div className={styles.loading}>
            <Loading />
          </div>
        )}
        {!isLoading && (
          <div className={styles.actionList}>
            <Button
              type="primary"
              onClick={() => {
                this.props.onConfigChanged &&
                  this.props.onConfigChanged(this.state.config);
              }}
            >
              <FormattedMessage id="common.ok" defaultValue="确定" />
            </Button>
          </div>
        )}
      </div>
    );
  }
}

const TYPES = {
  STRING: "string",
  NUMBER: "number",
  NULL: "null",
};

const getType = (value) => {
  if (value == null || value === "") {
    return TYPES.NULL;
  } else if (typeof value === "number") {
    return TYPES.NUMBER;
  }

  return TYPES.STRING;
};

const getCollectionFields = (collection) => {
  const fields = {};
  if (Array.isArray(collection)) {
    collection.forEach((item) => {
      for (const [key, value] of Object.entries(item)) {
        fields[key] = fields[key] || [];
        fields[key].push(getType(value));
      }
    });
  } else {
    for (const [key, value] of Object.entries(collection)) {
      fields[key] = fields[key] || [];
      fields[key].push(getType(value));
    }
  }

  let results = [];
  for (const [key, types] of Object.entries(fields)) {
    results.push({
      label: key,
      value: key,
      type: _.includes(types, TYPES.STRING) ? TYPES.STRING : TYPES.NUMBER,
    });
  }

  return results;
};

export default ComponentSetting;
