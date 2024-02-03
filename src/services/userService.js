
import db from '../models/index';
import bcrypt  from 'bcryptjs';
const salt = bcrypt.genSaltSync(10);


let handleUserLogin = (email, password) =>{
    return new Promise(async(resolve, reject) =>{
        try{
            let userData = {}
            let isExist = await checkUserEmail(email)
            if(isExist){
                let user = await db.User.findOne({
                    where:{email: email},
                    attributes:['id','email','roleId','password','firstName','lastName'],
                    raw: true
                })

                if(user){
                    let check = await bcrypt.compareSync(password, user.password);
                    if(check){
                        userData.errorCode = 0;
                        userData.errorMessage ="Ok";
                        delete user.password;
                        userData.user = user;
                    }else{
                        userData.errorCode = 3;
                        userData.errorMessage ="The password isn't true. Please try again";
                    }

                }else{
                    userData.errorCode = 2;
                    userData.errorMessage ="User isn't found";
                }

            }else{
                userData.errorCode = 1;
                userData.errorMessage ="Your's email isn't exist in the system. Please try other email addresses"
            }
            resolve(userData)
        }catch(e){
            reject(e);
        }
    } )

}

let checkUserEmail = (userEmail)=>{
    return new Promise(async(resolve, reject) =>{
        try{
            let user = await db.User.findOne({
                where:{
                    email: userEmail
                }
            })
            if(user){
                resolve(true)
            }else{
                resolve(false)
            }
        }catch(e){
            reject(e);
        }

    })
}

let getAllUsers = (userId)=>{
    return new Promise(async(resolve, reject)=>{
        try{
            let users = '';
            if(userId ==='ALL'){
                users =  await db.User.findAll({
                    attributes:{
                        exclude: ['password']
                    }
                })
            }
            if( userId && userId !=='ALL'){
                users =  await db.User.findOne({
                    where: {id: userId},
                    attributes:{
                        exclude: ['password']
                    }
                })
            }
            resolve(users)

        }catch(e){
            reject(e);
        }
    })
}

let hashUserPassword = (password)=>{
    return new Promise(async (resolve, reject) =>{
        try{
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        }
        catch(e){
            reject(e);
        }
    })
}

let createNewUser = (data)=>{
    return new Promise(async(resolve, reject)=>{
        try{
            let check = await checkUserEmail(data.email) && data.password;
            if(check){
                resolve({
                    errCode:  1,
                    message: 'Email have been use, please use another email'
                })
            }else{
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    gender: data.gender,
                    roleId: data.role,
                    positionId: data.position,
                    image: data.avatar
                })
                resolve({
                    errCode:  0,
                    message: 'ok'
                })

            }

        }catch(e){
            reject(e)
        }
    })
}

let deleteUser= (id)=>{
    return new Promise(async(resolve, reject) => {
        let user = await db.User.findOne({
            where:{id},
            raw: false
        })
        if(!user){
            resolve({
                errorCode:2,
                message : "The user doesn't exist"
            })
        }else{
            // await db.User.destroy({
            //     where:{id},
            // })
            await user.destroy()
            resolve({
                errorCode: 0,
                message : "ok"
            })
        }
    })
}

let updateUserData =  (data)=>{
    return new Promise(async(resolve, reject) => {
        try{
            if(!data.id ||!data.role || !data.position || !data.gender){
                resolve({
                    errorCode: 2,
                    message: 'missing required'
                })
            }
            let user = await db.User.findOne({
            where:{id: data.id},
            raw: false
            })
            if(user){
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.phoneNumber = data.phoneNumber;
                user.gender = data.gender;
                user.roleId = data.role;
                user.positionId = data.position;
                if(data.avatar){
                    user.image = data.avatar
                }

                await user.save() 
                resolve({
                    errorCode: 0,
                    message: 'ok',
                    user
                })
            }else{
                resolve({
                    errorCode: 1,
                    message: 'User not found'
                })
            }

        }catch(e){
            console.log(e)
        }
    })
}

let getAllCodeService = (typeInput)=>{
    return new Promise(async(resolve, reject)=>{
        try{
            if(typeInput){
                let res = {};
                let allCode = await db.Allcode.findAll({
                    where:{type: typeInput}
                })
                res.errCode = 0;
                res.data = allCode;
                resolve(res)
            }else{
                resolve({
                    errorCode: 1,
                    message:'Missing require parameter'
                })
            }
        }catch(e){
            reject(e)
        }
    })
}

module.exports ={
    handleUserLogin,
    getAllUsers,
    createNewUser,
    deleteUser,
    updateUserData,
    getAllCodeService
}