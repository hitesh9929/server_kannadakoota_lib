create database library;


{
  "book_name_id":"k1"
  "name":"ಹಣದ ಮನೋವಿಜ್ಞಾನ",
  "author":"ಮೋರ್ಗನ್ ಹೌಸ್ಲ್",
  "genre":"ಹಣಕಾಸು"
}
{
  "book_name_id":"k1"
  "User_name":"nidhi",
  "ph_number":"6547",
  "mail_id":"srinakkan@mail.c"
}



/*----------------------------------------------------------------------------------------------------*/
LOAD DATA INFILE 'data.csv'
INTO TABLE books_info
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\r\n'
IGNORE 1 ROWS;
insert into transactions(book_name_id,User_name,ph_number,mail_id,book_take) values('k1','nidhi',"6547","srinakkan@mail.c",now());

/*-----------------------------------------------------------------------------------------------------*/

CREATE TABLE books_info (
  book_name_id VARCHAR(50) primary key,
  name VARCHAR(50) , -- this column can store Unicode characters, including non-English characters
  author VARCHAR(50),
  genre VARCHAR(50),
  availability int default 1
);

insert into books_info(book_name_id,name,author,genre,availability) values('psychology of money','ಹಣದ ಮನೋವಿಜ್ಞಾನ','ಮೋರ್ಗನ್ ಹೌಸ್ಲ್','ಹಣಕಾಸು',1);

/*------------------------------------------------------------------------------------------------------*/


create table transactions(transaction_id serial primary key,book_name_id VARCHAR(50) ,User_name varchar(100),ph_number varchar(15),mail_id varchar(50),book_take datetime,book_return datetime default null , FOREIGN KEY(book_name_id) references books_info(book_name_id) ON DELETE CASCADE);
insert into transactions(book_name_id,User_name,ph_number,mail_id,book_take,book_return) values('k1','hitesh bishnoi',4566,'h@gm.com',now(),now());

insert into transactions(book_name_id,User_name,ph_number,mail_id,book_take) values('k1','hitesh bishnoi',4566,'h@gm.com',now());

/*-----------------------------------------------------------------------------------------------------------*/


CREATE TRIGGER before_insert_transactions
BEFORE INSERT ON transactions
FOR EACH ROW
BEGIN
update transactions set book_return=now() where transaction_id in(select transaction_id from transactions where book_name_id=NEW.book_name_id and book_return is NULL);
END;

/*---------------------------------------------------------------*/
DELIMITER$$
CREATE TRIGGER by_mistake
 INSERT ON transactions
FOR EACH ROW
BEGIN
    IF (select availability from books_info where book_name_id = NEW.book_name_id)=0 THEN
update transactions set book_return=now() where transaction_id in(select transaction_id from transactions where book_name_id=NEW.book_name_id and book_return is NULL);
        
    END IF;
END$$
DELIMITER;



DELIMITER $$
CREATE TRIGGER set_availability
AFTER INSERT ON transactions
FOR EACH ROW
BEGIN
    UPDATE books_info set availability=0 where book_name_id=NEW.book_name_id;
END$$
DELIMITER;



