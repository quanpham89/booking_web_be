import db from '../models/index';
import emailService from'./emailService'
require('dotenv').config()
import _, { first } from 'lodash';
const MAX_NUMBER_SCHEDULE  = process.env.MAX_NUMBER_SCHEDULE;
let getTopDoctor = (limit)=>{
    return new Promise(async(resolve, reject) =>{
        try{
            let users = await db.User.findAll({
                limit: limit,
                order: [['createdAt', 'DESC']],
                attributes:{
                    exclude: ['password']
                },
                where:{
                    roleId: 'R2'
                },
                include: [
                    {model: db.Allcode, as:'positionData', attributes:['valueEn','valueVi']},
                    {model: db.Allcode, as:'genderData', attributes:['valueEn','valueVi']}

                ],
                raw: true,
                nest: true
            })
            resolve({
                errCode: 0,
                data: users
            })
        }catch(e){
            reject(e)
        }
    })
}

let getAllDoctors = ()=>{
    return new Promise(async(resolve, reject)=>{
        try{
            let doctors = await db.User.findAll({
                where: {roleId: 'R2'},
                attributes:{
                    exclude: ['password','image']
                },
            })
            resolve({
                errCode: 0,
                data: doctors
            })
        }catch(err){
            reject(err)
        }
    })
}

let checkDataSendFromClient = (inputData) =>{
    let arrField = [ 'doctorId', 'contentHTML', 'contentMarkdown', 'action',
    'selectedPrice', 'selectedProvince', 'nameClinic', 'selectedPayment',
    'specialtyId','clinicId', 'note']
    let element = ""
    let check = true
    for(let i =0;i<arrField.length;i++){
        if(!inputData[arrField[i]]){
            element = arrField[i];
            check = false;
            break;
        }
    }
    return {
        element,
        check
    }
}

let saveInfoDoctor = (inputData)=>{
    return new Promise(async(resolve, reject)=>{
        try{
            let checkInfo = checkDataSendFromClient(inputData);
            if(checkInfo.check === false){
                resolve({
                    errCode: 1,
                    errMessage: `Missing parameter: ${checkInfo.element}`,
                })
            }else{
                // markdown
                // doctor info
                let doctorInfo = await db.DoctorInfo.findOne({
                    where: {doctorId: inputData.doctorId},
                    raw: false
                })
                if(inputData.action === 'CREATE'){
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId
                    })
                    await db.DoctorInfo.create({
                        doctorId: inputData.doctorId,
                        priceId :  inputData.selectedPrice,
                        provinceId :  inputData.selectedProvince,
                        paymentId :  inputData.selectedPayment,
                        nameClinic :  inputData.nameClinic,
                        addressClinic :  inputData.addClinic,
                        note :  inputData.note,
                        specialtyId : inputData.specialtyId,
                        clinicId: inputData.clinicId
                        })
                }else if (inputData.action ==='EDIT'){
                    let doctorMarkdown =  await db.Markdown.findOne({
                        where: {doctorId: inputData.doctorId},
                        raw: false
                    })
                    if(doctorMarkdown){
                        doctorMarkdown.contentHTML =  inputData.contentHTML,
                        doctorMarkdown.contentMarkdown =  inputData.contentMarkdown,
                        doctorMarkdown.description =  inputData.description,
                        doctorMarkdown.updateAt = new Date(),
                        await doctorMarkdown.save()
                    }
                
                    if(doctorInfo){
                        doctorInfo.priceId =  inputData.selectedPrice,
                        doctorInfo.provinceId =  inputData.selectedProvince,
                        doctorInfo.paymentId =  inputData.selectedPayment,
                        doctorInfo.nameClinic =  inputData.nameClinic,
                        doctorInfo.addressClinic =  inputData.addClinic,
                        doctorInfo.note =  inputData.note,
                        doctorInfo.specialtyId = inputData.specialtyId,
                        doctorInfo.clinicId = inputData.clinicId

                        await doctorInfo.save()
                    }
                }
                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
                
            }
        }catch(err){
            reject(err)
        }
    })
}

let getInfoDoctorById = (inputId)=>{
    return new Promise(async(resolve, reject)=>{
        try{
            if(!inputId){
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            }else{
                let data = await db.User.findOne({
                    where: {id: inputId},
                    attributes:{
                        exclude: ['password']
                    },
                    include: [
                        {model: db.Markdown, 
                            attributes: ['description', 'contentHTML','contentMarkdown']
                        },
                        {model: db.Allcode, as:'positionData', attributes:['valueEn','valueVi']},
                        {model: db.DoctorInfo,
                            attributes:{
                                exclude:['id','doctorId'],
                            },
                            include: [
                                {model: db.Allcode, as:'priceTypeData', attributes:['valueEn','valueVi']},
                                {model: db.Allcode, as:'provinceTypeData', attributes:['valueEn','valueVi']},
                                {model: db.Allcode, as:'paymentTypeData', attributes:['valueEn','valueVi']},
                            ]
                        },
    
                    ],
                    raw: true,
                    nest: true
                    }
                ) 
                // if( data && data.image ){
                //     data.image = new Buffer(data.image,'base64').toString('binary')
                // }else{
                //     data = {}
                // }
                if(!data.Markdown.contentHTML || !data.Markdown.contentMarkdown || !data.Markdown.description){
                    data.Markdown.contentHTML = 1,
                    data.Markdown.contentMarkdown = 1,
                    data.Markdown.description = 1
                }

                resolve({
                    errCode: 0,
                    data
                })
            }

        
        }catch(err){
            reject(err)
        }
    })
}

let bulkCreateScheduleInfo = (data)=>{
    return new Promise(async(resolve, reject)=>{
        try{
            if(!data.arrSchedule || !data.doctorId || !data.formattedDate){ 
                resolve({
                    errCode: 1,
                    errMessage: 'Missing schedule information'
                })
            }else{
                let schedule = data.arrSchedule;
                if(schedule && schedule.length > 0){
                    schedule = schedule.map(item =>{
                        item.maxNumber = MAX_NUMBER_SCHEDULE
                        return item
                    });
                }
                let existing = await db.Schedule.findAll({
                    where: {doctorId: data.doctorId, date: data.formattedDate },
                    attributes:['timeType', 'date','doctorId', 'maxNumber', 'dateStyle' ],
                    raw: true,
                })
                if(existing && existing.length>0){
                    existing = existing.map(item =>{
                        item.date = new Date(item.date).getTime();
                        return item
                    })
                }

                let toCreate = _.differenceWith(schedule, existing, (a,b)=>{
                    return a.timeType === b.timeType && a.date === b.date && +a.dateStyle === +b.dateStyle
                })
                if(toCreate && toCreate.length > 0){
                    await db.Schedule.bulkCreate(toCreate)
                    
                }
                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }
        }catch(err){
            reject(err)
        }
    })
}

let getScheduleByDate = (doctorId, dateStyle)=>{
    return new Promise(async(resolve, reject)=>{
        try{
            if(!doctorId|| !dateStyle){
                resolve({
                    errCode: 1,
                    errMessage:'Missing required parameter'
                })
            }else{
                let dataSchedule = await db.Schedule.findAll({
                    where:{
                        doctorId: doctorId,
                        dateStyle: dateStyle
                    },
                    include: [
                        {model: db.Allcode, as:'timeTypeData', attributes:['valueEn','valueVi']},

                    ],

                    raw: true,
                    nest: true
                })
                if(!dataSchedule){
                    dataSchedule = []
                }
                resolve({
                    errCode: 0,
                    data: dataSchedule
                })
            }
            

        
        }catch(err){
            reject(err)
        }
    })
}

let getScheduleForDoctor = (id,dateStyle) =>{
    return new Promise(async(resolve, reject)=>{
        try{
            if(!id){
                resolve({
                    errCode: -1,
                    errMessage: "Invalid Id, please check again !"
                })
            }else{
                let data = await db.Schedule.findAll({
                    where: {
                        doctorId: id,
                        dateStyle 
                    },
                    attributes:{
                        exclude:['createdAt','updatedAt', "currentNumber","maxNumber","id"],
                    },
                    include: [
                        {model: db.Allcode, as:'timeTypeData', attributes:['valueVi']},
                    ],
                    raw: true,
                    nest: true
                })
                resolve({
                    errCode: 0,
                    data: data
                })
                
            }
        }catch(err){
            reject(err)
        }
    })
}


let getExtraInfoDoctorById = (inputDoctorId)=>{
    return new Promise(async(resolve, reject)=>{
        try{
            if(!inputDoctorId){
                resolve({
                    errCode: 1,
                    errMessage:'Missing required parameter'
                })
            }else{
                let data = await db.DoctorInfo.findOne({
                    where: {doctorId: inputDoctorId},
                    attributes:{
                        exclude:['id','doctorId'],
                    },
                    include: [
                        {model: db.Allcode, as:'priceTypeData', attributes:['valueEn','valueVi']},
                        {model: db.Allcode, as:'provinceTypeData', attributes:['valueEn','valueVi']},
                        {model: db.Allcode, as:'paymentTypeData', attributes:['valueEn','valueVi']},
                    ],
                    raw: false,
                    nest: true

                })
                if(!data){
                    data = {}
                }else{
                    resolve({
                        errCode: 0,
                        data
                    })

                }
                
                
            }
        }catch(err){
            reject(err)
        }
    })
}

let getProfileDoctorById = (doctorId)=>{
    return new Promise(async(resolve, reject)=>{
        try{
            if(!doctorId){
                resolve({
                    errCode: 1,
                    errMessage:'Missing required parameter'
                })
            }else{
                let data = await db.User.findOne({
                    where: {id: doctorId},
                    attributes:{
                        exclude: ['password']
                    },
                    include: [

                        {model: db.Allcode, as:'positionData', attributes:['valueEn','valueVi']},
                        {model: db.Markdown, 
                            attributes: ['description', 'contentHTML','contentMarkdown']
                        },
                        {model: db.DoctorInfo,
                            attributes:{
                                exclude:['id','doctorId'],
                            },
                            include: [
                                {model: db.Allcode, as:'priceTypeData', attributes:['valueEn','valueVi']},
                                {model: db.Allcode, as:'provinceTypeData', attributes:['valueEn','valueVi']},
                                {model: db.Allcode, as:'paymentTypeData', attributes:['valueEn','valueVi']},
                            ]
                        },
    
                    ],
                    raw: true,
                    nest: true
                    }
                ) 
                // if( data && data.image ){
                //     data.image = new Buffer(data.image,'base64').toString('binary')
                // }else{
                //     data = {}
                // }
                resolve({
                    errCode: 0,
                    data
                })
            }
        }catch(err){
            reject(err)
        }
    })
}

let getListPatientForDoctor = (doctorId, date)=>{
    return new Promise(async(resolve, reject)=>{
        try{
            if(!doctorId|| !date){
                resolve({
                    errCode: 1,
                    errMessage:'Missing required parameter'
                })
            }else{
                let data = await db.Booking.findAll({
                    where:{
                        statusId: 'S2',
                        doctorId: doctorId,
                        date: date
                    },
                    attributes:{
                        exclude: ['createdAt', 'updatedAt']
                    },
                    include: [
                        {model: db.User, as: 'patientData',
                            attributes:['email', 'firstName','lastName', 'address', 'gender'],
                            include: [
                                {model: db.Allcode, as:'genderData', attributes:['valueEn','valueVi']},
                                
                            ]
                        },
                        {model: db.Allcode, as:'timeTypeDataPatient', attributes:['valueEn','valueVi']},
                    ],
                    
                    raw: false,
                    nest: true
                })   
                resolve({
                    errCode: 0,
                    data: data
                })
            }
            

        
        }catch(err){
            reject(err)
        }
    })
}
let sendRemedy = (data)=>{
    return new Promise(async(resolve, reject)=>{
        try{
            if(!data.email || !data.doctorId || !data.patientId){
                resolve({
                    errCode: 1,
                    errMessage:'Missing required parameter'
                })
            }else{
                // update patient status
                let appointment = await db.Booking.findOne({
                    where:{
                        doctorId: data.doctorId, 
                        patientId: data.patientId,
                        timeType: data.timeType,
                        statusId: 'S2'

                    },
                    raw: false
                })
                if(appointment){
                    appointment.statusId = 'S3'
                    await appointment.save()
                }
                // send email
                await emailService.sendEmailAttachment(data)
                resolve({
                    errCode: 0,
                    errMessage: 'Ok' 
                })
            }
            

        
        }catch(err){
            reject(err)
        }
    })
}



module.exports = {
    getTopDoctor,
    getAllDoctors,
    saveInfoDoctor,
    getInfoDoctorById,
    bulkCreateScheduleInfo,
    getScheduleByDate,
    getScheduleForDoctor,
    getExtraInfoDoctorById,
    getProfileDoctorById,
    getListPatientForDoctor,
    sendRemedy
}