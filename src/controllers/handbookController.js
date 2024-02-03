import handbookService from '../services/handbookService'
let handleHandbook = async(req, res)=>{
    try{
        let data  =await handbookService.handleHandbook(req.body)
        return res.status(200).json(data)

    }catch(e){
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let getAllHandbook = async(req, res)=>{
    try{
        let data =await handbookService.getAllHandbook()
        return res.status(200).json(data)

    }catch(e){
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}

let getDetailHandbookById = async(req, res)=>{
    try{
        let data = await handbookService.getDetailHandbookById(req.query.id)
        return res.status(200).json(data)

    }catch(e){
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}
module.exports = {
    handleHandbook,
    getAllHandbook,
    getDetailHandbookById
}