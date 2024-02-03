
import db from '../models/index'
import CRUDService from'../services/CRUDService'
let getHomePage =  async(req, res)=>{
    try{
        let data = await db.User.findAll();
        // trong viewsEngine setup tat ca cac file render se choc thang vao ./src/views
        return res.render('homepage.ejs', {
            data : JSON.stringify(data)
        });

    }catch(e){
        console.log(e)
    }
}

let getCRUD =  (req, res)=>{
    // trong viewsEngine setup tat ca cac file render se choc thang vao ./src/views
    return res.render('crud.ejs');
    
}

let postCRUD =  async(req, res)=>{
    let message = await CRUDService.createNewUser(req.body)
    return res.render('crud.ejs');
}

// render user in displayCRUD 
let displayCRUD = async(req, res)=>{
    let data = await CRUDService.getAllUsers();
    return res.render('displayCRUD.ejs',{
        dataTable: data
    });
}

// edit user
let editCRUD = async(req, res)=>{
    let userId = req.query.id
    if(userId){
        let userData = await CRUDService.getUserInfoById(userId);
        return res.render('editCRUD.ejs',{
            userData: userData
        })
    }
    else{
        return res.send('User not found! ')
    }
}

let putCRUD = async(req, res)=>{
    let data = req.body;
    await CRUDService.updateUserData(data);
    return res.redirect('/get-crud');
}

let deleteCRUD =  async(req, res)=>{
    let id = req.query.id;
    await CRUDService.deleteUserById(id);
    if(id){
        return res.redirect('/get-crud');
    }else{
        res.send('User not found!!!')
    }
}

module.exports = {
    getHomePage,
    getCRUD,
    postCRUD ,
    displayCRUD,
    editCRUD,
    putCRUD,
    deleteCRUD
}