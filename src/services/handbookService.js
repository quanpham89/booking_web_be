import db from '../models/index'
let handleHandbook = (data)=>{
    return new Promise(async(resolve,reject) =>{
        try{
            if(!data){
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameters"
                })
            }else{
                if(data.action === 'CREATE'){
                    await db.Handbook.create({
                        title: data.title,
                        descriptionMarkdown: data.descriptionMarkdown,
                        descriptionHTML: data.descriptionHTML,
                        author: data.author,
                        image: data.imgBase64,
                    })
                    resolve({
                        errCode: 0,
                        errMessage: "create successfully"
                    })
                }else if(data.action === 'UPDATE'){

                }
            }
        }catch(e){

        }
    })
}

let getAllHandbook = ()=>{
    return new Promise(async(resolve,reject)=>{
        let data = await db.Handbook.findAll()
        try{
            if(data && data.length > 0){
                data.map(item =>{
                    item.image = new Buffer(item.image, 'base64').toString('binary')
                    return item
                })
                resolve({
                    errCode: 0,
                    errMessage: 'ok',
                    data
                })
            }else{
                resolve({
                    errCode: 0,
                    errMessage: "Do not found any handbook"
                })
            }

        }catch(e){
            console.log(e)
            reject(e)
        }
    })
}

let getDetailHandbookById = (id)=>{
    return new Promise(async(resolve, reject)=>{
        try{
            if(!id){
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter: id"
                })
            }else{
                let data = await db.Handbook.findOne({
                    where: {id: id},
                    attributes:{
                        exclude: ["image"]
                    }
                })
                if(data){
                    resolve({
                        errCode: 0,
                        errMessage:'ok',
                        data
                    })
                }else{
                    resolve({
                        errCode: 0,
                        errMessage: "Do not found any handbook"
                    })
                }
            }

        }catch(e){
            console.log(e)
            reject(e)
        }
    })
}
module.exports = {
    handleHandbook,
    getAllHandbook,
    getDetailHandbookById
}