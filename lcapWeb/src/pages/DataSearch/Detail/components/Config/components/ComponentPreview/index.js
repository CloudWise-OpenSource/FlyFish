import React from "react";
import {
  getDefaultScreenJson,
  getScreenHTML,
  MESSAGE_TYPES,
} from "./assets/screen";
import Loading from "@/components/Loading";
export default class ComponentPreview extends React.Component {
  constructor(props) {
    super(props);
    this.iframeRef = React.createRef();
    this.resize = this.resize.bind(this);
    this.receiveMessage = this.receiveMessage.bind(this);
    this.state = {
      isLoading: false,
    };
  }

  componentDidMount() {
    if (this.iframeRef && this.iframeRef.current) {
      window.addEventListener("resize", this.resize);
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
      window.removeEventListener("resize", this.resize);
      window.removeEventListener("message", this.receiveMessage);
    }
  }

  resize() {
    this.generateScreen();
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
    let { activeComponent, data, dataConfig } = this.props;
    if (!activeComponent || !activeComponent.id) {
      return;
    }

    this.setState({
      isLoading: true,
    });
    setTimeout(() => {
      let screenObject = getDefaultScreenJson(
        {
          height: this.iframeRef.current.offsetHeight,
          width: this.iframeRef.current.offsetWidth,
        },
        activeComponent,
        {
          height: this.iframeRef.current.offsetHeight - 30,
          width: (this.iframeRef.current.offsetWidth / 3) * 2,
        },
        data,
        dataConfig
      );
      let screenHtmlStr = getScreenHTML(JSON.stringify(screenObject));
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
      <div
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        {isLoading && <Loading />}
        <iframe
          ref={this.iframeRef}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
          }}
        />
      </div>
    );
  }
}
