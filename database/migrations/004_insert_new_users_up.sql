ALTER TABLE users
ALTER COLUMN gender SET DEFAULT 'Other';


DELETE FROM users WHERE email = 'ali@iranggard.com';
DELETE FROM users WHERE email = 'mmd@iranggard.com';
DELETE FROM users WHERE email = 'admin@iranggard.com';

-- UPGRADE: Insert initial users
INSERT INTO users (user_id,username, email, user_password, gender, profile_url, favorite_categories)
VALUES
(1,'mmd', 'mmd@iranggard.com', '$2b$12$oOKjcmJeA.5Heyv8m5Qa6.Us/44k9kTT8HnHjCmf4dHe2rbMW4hPW', 'Male', 'default.jpg', '{}'),

(2,'ali', 'ali@iranggard.com', '$2b$12$oOKjcmJeA.5Heyv8m5Qa6.Us/44k9kTT8HnHjCmf4dHe2rbMW4hPW', 'Male', 'default.jpg', '{}'),

(3,'yasamin', 'yasamin@iranggard.com', '$2b$12$oOKjcmJeA.5Heyv8m5Qa6.Us/44k9kTT8HnHjCmf4dHe2rbMW4hPW', 'Female', 'default.jpg', '{}'),

(4,'kimia', 'kimia@iranggard.com', '$2b$12$oOKjcmJeA.5Heyv8m5Qa6.Us/44k9kTT8HnHjCmf4dHe2rbMW4hPW', 'Male', 'default.jpg', '{Religious}'),

(5,'admin', 'admin@iranggard.com', '$2b$12$oOKjcmJeA.5Heyv8m5Qa6.Us/44k9kTT8HnHjCmf4dHe2rbMW4hPW', 'Other', 'default.jpg', '{}');

