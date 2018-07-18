/*
实现一个静态服务器
 */
var http = require("http");
var path = require("path");
var fs = require("fs");
var url = require("url");

//创建一个server对象,并设置它端口对象。
var server = http.createServer(function(request,response){
    // path.join(__dirname, 'static') 定位到当前文件，找到static文件夹 C:\Users\LiuZhao\Desktop\test-node\static
    staticRoot(__dirname ,request,response);
});
server.listen(8080);

function staticRoot(staticPath,request,response){
    //获取到用户要访问的完整url对象。
    var pathObj = url.parse(request.url, true);
    /*
    pathObj {
      protocol: null,
      slashes: null,
      auth: null,
      host: null,
      port: null,
      hostname: null,
      hash: null,
      search: '',
      query: {},
      pathname: '/demo.html',
      path: '/demo.html',
      href: '/demo.html' }
     */
    if(pathObj.pathnamea === "/"){
        pathObj.pathname += 'index.html';
    }
    var filePath = path.join(staticPath, pathObj.pathname);

    fs.readFile(filePath,"binary",function(err,fileContent){
        if(err){//没有找到路径或其他异常
            console.log("文件没能找到：" + filePath);
            response.setHeader("Content-type","text/html; charset=UTF-8");
            response.writeHead(404, "not found");
            response.end("<h1>404 Not Found</h1>")
        }else{
            console.log("请求的地址是：" + filePath);
            response.writeHead(200,"OK");
            response.write(fileContent,"binary");
            response.end();
        }
    });
}