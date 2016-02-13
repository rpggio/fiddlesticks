
declare var snabbdom: any;
declare var patch: any;
declare var h: any;

declare var app: AppController;

declare var require: any;
declare var requirejs: any;

Rx.Observable.just('ta').subscribe(x => console.log(x));

$(document).ready(function() {  
   
    app = new AppController();
    
});
