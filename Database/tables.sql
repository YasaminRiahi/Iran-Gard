

CREATE TYPE trip_status AS ENUM ('planning','finished');
CREATE TYPE gender_type AS ENUM ('Male','Female');


CREATE TABLE users (
    user_id     BIGSERIAL PRIMARY KEY,
    username    VARCHAR(50)  UNIQUE NOT NULL,
    email       VARCHAR(100) UNIQUE NOT NULL,
    user_password    VARCHAR(255) NOT NULL,
    gender      gender_type DEFAULT 'Male',
	profile_url      VARCHAR(500) NOT NULL
);

CREATE TABLE categories (
    category_id BIGSERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE favorite_categories (
    category_id BIGINT NOT NULL,
    user_id     BIGINT NOT NULL,
	PRIMARY KEY (category_id, user_id),
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE,
	FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);


CREATE TABLE cities (
    city_name VARCHAR(100) PRIMARY KEY
);

CREATE TABLE provinces (
    province_name VARCHAR(100) PRIMARY KEY
);

CREATE TABLE places (
    place_id    BIGSERIAL PRIMARY KEY,
    place_name  VARCHAR(100) NOT NULL,
    city_name VARCHAR(100) NOT NULL,
	province_name VARCHAR(100) NOT NULL,
    place_location JSONB,
    description TEXT,
    category_id BIGINT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL,
	FOREIGN KEY (city_name) REFERENCES cities(city_name) ON DELETE SET NULL,
	FOREIGN KEY (province_name) REFERENCES provinces(province_name) ON DELETE SET NULL
	
);
CREATE INDEX idx_places_city ON places(city_name);

CREATE TABLE place_photos (
    photo_num BIGSERIAL,
    place_id BIGINT NOT NULL,
    url      VARCHAR(500) NOT NULL,
 	PRIMARY KEY (place_id,photo_num),
    FOREIGN KEY (place_id) REFERENCES places(place_id) ON DELETE CASCADE
);

CREATE TABLE trips (
    trip_id     BIGSERIAL PRIMARY KEY,
    creator_id  BIGINT NOT NULL,
    trip_title  VARCHAR(200) NOT NULL,
    start_date  DATE,
    end_date    DATE CHECK (end_date >= start_date),
    status      trip_status DEFAULT 'planning',
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (creator_id) REFERENCES users(user_id) ON DELETE CASCADE
);


CREATE TABLE trip_cities (
    trip_id BIGINT NOT NULL,
    city_name VARCHAR(100) NOT NULL,
    PRIMARY KEY (trip_id,city_name),
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE,
    FOREIGN KEY (city_name) REFERENCES cities(city_name) ON DELETE CASCADE
);

CREATE TABLE trip_places (
    trip_id BIGINT NOT NULL,
    place_id BIGINT NOT NULL,
    PRIMARY KEY (trip_id,place_id),
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE,
    FOREIGN KEY (place_id) REFERENCES places(place_id) ON DELETE CASCADE
);

CREATE TABLE trip_packages (
    package_num  BIGSERIAL,
    trip_id      BIGINT NOT NULL,
	city_name VARCHAR(100) NOT NULL,
    package_name VARCHAR(200),
    package_date DATE,
	PRIMARY KEY (trip_id, package_num),
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE,
	FOREIGN KEY (city_name) REFERENCES cities(city_name) ON DELETE CASCADE	
);

CREATE TABLE trip_packages_places (
    package_num  BIGINT NOT NULL,
    trip_id      BIGINT NOT NULL,
	place_id BIGINT NOT NULL,
    preference NUMERIC(12,2) NOT NULL CHECK ( preference>= 0),	
	PRIMARY KEY (trip_id, package_num, place_id),
    FOREIGN KEY (trip_id,package_num) REFERENCES trip_packages(trip_id,package_num) ON DELETE CASCADE,
	FOREIGN KEY (place_id) REFERENCES places(place_id)ON DELETE CASCADE

	
);


CREATE TABLE trip_members (
    trip_id   BIGINT NOT NULL,
    user_id   BIGINT NOT NULL,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (trip_id, user_id),
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE wishlist (
    user_id    BIGINT NOT NULL,
    place_id   BIGINT NOT NULL,
    added_date DATE DEFAULT CURRENT_DATE,
    PRIMARY KEY (user_id, place_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (place_id) REFERENCES places(place_id) ON DELETE CASCADE
);

CREATE TABLE likes (
    user_id   BIGINT NOT NULL,
    place_id  BIGINT NOT NULL,
    PRIMARY KEY (user_id, place_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (place_id) REFERENCES places(place_id) ON DELETE CASCADE
);

CREATE TABLE place_comments (
    comment_id BIGSERIAL PRIMARY KEY,
    user_id    BIGINT NOT NULL,
    place_id   BIGINT NOT NULL,
    comment_content    TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (place_id) REFERENCES places(place_id) ON DELETE CASCADE
);


CREATE TABLE liked_comments(
    comment_id BIGINT NOT NULL,
    user_id    BIGINT NOT NULL,
	PRIMARY KEY (comment_id,user_id),
    FOREIGN KEY (comment_id) REFERENCES place_comments(comment_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE	
);


CREATE TABLE friend_requests (
    requester_id BIGINT NOT NULL,
    requestee_id BIGINT NOT NULL,
    request_date DATE DEFAULT CURRENT_DATE,
    PRIMARY KEY (requester_id, requestee_id),
    FOREIGN KEY (requester_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (requestee_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CHECK (requester_id <> requestee_id)
);

CREATE TABLE friends (
    user_id1 BIGINT NOT NULL,
    user_id2 BIGINT NOT NULL,
    PRIMARY KEY (user_id1, user_id2),
    FOREIGN KEY (user_id1) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id2) REFERENCES users(user_id) ON DELETE CASCADE,
    CHECK (user_id1 <> user_id2)
);

CREATE OR REPLACE FUNCTION make_friends_when_mutual()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM friend_requests
        WHERE requester_id = NEW.requestee_id
          AND requestee_id = NEW.requester_id
    ) THEN

        INSERT INTO friends(user_id1, user_id2)
        VALUES (
            LEAST(NEW.requester_id, NEW.requestee_id),
            GREATEST(NEW.requester_id, NEW.requestee_id)
        )
        ON CONFLICT DO NOTHING;

        DELETE FROM friend_requests
        WHERE (requester_id = NEW.requester_id AND requestee_id = NEW.requestee_id)
           OR (requester_id = NEW.requestee_id AND requestee_id = NEW.requester_id);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_make_friends_on_mutual_request
AFTER INSERT ON friend_requests
FOR EACH ROW
EXECUTE FUNCTION make_friends_when_mutual();

CREATE TABLE trip_invitations (
    trip_id     BIGINT NOT NULL,
    inviter_id  BIGINT NOT NULL,
    invitee_id  BIGINT NOT NULL,
    invited_at  TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (trip_id, invitee_id),
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE,
    FOREIGN KEY (inviter_id) REFERENCES users(user_id),
    FOREIGN KEY (invitee_id) REFERENCES users(user_id)
);

CREATE TABLE expenses (
    expense_num   BIGSERIAL NOT NULL ,
    trip_id      BIGINT NOT NULL,
    payer_id     BIGINT NOT NULL,
    amount       NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
    category     VARCHAR(100),
    expense_date DATE DEFAULT CURRENT_DATE,
    description  TEXT,
    created_at   TIMESTAMPTZ DEFAULT NOW(),
	PRIMARY KEY (trip_id,expense_num),
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE,
    FOREIGN KEY (payer_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE expense_shares (
    expense_num   BIGINT NOT NULL,
    user_id      BIGINT NOT NULL,
	trip_id BIGINT NOT NULL,
    share_amount NUMERIC(12,2) NOT NULL CHECK (share_amount >= 0),
    PRIMARY KEY (trip_id,expense_num, user_id),
    FOREIGN KEY (trip_id,expense_num) REFERENCES expenses(trip_id,expense_num) ON DELETE CASCADE,
	FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE trip_package_react (
    trip_id    BIGINT NOT NULL,
    package_num BIGINT NOT NULL,
    user_id    BIGINT NOT NULL,
	react_content VARCHAR(50) NOT NULL,
    PRIMARY KEY (trip_id,package_num,user_id),
	FOREIGN KEY (trip_id,package_num) REFERENCES trip_packages(trip_id,package_num) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);


CREATE TABLE trip_place_react (
    trip_id    BIGINT NOT NULL,
    place_id BIGINT NOT NULL,
    user_id    BIGINT NOT NULL,
	react_content VARCHAR(50) NOT NULL,
	PRIMARY KEY (trip_id,place_id,user_id),
	FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE CASCADE,
    FOREIGN KEY (place_id) REFERENCES places(place_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

