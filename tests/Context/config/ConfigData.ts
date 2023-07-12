export const validConfigData = '{ "directory": "value", "filename": "value2" }';

export const invalidDirectoryConfigData = '{ "directory": 123, "filename": "value2" }';

const absolutePath = process.platform === 'win32' ? 'd:\\\\eduardoleolim' : '/eduardoleolim';

export const invalidAbsolutePathConfigData = `{ "directory": "${absolutePath}", "filename": "value2" }`;

export const invalidFilenameConfigData = '{ "directory": "value", "filename": 123 }';
