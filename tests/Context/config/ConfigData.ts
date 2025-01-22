export const validOutputConfig = '{ "directory": "out_dir", "filename": "out_file.ext" }';

export const invalidDirectoryConfigData = '{ "directory": 123, "filename": "value2" }';

const absolutePath = process.platform === 'win32' ? 'd:\\\\eduardoleolim' : '/eduardoleolim';

export const invalidAbsolutePathConfigData = `{ "directory": "${absolutePath}", "filename": "value2" }`;

export const invalidFilenameConfigData = '{ "directory": "value", "filename": 123 }';

export const invalidFromResourcesConfigData = '{ "from": 123, "to": "value2" }';

export const invalidToResourcesConfigData = '{ "from": "value", "to": 123 }';

export const validCustomResourceConfigData = `{ "from": "from/file.ext", "to": ${validOutputConfig} }`;
