import doctorService from '../services/doctorService'
let getTopDoctorHome = async(req, res)=>{
    let limit = req.query.limit
    if(!limit){
        limit = 10
    }
    try{
        let response = await doctorService.getTopDoctor(+limit)
        return res.status(200).json(response)

    }catch(err){
        console.log(err)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        })
    }
}

let getAllDoctors = async(req, res)=>{
    try{
        let doctors = await doctorService.getAllDoctors();
        return res.status(200).json(doctors)
    } catch(err){
        console.log(err)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        
        })
    }
}

let postInfoDoctor = async(req, res)=>{
    try{
        let response = await doctorService.saveInfoDoctor(req.body);
        return res.status(200).json(response)
    } catch(err){
        console.log(err)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        
        })
    }
}

let getDetailDoctorById = async(req, res)=>{
    try{
        if(!req.query.id){
            return res.status(200).json({
                errCode: 2,
                errMessage: 'Missing id'
            
            })
        }else{
            let info = await doctorService.getInfoDoctorById(req.query.id);
            return res.status(200).json(info)
        }
    } catch(err){
        console.log(err)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        
        })
    }
}

let bulkCreateSchedule = async(req, res)=>{
    try{
        let info = await doctorService.bulkCreateScheduleInfo(req.body) 
        return res.status(200).json(info)
    } catch(err){
        console.log(err)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        
        })
    }
}

let getScheduleByDate = async(req, res)=>{
    try{
        let info = await doctorService.getScheduleByDate(req.query.doctorId, req.query.dateStyle) 
        return res.status(200).json(info)
    } catch(err){
        console.log(err)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        
        })
    }
}

let getScheduleForDoctor = async(req, res)=>{
    try{
        let data = await doctorService.getScheduleForDoctor(req.query.doctorId, req.query.dateStyle)
        return res.status(200).json(data)

    }catch(e){
        console.log(err)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

let getExtraInfoDoctorById = async(req, res)=>{
    try{
        let info = await doctorService.getExtraInfoDoctorById(req.query.doctorId) 
        console.log(req.query)
        return res.status(200).json(info)
    } catch(err){
        console.log(err)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        
        })
    }
}

let getProfileDoctorById = async(req, res)=>{
    try{
        let info = await doctorService.getProfileDoctorById(req.query.doctorId) 
        return res.status(200).json(info)
    } catch(err){
        console.log(err)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        
        })
    }
}

let getListPatientForDoctor = async(req, res)=>{
    try{
        let info = await doctorService.getListPatientForDoctor(req.query.doctorId, req.query.date) 
        return res.status(200).json(info)
    } catch(err){
        console.log(err)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        
        })
    }
}

let sendRemedy = async(req, res)=>{
    try{
        let info = await doctorService.sendRemedy(req.body) 
        return res.status(200).json(info)
    } catch(err){
        console.log(err)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        
        })
    }
}
module.exports = {
    getTopDoctorHome,
    getAllDoctors,
    postInfoDoctor,
    getDetailDoctorById,
    bulkCreateSchedule,
    getScheduleByDate,
    getScheduleForDoctor,
    getExtraInfoDoctorById,
    getProfileDoctorById,
    getListPatientForDoctor,
    sendRemedy
}