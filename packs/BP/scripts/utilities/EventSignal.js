export class EventSignal{
    #methods = {};
    #symbol = Symbol('current');
    async trigger(...params){
        const promises = [];
        let successCount = 0;
        for (const sym of Object.getOwnPropertySymbols(this.#methods)) {
            try {
                promises.push(this.#methods[sym](...params));
            } catch (error) {
                errorHandle(error);
            }
        }
        const settled = await Promise.allSettled(promises);
        for (const {reason,status} of settled) {
            if(status == 'rejected') errorHandle(reason);
            else successCount++;
        }
        return successCount;
    }
    subscribe(method){
        if(Object.prototype.hasOwnProperty.call(method,this.#symbol)) return;
        const key = Symbol('key');
        method[this.#symbol] = key;
        this.#methods[key] = method;
        return method;
    }
    unsubscribe(method){
        if(!Object.prototype.hasOwnProperty.call(method,this.#symbol)) return;
        delete this.#methods[method[this.#symbol]];
        delete method[this.#symbol];
        return method;
    }
}