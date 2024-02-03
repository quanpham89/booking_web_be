import clinicService from '../services/clinicService'
let handleClinic = async(req, res)=>{
    try{
        let info = await clinicService.handleClinic(req.body)
        return res.status(200).json(info)
    }catch(err){
        console.log(err)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        })
    }
}

let getAllClinic = async(req, res)=>{
    try{
        let info = await clinicService.getAllClinic()
        return res.status(200).json(info)
    }catch(err){
        console.log(err)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        })
    }
}

let getDetailClinicById = async(req, res)=>{
    try{
        let info = await clinicService.getDetailClinicById(req.query.id)
        return res.status(200).json(info)
    }catch(err){
        console.log(err)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        })
    }
}

let deleteClinicById = async(req, res)=>{
    try{
        let response = await clinicService.deleteClinicById(req.query.id)
        return res.status(200).json(response)
    }catch(err){
        console.log(err)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        })

    }
}
module.exports ={
    handleClinic,
    getAllClinic,
    getDetailClinicById,
    deleteClinicById
}