function PageMaker(){
    var page = 0;
    var count = 0;
    var start = 0;
    var end = 0;
    var prev;
    var next;

    function getStart(){
        return this.start;
    }
    function setStart(start){
        this.start = start;
    }
    function getEnd(){
        return this.end;
    }
    function setEnd(end){
        this.end = end;
    }
    function isPrev(){
        return this.prev;
    }
    function setPrev(prev){
        this.prev = prevl
    }
    function isNext(){
        return this.next;
    }
    function setNext(next){
        this.next = next;
    }
    function getCount(){
        return this.count;
    }
    function getPage(){
        return this.page;
    }
    function setPage(page){
        if(page < 1){
            this.page = 1;
            return;
        }else{
            this.page;
        }
    }
    function calcPage(){
        var tempEnd = Math.ceil(this.page/10.0)*10;
        this.start = tempEnd - 1;
        if(tempEnd * 10 > this.count){
            this.end = Math.ceil(this.count/10.0);
        }else{
            this.end = tempEnd;
        }
        this.prev = this.start != 1;
        this.next = this.end * 10 < this.count;
    }
    function setCount(count){
        if(count<2){
            return;
        }
        this.count = count;
        calcPage();
    }
}

module.exports ={

}