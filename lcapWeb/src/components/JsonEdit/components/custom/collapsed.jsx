import { Icon } from 'antd'
import React, { useState } from 'react'
import useCollapse from 'react-collapsed'

function Collaps(props) {
    const { getCollapseProps, getToggleProps, isExpanded } = useCollapse({
        defaultExpanded: true,
    })
    return (
            <div  >
                <div {...getToggleProps()} className="custom-collapse" style={{background:'rgba(0, 0, 0, 0.02)'}}>
                    <Icon type={isExpanded ? 'down' : 'right'} style={{marginRight:'10px'}}/>
                    {props.header}
                </div>
                <div className="ant-collapse-content"  {...getCollapseProps()}>
                    <div className='ant-collapse-content-box'>
                        {props.children}
                    </div>
                </div>
            </div>
    )
}

export default Collaps