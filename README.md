# nodejs-app-electron
用nodejs构建的桌面应用基于electron
1、less模块缩进问题，修改node_modules\less\lib\less\tree\ruleset.js  ，将tabRuleStr = context.compress ? '' : Array(context.tabLevel + 1).join("  "),改为：tabRuleStr = context.compress ? '' : context.tabLevel?"\t":"",