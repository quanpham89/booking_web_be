import userService from '../services/userService'
let handleLogin  = async(req, res)=>{
    let email = req.body.email;
    let password = req.body.password;
    let userData = await userService.handleUserLogin(email, password)
    if(!email || !password) {
        return res.status(500).json({
            errcode: userData.errorCode,
            message: userData.errorMessage,
            userData
        })
    }
    return res.status(200).json({
        errcode: userData.errorCode,
        message: userData.errorMessage,
        user: userData.user? userData.user:{}
    })
}

let handleGetAllUsers = async(req, res)=>{
    let id = req.query.id; //All, SINGLE
    let users = await userService.getAllUsers(id);
    if(id){
        if(users){
            return res.status(200).json({
                errcode: 0,
                message: 'ok',
                users:users
            })
        }else{
            return res.status(200).json({
                errcode: 2,
                message: 'id not found',
                users:[]
            })
        }
    }else{
        return res.status(200).json({
            errcode: 1,
            message: 'missing required parameter ' ,
            users:[]
        })
    }
    
}

let handleCreateNewUser = async(req, res)=>{
    let message = await userService.createNewUser(req.body)
    return res.status(200).json(message) 
}


let handleEditUser =  async(req, res)=>{
        let data = req.body;
        let message = await userService.updateUserData(data);
        return res.status(200).json(message)
        
}

let handleDeleteUser =  async(req, res)=>{
    if(!req.body.id){
        return res.status(200).json({
            errcode: 1,
            message: 'Missing required parameter ',
        })
    }else{
        let message = await userService.deleteUser(req.body.id)
        return res.status(200).json(message) 

    }
}

let getAllCode = async (req, res)=>{
    try{
        let data = await userService.getAllCodeService(req.query.type)
        return res.status(200).json(data);
    
    }catch(err){
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server(database)'
        })
    }
}





module.exports = {
    handleLogin,
    handleGetAllUsers,
    handleCreateNewUser,
    handleEditUser,
    handleDeleteUser,
    getAllCode
}