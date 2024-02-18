import db from '../models/index'

let handleClinic = (data)=>{
    return new Promise(async(resolve, reject) => {
        try{
            if(!data || !data.name || !data.address || !data.descriptionHTML || !data.descriptionMarkdown){
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                })
            }else{
                if(data.action === 'CREATE'){
                    // create
                    await db.Clinic.create({
                        name: data.name,
                        address: data.address,
                        image: data.urlImage,
                        descriptionHTML: data.descriptionHTML,
                        descriptionMarkdown: data.descriptionMarkdown
                    })
                    resolve({
                        errCode: 0,
                        errMessage:'ok'
                    })
                }else if(data.action === 'UPDATE'){
                    // update
                    let dataUpdate = await db.Clinic.findOne({
                        where:{ id: data.clinicId},
                        raw: false
                    })
                    if (dataUpdate){
                        dataUpdate.name =  data.name,
                        dataUpdate.address =  data.address,
                        dataUpdate.image =  data.urlImage,
                        dataUpdate.descriptionHTML =  data.descriptionHTML,
                        dataUpdate.descriptionMarkdown =  data.descriptionMarkdown
                        await dataUpdate.save()
                    }
                    resolve({
                        errCode: 0,
                        errMessage:'ok'
                    })
                }
            }
        }catch(err){
            console.log(err)
            reject(e)
        }
    })
}

let getAllClinic = ()=>{
    return new Promise(async(resolve, reject) => {
        try{
            let data = await db.Clinic.findAll({
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
        }catch(err){
            console.log(err)
            reject(e)
        }
    })
}

let getDetailClinicById = (inputId)=>{
    return new Promise (async(resolve, reject)=>{
        try{
            if(!inputId){
                resolve({
                    errCode: -1,
                    errMessage: 'Missing parameter'
            })
            }else{
                let data = await db.Clinic.findOne({
                    where:{
                        id: inputId
                    },
                    attributes:['name','address','descriptionHTML','descriptionMarkdown','image']
                })
                if(data){
                    // data.image = new Buffer(data.image, 'base64').toString('binary')
                    let doctorClinic = [];
                    doctorClinic = await db.Doctor_Info.findAll({
                        where: {
                            clinicId: inputId
                        },
                        attributes:['doctorId', 'provinceId']
                    })
                    data.doctorClinic = doctorClinic
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
            reject(e)
        }
    })
}

let deleteClinicById = (id)=>{
    return new Promise(async(resolve, reject)=>{
        try{
            if(!id){
                resolve({
                    errCode: -1,
                    errMessage: "The Clinic doesn't exist"
                })
            }else{
                let clinic = await db.Clinic.findOne({
                    where: {id: id},
                    raw: false
                })
                if(!clinic){
                    resolve({
                        errCode: -1,
                        errMessage: "The Clinic doesn't exist"
                    })
                }else{
                    await clinic.destroy();
                    resolve({
                        errCode: 0,
                        errMessage: "Delete user successfully!"
                    })
                }
            }
        }catch(e){
            console.log(e)
            reject(e)
        }
        
        
    })
}


module.exports ={
    handleClinic,
    getAllClinic,
    getDetailClinicById,
    deleteClinicById
}