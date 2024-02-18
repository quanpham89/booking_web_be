import db from '../models/index';
let handleSpecialty = (data)=>{
    return new Promise (async(resolve, reject)=>{
        try{
            if(!data.name || !data.descriptionHTML || !data.descriptionMarkdown){
                resolve({
                    errCode: -1,
                    errMessage: 'Missing parameter'
                })
            }else{
                if(data.action ==="CREATE"){
                    await db.Specialty.create({
                        name: data.name,
                        image: data.urlImage,
                        descriptionHTML: data.descriptionHTML,
                        descriptionMarkdown: data.descriptionMarkdown
                    })
                    resolve({
                        errCode: 0,
                        errMessage:'ok'
                    })
                }else{
                    if(data.action ==="UPDATE"){
                        let updateSpecialty = await db.Specialty.findOne({
                            where: {id: data.specialtyId},
                            raw: false,
                        })
                        if(updateSpecialty){
                            updateSpecialty.name =  data.name,
                            updateSpecialty.address =  data.address,
                            updateSpecialty.image =  data.urlImage,
                            updateSpecialty.descriptionHTML =  data.descriptionHTML,
                            updateSpecialty.descriptionMarkdown =  data.descriptionMarkdown
                        }
                        await updateSpecialty.save()
                        resolve({
                            errCode: 0,
                            errMessage:'save success'
                        })
                    }
                }
            }
        }catch(e){
            reject(e);
        }
    })
}

let getAllSpecialty = ()=>{
    return new Promise (async(resolve, reject)=>{
        try{
            let data = await db.Specialty.findAll({
                attributes:{
                    exclude: ['createdAt','updatedAt']
                },
            })
            // if(data && data.length >0){
            //     data.map(item =>{
            //         item.image = new Buffer(item.image, 'base64').toString('binary')
            //         return item
            //     })
            // }
            resolve({
                errCode: 0,
                errMessage:'ok',
                data: data
            })
            
        }catch(e){
            reject(e);
        }
    })
}

let getDetailSpecialtyById = (inputId, location)=>{
    return new Promise (async(resolve, reject)=>{
        try{
            if(!inputId || !location){
                resolve({
                    errCode: -1,
                    errMessage: 'Missing parameter'
            })
            }else{
                let data = await db.Specialty.findOne({
                    where:{
                        id: inputId
                    },
                    attributes:['name','descriptionHTML','descriptionMarkdown','image']
                })
                if(data){
                    let doctorSpecialty = [];
                    // data.imageBase64 = data.image
                    // data.image = new Buffer(data.image, 'base64').toString('binary')
                    if(location ==='ALL'){
                        doctorSpecialty = await db.Doctor_Info.findAll({
                            where: {
                                SpecialtyId: inputId
                            },
                            attributes:['doctorId', 'provinceId']
                        })
                    }
                    else{
                        doctorSpecialty = await db.Doctor_Info.findAll({
                            where: {
                                SpecialtyId: inputId,
                                provinceId: location 
                            },
                            attributes:['doctorId', 'provinceId']
                        })
                    }
                    data.doctorSpecialty = doctorSpecialty
                }else{
                    data = {}
                }
                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                    data
                })

            }
            
            
        }catch(e){
            reject(e);
        }
    })
}

let deleteSpecialById = (id)=>{
    return new Promise(async(resolve, reject)=>{
        try{
            if(!id){
                resolve({
                    errCode: -1,
                    errMessage: "Missing parameter"
                })
            }else{
                let data = await db.Specialty.findOne({
                    where:{id: id},
                    raw: false
                })
                if(!data){
                    resolve({
                        errCode: -1,
                        errMessage:'Can not find the specialty'
                    })
                }else{
                    await data.destroy();
                    resolve({
                        errCode: 0,
                        errMessage:'Delete successfully!'
                    })
                }

            }

        }catch(e){
            reject(e)
        }
    })

}

module.exports ={
    handleSpecialty,
    getAllSpecialty,
    getDetailSpecialtyById,
    deleteSpecialById
}