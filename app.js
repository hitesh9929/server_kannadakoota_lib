const express = require('express');
const cors = require("cors");
const pool = require("./db");
const { json } = require('express');
const app = express();

//middleware
app.use(cors());
app.use(express.json()); //req.body


pool.connect((err)=>{
    if(err){
        throw err;
    }
    console.log("Database connected");
});


app.get("/available",(req,res)=>{
  try {
    const q='SELECT DISTINCT name from books_info where availability=1';
    pool.query(q,(err,names)=>{
      res.json(names);
    })
  } catch (err) {
    res.send("could not fetch data contact kk");
    
  }
})


app.get("/lib/:book_name_id",(req, res) => {
  try {
    const {book_name_id}=req.params;
    console.log(book_name_id);
    const q=`SELECT name,author,genre FROM books_info where book_name_id="${book_name_id}"`;
    console.log(q);
    pool.query(q, (err,records)=>{

      // console.log(records);
      res.json(records);
    }) 
    // console.log(allTodos)
    // res.json(allTodos.rows);
  } catch (err) {
    res.send("data fetch failed scan qr again");
  }
});

app.post("/lib", (req, res) => {
    try { 
        const {book_name_id,User_name,ph_number,mail_id}=req.body;
        console.log(book_name_id);
        pool.query(`update transactions set book_return=now() where transaction_id in(select transaction_id from transactions where book_name_id="${book_name_id}" and book_return is NULL)`,(error,rest)=>{
          if (error) throw error;
          
        });
        console.log("are we");
        const q=`insert into transactions(book_name_id,User_name,ph_number,mail_id,book_take) values("${book_name_id}","${User_name}","${ph_number}","${mail_id}",now())`;
        console.log(q);
        pool.query(q,(error,records)=>{
          if(error) throw error;
          console.log("success",records.insertId);
          const msg=`insertion success with transaction id ${records.insertId}`
          pool.query(`update books_info set availability=0 where book_name_id="${book_name_id}"`);
          res.send(msg);

        });
    //   res.json(newTodo.rows[0]);//return the inserted values
      }
    catch (err) {
      res.send("transaction failed try again",err.message);
    }
  });


  app.post("/libreturn/:book_name_id",(req,res)=>{
    try {
      const {book_name_id}=req.params;
      pool.query(`SELECT availability FROM books_info where book_name_id="${book_name_id}"`,(error,result)=>{
        if(error) throw error;
        if(result[0].availability ===1){
          res.send("book already returned");
        }
        else{
          pool.query(`update transactions set book_return=now() where transaction_id in(select max(transaction_id) from transactions where book_name_id="${book_name_id}")`,(error,results)=>{
            if (error) throw error;
            // console.log(`Rows affected: ${result.affectedRows}`);
            if (result.changedRows === 0) {
              res.send("transaction failed try again");
            }

            else {
            pool.query(`update books_info set availability=1 where book_name_id="${book_name_id}"`);
            res.send("successfully returned...");
            }
          });


        }
        
      });



      
      
    } catch (error) {
      res.send("transaction failed try again",error.message);
    }

  });







app.listen(5000,()=>{
    console.log("server live on port 5000");
})