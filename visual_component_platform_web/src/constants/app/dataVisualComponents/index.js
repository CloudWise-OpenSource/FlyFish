
/**
 * 枚举代码树的标记
 * @type {{file: {label: string, value: number}, dir: {label: string, value: number}}}
 */
export const EnumCodeTreeMarkType = {
	file: {
		label: "文件",
		value: 1,
	},

	dir: {
		label: "目录",
		value: 2
	}
};

/**
 * 枚举代码树的操作类型
 * @type {{add: number, edit: number, del: number, upload: number}}
 */
export const EnumCodeTreeOperateType = {
	add: 1,     // 添加
	edit: 2,    // 编辑
	del: 3,     // 删除
	upload: 4,  // 上传
};

/**
 * 枚举代码编辑器
 * @type {{themeKey:string}}
 */
export const EnumCodeEditor = {
	themeKey: 'EDITOR_THEME', // 编辑器代码主题存储key
}

