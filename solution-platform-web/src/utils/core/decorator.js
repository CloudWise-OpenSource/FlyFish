/**
 * Created by chencheng on 17-9-4.
 */

import PropTypes from 'prop-types';

/**
 * react component contextTypes的装饰器，目前支持的类型：store, router
 * @param arguments
 * @returns {function(*)}
 */
export const contextTypes = (...params) => {

    return (targetClass) => {
        params.forEach((type) => {
            targetClass.contextTypes = targetClass.contextTypes || {};
            if (!targetClass.contextTypes.hasOwnProperty(type)) {
                switch (type) {
                    case 'store':
                    case 'router':
                        targetClass.contextTypes[type] = PropTypes.object.isRequired;
                        break;

                }
            }
        });
    };
};

/**
 * 验证propTypes的装饰器
 * @param propTypesChecker
 * @returns {function(*)}
 */
export const propTypes = (propTypesChecker = {}) => {

    return (targetClass) => {
        targetClass.propTypes = propTypesChecker;
    };
};

