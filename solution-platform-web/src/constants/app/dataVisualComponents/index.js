/**
 * 获取组件封面
 * @param component_mark
 * @param account_id
 * @return {string}
 */
export const getComponentCover = (component_mark, account_id) => `${window.ENV.apiDomain}/static/public_visual_component/${account_id}/${component_mark}/cover.png?random=${Date.now()}`;
