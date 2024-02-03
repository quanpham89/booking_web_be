import db from '../models/index';
require('dotenv').config()
import _ from 'lodash';
import  emailService  from './emailService';
import {v4 as uuidv4} from'uuid'
let buildUrlEmail = (doctorId,token)=>{
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result 
}
let postBookAppointment =(data)=>{
    return new Promise(async(resolve, reject)=>{
        try{
            if(!data.email || !data.doctorId || !data.timeType || 
                !data.date || !data.name || !data.selectedGender || !data.address
                ){
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            }else{
                let token = uuidv4();
                await emailService.sendSimpleEmail({
                    receiverEmail: data.email,
                    patientName: data.name,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    address:data.address,
                    language: data.language,
                    reason: data.reason,
                    sex: data.selectedGender,
                    hrefLink: buildUrlEmail(data.doctorId, token)
                })
                let user = await db.User.findOrCreate({
                    where:{email: data.email},
                    defaults:{
                        email: data.email,
                        roleId: 'R3',
                        gender: data.selectedGender,
                        address: data.address,
                        firstName: data.name,
                        // reason: data.reason,
                        // sex: data.selectedGender,
                    }
                })
                // create a booking record
                if(user && user[0]){
                    await db.Booking.findOrCreate({
                        where:{patientId: user[0].id},
                        defaults:{
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            reason: data.reason,
                            // sex: data.selectedGender,
                            timeType: data.timeType,
                            token: token
                        }

                    })
                }
                resolve({
                    errCode: 0,
                    errMessage:'Ok',
                })
            }
        }catch(e){
            console.log(e)
        }
    })
}

let postVerifyBookAppointment = (data)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            if(!data.token || !data.doctorId){
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            }else{
                let appointment = await db.Booking.findOne({
                    where:{
                        doctorId: Number(data.doctorId),
                        token: data.token,
                        statusId:'S1'
                    },
                    raw: false 
                }) 
                if(appointment){
                    appointment.statusId = 'S2'
                    await appointment.save()
                    resolve({
                        errCode: 0,
                        errMessage:"Confirmed "
                    })
                }else{
                    resolve({
                        errCode: 2,
                        errMessage:"Appointment was active or not exist",
                    })
                }
            }
        }catch(e){
            console.log(e)
        }
    })
}



module.exports = {
    postBookAppointment,
    postVerifyBookAppointment
}