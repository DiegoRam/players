module.exports = function(){
    return new MemoryStorage();
}

function MemoryStorage(){
    this.storage = [];
}

MemoryStorage.prototype.save = function(element){
    this.storage.push(element);
}