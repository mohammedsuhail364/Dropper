

class APIFeatures{
    constructor(query,querystr){
        this.query=query
        this.querystr=querystr
    }
    search(){
        let keyword=this.querystr.keyword ? {
            name:{
                $regex:this.querystr.keyword,
                $options:'i'
            }
        }:{};
        this.query.find({...keyword})
        return this;
    }
    filter(){
        const querystrcopy={...this.querystr}
        const removefields=['keyword','limit','page']
        removefields.forEach(field =>delete querystrcopy[field])
        let querystr = JSON.stringify(querystrcopy);
        querystr = querystr.replace(/\b(gt|gte|lt|lte)/g,match=>`$${match}`)
      
        this.query.find(JSON.parse(querystr));
        return this
    }
    paginate(resperpage){
        const currentpage=Number(this.querystr.page) || 1;
        const skip=resperpage*(currentpage-1);
        this.query.limit(resperpage).skip(skip);
        return this
    }
}
module.exports=APIFeatures;