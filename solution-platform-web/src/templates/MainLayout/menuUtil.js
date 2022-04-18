/**
 * Created by chencheng on 2017/8/28.
 */
import T from 'utils/T';
import { EnumDefaultMenus, EnumCollapsedLeftMenuUrls } from 'constants/EnumDefaultMenus';

// --图片资源--
import LogoutIcon from './img/logout.svg';

/**
 * url和分类值的对应关系
 * @type {{}}
 */
export const UrlToExtraInfoMap = {};

/**
 * 配置菜单文件
 */
const EnumMenus = (() => {
    const EnumDefaultMenusClone = T.lodash.cloneDeep(EnumDefaultMenus);

    /**
     * 获取url对应额外信息的Item
     * @param category
     * @param url
     */
    const getUrlToExtraInfoMapItem = (category, url) => ({
        category,
        isCollapsedLeftMenu: EnumCollapsedLeftMenuUrls.indexOf(url) !== -1
    });

    /**
     * 格式化菜单
     * @param category
     * @param menus
     * @param urls
     * @returns {{menus: *, urls: Array}}
     */
    const formatMenus = (category, menus, urls = []) => {
        menus.forEach(menu => {
            if (T.lodash.isUndefined(menu.children)) menu.children = [];

            if (Array.isArray(menu.url)) {
                urls = urls.concat(menu.url);
            } else if (T.lodash.isString(menu.url)) {
                urls.push(menu.url);
            }

            if (Array.isArray(menu.children) && menu.children.length > 0) {
                if(menu.url){
                    if(T.lodash.isString(menu.url)){
                        menu.url = [menu.url];
                    }
                } else {
                    menu.url = [];
                }
                const result = formatMenus(category, menu.children);

                menu.url = T.lodash.uniq(menu.url.concat(result.urls));
                urls = T.lodash.uniq(urls.concat(menu.url));
            }
        });

        urls.forEach(url => UrlToExtraInfoMap[url] = getUrlToExtraInfoMapItem(category, url));

        return { menus, urls };
    }

    // 1.加工默认菜单配置
    EnumDefaultMenusClone.forEach((appMenus) => appMenus.childrenMenu = formatMenus(appMenus.value, appMenus.childrenMenu).menus);

    // 2.权限过滤
    const { menuPermission } = T.auth.getLoginInfo() || {};
    const permissionMenus = (menus) => {
        let newMenus = [];
        for (let i = 0; i < menus.length; i++){
            let menu = menus[i];
            let childrenPermission = [];
            if (Array.isArray(menu.children) && menu.children.length > 0) {
                childrenPermission = menu.children.map(item => item.uniqueIdentity);
                menu.children = permissionMenus(menu.children);
            }

            if (!(!T.auth.can(menu.uniqueIdentity) && T.lodash.difference(childrenPermission, menuPermission).length === childrenPermission.length)) {
                newMenus.push(menu);
            }
        }

        return newMenus;
    };

    EnumDefaultMenusClone.forEach((appMenus) => appMenus.childrenMenu = permissionMenus(appMenus.childrenMenu));

    return EnumDefaultMenusClone;
})();

/**
 * 枚举碎片
 * @type {[*]}
 */
export const EnumFragmentMenu = [
    {
        label: '退出',
        url: '',
        icon: LogoutIcon,
        children: []
    }
];

/**
 * 是否移除左侧菜单
 * @param url
 * @return {boolean}
 */
export const isRemoveLeftMenu = (url) => {
    for (let i = 0; i < EnumDefaultMenus.length; i++){
        const childrenMenu = EnumDefaultMenus[i].childrenMenu;
        for (let j = 0; j < childrenMenu.length; j++) {
            const menu = childrenMenu[j];
            let isCheck = false;

            if (menu.url){
                if (Array.isArray(menu.url) && menu.url.indexOf(url) !== -1){
                    isCheck = true;
                } else if(T.lodash.isString(menu.url) && menu.url == url) {
                    isCheck = true;
                }
            }

            if (isCheck){
                if (!menu.children || menu.children.length < 1) {
                    return true;
                }else {
                    return false;
                }
            }
        }
    }

    return false;
};


/**
 * 获取菜单的类别
 * @param {String} category
 * @returns {Array}
 */
export const getMenusByCategory = (category) => {
	for (let i = 0; i < EnumMenus.length; i++) {
		if (category === EnumMenus[i].value) {
			return EnumMenus[i].childrenMenu;
		}
	}

	return [];
};


/**
 * 获取左侧菜单
 * @param url
 * @param type
 * @returns {Array}
 */
export const getLeftMenu = (url, type = EnumMenus[0]['value']) => {
    const menu = getMenusByCategory(type);

	for (let i = 0; i < menu.length; i++) {
		if ((T.lodash.isArray(menu[i].url) && T.lodash.indexOf(menu[i].url, url) !== -1) ||
			(T.lodash.isString(menu[i].url) && menu[i].url === url)
		) {
			return menu[i].children;
		}
	}

	return [];
};
