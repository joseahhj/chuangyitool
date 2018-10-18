/**
 * modify by haijin on 2017/9/14.
 */
const shell = require('shelljs');
var readlineSync = require('readline-sync');

if (readlineSync.keyInYN('你确认要上线创意工具代码吗?')) {
	shell.cd('../../../ads.business.union.original_tool');
	if (shell.exec('git pull').code !== 0) {
	    shell.echo('Error: Git pull failed');
	    shell.exit(1);
	}
	shell.rm('-rf','original_tool-web/src/main/webapp/picmaker');
	shell.cd('../jztFeSeparation/projects/fe-picmaker');
	shell.cp('-R','picmaker/','../../../ads.business.union.original_tool/original_tool-web/src/main/webapp/picmaker');
	shell.cd('../../../ads.business.union.original_tool');
	if(shell.exec('git add .').code !==0){
	    shell.echo('Error: Git add failed');
	    shell.exit(1);
	}


	if(shell.exec('git commit -m "Auto-Commit-tool"').code !==0){


	    shell.echo('Error: Git commit failed');
	    shell.exit(1);
	}
	if(shell.exec('git push').code !==0){
	    shell.echo('Error: Git push failed');
	    shell.exit(1);
	}
}