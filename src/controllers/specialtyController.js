import specialtyService from '../services/specialtyService'
let handleSpecialty = async(req, res)=>{
    try{
        let info = await specialtyService.handleSpecialty(req.body)
        return res.status(200).json(info)
    }catch(e){
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'error from server'
        })
    }
}

let getAllSpecialty = async(req, res)=>{
    try{
        let info = await specialtyService.getAllSpecialty()
        return res.status(200).json(info)
    }catch(e){
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'error from server'
        })
    }
}
let getDetailSpecialtyById = async(req, res)=>{
    try{
        let info = await specialtyService.getDetailSpecialtyById(req.query.id, req.query.location)
        return res.status(200).json(info)
    }catch(e){
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'error from server'
        })
    }
}
let deleteSpecialById = async(req, res)=>{
    try{
        let response = await specialtyService.deleteSpecialById(req.query.id)
            return res.status(200).json(response)
        
    }catch(e){
        console.log(e)
        return res.status.json({
            errCode:-1,
            errMessage: "Error from server"
        })
    }
}



module.exports ={
    handleSpecialty,
    getAllSpecialty,
    getDetailSpecialtyById,
    deleteSpecialById
}