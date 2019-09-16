#!/usr/bin/env node
"use strict";var _path=_interopRequireDefault(require("path")),_fs=_interopRequireDefault(require("fs")),_fastGlob=_interopRequireDefault(require("fast-glob")),_meow=_interopRequireDefault(require("meow")),_makeDir=_interopRequireDefault(require("make-dir")),_posthtml=_interopRequireDefault(require("posthtml")),_outResolve=_interopRequireDefault(require("./out-resolve")),_cfgResolve=_interopRequireDefault(require("./cfg-resolve"));function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function asyncGeneratorStep(gen,resolve,reject,_next,_throw,key,arg){try{var info=gen[key](arg),value=info.value}catch(error){return void reject(error)}info.done?resolve(value):Promise.resolve(value).then(_next,_throw)}function _asyncToGenerator(fn){return function(){var self=this,args=arguments;return new Promise(function(resolve,reject){function _next(value){asyncGeneratorStep(gen,resolve,reject,_next,_throw,"next",value)}function _throw(err){asyncGeneratorStep(gen,resolve,reject,_next,_throw,"throw",err)}var gen=fn.apply(self,args);_next(void 0)})}}const cli=(0,_meow.default)(`
  Usage: posthtml <patterns>

  Options:
    --output -o    Output File or Folder
    --config -c    Path to config file
    --use -u       PostHTML plugin name
    --help -h      CLI Help
    --version -v   CLI Version

  Examples:
    $ posthtml input.html
    $ posthtml input.html -o output.html
    $ posthtml inputFolder/*.html !unicorn.html
    $ posthtml input.html -o output.html -c posthtml.js
    $ posthtml input.html -o output.html -u posthtml-bem --posthtml-bem.elemPrefix __
    $ posthtml inputFolder/*.html -o outputFolder
    $ posthtml inputFolder/**/*.html -o outputFolder
`,{flags:{config:{type:"string",alias:"c"},version:{type:"boolean",alias:"v"},help:{type:"boolean",alias:"h"},output:{type:"string",alias:"o"},use:{type:"Array",alias:"u"}}}),read=file=>new Promise(resolve=>_fs.default.readFile(file,"utf8",(error,data)=>{error&&console.warn(error),resolve(data)})),getPlugins=config=>Object.keys(config.plugins||{}).map(plugin=>require(plugin)(config.plugins[plugin])),config=(0,_cfgResolve.default)(cli),processing=/*#__PURE__*/function(){var _ref=_asyncToGenerator(function*(file){const output=yield(0,_outResolve.default)(file,config.output),plugins=Array.isArray(config.plugins)?config.plugins:getPlugins(config);(0,_makeDir.default)(_path.default.dirname(output)).then(read.bind(null,file)).then(html=>(0,_posthtml.default)(plugins).process(html)).then(({html})=>{_fs.default.writeFile(output,html,error=>{error&&console.warn(error),console.log(`The file ${file} has been saved!`)})})});return function(){return _ref.apply(this,arguments)}}();_fastGlob.default.stream(config.input).on("data",processing).once("error",console.warn);