'use strict';

const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const Menu = electron.Menu;

//菜单项
var template = [
    {
        label: '编辑',
        submenu: [
            {
                label: '取消',
                accelerator: 'CmdOrCtrl+Z',
                role: 'undo'
            },
            {
                label: '恢复',
                accelerator: 'Shift+CmdOrCtrl+Z',
                role: 'redo'
            },
            {
                type: 'separator'
            },
            {
                label: '剪切',
                accelerator: 'CmdOrCtrl+X',
                role: 'cut'
            },
            {
                label: '复制',
                accelerator: 'CmdOrCtrl+C',
                role: 'copy'
            },
            {
                label: '粘贴',
                accelerator: 'CmdOrCtrl+V',
                role: 'paste'
            },
            {
                label: '全选',
                accelerator: 'CmdOrCtrl+A',
                role: 'selectall'
            },
        ]
    },
    {
        label: '视图',
        submenu: [
            {
                label: '刷新',
                accelerator: 'CmdOrCtrl+R',
                click: function(item, focusedWindow) {
                    if (focusedWindow){
                        focusedWindow.reload();
                    }
                }
            },
            {
                label: '切换全屏',
                accelerator: (function() {
                    if (process.platform == 'darwin') {
                        return 'Ctrl+Command+F';
                    }else{
                        return 'F11';
                    }
                })(),
                click: function(item, focusedWindow) {
                    if (focusedWindow){
                        focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
                    }
                }
            },
            {
                label: '开发者工具',
                accelerator: (function() {
                    if (process.platform == 'darwin'){
                        return 'Alt+Command+I';
                    }else{
                        return 'Ctrl+Shift+I';
                    }
                })(),
                click: function(item, focusedWindow) {
                    if (focusedWindow){
                        focusedWindow.toggleDevTools();
                    }
                }
            },
        ]
    },
    {
        label: '窗口',
        role: 'window',
        submenu: [
            {
                label: '最小化',
                accelerator: 'CmdOrCtrl+M',
                role: 'minimize'
            },
            {
                label: '关闭',
                accelerator: 'CmdOrCtrl+W',
                role: 'close'
            },
        ]
    },
    {
        label: '帮助',
        role: 'help',
        submenu: [
            {
                label: '了解更多',
                click: function() { require('electron').shell.openExternal('http://electron.atom.io') }
            },
        ]
    },
];

if (process.platform == 'darwin') {
    var name = require('electron').remote.app.getName();
    template.unshift({
        label: name,
        submenu: [
            {
                label: '关于 ' + name,
                role: 'about'
            },
            {
                type: 'separator'
            },
            {
                label: '服务',
                role: 'services',
                submenu: []
            },
            {
                type: 'separator'
            },
            {
                label: 'Hide ' + name,
                accelerator: 'Command+H',
                role: 'hide'
            },
            {
                label: 'Hide Others',
                accelerator: 'Command+Alt+H',
                role: 'hideothers'
            },
            {
                label: 'Show All',
                role: 'unhide'
            },
            {
                type: 'separator'
            },
            {
                label: 'Quit',
                accelerator: 'Command+Q',
                click: function() { app.quit(); }
            },
        ]
    });
// Window menu.
    template[3].submenu.push(
        {
            type: 'separator'
        },
        {
            label: 'Bring All to Front',
            role: 'front'
        }
    );
}
//应用菜单项设置
var menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
// Create the browser window.
    mainWindow = new BrowserWindow({width: 800, height: 600,minWidth:600,minHeight:500, frame: false});//, frame: false 创建无边框窗口

// and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/index.html');
    //mainWindow.loadURL('http://www.anxinp2p.com/');

// Open the DevTools.
    mainWindow.webContents.openDevTools();

// Emitted when the window is closed.
    mainWindow.on('closed', function() {
// Dereference the window object, usually you would store windows
// in an array if your app supports multi windows, this is the time
// when you should delete the corresponding element.
        mainWindow = null;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
// On OS X it is common for applications and their menu bar
// to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
// On OS X it's common to re-create a window in the app when the
// dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});
