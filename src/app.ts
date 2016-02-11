
interface Window {
    app: AppController;
}


declare var Cycle: any;
declare var CycleDOM: any;
declare var CycleIsolate: any;

$(document).ready(function() {  
   
    window.app = new AppController();
    
});
