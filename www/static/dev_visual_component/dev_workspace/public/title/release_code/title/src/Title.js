import React, { Component } from 'react';
import _ from "lodash";
import './index.less';
const wrapStyle = {
    height: '100%',
    display: 'flex',
    // border: '1px solid #25324d',
    borderRadius: '10px'
}
export default class Title extends Component {
    constructor(props){
        super(props);
    }

    handleTitleClick = ()=>{
        const { isLink, hrefUrl = '', isNewWindow = true } = this.props;
        if(isLink && hrefUrl) window.open(hrefUrl, isNewWindow ? '_blank' : '_self')
    }

    translation = (arrAy = [], text = '') => {
        const { data = {} } = this.props;
        let content = text;
        (arrAy || []).forEach(item => {
            const regularValue = item.replace('${', '').replace('}', '');
            const newdata = _.get(data, regularValue) || '';
            content = content.replace(item, newdata);
        })
        return  content;
    }

   
    render(){
        const { text = '', hrefUrl, isNewWindow, ...style  } = this.props;
        const regular = text.match(/\${[a-z,A-Z,\.]{1,}\}/g) || [];
        let content = text;
        if(regular) content = this.translation(regular, text); 
        return <div style={{ ...wrapStyle, ...style }} >
            <div onClick={this.handleTitleClick} dangerouslySetInnerHTML={{ __html: content }}></div>
        </div>
    }
}
