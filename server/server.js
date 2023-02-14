const express = require("express")
const app = express()
const mysql = require("mysql")
const db = mysql.createPool({
  host:"localhost",
  user:"root",
  password:"123456",
  database:"db_system",
  // 允许一个query中有多个sql语句
  multipleStatements:true
})

// 登录验证
app.get("/login",(req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','*')
  let sql = `select * from ${req.query.chart} where username = ${req.query.user} and password = ${req.query.password}`
  db.query(sql,(err,result)=>{
    if(err) {
      res.send(err.message)
      return
    }
    res.send(result)
  })
})
// 修改密码
app.get("/updatePassword",(req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','*')
  let sql = `update ${req.query.chart} set password = ${req.query.password} where username = ${req.query.username}`
  db.query(sql,(err,result)=>{
    if(err){
      res.send(err.message)
      return
    }
    res.send(result)
  })
})


// 查询语句
app.get("/select",(req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','*')
  let sql = ""
  let where = ""
  let order = ""
  if(req.query.order.length !== 0){
    let a = req.query.order.split(",")
    order = `order by ${a[0]} ${a[1]}`
  }
    let course_name = []
    db.query("select course_name from course",(err,result)=>{
      if(err){
        res.send(err.message)
        return
      }
      course_name = result
      let sum = ""
      for(let i = 0;i < course_name.length;i++){
        sum = sum + `sum(case course.course_name when '${course_name[i].course_name}' then score else 0 end) as ${course_name[i].course_name},`
      }
      if(req.query.chart === "result"){
        if(req.query.username !== "*") where = `where student.username = ${req.query.username}`
            sql = `select student.username as 学工号,student.姓名,
                      ${sum}
                      sum(score) as 总分
                      from student
                      left outer join result on student.username = result.username
                      left outer join course on result.course_id = course.course_id
                      ${where}
                      group by student.username,student.姓名
                      ${order}`
          }
          else if(req.query.chart === "course"){
            if(req.query.username !== "*") where = `where course_id = ${req.query.username}`
            sql = `select course_id as 课程编号,course_name as 课程名 from ${req.query.chart} ${where} ${order}`
          }
          else{
            if(req.query.username !== "*") where = `username = ${req.query.username}`
            sql = `select username as 学工号,姓名,password as 密码 from ${req.query.chart} ${where} ${order}`
          }
            db.query(sql,(err,result)=>{
              if(err){
                res.send(err.message)
                return
              }
              res.send(result)
        })
    })
})
// 删除
app.get("/delete",(req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','*')
  let sql = ""
  let a = ""
  if(req.query.chart === "student") a = 49999
  else if(req.query.chart === "teacher") a = 19999
  else a = 9999
  if(req.query.chart === "student"){
    sql = `delete from result where username=${req.query.username};
          delete from ${req.query.chart} where username=${req.query.username};
          SET @a = ${a};
          UPDATE ${req.query.chart} SET username = @a := @a + 1;
          ALTER TABLE ${req.query.chart} AUTO_INCREMENT = 0;`
  } 
  else if(req.query.chart === "course"){
    sql = `delete from result where course_id=${req.query.username};
          delete from ${req.query.chart} where course_id=${req.query.username};`
  }
  else sql = `delete from ${req.query.chart} where username=${req.query.username};
              SET @a = ${a};
              UPDATE ${req.query.chart} SET username = @a := @a + 1;
              ALTER TABLE ${req.query.chart} AUTO_INCREMENT = 0;`
  console.log(sql);
  db.query(sql,(err,result)=>{
    // if(err) return console.log(err.message);
    if(err){
      res.send(err.message)
      return
    }
    res.send(result)
  })
})

// 添加信息
app.get("/insert",(req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','*')
  let sql = ""
  if(req.query.chart === "course"){
    sql = `insert into ${req.query.chart} (course_id, course_name) values(${req.query.password},'${req.query.username}');
insert into result(username,course_id) select username,(select course_id from course where course_id = ${req.query.password}) from student;`
  }
   else if(req.query.chart === "student"){
     sql = `insert into ${req.query.chart}(姓名,password) values('${req.query.username}','${req.query.password}');
insert into result(course_id,username) select course_id,(select username from student where 姓名="${req.query.username}" ) from course;`
   }
  else sql = `insert into ${req.query.chart} (姓名, password) values('${req.query.username}','${req.query.password}');`
  db.query(sql,(err,result)=>{
    if(err){
      res.send(err.message)
      return
    }
    res.send(result)
  })
})
// 更新
app.get("/update",(req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','*')
  let sql = ''
  let data = JSON.parse(req.query.data)
  if(req.query.chart === 'result'){
    for(let i = 0;i < data.length;i++){
      let key = Object.keys(data[i])
      let val = Object.values(data[i])
      sql = sql + `update ${req.query.chart} set score = ${val[0]} where username = ${req.query.username} and course_id = (select course_id from course where course_name = '${key[0]}');`
    }
  }
  else if(req.query.chart === "course") sql = `update ${req.query.chart} set course_name = '${Object.values(data[0])[0]}' where course_id = ${req.query.username}`
  else sql = `update ${req.query.chart} set 姓名 = '${Object.values(data[0])[0]}',password = '${Object.values(data[1])[0]}' where username = ${req.query.username}`
  db.query(sql,(err,result)=>{
    if(err){
      res.send(err.message)
      return
    }
    res.send(result)
  })
})
app.listen(3000,()=>{
  console.log("http://localhost:3000");
})