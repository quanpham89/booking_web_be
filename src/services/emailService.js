require('dotenv').config()
const nodemailer = require("nodemailer");
let sendSimpleEmail = async(dataSend)=>{
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: process.env.EMAIL_APP,
        pass: process.env.EMAIL_APP_PASSWORD,
        }
    });

    const info = await transporter.sendMail({
        from: '"binhminhtran" <binhminhtran88889999@gmail.com>', // sender address
        to: dataSend.receiverEmail, // list  of receivers
        subject: " Thông tin đặt lịch khám bệnh", // Subject line
        html: getBodyHTMLEmails(dataSend)

    });

}
let getBodyHTMLEmails = (dataSend) =>{
    let result = ''
    if(dataSend.language === 'en'){
        result = 
        `
        <h3>Dear, ${dataSend.patientName}</h3>
        <p>You received this email because you booked an online appointment with: ${dataSend.doctorName} on Booking Web website </p>
        <p>Information about appointment:</p>
        <div>
            <b>Sex: ${dataSend.sex}</b>
            <p>F - Female</p>
            <p>M - Male</p>
            <p>O - Other</p>
        </div>
        <div>
            <b>Time: ${dataSend.time}</b>
        </div>
        <div>
            <b>Reason: ${dataSend.reason}</b>
        </div>

        <div>
            <b>Adress: ${dataSend.address}</b>      
        </div>
        <div>
            <p>If the information is true, please confirm by click into this link</p>  
        </div>

        <div>
            <a href=${dataSend.hrefLink} target="_blank">Confirm</a>
        </div>
        <div>
            <p >Sincerely thank!</p>
        </div>
        `
    }
    if(dataSend.language === 'vi'){
        result = 
        `
        <h3>Xin chào, ${dataSend.patientName}</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám online trên website Booking Web</p>
        <p>Thông tin lịch khám:</p>
        <div>
            <b>Giới tính: ${dataSend.sex}</b>
            <p>F - Nữ</p>
            <p>M - Nam</p>
            <p>O - Khác</p>
        </div>
        <div>
            <b>Thời gian: ${dataSend.time}</b>
        </div>
        <div>
            <b>Lý do: ${dataSend.reason}</b>
        </div>
        <div>
            <b>Tên bác sĩ: ${dataSend.doctorName}</b>
        </div>
        <div>
            <b>Địa chỉ phòng khám: ${dataSend.address}</b>      
        </div>
        <div>
            <p>Nếu thông tin đúng, vui lòng nhấn vào đường link sau để xác nhận.</p>  
        </div>

        <div>
            <a href=${dataSend.hrefLink} target="_blank">Xác nhận</a>
        </div>
        <div>
            <p >Xin chân thành cảm ơn!</p>
        </div>
        `
        
    }
    return result
}
let sendEmailAttachment = async(dataSend)=>{
    return new Promise(async(resolve, reject) => {
        try{
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth: {
                  // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                user: process.env.EMAIL_APP,
                pass: process.env.EMAIL_APP_PASSWORD,
                }
            });
        
            const info = await transporter.sendMail({
                from: '"binhminhtran" <binhminhtran88889999@gmail.com>', // sender address
                to: dataSend.email, // list  of receivers
                subject: "Kết quả đặt lịch khám bệnh", // Subject line
                attachments: [
                    {
                        filename: `remedy/bill-${dataSend.patientName}-${dataSend.patientId}.png`,
                        content: dataSend.imgBase64.split("base64,")[1], //
                        encoding: 'base64'
                    }
                ],
                html: getBodyHTMLEmailsRemedy(dataSend)
        
            }); 
            resolve()
        }catch(e){
            console.log(e)
        }

    })
}

let getBodyHTMLEmailsRemedy = (dataSend) =>{
    let result = ''
    if(dataSend.language === 'en'){
        result = 
        `
        <h3>Dear, ${dataSend.patientName ? dataSend.patientName : 'Name' }</h3>
        <p>Information about remedy/bill was sent in this file :</p>
        <div>
            lalalalala
        </div>
        <div>
            <p>Please do not response this email!</p>
            <p >Sincerely thank!</p>
        </div>
        `
    }
    if(dataSend.language === 'vi'){
        result = 
        `
        <h3>Xin chào, ${dataSend.patientName ?dataSend.patientName : 'Name' }</h3>
        <p>Thông tin hoá đơn/đơn thuốc được gửi trong file đính kèm:</p>
        </div>
                bla bla bla
        <div>
            <p>Vui lòng không phản hồi lại email này!</p>
            <p >Xin chân thành cảm ơn!</p>
        </div>
        `
        
    }
    return result
}
module.exports ={
    sendSimpleEmail,
    sendEmailAttachment
}