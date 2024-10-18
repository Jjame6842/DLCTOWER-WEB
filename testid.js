const express = require('express')
const mysql = require('mysql2');
const path = require('path');
const bodyparser = require('body-parser');
const cookieHandmade = require('./cookie_hd');

let user_cookie = '';
let unlock = false;

const port = 3002;


const app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));



const regis_path = path.join(__dirname,'html','register.html')
const login_path = path.join(__dirname,'html','login.html')
const home_path = path.join(__dirname,'html','home.html')
const comment_path = path.join(__dirname,'html','comment.html')
const leaderboard_path = path.join(__dirname,'html','leaderboard.html')



const connection = mysql.createConnection({
    host :'localhost',
    user:'root',
    password:'',
    database:'user_info'
});

connection.connect((err)=>{
    if(err){
        console.log("error",err)
        return;
    }
    console.log("success");
})

const queryDB = (sql) => {
    return new Promise((resolve,reject) => {
        connection.query(sql, (err,result, fields) => {
            if (err) reject(err);
            else
                resolve(result)
        })
    })
}

const multer = require('multer');
const { stringify } = require('querystring');
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'html/img/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });

const imageFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

//middleware

function randomnumber(){
    let eigth_random = Math.floor((Math.random()*100000000));
    //console.log(eigth_random);
    return eigth_random;
}




//เริ่ม
app.get('/',(req,res) => {
    let check_cookie = cookieHandmade.get_cookie(user_cookie);
    console.log('ck',check_cookie);
    if (user_cookie != null && check_cookie == true) {
        unlock = true;
        res.redirect('/home.html');
        console.log('ul',unlock);
    }
    else res.redirect('/login.html');
    console.log('ul',unlock);
});




//ส่งเพจ
app.get('/login.html', (req, res) => {
    if (unlock == true){
        res.redirect('/home.html');
    }
    else res.sendFile(login_path);
});

app.get('/register.html', (req, res) => {
    if (unlock == true){
        res.redirect('/home.html');
    }
    else res.sendFile(regis_path);
});

app.get('/home.html', (req, res) => {
    if (unlock == true){
    res.sendFile(home_path);
    }
    else res.redirect('/login.html');
    
});

app.get('/comment.html',(req,res)=>{
    if (unlock == true){
    app.use(express.static('html'));
    res.sendFile(comment_path);
    }
    else res.redirect('/');
})

app.get('/leaderboard.html', (req, res) => {
    if (unlock == true){
    app.use(express.static('html'));
    res.sendFile(leaderboard_path);
    }
    else res.redirect('/');
});

app.post('/register', async (req, res) => {
    const { email, username, password1, password2, displayname } = req.body;

    //email ซ้ำ
    const dbemail = `select * from users where email = "${email}"`;
    const existing_email = await queryDB(dbemail);
    if (existing_email.length > 0) {
        console.log("ใช้แล้วไปกรอกใหม่");
        return res.redirect('/register.html');
    }
    //username ซ้ำ
    const dbusername = `select * from users where username = "${username}"`;
    const existing_username = await queryDB(dbusername);
    if (existing_username.length > 0) {
        console.log("ใช้แล้วไปกรอกใหม่");
        return res.redirect('/register.html');
    }
    //passwordไม่ตรงกัน
    if (password1!=password2){
        console.log("ไม่ตรงไปกรอกใหม่");
        return res.redirect('/register.html');
    }
    //ชื่อเล่นว่างนะ
    if (displayname == ''){
        console.log("ว่างเกินไปกรอกใหม่");
        return res.redirect('/register.html');
    }
    const insert_info = `insert into users (username,password,email,displayname) values ("${username}", "${password1}", "${email}", "${displayname}")`;
    await queryDB(insert_info);

    console.log("เสร็จละไปเล่นได้");
    return res.redirect('/login.html');
});

app.post('/login',async (req,res)=>{
    const {username, password } = req.body;

    const sql = `select * from users where username = "${username}"`;
    const result = await queryDB(sql);
    const user = result[0];

    if (user && user.password === password) {
        let n_random = randomnumber();

        const set_cookie = `UPDATE users SET cookiehandmade = "${n_random}" WHERE username = "${user.username}"`;
        await queryDB(set_cookie);

        user_cookie = n_random;

        cookieHandmade.add_cookie(n_random);
        res.redirect('/');
    } else {
        // ถ้าชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง
        res.redirect('/login.html');
    }
})

app.get('/ok',async(req,res)=>{
    console.log('ok');
})

app.post('/home.html',async(req,res)=>{

})

app.get('/logout',async(req,res)=>{
    const sql = `select * from users where cookiehandmade = "${user_cookie}"`;
    const result = await queryDB(sql);
    const user = result[0];
    cookieHandmade.remove_cookie(user_cookie);

    user_cookie = null;

    const set_cookie = `UPDATE users SET cookiehandmade = "${user_cookie}" WHERE username = "${user.username}"`;
    await queryDB(set_cookie);
    
    console.log('logout');
    unlock = false;
    res.redirect('/');
})


app.post('/profilepic', multer({ storage: storage, fileFilter: imageFilter }).single('avatar'), async (req, res) => {
        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        } else if (!req.file) {
            return res.send('Please select an image to upload');
        }
        const sql = `select * from users where cookiehandmade = "${user_cookie}"`;
        const result = await queryDB(sql);
        const user = result[0];
        console.log('You uploaded this image filename: ' + req.file.filename);

        const img_file = req.file.filename;
        await updateImg(user.username, img_file);

        const updateImgQuery = `UPDATE users SET pic = '${img_file}' WHERE cookiehandmade = '${user_cookie}'`;
        await queryDB(updateImgQuery);

        return res.redirect('comment.html');
});
///
const updateImg = async (username, img_file) => {
    const getUserQuery = `SELECT * FROM users WHERE cookiehandmade = '${user_cookie}'`;        
    const userData = await queryDB(getUserQuery, [username]);

    if (userData.length > 0) {
            // อัปเดตข้อมูลรูปภาพในฐานข้อมูล MySQL
        const updateUserImgQuery = `UPDATE users SET pic = '${img_file}' WHERE cookiehandmade = '${user_cookie}'`;           
        await queryDB(updateUserImgQuery, [img_file, username]);
        console.log("image is uploaded");
    } else {
        console.log('User not found in the database');
    }

}
/////





////////คอมเม้นของแทร่
app.post('/writePost',async (req,res) => {
    const { message } = req.body;
    //console.log('write now');
    console.log(message);
    const sql = `select * from users where cookiehandmade = "${user_cookie}"`;
    const result = await queryDB(sql);
    const user = result[0];
    

    const sqlcomment = `INSERT INTO comments (text,username ) VALUES ( "${message}","${user.username}")`;
    await queryDB(sqlcomment);

    res.end();
})

app.post('/writelike',async (req,res) => {
    const {username1,likes} = req.body;
    const sql = `select username from users where cookiehandmade = "${user_cookie}"`;
    const result = await queryDB(sql);
    let user = result[0].username;
    console.log("=====");
    console.log(user);
    console.log("=====");
    console.log(username1);



    const insert_info = `insert into leaderboard (username1,username2) values ("${username1}","${user}")`;
    await queryDB(insert_info);

    const sql_table = `select username2 from leaderboard where username1 = "${user}"`;
    const result_table = await queryDB(sql_table);
    let user_table = result_table;
    for (var i=0;i<=user_table[i].length;i++){
        console.log("-------");
        console.log(user_table[i].username1);
        console.log("-------");
        console.log(user_table[i].username2);
        if (username1 == user_table[i].username1 && user == user_table[i.username2]){
            const delete_info = `delete from leaderboard where username1 = "${username1}"`;
            await queryDB(delete_info);
            console.log("delete");
        }
    }
    console.log(user_table);
})


app.get('/readPost', async (req,res) => {
    //console.log('read now');
    const sql = 'SELECT * FROM comments';
    const result = await queryDB(sql);
    res.json(result);
})

app.get('/readLeaderboard', async (req,res) => {
    const sql = 'SELECT score,username,likes FROM users';
    const result = await queryDB(sql);
    score = result.score;
    console.log(result);
    res.json(result);
})



app.get('/readPic',async(req,res)=>{
    const sql = `select * from users where cookiehandmade = "${user_cookie}"`;
    const result = await queryDB(sql);
    const user = result[0];
    let pic = user.pic;
    console.log(pic);
    res.json(pic);
})





app.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`);
});
