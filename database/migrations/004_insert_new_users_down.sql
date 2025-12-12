ALTER TABLE users
ALTER COLUMN gender SET DEFAULT 'Male';


-- DOWNGRADE: Remove the inserted users
DELETE FROM users
WHERE username IN ('mmd', 'ali', 'yasamin', 'kimia', 'admin');



insert into users(username,email,user_password,gender,profile_url) values ('ali','ali@iranggard.com','$2b$12$oOKjcmJeA.5Heyv8m5Qa6.Us/44k9kTT8HnHjCmf4dHe2rbMW4hPW','Male','default.jpg');
insert into users(username,email,user_password,gender,profile_url) values ('mmd','mmd@iranggard.com','$2b$12$oOKjcmJeA.5Heyv8m5Qa6.Us/44k9kTT8HnHjCmf4dHe2rbMW4hPW','Male','default.jpg');
insert into users(username,email,user_password,gender,profile_url) values ('admin','admin@iranggard.com','$2b$12$oOKjcmJeA.5Heyv8m5Qa6.Us/44k9kTT8HnHjCmf4dHe2rbMW4hPW','Male','default.jpg');
