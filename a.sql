--
-- PostgreSQL database dump
--

\restrict LAVwQ3YB9LEdXDzQVNoCvIXPnxcBP1ARzW8rdNVgC0KL59GepOXJsq1INLimExQ

-- Dumped from database version 15.16
-- Dumped by pg_dump version 17.7 (Ubuntu 17.7-0ubuntu0.25.10.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: friendshipstatus; Type: TYPE; Schema: public; Owner: irangard
--

CREATE TYPE public.friendshipstatus AS ENUM (
    'PENDING',
    'ACCEPTED'
);


ALTER TYPE public.friendshipstatus OWNER TO irangard;

--
-- Name: gendertype; Type: TYPE; Schema: public; Owner: irangard
--

CREATE TYPE public.gendertype AS ENUM (
    'Male',
    'Female',
    'Other'
);


ALTER TYPE public.gendertype OWNER TO irangard;

--
-- Name: invitationstatus; Type: TYPE; Schema: public; Owner: irangard
--

CREATE TYPE public.invitationstatus AS ENUM (
    'PENDING',
    'ACCEPTED',
    'REJECTED'
);


ALTER TYPE public.invitationstatus OWNER TO irangard;

--
-- Name: tripstatus; Type: TYPE; Schema: public; Owner: irangard
--

CREATE TYPE public.tripstatus AS ENUM (
    'ONGOING',
    'COMPLETED'
);


ALTER TYPE public.tripstatus OWNER TO irangard;

--
-- Name: votetype; Type: TYPE; Schema: public; Owner: irangard
--

CREATE TYPE public.votetype AS ENUM (
    'LIKE',
    'DISLIKE'
);


ALTER TYPE public.votetype OWNER TO irangard;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: irangard
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE public.alembic_version OWNER TO irangard;

--
-- Name: cities; Type: TABLE; Schema: public; Owner: irangard
--

CREATE TABLE public.cities (
    city_name character varying(100) NOT NULL
);


ALTER TABLE public.cities OWNER TO irangard;

--
-- Name: expense_participants; Type: TABLE; Schema: public; Owner: irangard
--

CREATE TABLE public.expense_participants (
    expense_id bigint NOT NULL,
    user_id bigint NOT NULL,
    share bigint NOT NULL
);


ALTER TABLE public.expense_participants OWNER TO irangard;

--
-- Name: expenses; Type: TABLE; Schema: public; Owner: irangard
--

CREATE TABLE public.expenses (
    expense_id bigint NOT NULL,
    trip_id bigint NOT NULL,
    category character varying(50) NOT NULL,
    description character varying(255),
    amount bigint NOT NULL,
    payer_id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);


ALTER TABLE public.expenses OWNER TO irangard;

--
-- Name: expenses_expense_id_seq; Type: SEQUENCE; Schema: public; Owner: irangard
--

CREATE SEQUENCE public.expenses_expense_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.expenses_expense_id_seq OWNER TO irangard;

--
-- Name: expenses_expense_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: irangard
--

ALTER SEQUENCE public.expenses_expense_id_seq OWNED BY public.expenses.expense_id;


--
-- Name: friendships; Type: TABLE; Schema: public; Owner: irangard
--

CREATE TABLE public.friendships (
    friendship_id bigint NOT NULL,
    requester_id bigint NOT NULL,
    addressee_id bigint NOT NULL,
    status public.friendshipstatus NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);


ALTER TABLE public.friendships OWNER TO irangard;

--
-- Name: friendships_friendship_id_seq; Type: SEQUENCE; Schema: public; Owner: irangard
--

CREATE SEQUENCE public.friendships_friendship_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.friendships_friendship_id_seq OWNER TO irangard;

--
-- Name: friendships_friendship_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: irangard
--

ALTER SEQUENCE public.friendships_friendship_id_seq OWNED BY public.friendships.friendship_id;


--
-- Name: liked_reviews; Type: TABLE; Schema: public; Owner: irangard
--

CREATE TABLE public.liked_reviews (
    review_id bigint NOT NULL,
    user_id bigint NOT NULL
);


ALTER TABLE public.liked_reviews OWNER TO irangard;

--
-- Name: place_photos; Type: TABLE; Schema: public; Owner: irangard
--

CREATE TABLE public.place_photos (
    photo_num bigint NOT NULL,
    place_id bigint NOT NULL,
    url character varying(500) NOT NULL
);


ALTER TABLE public.place_photos OWNER TO irangard;

--
-- Name: place_photos_photo_num_seq; Type: SEQUENCE; Schema: public; Owner: irangard
--

CREATE SEQUENCE public.place_photos_photo_num_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.place_photos_photo_num_seq OWNER TO irangard;

--
-- Name: place_photos_photo_num_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: irangard
--

ALTER SEQUENCE public.place_photos_photo_num_seq OWNED BY public.place_photos.photo_num;


--
-- Name: place_reviews; Type: TABLE; Schema: public; Owner: irangard
--

CREATE TABLE public.place_reviews (
    review_id bigint NOT NULL,
    user_id bigint NOT NULL,
    place_id bigint NOT NULL,
    rating integer NOT NULL,
    review text,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT review_rating_range CHECK (((rating IS NULL) OR ((rating >= 1) AND (rating <= 5))))
);


ALTER TABLE public.place_reviews OWNER TO irangard;

--
-- Name: place_reviews_review_id_seq; Type: SEQUENCE; Schema: public; Owner: irangard
--

CREATE SEQUENCE public.place_reviews_review_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.place_reviews_review_id_seq OWNER TO irangard;

--
-- Name: place_reviews_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: irangard
--

ALTER SEQUENCE public.place_reviews_review_id_seq OWNED BY public.place_reviews.review_id;


--
-- Name: places; Type: TABLE; Schema: public; Owner: irangard
--

CREATE TABLE public.places (
    place_id bigint NOT NULL,
    place_name character varying(100) NOT NULL,
    city_name character varying(100) NOT NULL,
    province_name character varying(100) NOT NULL,
    place_location jsonb,
    description text,
    category_id bigint
);


ALTER TABLE public.places OWNER TO irangard;

--
-- Name: places_place_id_seq; Type: SEQUENCE; Schema: public; Owner: irangard
--

CREATE SEQUENCE public.places_place_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.places_place_id_seq OWNER TO irangard;

--
-- Name: places_place_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: irangard
--

ALTER SEQUENCE public.places_place_id_seq OWNED BY public.places.place_id;


--
-- Name: provinces; Type: TABLE; Schema: public; Owner: irangard
--

CREATE TABLE public.provinces (
    province_name character varying(100) NOT NULL
);


ALTER TABLE public.provinces OWNER TO irangard;

--
-- Name: trip_invitations; Type: TABLE; Schema: public; Owner: irangard
--

CREATE TABLE public.trip_invitations (
    invitation_id bigint NOT NULL,
    trip_id bigint NOT NULL,
    sender_id bigint NOT NULL,
    receiver_id bigint NOT NULL,
    status public.invitationstatus DEFAULT 'PENDING'::public.invitationstatus,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.trip_invitations OWNER TO irangard;

--
-- Name: trip_invitations_invitation_id_seq; Type: SEQUENCE; Schema: public; Owner: irangard
--

ALTER TABLE public.trip_invitations ALTER COLUMN invitation_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.trip_invitations_invitation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: trip_location_votes; Type: TABLE; Schema: public; Owner: irangard
--

CREATE TABLE public.trip_location_votes (
    trip_id bigint NOT NULL,
    place_id bigint NOT NULL,
    user_id bigint NOT NULL,
    vote_type public.votetype NOT NULL
);


ALTER TABLE public.trip_location_votes OWNER TO irangard;

--
-- Name: trip_locations; Type: TABLE; Schema: public; Owner: irangard
--

CREATE TABLE public.trip_locations (
    trip_id bigint NOT NULL,
    place_id bigint NOT NULL,
    visited boolean NOT NULL,
    added_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.trip_locations OWNER TO irangard;

--
-- Name: trip_participants; Type: TABLE; Schema: public; Owner: irangard
--

CREATE TABLE public.trip_participants (
    trip_id bigint NOT NULL,
    user_id bigint NOT NULL
);


ALTER TABLE public.trip_participants OWNER TO irangard;

--
-- Name: trip_plan_locations; Type: TABLE; Schema: public; Owner: irangard
--

CREATE TABLE public.trip_plan_locations (
    plan_id bigint NOT NULL,
    place_id bigint NOT NULL,
    "order" integer NOT NULL,
    estimated_time_minutes integer
);


ALTER TABLE public.trip_plan_locations OWNER TO irangard;

--
-- Name: trip_plan_votes; Type: TABLE; Schema: public; Owner: irangard
--

CREATE TABLE public.trip_plan_votes (
    plan_id bigint NOT NULL,
    user_id bigint NOT NULL,
    vote_type public.votetype NOT NULL
);


ALTER TABLE public.trip_plan_votes OWNER TO irangard;

--
-- Name: trip_plans; Type: TABLE; Schema: public; Owner: irangard
--

CREATE TABLE public.trip_plans (
    plan_id bigint NOT NULL,
    trip_id bigint NOT NULL,
    title character varying(100) NOT NULL,
    city_name character varying(100),
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.trip_plans OWNER TO irangard;

--
-- Name: trip_plans_plan_id_seq; Type: SEQUENCE; Schema: public; Owner: irangard
--

CREATE SEQUENCE public.trip_plans_plan_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.trip_plans_plan_id_seq OWNER TO irangard;

--
-- Name: trip_plans_plan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: irangard
--

ALTER SEQUENCE public.trip_plans_plan_id_seq OWNED BY public.trip_plans.plan_id;


--
-- Name: trips; Type: TABLE; Schema: public; Owner: irangard
--

CREATE TABLE public.trips (
    trip_id bigint NOT NULL,
    owner_id bigint NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    status public.tripstatus DEFAULT 'ONGOING'::public.tripstatus,
    cover_image character varying(500) DEFAULT '/static/images/genders/Male.png'::character varying,
    city_names character varying[]
);


ALTER TABLE public.trips OWNER TO irangard;

--
-- Name: trips_trip_id_seq; Type: SEQUENCE; Schema: public; Owner: irangard
--

ALTER TABLE public.trips ALTER COLUMN trip_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.trips_trip_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: irangard
--

CREATE TABLE public.users (
    user_id bigint NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    user_password character varying(255) NOT NULL,
    gender public.gendertype DEFAULT 'Other'::public.gendertype NOT NULL,
    profile_url character varying(500) DEFAULT '/static/images/genders/Other.png'::character varying NOT NULL,
    full_name character varying(100),
    about_me character varying(255),
    favorite_categories character varying[]
);


ALTER TABLE public.users OWNER TO irangard;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: irangard
--

CREATE SEQUENCE public.users_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO irangard;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: irangard
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: verification_codes; Type: TABLE; Schema: public; Owner: irangard
--

CREATE TABLE public.verification_codes (
    id bigint NOT NULL,
    email character varying(100) NOT NULL,
    code character varying(6) NOT NULL,
    code_type character varying(20) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    is_used boolean NOT NULL
);


ALTER TABLE public.verification_codes OWNER TO irangard;

--
-- Name: verification_codes_id_seq; Type: SEQUENCE; Schema: public; Owner: irangard
--

CREATE SEQUENCE public.verification_codes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.verification_codes_id_seq OWNER TO irangard;

--
-- Name: verification_codes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: irangard
--

ALTER SEQUENCE public.verification_codes_id_seq OWNED BY public.verification_codes.id;


--
-- Name: wishlist; Type: TABLE; Schema: public; Owner: irangard
--

CREATE TABLE public.wishlist (
    user_id bigint NOT NULL,
    place_id bigint NOT NULL,
    added_date date DEFAULT CURRENT_DATE
);


ALTER TABLE public.wishlist OWNER TO irangard;

--
-- Name: expenses expense_id; Type: DEFAULT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.expenses ALTER COLUMN expense_id SET DEFAULT nextval('public.expenses_expense_id_seq'::regclass);


--
-- Name: friendships friendship_id; Type: DEFAULT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.friendships ALTER COLUMN friendship_id SET DEFAULT nextval('public.friendships_friendship_id_seq'::regclass);


--
-- Name: place_photos photo_num; Type: DEFAULT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.place_photos ALTER COLUMN photo_num SET DEFAULT nextval('public.place_photos_photo_num_seq'::regclass);


--
-- Name: place_reviews review_id; Type: DEFAULT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.place_reviews ALTER COLUMN review_id SET DEFAULT nextval('public.place_reviews_review_id_seq'::regclass);


--
-- Name: places place_id; Type: DEFAULT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.places ALTER COLUMN place_id SET DEFAULT nextval('public.places_place_id_seq'::regclass);


--
-- Name: trip_plans plan_id; Type: DEFAULT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.trip_plans ALTER COLUMN plan_id SET DEFAULT nextval('public.trip_plans_plan_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Name: verification_codes id; Type: DEFAULT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.verification_codes ALTER COLUMN id SET DEFAULT nextval('public.verification_codes_id_seq'::regclass);


--
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: irangard
--

INSERT INTO public.alembic_version VALUES ('afffdd34c229');


--
-- Data for Name: cities; Type: TABLE DATA; Schema: public; Owner: irangard
--

INSERT INTO public.cities VALUES ('تهران');
INSERT INTO public.cities VALUES ('اصفهان');
INSERT INTO public.cities VALUES ('شیراز');
INSERT INTO public.cities VALUES ('یزد');
INSERT INTO public.cities VALUES ('مشهد');
INSERT INTO public.cities VALUES ('کاشان');
INSERT INTO public.cities VALUES ('تبریز');
INSERT INTO public.cities VALUES ('رامسر');
INSERT INTO public.cities VALUES ('رشت');
INSERT INTO public.cities VALUES ('اهواز');
INSERT INTO public.cities VALUES ('کرمان');
INSERT INTO public.cities VALUES ('قشم');
INSERT INTO public.cities VALUES ('شاهرود');
INSERT INTO public.cities VALUES ('آران و بیدگل');
INSERT INTO public.cities VALUES ('کبودرآهنگ');
INSERT INTO public.cities VALUES ('فومن');
INSERT INTO public.cities VALUES ('بندر انزلی');
INSERT INTO public.cities VALUES ('خرم‌آباد');
INSERT INTO public.cities VALUES ('کلیبر');
INSERT INTO public.cities VALUES ('سوادکوه');
INSERT INTO public.cities VALUES ('ساری');
INSERT INTO public.cities VALUES ('مشگین‌شهر');
INSERT INTO public.cities VALUES ('آمل');
INSERT INTO public.cities VALUES ('سپیدان');
INSERT INTO public.cities VALUES ('چالوس');
INSERT INTO public.cities VALUES ('دورود');
INSERT INTO public.cities VALUES ('شهداد');
INSERT INTO public.cities VALUES ('قوچان');
INSERT INTO public.cities VALUES ('مینودشت');
INSERT INTO public.cities VALUES ('آستارا');
INSERT INTO public.cities VALUES ('تفتان');
INSERT INTO public.cities VALUES ('اردکان');
INSERT INTO public.cities VALUES ('بیستون');
INSERT INTO public.cities VALUES ('شوش');
INSERT INTO public.cities VALUES ('شوشتر');
INSERT INTO public.cities VALUES ('اراک');
INSERT INTO public.cities VALUES ('بندر بوشهر');
INSERT INTO public.cities VALUES ('همدان');
INSERT INTO public.cities VALUES ('سقز');
INSERT INTO public.cities VALUES ('بم');
INSERT INTO public.cities VALUES ('میبد');
INSERT INTO public.cities VALUES ('فین');
INSERT INTO public.cities VALUES ('ارومیه');
INSERT INTO public.cities VALUES ('پاسارگاد');
INSERT INTO public.cities VALUES ('کرمانشاه');
INSERT INTO public.cities VALUES ('تکاب');
INSERT INTO public.cities VALUES ('چالدران');
INSERT INTO public.cities VALUES ('گنبد کاووس');
INSERT INTO public.cities VALUES ('کرج');
INSERT INTO public.cities VALUES ('قم');
INSERT INTO public.cities VALUES ('بندر عباس');
INSERT INTO public.cities VALUES ('جلفا');
INSERT INTO public.cities VALUES ('بسطام');
INSERT INTO public.cities VALUES ('کلاله');
INSERT INTO public.cities VALUES ('دزفول');


--
-- Data for Name: expense_participants; Type: TABLE DATA; Schema: public; Owner: irangard
--

INSERT INTO public.expense_participants VALUES (1, 2, 500000);
INSERT INTO public.expense_participants VALUES (1, 3, 500000);
INSERT INTO public.expense_participants VALUES (2, 3, 200000);
INSERT INTO public.expense_participants VALUES (3, 2, 50);
INSERT INTO public.expense_participants VALUES (3, 3, 50);


--
-- Data for Name: expenses; Type: TABLE DATA; Schema: public; Owner: irangard
--

INSERT INTO public.expenses VALUES (1, 1, 'food', 'شام', 1000000, 2, '2026-02-13 13:02:23.694603+00', NULL);
INSERT INTO public.expenses VALUES (2, 4, 'accommodation', 'هتل', 200000, 3, '2026-02-13 13:03:44.064591+00', NULL);
INSERT INTO public.expenses VALUES (3, 1, 'entertainment', 'شهربازی', 100, 3, '2026-02-13 13:05:58.073528+00', NULL);


--
-- Data for Name: friendships; Type: TABLE DATA; Schema: public; Owner: irangard
--

INSERT INTO public.friendships VALUES (2, 2, 3, 'ACCEPTED', '2025-12-12 17:53:55.310843+00', '2025-12-12 18:03:37.117278+00');
INSERT INTO public.friendships VALUES (4, 3, 1, 'ACCEPTED', '2025-12-12 18:03:25.273662+00', '2025-12-12 18:43:30.962478+00');
INSERT INTO public.friendships VALUES (3, 2, 4, 'ACCEPTED', '2025-12-12 17:54:01.580391+00', '2025-12-23 15:58:06.729834+00');
INSERT INTO public.friendships VALUES (8, 3, 7, 'ACCEPTED', '2025-12-23 16:24:51.905002+00', '2025-12-23 16:25:09.738399+00');
INSERT INTO public.friendships VALUES (10, 8, 2, 'PENDING', '2025-12-23 17:26:47.58275+00', NULL);
INSERT INTO public.friendships VALUES (11, 8, 6, 'PENDING', '2025-12-23 17:26:50.483214+00', NULL);
INSERT INTO public.friendships VALUES (14, 8, 5, 'PENDING', '2025-12-23 17:27:21.371977+00', NULL);
INSERT INTO public.friendships VALUES (13, 8, 1, 'ACCEPTED', '2025-12-23 17:27:14.350889+00', '2025-12-23 20:04:52.448743+00');
INSERT INTO public.friendships VALUES (17, 1, 4, 'ACCEPTED', '2025-12-23 20:04:25.360094+00', '2025-12-23 20:07:15.312787+00');
INSERT INTO public.friendships VALUES (12, 8, 3, 'ACCEPTED', '2025-12-23 17:27:00.020171+00', '2025-12-24 05:34:37.61929+00');
INSERT INTO public.friendships VALUES (18, 3, 10, 'ACCEPTED', '2025-12-24 05:38:17.366949+00', '2025-12-24 05:38:40.760461+00');
INSERT INTO public.friendships VALUES (19, 4, 8, 'PENDING', '2025-12-24 09:10:03.764588+00', NULL);
INSERT INTO public.friendships VALUES (20, 11, 1, 'PENDING', '2025-12-28 14:07:12.551304+00', NULL);
INSERT INTO public.friendships VALUES (22, 12, 4, 'PENDING', '2025-12-31 16:52:11.921446+00', NULL);


--
-- Data for Name: liked_reviews; Type: TABLE DATA; Schema: public; Owner: irangard
--

INSERT INTO public.liked_reviews VALUES (3, 2);
INSERT INTO public.liked_reviews VALUES (3, 1);
INSERT INTO public.liked_reviews VALUES (19, 1);
INSERT INTO public.liked_reviews VALUES (3, 14);


--
-- Data for Name: place_photos; Type: TABLE DATA; Schema: public; Owner: irangard
--

INSERT INTO public.place_photos VALUES (1, 1, 'https://images.unsplash.com/photo-1613907777135-94e121cdd8f5?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
INSERT INTO public.place_photos VALUES (2, 1, 'https://images.unsplash.com/photo-1706303176915-b51ece515aaf?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
INSERT INTO public.place_photos VALUES (3, 1, 'https://www.qaaph.com/uploads/blog/1691147159_banner.jpg');
INSERT INTO public.place_photos VALUES (4, 1, 'https://images.pexels.com/photos/3799150/pexels-photo-3799150.jpeg?cs=srgb&dl=pexels-kamran-gholami-2160295-3799150.jpg&fm=jpg');
INSERT INTO public.place_photos VALUES (5, 2, 'https://lp-cms-production.imgix.net/2019-06/GettyImages-500744011_full.jpg?w=1920&h=640&fit=crop&crop=faces%2Cedges&auto=format&q=75');
INSERT INTO public.place_photos VALUES (6, 2, 'https://iranmavaa.ir/wp-content/uploads/2018/03/%DA%AF%D9%84%D8%B3%D8%AA%D8%A7%D9%86.png');
INSERT INTO public.place_photos VALUES (7, 2, 'https://mrbilit.com/mag/wp-content/uploads/2022/12/Untitled-5-1000x670.jpg');
INSERT INTO public.place_photos VALUES (8, 2, 'https://api2.kojaro.com/media/2020-9-2ea11bb2-efa7-4ef7-8f58-a615fb075ad4-67c46106c1067c5ba766c699?w=1920&q=80');
INSERT INTO public.place_photos VALUES (9, 3, 'https://www.jowhareh.com/images/Jowhareh/galleries/poster_a7720489-e488-4579-9e19-adad70efbe14.jpeg');
INSERT INTO public.place_photos VALUES (10, 3, 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.karnaval.ir%2Fthings-to-do%2Fdarband-tehran&psig=AOvVaw3ubur-z_ZUmVTOWn8Ykpu2&ust=1764376356885000&source=images&cd=vfe&opi=89978449&ved=2ahUKEwim6aShzJORAxXYlCYFHfKOA3MQjRx6BAgAEBs');
INSERT INTO public.place_photos VALUES (11, 3, 'https://cdn01.eavartravel.com/2023/10/ae1737e2-358d-4c05-aa8e-531c2492d616.jpg');
INSERT INTO public.place_photos VALUES (12, 4, 'https://respina24.ir/mag/wp-content/uploads/2022/04/bagh-ketab-tehran.jpg');
INSERT INTO public.place_photos VALUES (13, 4, 'https://storage.bagheketab.com/2025/02/conversions/%D8%A8%D8%A7%D8%BA-%DA%A9%D8%AA%D8%A7%D8%A8-01-super_large.webp');
INSERT INTO public.place_photos VALUES (14, 4, 'https://storage.bagheketab.com/2025/03/conversions/0308-super_large.webp');
INSERT INTO public.place_photos VALUES (15, 4, 'https://orienttrips.com/mag/wp-content/uploads/2025/04/Tehrans-Book-Garden-4-1024x683.jpg');
INSERT INTO public.place_photos VALUES (16, 4, 'https://orienttrips.com/mag/wp-content/uploads/2025/04/Tehrans-Book-Garden-7-1024x768.jpg');
INSERT INTO public.place_photos VALUES (17, 5, 'https://upload.wikimedia.org/wikipedia/commons/0/06/Naghsh-e_Jahan_Square.jpg');
INSERT INTO public.place_photos VALUES (18, 5, 'https://upload.wikimedia.org/wikipedia/commons/0/06/Naghsh-e_Jahan_Square.jpg');
INSERT INTO public.place_photos VALUES (19, 5, 'https://upload.wikimedia.org/wikipedia/commons/0/06/Naghsh-e_Jahan_Square.jpg');
INSERT INTO public.place_photos VALUES (20, 5, 'https://upload.wikimedia.org/wikipedia/commons/0/06/Naghsh-e_Jahan_Square.jpg');
INSERT INTO public.place_photos VALUES (21, 6, 'https://upload.wikimedia.org/wikipedia/commons/9/92/Sheikh_Lotfollah_Mosque_inside_3.jpg');
INSERT INTO public.place_photos VALUES (22, 6, 'https://upload.wikimedia.org/wikipedia/commons/9/92/Sheikh_Lotfollah_Mosque_inside_3.jpg');
INSERT INTO public.place_photos VALUES (23, 6, 'https://upload.wikimedia.org/wikipedia/commons/9/92/Sheikh_Lotfollah_Mosque_inside_3.jpg');
INSERT INTO public.place_photos VALUES (24, 6, 'https://upload.wikimedia.org/wikipedia/commons/9/92/Sheikh_Lotfollah_Mosque_inside_3.jpg');
INSERT INTO public.place_photos VALUES (25, 7, 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Si-o-se-Pol.jpg');
INSERT INTO public.place_photos VALUES (26, 7, 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Si-o-se-Pol.jpg');
INSERT INTO public.place_photos VALUES (27, 7, 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Si-o-se-Pol.jpg');
INSERT INTO public.place_photos VALUES (28, 7, 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Si-o-se-Pol.jpg');
INSERT INTO public.place_photos VALUES (29, 8, 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Persepolis.jpg');
INSERT INTO public.place_photos VALUES (30, 8, 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Persepolis.jpg');
INSERT INTO public.place_photos VALUES (31, 8, 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Persepolis.jpg');
INSERT INTO public.place_photos VALUES (32, 8, 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Persepolis.jpg');
INSERT INTO public.place_photos VALUES (33, 9, 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Nasir_al-_mulk_mosque%2C_Shiraz.jpg');
INSERT INTO public.place_photos VALUES (34, 9, 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Nasir_al-_mulk_mosque%2C_Shiraz.jpg');
INSERT INTO public.place_photos VALUES (35, 9, 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Nasir_al-_mulk_mosque%2C_Shiraz.jpg');
INSERT INTO public.place_photos VALUES (36, 9, 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Nasir_al-_mulk_mosque%2C_Shiraz.jpg');
INSERT INTO public.place_photos VALUES (37, 10, 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Eram_garden%2C_shiraz.jpg');
INSERT INTO public.place_photos VALUES (38, 10, 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Eram_garden%2C_shiraz.jpg');
INSERT INTO public.place_photos VALUES (39, 10, 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Eram_garden%2C_shiraz.jpg');
INSERT INTO public.place_photos VALUES (40, 10, 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Eram_garden%2C_shiraz.jpg');
INSERT INTO public.place_photos VALUES (41, 11, 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Hafezieh-shiraz.jpg');
INSERT INTO public.place_photos VALUES (42, 11, 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Hafezieh-shiraz.jpg');
INSERT INTO public.place_photos VALUES (43, 11, 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Hafezieh-shiraz.jpg');
INSERT INTO public.place_photos VALUES (44, 11, 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Hafezieh-shiraz.jpg');
INSERT INTO public.place_photos VALUES (45, 12, 'https://upload.wikimedia.org/wikipedia/commons/5/59/Imam_Reza_shrine.jpg');
INSERT INTO public.place_photos VALUES (46, 12, 'https://upload.wikimedia.org/wikipedia/commons/5/59/Imam_Reza_shrine.jpg');
INSERT INTO public.place_photos VALUES (47, 12, 'https://upload.wikimedia.org/wikipedia/commons/5/59/Imam_Reza_shrine.jpg');
INSERT INTO public.place_photos VALUES (48, 12, 'https://upload.wikimedia.org/wikipedia/commons/5/59/Imam_Reza_shrine.jpg');
INSERT INTO public.place_photos VALUES (49, 13, 'https://upload.wikimedia.org/wikipedia/commons/3/3e/%D8%AC%D9%86%DA%AF%D9%84_%D8%A7%D8%A8%D8%B1_-_panoramio.jpg');
INSERT INTO public.place_photos VALUES (50, 13, 'https://upload.wikimedia.org/wikipedia/commons/3/3e/%D8%AC%D9%86%DA%AF%D9%84_%D8%A7%D8%A8%D8%B1_-_panoramio.jpg');
INSERT INTO public.place_photos VALUES (51, 13, 'https://upload.wikimedia.org/wikipedia/commons/3/3e/%D8%AC%D9%86%DA%AF%D9%84_%D8%A7%D8%A8%D8%B1_-_panoramio.jpg');
INSERT INTO public.place_photos VALUES (52, 13, 'https://upload.wikimedia.org/wikipedia/commons/3/3e/%D8%AC%D9%86%DA%AF%D9%84_%D8%A7%D8%A8%D8%B1_-_panoramio.jpg');
INSERT INTO public.place_photos VALUES (53, 14, 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Maranjab_Desert_20190120_17.jpg');
INSERT INTO public.place_photos VALUES (54, 14, 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Maranjab_Desert_20190120_17.jpg');
INSERT INTO public.place_photos VALUES (55, 14, 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Maranjab_Desert_20190120_17.jpg');
INSERT INTO public.place_photos VALUES (56, 14, 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Maranjab_Desert_20190120_17.jpg');
INSERT INTO public.place_photos VALUES (57, 15, 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Alisadr_cave.jpg');
INSERT INTO public.place_photos VALUES (58, 15, 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Alisadr_cave.jpg');
INSERT INTO public.place_photos VALUES (59, 15, 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Alisadr_cave.jpg');
INSERT INTO public.place_photos VALUES (60, 15, 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Alisadr_cave.jpg');
INSERT INTO public.place_photos VALUES (61, 16, 'https://upload.wikimedia.org/wikipedia/commons/4/43/Masouleh.jpg');
INSERT INTO public.place_photos VALUES (62, 16, 'https://upload.wikimedia.org/wikipedia/commons/4/43/Masouleh.jpg');
INSERT INTO public.place_photos VALUES (63, 16, 'https://upload.wikimedia.org/wikipedia/commons/4/43/Masouleh.jpg');
INSERT INTO public.place_photos VALUES (64, 16, 'https://upload.wikimedia.org/wikipedia/commons/4/43/Masouleh.jpg');
INSERT INTO public.place_photos VALUES (65, 17, 'https://upload.wikimedia.org/wikipedia/commons/9/95/Anzali_Lagoon.jpg');
INSERT INTO public.place_photos VALUES (66, 17, 'https://upload.wikimedia.org/wikipedia/commons/9/95/Anzali_Lagoon.jpg');
INSERT INTO public.place_photos VALUES (67, 17, 'https://upload.wikimedia.org/wikipedia/commons/9/95/Anzali_Lagoon.jpg');
INSERT INTO public.place_photos VALUES (68, 17, 'https://upload.wikimedia.org/wikipedia/commons/9/95/Anzali_Lagoon.jpg');
INSERT INTO public.place_photos VALUES (69, 18, 'https://upload.wikimedia.org/wikipedia/commons/2/23/Bisheh_Waterfall.jpg');
INSERT INTO public.place_photos VALUES (70, 18, 'https://upload.wikimedia.org/wikipedia/commons/2/23/Bisheh_Waterfall.jpg');
INSERT INTO public.place_photos VALUES (71, 18, 'https://upload.wikimedia.org/wikipedia/commons/2/23/Bisheh_Waterfall.jpg');
INSERT INTO public.place_photos VALUES (72, 18, 'https://upload.wikimedia.org/wikipedia/commons/2/23/Bisheh_Waterfall.jpg');
INSERT INTO public.place_photos VALUES (73, 19, 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Stars_Valley_%28Qeshm%29_009.jpg/500px-Stars_Valley_%28Qeshm%29_009.jpg');
INSERT INTO public.place_photos VALUES (74, 19, 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Stars_Valley_%28Qeshm%29_009.jpg/500px-Stars_Valley_%28Qeshm%29_009.jpg');
INSERT INTO public.place_photos VALUES (75, 19, 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Stars_Valley_%28Qeshm%29_009.jpg/500px-Stars_Valley_%28Qeshm%29_009.jpg');
INSERT INTO public.place_photos VALUES (76, 19, 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Stars_Valley_%28Qeshm%29_009.jpg/500px-Stars_Valley_%28Qeshm%29_009.jpg');
INSERT INTO public.place_photos VALUES (77, 20, 'https://upload.wikimedia.org/wikipedia/commons/0/01/Arasbaran_Forests.jpg');
INSERT INTO public.place_photos VALUES (78, 20, 'https://upload.wikimedia.org/wikipedia/commons/0/01/Arasbaran_Forests.jpg');
INSERT INTO public.place_photos VALUES (79, 20, 'https://upload.wikimedia.org/wikipedia/commons/0/01/Arasbaran_Forests.jpg');
INSERT INTO public.place_photos VALUES (80, 20, 'https://upload.wikimedia.org/wikipedia/commons/0/01/Arasbaran_Forests.jpg');
INSERT INTO public.place_photos VALUES (81, 21, 'https://upload.wikimedia.org/wikipedia/commons/3/37/Lake_shormast.JPG');
INSERT INTO public.place_photos VALUES (82, 21, 'https://upload.wikimedia.org/wikipedia/commons/3/37/Lake_shormast.JPG');
INSERT INTO public.place_photos VALUES (83, 21, 'https://upload.wikimedia.org/wikipedia/commons/3/37/Lake_shormast.JPG');
INSERT INTO public.place_photos VALUES (84, 21, 'https://upload.wikimedia.org/wikipedia/commons/3/37/Lake_shormast.JPG');
INSERT INTO public.place_photos VALUES (85, 22, 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Badab_e_surt.jpg');
INSERT INTO public.place_photos VALUES (86, 22, 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Badab_e_surt.jpg');
INSERT INTO public.place_photos VALUES (87, 22, 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Badab_e_surt.jpg');
INSERT INTO public.place_photos VALUES (88, 22, 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Badab_e_surt.jpg');
INSERT INTO public.place_photos VALUES (89, 23, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mt._Sabalan_from_Highway_near_Ardabil.jpg/500px-Mt._Sabalan_from_Highway_near_Ardabil.jpg');
INSERT INTO public.place_photos VALUES (90, 23, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mt._Sabalan_from_Highway_near_Ardabil.jpg/500px-Mt._Sabalan_from_Highway_near_Ardabil.jpg');
INSERT INTO public.place_photos VALUES (91, 23, 'https://commons.wikimedia.org/wiki/File:Sabalan_mountains_%D9%83%D9%88%D9%87%D8%B3%D8%AA%D8%A7%D9%86_%D8%B3%D8%A8%D9%84%D8%A7%D9%86_%D8%B3%D8%B1%D8%B9%DB%8C%D9%86_%D8%A7%D8%B1%D8%AF%D8%A8%DB%8C%D9%84_-_panoramio.jpg');
INSERT INTO public.place_photos VALUES (92, 23, 'https://commons.wikimedia.org/wiki/File:Sabalan_mountains_%D9%83%D9%88%D9%87%D8%B3%D8%AA%D8%A7%D9%86_%D8%B3%D8%A8%D9%84%D8%A7%D9%86_%D8%B3%D8%B1%D8%B9%DB%8C%D9%86_%D8%A7%D8%B1%D8%AF%D8%A8%DB%8C%D9%84_-_panoramio.jpg');
INSERT INTO public.place_photos VALUES (93, 24, 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Chah_Kooh_Valley_%28Qeshm%29_003.jpg');
INSERT INTO public.place_photos VALUES (94, 24, 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Chah_Kooh_Valley_%28Qeshm%29_003.jpg');
INSERT INTO public.place_photos VALUES (95, 24, 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Chah_Kooh_Valley_%28Qeshm%29_003.jpg');
INSERT INTO public.place_photos VALUES (96, 24, 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Chah_Kooh_Valley_%28Qeshm%29_003.jpg');
INSERT INTO public.place_photos VALUES (97, 25, 'https://upload.wikimedia.org/wikipedia/commons/5/51/Mount-Damavand.jpg');
INSERT INTO public.place_photos VALUES (98, 25, 'https://upload.wikimedia.org/wikipedia/commons/5/51/Mount-Damavand.jpg');
INSERT INTO public.place_photos VALUES (99, 25, 'https://upload.wikimedia.org/wikipedia/commons/5/51/Mount-Damavand.jpg');
INSERT INTO public.place_photos VALUES (100, 25, 'https://upload.wikimedia.org/wikipedia/commons/5/51/Mount-Damavand.jpg');
INSERT INTO public.place_photos VALUES (101, 26, 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Margoon_Waterfall.jpg/960px-Margoon_Waterfall.jpg?20090601162016');
INSERT INTO public.place_photos VALUES (102, 26, 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Margoon_Waterfall.jpg/960px-Margoon_Waterfall.jpg?20090601162016');
INSERT INTO public.place_photos VALUES (103, 26, 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Margoon_Waterfall.jpg/960px-Margoon_Waterfall.jpg?20090601162016');
INSERT INTO public.place_photos VALUES (104, 26, 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Margoon_Waterfall.jpg/960px-Margoon_Waterfall.jpg?20090601162016');
INSERT INTO public.place_photos VALUES (105, 27, 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Hengam_Island.jpg');
INSERT INTO public.place_photos VALUES (106, 27, 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Hengam_Island.jpg');
INSERT INTO public.place_photos VALUES (107, 27, 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Hengam_Island.jpg');
INSERT INTO public.place_photos VALUES (108, 27, 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Hengam_Island.jpg');
INSERT INTO public.place_photos VALUES (109, 28, 'https://upload.wikimedia.org/wikipedia/commons/6/68/Kelardasht_valley.jpg');
INSERT INTO public.place_photos VALUES (110, 28, 'https://upload.wikimedia.org/wikipedia/commons/6/68/Kelardasht_valley.jpg');
INSERT INTO public.place_photos VALUES (111, 28, 'https://upload.wikimedia.org/wikipedia/commons/6/68/Kelardasht_valley.jpg');
INSERT INTO public.place_photos VALUES (112, 28, 'https://upload.wikimedia.org/wikipedia/commons/6/68/Kelardasht_valley.jpg');
INSERT INTO public.place_photos VALUES (113, 29, 'https://upload.wikimedia.org/wikipedia/commons/9/93/Gahar_Lake_-_panoramio.jpg');
INSERT INTO public.place_photos VALUES (114, 29, 'https://upload.wikimedia.org/wikipedia/commons/9/93/Gahar_Lake_-_panoramio.jpg');
INSERT INTO public.place_photos VALUES (115, 29, 'https://upload.wikimedia.org/wikipedia/commons/9/93/Gahar_Lake_-_panoramio.jpg');
INSERT INTO public.place_photos VALUES (116, 29, 'https://upload.wikimedia.org/wikipedia/commons/9/93/Gahar_Lake_-_panoramio.jpg');
INSERT INTO public.place_photos VALUES (117, 30, 'https://upload.wikimedia.org/wikipedia/commons/1/19/Iran%E2%80%99s_Lut_Desert_%28153634%29.jpg');
INSERT INTO public.place_photos VALUES (118, 30, 'https://upload.wikimedia.org/wikipedia/commons/1/19/Iran%E2%80%99s_Lut_Desert_%28153634%29.jpg');
INSERT INTO public.place_photos VALUES (119, 30, 'https://upload.wikimedia.org/wikipedia/commons/1/19/Iran%E2%80%99s_Lut_Desert_%28153634%29.jpg');
INSERT INTO public.place_photos VALUES (120, 30, 'https://upload.wikimedia.org/wikipedia/commons/1/19/Iran%E2%80%99s_Lut_Desert_%28153634%29.jpg');
INSERT INTO public.place_photos VALUES (121, 31, 'https://upload.wikimedia.org/wikipedia/commons/0/07/Shamkhal_valley_-_panoramio_%282%29.jpg');
INSERT INTO public.place_photos VALUES (122, 31, 'https://upload.wikimedia.org/wikipedia/commons/0/07/Shamkhal_valley_-_panoramio_%282%29.jpg');
INSERT INTO public.place_photos VALUES (123, 31, 'https://upload.wikimedia.org/wikipedia/commons/0/07/Shamkhal_valley_-_panoramio_%282%29.jpg');
INSERT INTO public.place_photos VALUES (124, 31, 'https://upload.wikimedia.org/wikipedia/commons/0/07/Shamkhal_valley_-_panoramio_%282%29.jpg');
INSERT INTO public.place_photos VALUES (125, 32, 'https://upload.wikimedia.org/wikipedia/commons/9/93/Golestan_National_Park_20161109_11.jpg');
INSERT INTO public.place_photos VALUES (126, 32, 'https://upload.wikimedia.org/wikipedia/commons/9/93/Golestan_National_Park_20161109_11.jpg');
INSERT INTO public.place_photos VALUES (127, 32, 'https://commons.wikimedia.org/wiki/File:Golestan_National_Park_20161109_11.jpg');
INSERT INTO public.place_photos VALUES (128, 32, 'https://commons.wikimedia.org/wiki/File:Golestan_National_Park_20161109_11.jpg');
INSERT INTO public.place_photos VALUES (129, 33, 'https://upload.wikimedia.org/wikipedia/commons/6/60/Laton_Waterfall_2020-05-04_01.jpg');
INSERT INTO public.place_photos VALUES (130, 33, 'https://upload.wikimedia.org/wikipedia/commons/6/60/Laton_Waterfall_2020-05-04_01.jpg');
INSERT INTO public.place_photos VALUES (131, 33, 'https://upload.wikimedia.org/wikipedia/commons/6/60/Laton_Waterfall_2020-05-04_01.jpg');
INSERT INTO public.place_photos VALUES (132, 33, 'https://upload.wikimedia.org/wikipedia/commons/6/60/Laton_Waterfall_2020-05-04_01.jpg');
INSERT INTO public.place_photos VALUES (133, 34, 'https://upload.wikimedia.org/wikipedia/commons/0/00/Taftan_Volcano.jpg');
INSERT INTO public.place_photos VALUES (134, 34, 'https://upload.wikimedia.org/wikipedia/commons/0/00/Taftan_Volcano.jpg');
INSERT INTO public.place_photos VALUES (135, 34, 'https://upload.wikimedia.org/wikipedia/commons/0/00/Taftan_Volcano.jpg');
INSERT INTO public.place_photos VALUES (136, 34, 'https://upload.wikimedia.org/wikipedia/commons/0/00/Taftan_Volcano.jpg');
INSERT INTO public.place_photos VALUES (137, 35, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Sadabad9.jpg/500px-Sadabad9.jpg');
INSERT INTO public.place_photos VALUES (138, 35, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Sadabad9.jpg/500px-Sadabad9.jpg');
INSERT INTO public.place_photos VALUES (139, 35, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Sadabad9.jpg/500px-Sadabad9.jpg');
INSERT INTO public.place_photos VALUES (140, 35, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Sadabad9.jpg/500px-Sadabad9.jpg');
INSERT INTO public.place_photos VALUES (141, 36, 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Isfahan_-_Khakoo_bridge_-_panoramio.jpg/1280px-Isfahan_-_Khakoo_bridge_-_panoramio.jpg');
INSERT INTO public.place_photos VALUES (142, 36, 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Isfahan_-_Khakoo_bridge_-_panoramio.jpg/1280px-Isfahan_-_Khakoo_bridge_-_panoramio.jpg');
INSERT INTO public.place_photos VALUES (143, 36, 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Isfahan_-_Khakoo_bridge_-_panoramio.jpg/1280px-Isfahan_-_Khakoo_bridge_-_panoramio.jpg');
INSERT INTO public.place_photos VALUES (144, 36, 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Isfahan_-_Khakoo_bridge_-_panoramio.jpg/1280px-Isfahan_-_Khakoo_bridge_-_panoramio.jpg');
INSERT INTO public.place_photos VALUES (145, 37, 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Ali_Qapu_inside_Naghshe_Jahan_Square.jpg');
INSERT INTO public.place_photos VALUES (146, 37, 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Ali_Qapu_inside_Naghshe_Jahan_Square.jpg');
INSERT INTO public.place_photos VALUES (147, 37, 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Ali_Qapu_inside_Naghshe_Jahan_Square.jpg');
INSERT INTO public.place_photos VALUES (148, 37, 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Ali_Qapu_inside_Naghshe_Jahan_Square.jpg');
INSERT INTO public.place_photos VALUES (149, 38, 'https://upload.wikimedia.org/wikipedia/commons/9/92/%D8%B3%D8%B9%D8%AF%DB%8C%D9%87_%DB%8C%D8%A7_%D8%A2%D8%B1%D8%A7%D9%85%DA%AF%D8%A7%D9%87_%D8%B3%D8%B9%D8%AF%DB%8C_%D8%B4%DB%8C%D8%B1%D8%A7%D8%B2_%D8%A7%DB%8C%D8%B1%D8%A7%D9%86-Tomb_of_Saadi_shiraz_iran_02.jpg');
INSERT INTO public.place_photos VALUES (150, 38, 'https://upload.wikimedia.org/wikipedia/commons/9/92/%D8%B3%D8%B9%D8%AF%DB%8C%D9%87_%DB%8C%D8%A7_%D8%A2%D8%B1%D8%A7%D9%85%DA%AF%D8%A7%D9%87_%D8%B3%D8%B9%D8%AF%DB%8C_%D8%B4%DB%8C%D8%B1%D8%A7%D8%B2_%D8%A7%DB%8C%D8%B1%D8%A7%D9%86-Tomb_of_Saadi_shiraz_iran_02.jpg');
INSERT INTO public.place_photos VALUES (151, 38, 'https://upload.wikimedia.org/wikipedia/commons/9/92/%D8%B3%D8%B9%D8%AF%DB%8C%D9%87_%DB%8C%D8%A7_%D8%A2%D8%B1%D8%A7%D9%85%DA%AF%D8%A7%D9%87_%D8%B3%D8%B9%D8%AF%DB%8C_%D8%B4%DB%8C%D8%B1%D8%A7%D8%B2_%D8%A7%DB%8C%D8%B1%D8%A7%D9%86-Tomb_of_Saadi_shiraz_iran_02.jpg');
INSERT INTO public.place_photos VALUES (152, 38, 'https://upload.wikimedia.org/wikipedia/commons/9/92/%D8%B3%D8%B9%D8%AF%DB%8C%D9%87_%DB%8C%D8%A7_%D8%A2%D8%B1%D8%A7%D9%85%DA%AF%D8%A7%D9%87_%D8%B3%D8%B9%D8%AF%DB%8C_%D8%B4%DB%8C%D8%B1%D8%A7%D8%B2_%D8%A7%DB%8C%D8%B1%D8%A7%D9%86-Tomb_of_Saadi_shiraz_iran_02.jpg');
INSERT INTO public.place_photos VALUES (153, 39, 'https://upload.wikimedia.org/wikipedia/commons/5/52/Pasargadae%2C_the_first_capital_of_the_Achaemenid_Empire%2C_Iran_%2848835448233%29.jpg');
INSERT INTO public.place_photos VALUES (154, 39, 'https://upload.wikimedia.org/wikipedia/commons/5/52/Pasargadae%2C_the_first_capital_of_the_Achaemenid_Empire%2C_Iran_%2848835448233%29.jpg');
INSERT INTO public.place_photos VALUES (155, 39, 'https://upload.wikimedia.org/wikipedia/commons/5/52/Pasargadae%2C_the_first_capital_of_the_Achaemenid_Empire%2C_Iran_%2848835448233%29.jpg');
INSERT INTO public.place_photos VALUES (156, 39, 'https://upload.wikimedia.org/wikipedia/commons/5/52/Pasargadae%2C_the_first_capital_of_the_Achaemenid_Empire%2C_Iran_%2848835448233%29.jpg');
INSERT INTO public.place_photos VALUES (157, 40, 'https://upload.wikimedia.org/wikipedia/commons/7/77/Fin_Garden%2C_Kashan%2C_Iran.jpg');
INSERT INTO public.place_photos VALUES (158, 40, 'https://upload.wikimedia.org/wikipedia/commons/7/77/Fin_Garden%2C_Kashan%2C_Iran.jpg');
INSERT INTO public.place_photos VALUES (159, 40, 'https://upload.wikimedia.org/wikipedia/commons/7/77/Fin_Garden%2C_Kashan%2C_Iran.jpg');
INSERT INTO public.place_photos VALUES (160, 40, 'https://upload.wikimedia.org/wikipedia/commons/7/77/Fin_Garden%2C_Kashan%2C_Iran.jpg');
INSERT INTO public.place_photos VALUES (161, 41, 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Casa_hist%C3%B3rica_de_Tabatabaeis%2C_Kashan%2C_Ir%C3%A1n%2C_2016-09-19%2C_DD_64.jpg/2560px-Casa_hist%C3%B3rica_de_Tabatabaeis%2C_Kashan%2C_Ir%C3%A1n%2C_2016-09-19%2C_DD_64.jpg');
INSERT INTO public.place_photos VALUES (162, 41, 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Casa_hist%C3%B3rica_de_Tabatabaeis%2C_Kashan%2C_Ir%C3%A1n%2C_2016-09-19%2C_DD_64.jpg/2560px-Casa_hist%C3%B3rica_de_Tabatabaeis%2C_Kashan%2C_Ir%C3%A1n%2C_2016-09-19%2C_DD_64.jpg');
INSERT INTO public.place_photos VALUES (163, 41, 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Casa_hist%C3%B3rica_de_Tabatabaeis%2C_Kashan%2C_Ir%C3%A1n%2C_2016-09-19%2C_DD_64.jpg/2560px-Casa_hist%C3%B3rica_de_Tabatabaeis%2C_Kashan%2C_Ir%C3%A1n%2C_2016-09-19%2C_DD_64.jpg');
INSERT INTO public.place_photos VALUES (164, 41, 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Casa_hist%C3%B3rica_de_Tabatabaeis%2C_Kashan%2C_Ir%C3%A1n%2C_2016-09-19%2C_DD_64.jpg/2560px-Casa_hist%C3%B3rica_de_Tabatabaeis%2C_Kashan%2C_Ir%C3%A1n%2C_2016-09-19%2C_DD_64.jpg');
INSERT INTO public.place_photos VALUES (165, 42, 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Masjed_jame_20181108_122633.jpg/500px-Masjed_jame_20181108_122633.jpg');
INSERT INTO public.place_photos VALUES (166, 42, 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Masjed_jame_20181108_122633.jpg/500px-Masjed_jame_20181108_122633.jpg');
INSERT INTO public.place_photos VALUES (167, 42, 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Masjed_jame_20181108_122633.jpg/500px-Masjed_jame_20181108_122633.jpg');
INSERT INTO public.place_photos VALUES (168, 42, 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Masjed_jame_20181108_122633.jpg/500px-Masjed_jame_20181108_122633.jpg');
INSERT INTO public.place_photos VALUES (169, 43, 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Dakhme_zartoshtian_20181109_102802.jpg');
INSERT INTO public.place_photos VALUES (170, 43, 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Dakhme_zartoshtian_20181109_102802.jpg');
INSERT INTO public.place_photos VALUES (171, 43, 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Dakhme_zartoshtian_20181109_102802.jpg');
INSERT INTO public.place_photos VALUES (172, 43, 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Dakhme_zartoshtian_20181109_102802.jpg');
INSERT INTO public.place_photos VALUES (173, 44, 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/DSC0052_%282%29_%281600x1200%29.jpg/500px-DSC0052_%282%29_%281600x1200%29.jpg');
INSERT INTO public.place_photos VALUES (174, 44, 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/DSC0052_%282%29_%281600x1200%29.jpg/500px-DSC0052_%282%29_%281600x1200%29.jpg');
INSERT INTO public.place_photos VALUES (175, 44, 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/DSC0052_%282%29_%281600x1200%29.jpg/500px-DSC0052_%282%29_%281600x1200%29.jpg');
INSERT INTO public.place_photos VALUES (176, 44, 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/DSC0052_%282%29_%281600x1200%29.jpg/500px-DSC0052_%282%29_%281600x1200%29.jpg');
INSERT INTO public.place_photos VALUES (177, 45, 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Chak-Chak%2C_Yazd_by_Hadi_Karimi.jpg');
INSERT INTO public.place_photos VALUES (178, 45, 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Chak-Chak%2C_Yazd_by_Hadi_Karimi.jpg');
INSERT INTO public.place_photos VALUES (179, 45, 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Chak-Chak%2C_Yazd_by_Hadi_Karimi.jpg');
INSERT INTO public.place_photos VALUES (180, 45, 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Chak-Chak%2C_Yazd_by_Hadi_Karimi.jpg');
INSERT INTO public.place_photos VALUES (181, 46, 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Tomb_of_Ferdowsi_Tus%2C_Iran.jpg');
INSERT INTO public.place_photos VALUES (182, 46, 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Tomb_of_Ferdowsi_Tus%2C_Iran.jpg');
INSERT INTO public.place_photos VALUES (183, 46, 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Tomb_of_Ferdowsi_Tus%2C_Iran.jpg');
INSERT INTO public.place_photos VALUES (184, 46, 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Tomb_of_Ferdowsi_Tus%2C_Iran.jpg');
INSERT INTO public.place_photos VALUES (185, 47, 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Tomb_of_Nader_Shah_-_Mashhad_1.jpg');
INSERT INTO public.place_photos VALUES (186, 47, 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Tomb_of_Nader_Shah_-_Mashhad_1.jpg');
INSERT INTO public.place_photos VALUES (187, 47, 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Tomb_of_Nader_Shah_-_Mashhad_1.jpg');
INSERT INTO public.place_photos VALUES (188, 47, 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Tomb_of_Nader_Shah_-_Mashhad_1.jpg');
INSERT INTO public.place_photos VALUES (189, 48, 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/GRAND_BAZAR_OF_TABRIZ.jpg/500px-GRAND_BAZAR_OF_TABRIZ.jpg');
INSERT INTO public.place_photos VALUES (190, 48, 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/GRAND_BAZAR_OF_TABRIZ.jpg/500px-GRAND_BAZAR_OF_TABRIZ.jpg');
INSERT INTO public.place_photos VALUES (191, 48, 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/GRAND_BAZAR_OF_TABRIZ.jpg/500px-GRAND_BAZAR_OF_TABRIZ.jpg');
INSERT INTO public.place_photos VALUES (192, 48, 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/GRAND_BAZAR_OF_TABRIZ.jpg/500px-GRAND_BAZAR_OF_TABRIZ.jpg');
INSERT INTO public.place_photos VALUES (193, 49, 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Blue_Mosque_%28Tabriz%29_General_view.jpg/500px-Blue_Mosque_%28Tabriz%29_General_view.jpg');
INSERT INTO public.place_photos VALUES (194, 49, 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Blue_Mosque_%28Tabriz%29_General_view.jpg/500px-Blue_Mosque_%28Tabriz%29_General_view.jpg');
INSERT INTO public.place_photos VALUES (195, 49, 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Blue_Mosque_%28Tabriz%29_General_view.jpg/500px-Blue_Mosque_%28Tabriz%29_General_view.jpg');
INSERT INTO public.place_photos VALUES (196, 49, 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Blue_Mosque_%28Tabriz%29_General_view.jpg/500px-Blue_Mosque_%28Tabriz%29_General_view.jpg');
INSERT INTO public.place_photos VALUES (197, 50, 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/RudkhanCastle.JPG/960px-RudkhanCastle.JPG');
INSERT INTO public.place_photos VALUES (198, 50, 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/RudkhanCastle.JPG/960px-RudkhanCastle.JPG');
INSERT INTO public.place_photos VALUES (199, 50, 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/RudkhanCastle.JPG/960px-RudkhanCastle.JPG');
INSERT INTO public.place_photos VALUES (200, 50, 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/RudkhanCastle.JPG/960px-RudkhanCastle.JPG');
INSERT INTO public.place_photos VALUES (201, 51, 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Fortaleza_de_Bam%2C_Ir%C3%A1n%2C_2016-09-23%2C_DD_09.jpg');
INSERT INTO public.place_photos VALUES (202, 51, 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Fortaleza_de_Bam%2C_Ir%C3%A1n%2C_2016-09-23%2C_DD_09.jpg');
INSERT INTO public.place_photos VALUES (203, 51, 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Fortaleza_de_Bam%2C_Ir%C3%A1n%2C_2016-09-23%2C_DD_09.jpg');
INSERT INTO public.place_photos VALUES (204, 51, 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Fortaleza_de_Bam%2C_Ir%C3%A1n%2C_2016-09-23%2C_DD_09.jpg');
INSERT INTO public.place_photos VALUES (205, 52, 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Shazdeh_Garden.jpg');
INSERT INTO public.place_photos VALUES (206, 52, 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Shazdeh_Garden.jpg');
INSERT INTO public.place_photos VALUES (207, 52, 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Shazdeh_Garden.jpg');
INSERT INTO public.place_photos VALUES (208, 52, 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Shazdeh_Garden.jpg');
INSERT INTO public.place_photos VALUES (209, 53, 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/5O3A3530.jpg/1280px-5O3A3530.jpg');
INSERT INTO public.place_photos VALUES (210, 53, 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/5O3A3530.jpg/1280px-5O3A3530.jpg');
INSERT INTO public.place_photos VALUES (211, 53, 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/5O3A3530.jpg/1280px-5O3A3530.jpg');
INSERT INTO public.place_photos VALUES (212, 53, 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/5O3A3530.jpg/1280px-5O3A3530.jpg');
INSERT INTO public.place_photos VALUES (213, 54, 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/37/6e/34/hegmataneh-hill.jpg?w=2000&h=-1&s=1');
INSERT INTO public.place_photos VALUES (214, 54, 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/37/6e/34/hegmataneh-hill.jpg?w=2000&h=-1&s=1');
INSERT INTO public.place_photos VALUES (215, 54, 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/37/6e/34/hegmataneh-hill.jpg?w=2000&h=-1&s=1');
INSERT INTO public.place_photos VALUES (216, 54, 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/37/6e/34/hegmataneh-hill.jpg?w=2000&h=-1&s=1');
INSERT INTO public.place_photos VALUES (217, 55, 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Shushtar_Historical_Hydraulic_System.JPG');
INSERT INTO public.place_photos VALUES (218, 55, 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Shushtar_Historical_Hydraulic_System.JPG');
INSERT INTO public.place_photos VALUES (219, 55, 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Shushtar_Historical_Hydraulic_System.JPG');
INSERT INTO public.place_photos VALUES (220, 55, 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Shushtar_Historical_Hydraulic_System.JPG');
INSERT INTO public.place_photos VALUES (221, 56, 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Choghazanbil2.jpg/488px-Choghazanbil2.jpg');
INSERT INTO public.place_photos VALUES (222, 56, 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Choghazanbil2.jpg/488px-Choghazanbil2.jpg');
INSERT INTO public.place_photos VALUES (223, 56, 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Choghazanbil2.jpg/488px-Choghazanbil2.jpg');
INSERT INTO public.place_photos VALUES (224, 56, 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Choghazanbil2.jpg/488px-Choghazanbil2.jpg');
INSERT INTO public.place_photos VALUES (225, 57, 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Asef_Residence_court.jpg/500px-Asef_Residence_court.jpg');
INSERT INTO public.place_photos VALUES (226, 57, 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Asef_Residence_court.jpg/500px-Asef_Residence_court.jpg');
INSERT INTO public.place_photos VALUES (227, 57, 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Asef_Residence_court.jpg/500px-Asef_Residence_court.jpg');
INSERT INTO public.place_photos VALUES (228, 57, 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Asef_Residence_court.jpg/500px-Asef_Residence_court.jpg');
INSERT INTO public.place_photos VALUES (229, 58, 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/%DA%A9%D8%AA%DB%8C%D8%A8%D9%87_%D8%AF%D8%A7%D8%B1%DB%8C%D9%88%D8%B4_%28_%D8%A8%DB%8C%D8%B3%D8%AA%D9%88%D9%86%28.jpg/500px-%DA%A9%D8%AA%DB%8C%D8%A8%D9%87_%D8%AF%D8%A7%D8%B1%DB%8C%D9%88%D8%B4_%28_%D8%A8%DB%8C%D8%B3%D8%AA%D9%88%D9%86%28.jpg');
INSERT INTO public.place_photos VALUES (230, 58, 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/%DA%A9%D8%AA%DB%8C%D8%A8%D9%87_%D8%AF%D8%A7%D8%B1%DB%8C%D9%88%D8%B4_%28_%D8%A8%DB%8C%D8%B3%D8%AA%D9%88%D9%86%28.jpg/500px-%DA%A9%D8%AA%DB%8C%D8%A8%D9%87_%D8%AF%D8%A7%D8%B1%DB%8C%D9%88%D8%B4_%28_%D8%A8%DB%8C%D8%B3%D8%AA%D9%88%D9%86%28.jpg');
INSERT INTO public.place_photos VALUES (231, 58, 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/%DA%A9%D8%AA%DB%8C%D8%A8%D9%87_%D8%AF%D8%A7%D8%B1%DB%8C%D9%88%D8%B4_%28_%D8%A8%DB%8C%D8%B3%D8%AA%D9%88%D9%86%28.jpg/500px-%DA%A9%D8%AA%DB%8C%D8%A8%D9%87_%D8%AF%D8%A7%D8%B1%DB%8C%D9%88%D8%B4_%28_%D8%A8%DB%8C%D8%B3%D8%AA%D9%88%D9%86%28.jpg');
INSERT INTO public.place_photos VALUES (232, 58, 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/%DA%A9%D8%AA%DB%8C%D8%A8%D9%87_%D8%AF%D8%A7%D8%B1%DB%8C%D9%88%D8%B4_%28_%D8%A8%DB%8C%D8%B3%D8%AA%D9%88%D9%86%28.jpg/500px-%DA%A9%D8%AA%DB%8C%D8%A8%D9%87_%D8%AF%D8%A7%D8%B1%DB%8C%D9%88%D8%B4_%28_%D8%A8%DB%8C%D8%B3%D8%AA%D9%88%D9%86%28.jpg');
INSERT INTO public.place_photos VALUES (233, 59, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/%D8%AA%D8%A7%D9%82%E2%80%8C%D8%A8%D8%B3%D8%AA%D8%A7%D9%86.jpg/500px-%D8%AA%D8%A7%D9%82%E2%80%8C%D8%A8%D8%B3%D8%AA%D8%A7%D9%86.jpg');
INSERT INTO public.place_photos VALUES (234, 59, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/%D8%AA%D8%A7%D9%82%E2%80%8C%D8%A8%D8%B3%D8%AA%D8%A7%D9%86.jpg/500px-%D8%AA%D8%A7%D9%82%E2%80%8C%D8%A8%D8%B3%D8%AA%D8%A7%D9%86.jpg');
INSERT INTO public.place_photos VALUES (235, 59, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/%D8%AA%D8%A7%D9%82%E2%80%8C%D8%A8%D8%B3%D8%AA%D8%A7%D9%86.jpg/500px-%D8%AA%D8%A7%D9%82%E2%80%8C%D8%A8%D8%B3%D8%AA%D8%A7%D9%86.jpg');
INSERT INTO public.place_photos VALUES (236, 59, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/%D8%AA%D8%A7%D9%82%E2%80%8C%D8%A8%D8%B3%D8%AA%D8%A7%D9%86.jpg/500px-%D8%AA%D8%A7%D9%82%E2%80%8C%D8%A8%D8%B3%D8%AA%D8%A7%D9%86.jpg');
INSERT INTO public.place_photos VALUES (237, 60, 'https://upload.wikimedia.org/wikipedia/commons/f/fd/%D9%82%D9%84%D8%B9%D9%87_%D9%82%D8%B4%D9%85_02.jpg');
INSERT INTO public.place_photos VALUES (238, 60, 'https://upload.wikimedia.org/wikipedia/commons/f/fd/%D9%82%D9%84%D8%B9%D9%87_%D9%82%D8%B4%D9%85_02.jpg');
INSERT INTO public.place_photos VALUES (239, 60, 'https://upload.wikimedia.org/wikipedia/commons/f/fd/%D9%82%D9%84%D8%B9%D9%87_%D9%82%D8%B4%D9%85_02.jpg');
INSERT INTO public.place_photos VALUES (240, 60, 'https://upload.wikimedia.org/wikipedia/commons/f/fd/%D9%82%D9%84%D8%B9%D9%87_%D9%82%D8%B4%D9%85_02.jpg');
INSERT INTO public.place_photos VALUES (241, 61, 'https://upload.wikimedia.org/wikipedia/commons/5/57/Takht_e_Soleyman.jpg');
INSERT INTO public.place_photos VALUES (242, 61, 'https://upload.wikimedia.org/wikipedia/commons/5/57/Takht_e_Soleyman.jpg');
INSERT INTO public.place_photos VALUES (243, 61, 'https://upload.wikimedia.org/wikipedia/commons/5/57/Takht_e_Soleyman.jpg');
INSERT INTO public.place_photos VALUES (244, 61, 'https://upload.wikimedia.org/wikipedia/commons/5/57/Takht_e_Soleyman.jpg');
INSERT INTO public.place_photos VALUES (245, 62, 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Saint_Thaddeus_Monastery.jpg');
INSERT INTO public.place_photos VALUES (246, 62, 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Saint_Thaddeus_Monastery.jpg');
INSERT INTO public.place_photos VALUES (247, 62, 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Saint_Thaddeus_Monastery.jpg');
INSERT INTO public.place_photos VALUES (248, 62, 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Saint_Thaddeus_Monastery.jpg');
INSERT INTO public.place_photos VALUES (249, 63, 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Malk_tajer_bushehri_%28cropped%29.jpg');
INSERT INTO public.place_photos VALUES (250, 63, 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Malk_tajer_bushehri_%28cropped%29.jpg');
INSERT INTO public.place_photos VALUES (251, 63, 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Malk_tajer_bushehri_%28cropped%29.jpg');
INSERT INTO public.place_photos VALUES (252, 63, 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Malk_tajer_bushehri_%28cropped%29.jpg');
INSERT INTO public.place_photos VALUES (253, 64, 'https://upload.wikimedia.org/wikipedia/commons/2/25/Gonbad-e_Qabus.JPG');
INSERT INTO public.place_photos VALUES (254, 64, 'https://upload.wikimedia.org/wikipedia/commons/2/25/Gonbad-e_Qabus.JPG');
INSERT INTO public.place_photos VALUES (255, 64, 'https://upload.wikimedia.org/wikipedia/commons/2/25/Gonbad-e_Qabus.JPG');
INSERT INTO public.place_photos VALUES (256, 64, 'https://upload.wikimedia.org/wikipedia/commons/2/25/Gonbad-e_Qabus.JPG');
INSERT INTO public.place_photos VALUES (257, 65, 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Pasargad_Tomb_Cyrus3.jpg/500px-Pasargad_Tomb_Cyrus3.jpg');
INSERT INTO public.place_photos VALUES (258, 65, 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Pasargad_Tomb_Cyrus3.jpg/500px-Pasargad_Tomb_Cyrus3.jpg');
INSERT INTO public.place_photos VALUES (259, 65, 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Pasargad_Tomb_Cyrus3.jpg/500px-Pasargad_Tomb_Cyrus3.jpg');
INSERT INTO public.place_photos VALUES (260, 65, 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Pasargad_Tomb_Cyrus3.jpg/500px-Pasargad_Tomb_Cyrus3.jpg');
INSERT INTO public.place_photos VALUES (261, 66, 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Masdjed-e_Vakil_central_court_%281%29.jpg/500px-Masdjed-e_Vakil_central_court_%281%29.jpg');
INSERT INTO public.place_photos VALUES (262, 66, 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Masdjed-e_Vakil_central_court_%281%29.jpg/500px-Masdjed-e_Vakil_central_court_%281%29.jpg');
INSERT INTO public.place_photos VALUES (263, 66, 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Masdjed-e_Vakil_central_court_%281%29.jpg/500px-Masdjed-e_Vakil_central_court_%281%29.jpg');
INSERT INTO public.place_photos VALUES (264, 66, 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Masdjed-e_Vakil_central_court_%281%29.jpg/500px-Masdjed-e_Vakil_central_court_%281%29.jpg');
INSERT INTO public.place_photos VALUES (265, 67, 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Ziggurat_on_the_southern_hill_of_Tepe_Sialk%2C_3rd_millennium_BC%2C_Iran_-_50546736451.jpg');
INSERT INTO public.place_photos VALUES (266, 67, 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Ziggurat_on_the_southern_hill_of_Tepe_Sialk%2C_3rd_millennium_BC%2C_Iran_-_50546736451.jpg');
INSERT INTO public.place_photos VALUES (317, 90, 'http://googleusercontent.com/maps.google.com/img_121_1');
INSERT INTO public.place_photos VALUES (267, 67, 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Ziggurat_on_the_southern_hill_of_Tepe_Sialk%2C_3rd_millennium_BC%2C_Iran_-_50546736451.jpg');
INSERT INTO public.place_photos VALUES (268, 67, 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Ziggurat_on_the_southern_hill_of_Tepe_Sialk%2C_3rd_millennium_BC%2C_Iran_-_50546736451.jpg');
INSERT INTO public.place_photos VALUES (269, 68, 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Dowlat_Abad_Garden%2C_Yazd%2C_Iran.jpg');
INSERT INTO public.place_photos VALUES (270, 68, 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Dowlat_Abad_Garden%2C_Yazd%2C_Iran.jpg');
INSERT INTO public.place_photos VALUES (271, 68, 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Dowlat_Abad_Garden%2C_Yazd%2C_Iran.jpg');
INSERT INTO public.place_photos VALUES (272, 68, 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Dowlat_Abad_Garden%2C_Yazd%2C_Iran.jpg');
INSERT INTO public.place_photos VALUES (273, 69, 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Falakolaflak_Castle.jpg');
INSERT INTO public.place_photos VALUES (274, 69, 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Falakolaflak_Castle.jpg');
INSERT INTO public.place_photos VALUES (275, 69, 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Falakolaflak_Castle.jpg');
INSERT INTO public.place_photos VALUES (276, 69, 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Falakolaflak_Castle.jpg');
INSERT INTO public.place_photos VALUES (277, 70, 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Night_Life_%28230640349%29.jpeg/1280px-Night_Life_%28230640349%29.jpeg');
INSERT INTO public.place_photos VALUES (278, 70, 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Night_Life_%28230640349%29.jpeg/1280px-Night_Life_%28230640349%29.jpeg');
INSERT INTO public.place_photos VALUES (279, 71, 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/%D9%81%D8%B1%D9%88%D8%B4%DA%AF%D8%A7%D9%87_%D8%B2%D9%86%D8%AC%DB%8C%D8%B1%D9%87_%D8%A7%DB%8C_%D8%A7%D9%81%D9%82_%DA%A9%D9%88%D8%B1%D9%88%D8%B4.jpg/1280px-%D9%81%D8%B1%D9%88%D8%B4%DA%AF%D8%A7%D9%87_%D8%B2%D9%86%D8%AC%DB%8C%D8%B1%D9%87_%D8%A7%DB%8C_%D8%A7%D9%81%D9%82_%DA%A9%D9%88%D8%B1%D9%88%D8%B4.jpg');
INSERT INTO public.place_photos VALUES (280, 71, 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/%D9%81%D8%B1%D9%88%D8%B4%DA%AF%D8%A7%D9%87_%D8%B2%D9%86%D8%AC%DB%8C%D8%B1%D9%87_%D8%A7%DB%8C_%D8%A7%D9%81%D9%82_%DA%A9%D9%88%D8%B1%D9%88%D8%B4.jpg/1280px-%D9%81%D8%B1%D9%88%D8%B4%DA%AF%D8%A7%D9%87_%D8%B2%D9%86%D8%AC%DB%8C%D8%B1%D9%87_%D8%A7%DB%8C_%D8%A7%D9%81%D9%82_%DA%A9%D9%88%D8%B1%D9%88%D8%B4.jpg');
INSERT INTO public.place_photos VALUES (281, 72, 'https://static.getoccupi.com/uploads/mall_photo/photo/6431/bam-land.jpg');
INSERT INTO public.place_photos VALUES (282, 72, 'https://static.getoccupi.com/uploads/mall_photo/photo/6431/bam-land.jpg');
INSERT INTO public.place_photos VALUES (283, 73, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Isfahan_City_Center_%281%29.jpg/1200px-Isfahan_City_Center_%281%29.jpg?20221020071403');
INSERT INTO public.place_photos VALUES (284, 73, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Isfahan_City_Center_%281%29.jpg/1200px-Isfahan_City_Center_%281%29.jpg?20221020071403');
INSERT INTO public.place_photos VALUES (285, 74, 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Birds_Garden_of_Isfahan_%D8%A8%D8%A7%D8%BA_%D9%BE%D8%B1%D9%86%D8%AF%DA%AF%D8%A7%D9%86_%D8%A7%D8%B5%D9%81%D9%87%D8%A7%D9%86_04.jpg');
INSERT INTO public.place_photos VALUES (286, 74, 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Birds_Garden_of_Isfahan_%D8%A8%D8%A7%D8%BA_%D9%BE%D8%B1%D9%86%D8%AF%DA%AF%D8%A7%D9%86_%D8%A7%D8%B5%D9%81%D9%87%D8%A7%D9%86_04.jpg');
INSERT INTO public.place_photos VALUES (287, 75, 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/%D8%B3%D8%B1%D8%AF%D8%B1_%D9%85%D8%AC%D8%AA%D9%85%D8%B9_%D8%AE%D9%84%DB%8C%D8%AC_%D9%81%D8%A7%D8%B1%D8%B3.jpg/1280px-%D8%B3%D8%B1%D8%AF%D8%B1_%D9%85%D8%AC%D8%AA%D9%85%D8%B9_%D8%AE%D9%84%DB%8C%D8%AC_%D9%81%D8%A7%D8%B1%D8%B3.jpg');
INSERT INTO public.place_photos VALUES (288, 75, 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/%D8%B3%D8%B1%D8%AF%D8%B1_%D9%85%D8%AC%D8%AA%D9%85%D8%B9_%D8%AE%D9%84%DB%8C%D8%AC_%D9%81%D8%A7%D8%B1%D8%B3.jpg/1280px-%D8%B3%D8%B1%D8%AF%D8%B1_%D9%85%D8%AC%D8%AA%D9%85%D8%B9_%D8%AE%D9%84%DB%8C%D8%AC_%D9%81%D8%A7%D8%B1%D8%B3.jpg');
INSERT INTO public.place_photos VALUES (289, 76, 'https://upload.wikimedia.org/wikipedia/commons/6/64/Luna_Park%2C_Shiraz.jpg');
INSERT INTO public.place_photos VALUES (290, 76, 'https://upload.wikimedia.org/wikipedia/commons/6/64/Luna_Park%2C_Shiraz.jpg');
INSERT INTO public.place_photos VALUES (291, 77, 'https://upload.wikimedia.org/wikipedia/fa/c/ca/Almase-shargh.jpg');
INSERT INTO public.place_photos VALUES (292, 77, 'https://upload.wikimedia.org/wikipedia/fa/c/ca/Almase-shargh.jpg');
INSERT INTO public.place_photos VALUES (293, 78, 'https://orienttrips.com/mag/wp-content/uploads/2025/04/Sarzamin-Mojhaye-Abi-scaled.jpg');
INSERT INTO public.place_photos VALUES (294, 78, 'https://orienttrips.com/mag/wp-content/uploads/2025/04/Sarzamin-Mojhaye-Abi-scaled.jpg');
INSERT INTO public.place_photos VALUES (295, 79, 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Laleh_Park-Tabriz.jpg');
INSERT INTO public.place_photos VALUES (296, 79, 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Laleh_Park-Tabriz.jpg');
INSERT INTO public.place_photos VALUES (297, 80, 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Ramsar_1.jpg');
INSERT INTO public.place_photos VALUES (298, 80, 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Ramsar_1.jpg');
INSERT INTO public.place_photos VALUES (299, 81, 'https://static.neshanmap.ir/places/images/04d/2563023_11525387_Thumbnail.jpeg');
INSERT INTO public.place_photos VALUES (300, 81, 'https://static.neshanmap.ir/places/images/04d/2563023_11525387_Thumbnail.jpeg');
INSERT INTO public.place_photos VALUES (301, 82, 'https://upload.wikimedia.org/wikipedia/commons/6/6d/%D8%A8%D8%A7%D8%B2%D8%A7%D8%B1_%D8%B1%D8%B4%D8%AA.jpg');
INSERT INTO public.place_photos VALUES (302, 82, 'https://upload.wikimedia.org/wikipedia/commons/6/6d/%D8%A8%D8%A7%D8%B2%D8%A7%D8%B1_%D8%B1%D8%B4%D8%AA.jpg');
INSERT INTO public.place_photos VALUES (303, 83, 'https://itto.org/iran/image-bin/meydan-shahrdari-rasht.jpg');
INSERT INTO public.place_photos VALUES (304, 83, 'https://itto.org/iran/image-bin/meydan-shahrdari-rasht.jpg');
INSERT INTO public.place_photos VALUES (305, 84, 'http://googleusercontent.com/maps.google.com/img_115_1');
INSERT INTO public.place_photos VALUES (306, 84, 'http://googleusercontent.com/maps.google.com/img_115_2');
INSERT INTO public.place_photos VALUES (307, 85, 'http://googleusercontent.com/maps.google.com/img_116_1');
INSERT INTO public.place_photos VALUES (308, 85, 'http://googleusercontent.com/maps.google.com/img_116_2');
INSERT INTO public.place_photos VALUES (309, 86, 'https://upload.wikimedia.org/wikipedia/commons/7/79/Setare_shoping_mall.png');
INSERT INTO public.place_photos VALUES (310, 86, 'https://upload.wikimedia.org/wikipedia/commons/7/79/Setare_shoping_mall.png');
INSERT INTO public.place_photos VALUES (311, 87, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Qeshm_City_Center_1.jpg/1280px-Qeshm_City_Center_1.jpg');
INSERT INTO public.place_photos VALUES (312, 87, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Qeshm_City_Center_1.jpg/1280px-Qeshm_City_Center_1.jpg');
INSERT INTO public.place_photos VALUES (313, 88, 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Old_bazaar-gheshm_island-dargahan_-_panoramio.jpg/1280px-Old_bazaar-gheshm_island-dargahan_-_panoramio.jpg');
INSERT INTO public.place_photos VALUES (314, 88, 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Old_bazaar-gheshm_island-dargahan_-_panoramio.jpg/1280px-Old_bazaar-gheshm_island-dargahan_-_panoramio.jpg');
INSERT INTO public.place_photos VALUES (315, 89, 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Fateh_Garden-2-Jahanshahr.jpg/500px-Fateh_Garden-2-Jahanshahr.jpg');
INSERT INTO public.place_photos VALUES (316, 89, 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Fateh_Garden-2-Jahanshahr.jpg/500px-Fateh_Garden-2-Jahanshahr.jpg');
INSERT INTO public.place_photos VALUES (318, 90, 'http://googleusercontent.com/maps.google.com/img_121_2');
INSERT INTO public.place_photos VALUES (319, 91, 'http://googleusercontent.com/maps.google.com/img_122_1');
INSERT INTO public.place_photos VALUES (320, 91, 'http://googleusercontent.com/maps.google.com/img_122_2');
INSERT INTO public.place_photos VALUES (321, 92, 'http://googleusercontent.com/maps.google.com/img_123_1');
INSERT INTO public.place_photos VALUES (322, 92, 'http://googleusercontent.com/maps.google.com/img_123_2');
INSERT INTO public.place_photos VALUES (323, 93, 'http://googleusercontent.com/maps.google.com/img_124_1');
INSERT INTO public.place_photos VALUES (324, 93, 'http://googleusercontent.com/maps.google.com/img_124_2');
INSERT INTO public.place_photos VALUES (325, 94, 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Goharshad_Mosque_%28Mashhad%29.jpg/1280px-Goharshad_Mosque_%28Mashhad%29.jpg');
INSERT INTO public.place_photos VALUES (326, 94, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Goharshad_Mosque_%281%29.jpg/1280px-Goharshad_Mosque_%281%29.jpg');
INSERT INTO public.place_photos VALUES (327, 95, 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Fatemeh_Masoumeh_Shrine_%28Qom%29.jpg/1280px-Fatemeh_Masoumeh_Shrine_%28Qom%29.jpg');
INSERT INTO public.place_photos VALUES (328, 95, 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Holy_shrine_of_Lady_Fatima_Masumeh_of_Qom_%28Iran%29_-_Main_courtyard_1.jpg/1280px-Holy_shrine_of_Lady_Fatima_Masumeh_of_Qom_%28Iran%29_-_Main_courtyard_1.jpg');
INSERT INTO public.place_photos VALUES (329, 96, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Jamkaran_Mosque_%28Qom%29.jpg/1280px-Jamkaran_Mosque_%28Qom%29.jpg');
INSERT INTO public.place_photos VALUES (330, 96, 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Jamkaran_Mosque_%284%29.jpg/1280px-Jamkaran_Mosque_%284%29.jpg');
INSERT INTO public.place_photos VALUES (331, 97, 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Shah_Cheragh_Shrine%2C_Shiraz%2C_Iran_1.jpg/1280px-Shah_Cheragh_Shrine%2C_Shiraz%2C_Iran_1.jpg');
INSERT INTO public.place_photos VALUES (332, 97, 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Shah_Cheragh_Shrine%2C_Shiraz%2C_Iran_-_01.jpg/1280px-Shah_Cheragh_Shrine%2C_Shiraz%2C_Iran_-_01.jpg');
INSERT INTO public.place_photos VALUES (333, 98, 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Hafezieh_Tomb_of_Hafez_%28Shiraz%29.jpg/1280px-Hafezieh_Tomb_of_Hafez_%28Shiraz%29.jpg');
INSERT INTO public.place_photos VALUES (334, 98, 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Tomb_of_Hafez_1.jpg/1280px-Tomb_of_Hafez_1.jpg');
INSERT INTO public.place_photos VALUES (335, 99, 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Imamzadeh_Ali_ibn_Hamzah_shiraz_3.jpg/1280px-Imamzadeh_Ali_ibn_Hamzah_shiraz_3.jpg');
INSERT INTO public.place_photos VALUES (336, 99, 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Imamzadeh_Ali_ibn_Hamzah_shiraz_3.jpg/1280px-Imamzadeh_Ali_ibn_Hamzah_shiraz_3.jpg');
INSERT INTO public.place_photos VALUES (337, 100, 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Saadieh_%28Shiraz%29.jpg/1280px-Saadieh_%28Shiraz%29.jpg');
INSERT INTO public.place_photos VALUES (338, 100, 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Tomb_of_Saadi_%28Shiraz%29_1.jpg/1280px-Tomb_of_Saadi_%28Shiraz%29_1.jpg');
INSERT INTO public.place_photos VALUES (339, 101, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Jameh_Mosque_of_Isfahan.jpg/1280px-Jameh_Mosque_of_Isfahan.jpg');
INSERT INTO public.place_photos VALUES (340, 101, 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Jameh_Mosque_of_Isfahan_%2804%29.jpg/1280px-Jameh_Mosque_of_Isfahan_%2804%29.jpg');
INSERT INTO public.place_photos VALUES (341, 102, 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Vank_Cathedral_%2802%29.jpg/1280px-Vank_Cathedral_%2802%29.jpg');
INSERT INTO public.place_photos VALUES (342, 102, 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Vank_Cathedral_Interior.jpg/1280px-Vank_Cathedral_Interior.jpg');
INSERT INTO public.place_photos VALUES (343, 103, 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Agha_Bozorg_Mosque_and_School_005.jpg/1280px-Agha_Bozorg_Mosque_and_School_005.jpg');
INSERT INTO public.place_photos VALUES (344, 103, 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Agha_Bozorg_Mosque_and_School_005.jpg/1280px-Agha_Bozorg_Mosque_and_School_005.jpg');
INSERT INTO public.place_photos VALUES (345, 104, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Seyyed_Rokneddin_Mausoleum_Yazd.jpg/1280px-Seyyed_Rokneddin_Mausoleum_Yazd.jpg');
INSERT INTO public.place_photos VALUES (346, 104, 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Mir_Chakhmagh_Complex_Yazd_Iran.jpg/1280px-Mir_Chakhmagh_Complex_Yazd_Iran.jpg');
INSERT INTO public.place_photos VALUES (347, 105, 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Yazd_Atash_Behram.jpg/1280px-Yazd_Atash_Behram.jpg');
INSERT INTO public.place_photos VALUES (348, 105, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Yazd_Atash_Behram_-_Fire_Temple_%283%29.jpg/1280px-Yazd_Atash_Behram_-_Fire_Temple_%283%29.jpg');
INSERT INTO public.place_photos VALUES (349, 106, 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Saint_Stepanos_Monastery_%28Jolfa%29.jpg/1280px-Saint_Stepanos_Monastery_%28Jolfa%29.jpg');
INSERT INTO public.place_photos VALUES (350, 106, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/St_Stepanos_Monastery_%28Julfa%29.jpg/1280px-St_Stepanos_Monastery_%28Julfa%29.jpg');
INSERT INTO public.place_photos VALUES (351, 107, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/St._Mary_Church%2C_Urmia.jpg/1280px-St._Mary_Church%2C_Urmia.jpg');
INSERT INTO public.place_photos VALUES (352, 107, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/St._Mary_Church%2C_Urmia.jpg/1280px-St._Mary_Church%2C_Urmia.jpg');
INSERT INTO public.place_photos VALUES (353, 108, 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Qara_Kelisa_%28St._Thaddeus_Monastery%29.jpg/1280px-Qara_Kelisa_%28St._Thaddeus_Monastery%29.jpg');
INSERT INTO public.place_photos VALUES (354, 108, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/St._Thaddeus_Monastery_%28Qareh_Kelisa%29.jpg/1280px-St._Thaddeus_Monastery_%28Qareh_Kelisa%29.jpg');
INSERT INTO public.place_photos VALUES (355, 109, 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Bayazid_Bistami_Mausoleum.jpg/1280px-Bayazid_Bistami_Mausoleum.jpg');
INSERT INTO public.place_photos VALUES (356, 109, 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Bayazid_Bistami_Mausoleum.jpg/1280px-Bayazid_Bistami_Mausoleum.jpg');
INSERT INTO public.place_photos VALUES (357, 110, 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Khaled_Nabi_Cemetery_%282%29.jpg/1280px-Khaled_Nabi_Cemetery_%282%29.jpg');
INSERT INTO public.place_photos VALUES (358, 110, 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Khaled_Nabi_%28Kalaleh%29_1.jpg/1280px-Khaled_Nabi_%28Kalaleh%29_1.jpg');
INSERT INTO public.place_photos VALUES (359, 111, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Tomb_of_Daniel%2C_Shush%2C_Iran_2.jpg/1280px-Tomb_of_Daniel%2C_Shush%2C_Iran_2.jpg');
INSERT INTO public.place_photos VALUES (360, 111, 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Tomb_of_Daniel%2C_Shush%2C_Iran.jpg/1280px-Tomb_of_Daniel%2C_Shush%2C_Iran.jpg');
INSERT INTO public.place_photos VALUES (361, 112, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Shushtar_Jameh_Mosque_-_Hassan_%288%29.JPG/1280px-Shushtar_Jameh_Mosque_-_Hassan_%288%29.JPG');
INSERT INTO public.place_photos VALUES (362, 112, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Shushtar_Jameh_Mosque_-_Hassan_%288%29.JPG/1280px-Shushtar_Jameh_Mosque_-_Hassan_%288%29.JPG');
INSERT INTO public.place_photos VALUES (363, 113, 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Yaqoob_Leith_Saffari_Tomb%2C_Dezful_3.jpg/1280px-Yaqoob_Leith_Saffari_Tomb%2C_Dezful_3.jpg');
INSERT INTO public.place_photos VALUES (364, 113, 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Tomb_of_Ya%27qub_ibn_al-Layth_al-Saffar.jpg/1280px-Tomb_of_Ya%27qub_ibn_al-Layth_al-Saffar.jpg');
INSERT INTO public.place_photos VALUES (365, 114, 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Imamzadeh_Saleh_%28Tehran%29_02.jpg/1280px-Imamzadeh_Saleh_%28Tehran%29_02.jpg');
INSERT INTO public.place_photos VALUES (366, 114, 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Imamzadeh_Saleh_%28Tajrish%29.jpg/1280px-Imamzadeh_Saleh_%28Tajrish%29.jpg');
INSERT INTO public.place_photos VALUES (367, 115, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/St._Mary_Church%2C_Urmia.jpg/1280px-St._Mary_Church%2C_Urmia.jpg');
INSERT INTO public.place_photos VALUES (368, 115, 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/St._Mary_Church_Urmia_interior.jpg/1280px-St._Mary_Church_Urmia_interior.jpg');


--
-- Data for Name: place_reviews; Type: TABLE DATA; Schema: public; Owner: irangard
--

INSERT INTO public.place_reviews VALUES (1, 1, 4, 5, 'فضایی جذاب و الهام‌بخشه که کتاب، علم و سرگرمی رو کنار هم آورده. معماری مدرن، تنوع کتاب‌ها و بخش‌های آموزشی باعث می‌شه هم برای مطالعه و هم برای گذروندن وقت با خانواده جای ایده‌آلی باشه.
', '2025-12-23 19:30:49.157+00');
INSERT INTO public.place_reviews VALUES (2, 2, 4, 3, 'از نکات منفی باغ کتاب تهران می‌شه به شلوغی بیش از حد به‌خصوص آخر هفته‌ها اشاره کرد که تمرکز برای مطالعه رو سخت می‌کنه. همچنین قیمت بعضی کتاب‌ها و بخش‌های تفریحی نسبتاً بالاست و بیشتر حال‌وهوای تجاری داره تا یک فضای کاملاً آرام و کتاب‌محور.
', '2025-12-23 16:02:58.249033+00');
INSERT INTO public.place_reviews VALUES (3, 3, 24, 4, 'یکی از شگفت‌انگیزترین جاذبه‌های طبیعی ایرانه؛ دیواره‌های سنگی خاص، فرم‌های فرسایشی منحصربه‌فرد و فضای آرامش‌بخش تنگه، تجربه‌ای متفاوت و به‌یادماندنی برای طبیعت‌گردها ایجاد می‌کنه.', '2025-12-23 16:02:58.249033+00');
INSERT INTO public.place_reviews VALUES (4, 4, 24, 1, 'مسیر تنگه در بعضی قسمت‌ها باریک و ناهمواره و برای افراد سالمند یا کسانی که آمادگی جسمی کمتری دارن می‌تونه خسته‌کننده یا حتی خطرناک باشه، ضمن اینکه در فصل‌های شلوغ، ازدحام گردشگر از حس بکر بودن فضا کم می‌کنه.', '2025-12-23 16:02:58.249033+00');
INSERT INTO public.place_reviews VALUES (18, 2, 24, 3, 'مکان قشنگیه ولی اصلا توی فصل تابستون نرید=)', '2026-02-13 12:26:18.929621+00');
INSERT INTO public.place_reviews VALUES (19, 1, 24, 4, 'پیشنهاد میکنم حتما یک بار رو برید', '2026-02-13 12:28:23.086136+00');
INSERT INTO public.place_reviews VALUES (20, 14, 24, 5, 'مکانی بکر و آرام با طبیعتی چشم‌نواز است', '2026-02-13 12:35:41.737229+00');


--
-- Data for Name: places; Type: TABLE DATA; Schema: public; Owner: irangard
--

INSERT INTO public.places VALUES (1, 'برج میلاد', 'تهران', 'تهران', '{"lat": 35.7447, "lng": 51.3729, "url": "https://www.google.com/maps/place/Milad+Tower/@35.7447679,51.3729316,17z/data=!4m14!1m7!3m6!1s0x3f8e0710d5918403:0x74f5290b67841378!2sMilad+Tower!8m2!3d35.7447636!4d51.3755012!16zL20vMDJuemdu!3m5!1s0x3f8e0710d5918403:0x74f5290b67841378!8m2!3d35.7447636!4d51.3755012!16zL20vMDJuemdu?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D"}', 'ششمین برج بلند دنیا و نماد تهران با رستوران‌های گردان و چشم‌انداز 360 درجه از شهر', 3);
INSERT INTO public.places VALUES (2, 'کاخ گلستان', 'تهران', 'تهران', '{"lat": 35.6797, "lng": 51.4179, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D"}', 'میراث جهانی یونسکو، کاخ سلطنتی دوره قاجار با آینه‌کاری‌های خیره‌کننده و معماری باشکوه', 2);
INSERT INTO public.places VALUES (3, 'دربند', 'تهران', 'تهران', '{"lat": 35.8239, "lng": 51.4160, "url": "https://www.google.com/maps/place/Darband,+Tehran,+Tehran+Province,+Iran/@35.8239953,51.4160357,16z/data=!3m1!4b1!4m6!3m5!1s0x3f8e08b1e3bb99db:0xa2fb8a26871ef5c5!8m2!3d35.8233292!4d51.4250525!16zL20vMDVfdjZ3?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D"}', 'مسیر کوهنوردی محبوب و منطقه تفریحی در دامنه توچال با رستوران‌های سنتی', 1);
INSERT INTO public.places VALUES (4, 'باغ کتاب', 'تهران', 'تهران', '{"lat": 35.7524, "lng": 51.4292, "url": "https://www.google.com/maps/place/Tehran+Book+Garden/@35.7524974,51.4292721,17z/data=!3m1!4b1!4m6!3m5!1s0x3f8e041cdb7e50af:0xb6ee8f5c9f83536e!8m2!3d35.7524974!4d51.4318417!16s%2Fg%2F1hb_f69qy?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D"}', 'مجموعه تفریحی-فرهنگی بزرگ با دریاچه و فضای سبز گسترده', 3);
INSERT INTO public.places VALUES (5, 'میدان نقش جهان', 'اصفهان', 'اصفهان', '{"lat": 32.6549, "lng": 51.6659, "url": "https://www.google.com/maps/place/Naqsh-e+Jahan+Square/@32.6549395,51.6659974,15z/data=!4m10!1m2!2m1!1smeydan+naghsh+jahan!3m6!1s0x3fbc357fd49fa1e1:0xeb657498e34e82c6!8m2!3d32.657307!4d51.6775223!15sChNtZXlkYW4gbmFnaHNoIGphaGFuWhUiE21leWRhbiBuYWdoc2ggamFoYW6SARJ0b3VyaXN0X2F0dHJhY3Rpb26aASNDaFpEU1VoTk1HOW5TMFZKUTBGblNVUmZjbGx5V2tabkVBReABAPoBBQjxBhBI!16s%2Fg%2F11rpx0rdd5?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D"}', 'یکی از بزرگترین میادین جهان، ثبت شده در یونسکو و احاطه شده با بناهای شگفت‌انگیز صفوی', 2);
INSERT INTO public.places VALUES (6, 'مسجد شیخ لطف‌الله', 'اصفهان', 'اصفهان', '{"lat": 32.6573, "lng": 51.6760, "url": "https://www.google.com/maps/place/Sheikh+Lotfollah+Mosque/@32.6573516,51.6760732,17z/data=!3m1!4b1!4m6!3m5!1s0x3fbc35f9ee2ecf27:0xe114f54fcf246168!8m2!3d32.6573516!4d51.6786428!16zL20vMDd4ZjUz?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D"}', 'شاهکار معماری ایرانی با کاشی‌کاری بی‌نظیر و گنبد منحصر به فرد بدون مناره', 4);
INSERT INTO public.places VALUES (7, 'سی‌و‌سه‌پل', 'اصفهان', 'اصفهان', '{"lat": 32.6573, "lng": 51.6760, "url": "google.com/maps/place/Isfahan+Province,+Isfahan,+33+Pol,+Iran/@32.6573516,51.6760732,17z/data=!4m6!3m5!1s0x3fbc35e1fe5cf0eb:0x5dbac6475f74c19!8m2!3d32.6444146!4d51.6674653!16s%2Fg%2F1td9tlgf?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D"}', 'معروف‌ترین پل اصفهان با 33 دهانه، ساخته شده در دوره صفویه روی زاینده‌رود', 2);
INSERT INTO public.places VALUES (8, 'تخت جمشید', 'شیراز', 'فارس', '{"lat": 29.9358, "lng": 52.8672, "url": "https://www.google.com/maps/place/Persepolis/@29.9358685,52.867286,14z/data=!4m10!1m2!2m1!1z2KrYrtiqINis2YXYtNuM2K8!3m6!1s0x3fade35f5cf0ad6d:0x2363ec76997cfee!8m2!3d29.9355823!4d52.8891817!15sChHYqtiu2Kog2KzZhdi024zYr1oTIhHYqtiu2Kog2KzZhdi024zYr5IBF2hpc3RvcmljYWxfcGxhY2VfbXVzZXVt4AEA!16zL20vMG14OGc?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D"}', 'پایتخت تشریفاتی امپراتوری هخامنشیان، میراث جهانی یونسکو با ویرانه‌های باشکوه', 2);
INSERT INTO public.places VALUES (9, 'مسجد نصیرالملک', 'شیراز', 'فارس', '{"lat": 29.6085, "lng": 52.5459, "url": "https://www.google.com/maps/place/Nasir+al-Mulk+Mosque/@29.6085555,52.5459112,17z/data=!3m1!4b1!4m6!3m5!1s0x3fb20d6dd1e1a9e1:0xa5db54d59b5f73fe!8m2!3d29.6085509!4d52.5484808!16zL20vMGNxcGhf?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D"}', 'مسجد صورتی معروف به خاطر پنجره‌های شیشه رنگی که نور رنگین‌کمانی ایجاد می‌کنند', 4);
INSERT INTO public.places VALUES (10, 'باغ ارم', 'شیراز', 'فارس', '{"lat": 29.6369, "lng": 52.5262, "url": "https://www.google.com/maps/place/Eram+Garden/@29.6369281,52.5262973,17z/data=!3m1!4b1!4m6!3m5!1s0x3fb2120c639a43bf:0x1516de5126619a7f!8m2!3d29.6369281!4d52.5262973!16zL20vMGR5dmJj?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D"}', 'باغ فارسی زیبا با عمارت تاریخی، بخشی از مجموعه باغ‌های فارسی یونسکو', 1);
INSERT INTO public.places VALUES (11, 'حافظیه', 'شیراز', 'فارس', '{"lat": 29.6258, "lng": 52.5559, "url": "https://www.google.com/maps/place/Tomb+of+Hafez/@29.6258039,52.5559256,17z/data=!3m1!4b1!4m6!3m5!1s0x3fb20da0cdc4d8d7:0x87f9a02c62a2d984!8m2!3d29.6257993!4d52.5584952!16s%2Fm%2F064r79t?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D"}', 'آرامگاه حافظ شاعر بزرگ ایرانی، مکانی آرام با باغ زیبا و معماری دوره زندیه', 2);
INSERT INTO public.places VALUES (12, 'حرم امام رضا', 'مشهد', 'خراسان رضوی', '{"lat": 36.2878, "lng": 59.6130, "url": "https://www.google.com/maps/place/Imam+Reza+Shrine/@36.2878592,59.6130941,17z/data=!3m1!4b1!4m6!3m5!1s0x3f6c916c0e0c1fbb:0xfe247c2f3b7ea0c2!8m2!3d36.2878549!4d59.6156637!16s%2Fm%2F03crjbj?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D"}', 'مقدس‌ترین زیارتگاه ایران و بزرگترین مجموعه مسجد جهان از نظر مساحت', 4);
INSERT INTO public.places VALUES (13, 'جنگل ابر', 'شاهرود', 'سمنان', '{"lat": 36.7869, "lng": 54.8091, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D2"}', 'جنگلی منحصر به فرد که اغلب توسط اقیانوسی از ابرها پوشیده شده است.', 1);
INSERT INTO public.places VALUES (28, 'کلاردشت', 'چالوس', 'مازندران', '{"lat": 36.4715, "lng": 51.0506, "url": "https://www.google.com/maps/place/Darband,+Tehran,+Tehran+Province,+Iran/@35.8239953,51.4160357,16z/data=!3m1!4b1!4m6!3m5!1s0x3f8e08b1e3bb99db:0xa2fb8a26871ef5c5!8m2!3d35.8233292!4d51.4250525!16zL20vMDVfdjZ3?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D7"}', 'منطقه‌ای کوهستانی و خوش آب و هوا با جنگل‌ها و مناظر خیره‌کننده.', 1);
INSERT INTO public.places VALUES (14, 'کویر مرنجاب', 'آران و بیدگل', 'اصفهان', '{"lat": 34.4086, "lng": 51.8152, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D3"}', 'تپه‌های شنی زیبا، دریاچه نمک و کاروانسرای تاریخی.', 1);
INSERT INTO public.places VALUES (15, 'غار علی‌صدر', 'کبودرآهنگ', 'همدان', '{"lat": 35.3582, "lng": 48.2435, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D4"}', 'یکی از بزرگترین غارهای آبی جهان که با قایق قابل بازدید است.', 1);
INSERT INTO public.places VALUES (16, 'ماسوله', 'فومن', 'گیلان', '{"lat": 37.0463, "lng": 48.9839, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D5"}', 'روستای پلکانی و تاریخی زیبا با معماری منحصر به فرد در دل کوهستان و طبیعت سرسبز.', 1);
INSERT INTO public.places VALUES (17, 'تالاب انزلی', 'بندر انزلی', 'گیلان', '{"lat": 37.4984, "lng": 49.4443, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D6"}', 'زیستگاه پرندگان مهاجر و نیلوفرهای آبی (لاله مردابی).', 1);
INSERT INTO public.places VALUES (18, 'آبشار بیشه', 'خرم‌آباد', 'لرستان', '{"lat": 33.3917, "lng": 48.7758, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D7"}', 'آبشاری بلند و باشکوه در نزدیکی ایستگاه راه‌آهن بیشه.', 1);
INSERT INTO public.places VALUES (19, 'دره ستارگان', 'قشم', 'هرمزگان', '{"lat": 26.8521, "lng": 56.1952, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D8"}', 'دره‌ای با اشکال هندسی عجیب و زیبا که حاصل فرسایش خاک است.', 1);
INSERT INTO public.places VALUES (20, 'جنگل‌های ارسباران', 'کلیبر', 'آذربایجان شرقی', '{"lat": 38.8687, "lng": 46.8576, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D9"}', 'منطقه حفاظت‌شده و جنگلی با تنوع زیستی بالا، معروف به قره داغ.', 1);
INSERT INTO public.places VALUES (21, 'دریاچه شورمست', 'سوادکوه', 'مازندران', '{"lat": 36.0094, "lng": 53.0783, "url": "https://www.google.com/maps/place/Darband,+Tehran,+Tehran+Province,+Iran/@35.8239953,51.4160357,16z/data=!3m1!4b1!4m6!3m5!1s0x3f8e08b1e3bb99db:0xa2fb8a26871ef5c5!8m2!3d35.8233292!4d51.4250525!16zL20vMDVfdjZ3?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D0"}', 'تنها دریاچه طبیعی سوادکوه، احاطه شده با درختان سر به فلک کشیده.', 1);
INSERT INTO public.places VALUES (22, 'چشمه‌های باداب سورت', 'ساری', 'مازندران', '{"lat": 36.5772, "lng": 53.9482, "url": "https://www.google.com/maps/place/Darband,+Tehran,+Tehran+Province,+Iran/@35.8239953,51.4160357,16z/data=!3m1!4b1!4m6!3m5!1s0x3f8e08b1e3bb99db:0xa2fb8a26871ef5c5!8m2!3d35.8233292!4d51.4250525!16zL20vMDVfdjZ3?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D1"}', 'پلکان‌های طبیعی رنگی و زیبا که بر اثر رسوب مواد معدنی چشمه‌ها ایجاد شده است.', 1);
INSERT INTO public.places VALUES (23, 'کوه سبلان', 'مشگین‌شهر', 'اردبیل', '{"lat": 40.8523, "lng": 47.8398, "url": "https://www.google.com/maps/place/Darband,+Tehran,+Tehran+Province,+Iran/@35.8239953,51.4160357,16z/data=!3m1!4b1!4m6!3m5!1s0x3f8e08b1e3bb99db:0xa2fb8a26871ef5c5!8m2!3d35.8233292!4d51.4250525!16zL20vMDVfdjZ3?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D2"}', 'کوهی آتشفشانی و فعال با دریاچه‌ای زیبا در قله.', 1);
INSERT INTO public.places VALUES (24, 'تنگه چاهکوه', 'قشم', 'هرمزگان', '{"lat": 26.8924, "lng": 56.0967, "url": "https://www.google.com/maps/place/Darband,+Tehran,+Tehran+Province,+Iran/@35.8239953,51.4160357,16z/data=!3m1!4b1!4m6!3m5!1s0x3f8e08b1e3bb99db:0xa2fb8a26871ef5c5!8m2!3d35.8233292!4d51.4250525!16zL20vMDVfdjZ3?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D3"}', 'تنگه‌ای شگفت‌انگیز با دیواره‌های عمودی و سوراخ‌های عجیب بر اثر فرسایش آب.', 1);
INSERT INTO public.places VALUES (25, 'کوه دماوند', 'آمل', 'مازندران', '{"lat": 35.9599, "lng": 52.1091, "url": "https://www.google.com/maps/place/Darband,+Tehran,+Tehran+Province,+Iran/@35.8239953,51.4160357,16z/data=!3m1!4b1!4m6!3m5!1s0x3f8e08b1e3bb99db:0xa2fb8a26871ef5c5!8m2!3d35.8233292!4d51.4250525!16zL20vMDVfdjZ3?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D4"}', 'بلندترین قله ایران و نماد ملی.', 1);
INSERT INTO public.places VALUES (26, 'آبشار مارگون', 'سپیدان', 'فارس', '{"lat": 30.6874, "lng": 51.9863, "url": "https://www.google.com/maps/place/Darband,+Tehran,+Tehran+Province,+Iran/@35.8239953,51.4160357,16z/data=!3m1!4b1!4m6!3m5!1s0x3f8e08b1e3bb99db:0xa2fb8a26871ef5c5!8m2!3d35.8233292!4d51.4250525!16zL20vMDVfdjZ3?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D5"}', 'بزرگترین آبشار چشمه‌ای جهان.', 1);
INSERT INTO public.places VALUES (27, 'جزیره هنگام', 'قشم', 'هرمزگان', '{"lat": 26.6575, "lng": 55.9080, "url": "https://www.google.com/maps/place/Darband,+Tehran,+Tehran+Province,+Iran/@35.8239953,51.4160357,16z/data=!3m1!4b1!4m6!3m5!1s0x3f8e08b1e3bb99db:0xa2fb8a26871ef5c5!8m2!3d35.8233292!4d51.4250525!16zL20vMDVfdjZ3?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D6"}', 'معروف به ساحل نقره‌ای و محل زندگی دلفین‌ها.', 1);
INSERT INTO public.places VALUES (29, 'دریاچه گهر', 'دورود', 'لرستان', '{"lat": 33.3150, "lng": 49.3000, "url": "https://www.google.com/maps/place/Darband,+Tehran,+Tehran+Province,+Iran/@35.8239953,51.4160357,16z/data=!3m1!4b1!4m6!3m5!1s0x3f8e08b1e3bb99db:0xa2fb8a26871ef5c5!8m2!3d35.8233292!4d51.4250525!16zL20vMDVfdjZ3?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D8"}', 'یکی از زیباترین دریاچه‌های کوهستانی ایران (نگین اشترانکوه).', 1);
INSERT INTO public.places VALUES (30, 'دشت لوت', 'شهداد', 'کرمان', '{"lat": 30.7061, "lng": 58.5029, "url": "https://www.google.com/maps/place/Darband,+Tehran,+Tehran+Province,+Iran/@35.8239953,51.4160357,16z/data=!3m1!4b1!4m6!3m5!1s0x3f8e08b1e3bb99db:0xa2fb8a26871ef5c5!8m2!3d35.8233292!4d51.4250525!16zL20vMDVfdjZ3?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D9"}', 'بیابانی ثبت شده در یونسکو با کلوت‌های شگفت‌انگیز.', 1);
INSERT INTO public.places VALUES (31, 'دره شمخال', 'قوچان', 'خراسان رضوی', '{"lat": 37.3888, "lng": 58.7483, "url": "https://www.google.com/maps/place/Tehran+Book+Garden/@35.7524974,51.4292721,17z/data=!3m1!4b1!4m6!3m5!1s0x3f8e041cdb7e50af:0xb6ee8f5c9f83536e!8m2!3d35.7524974!4d51.4318417!16s%2Fg%2F1hb_f69qy?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D0"}', 'دره‌ای سرسبز و عمیق با رودخانه جاری و دیواره‌های بلند.', 1);
INSERT INTO public.places VALUES (32, 'پارک ملی گلستان', 'مینودشت', 'گلستان', '{"lat": 37.3980, "lng": 55.9961, "url": "https://www.google.com/maps/place/Tehran+Book+Garden/@35.7524974,51.4292721,17z/data=!3m1!4b1!4m6!3m5!1s0x3f8e041cdb7e50af:0xb6ee8f5c9f83536e!8m2!3d35.7524974!4d51.4318417!16s%2Fg%2F1hb_f69qy?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D1"}', 'اولین پارک ملی ایران و پناهگاه حیات وحش با تنوع گیاهی و جانوری.', 1);
INSERT INTO public.places VALUES (33, 'آبشار لاتون', 'آستارا', 'گیلان', '{"lat": 38.3361, "lng": 48.7490, "url": "https://www.google.com/maps/place/Tehran+Book+Garden/@35.7524974,51.4292721,17z/data=!3m1!4b1!4m6!3m5!1s0x3f8e041cdb7e50af:0xb6ee8f5c9f83536e!8m2!3d35.7524974!4d51.4318417!16s%2Fg%2F1hb_f69qy?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D2"}', 'بلندترین آبشار ایران با طبیعت جنگلی بکر.', 1);
INSERT INTO public.places VALUES (34, 'کوه تفتان', 'تفتان', 'سیستان و بلوچستان', '{"lat": 28.5991, "lng": 61.1293, "url": "https://www.google.com/maps/place/Tehran+Book+Garden/@35.7524974,51.4292721,17z/data=!3m1!4b1!4m6!3m5!1s0x3f8e041cdb7e50af:0xb6ee8f5c9f83536e!8m2!3d35.7524974!4d51.4318417!16s%2Fg%2F1hb_f69qy?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D3"}', 'تنها کوه آتشفشان نیمه‌فعال ایران.', 1);
INSERT INTO public.places VALUES (35, 'کاخ سعدآباد', 'تهران', 'تهران', '{"lat": 35.8016, "lng": 51.4243, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D40"}', 'مجموعه‌ای فرهنگی-تاریخی و اقامتگاه تابستانی شاهان قاجار و پهلوی در شمال تهران که شامل ۱۸ کاخ و موزه با معماری فاخر و باغ‌های سرسبز است. این مجموعه عظمت دوران معاصر ایران را به نمایش می‌گذارد.', 2);
INSERT INTO public.places VALUES (36, 'پل خواجو', 'اصفهان', 'اصفهان', '{"lat": 32.6469, "lng": 51.6883, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D41"}', 'یکی از زیباترین پل‌های تاریخی اصفهان بر روی زاینده‌رود، که به دستور شاه عباس دوم صفوی ساخته شد. این پل دارای تزیینات کاشی‌کاری، مجسمه‌های سنگی و طاق‌هایی است که به عنوان محل استراحت و تفرج پادشاهان مورد استفاده قرار می‌گرفته است.', 2);
INSERT INTO public.places VALUES (37, 'عالی قاپو', 'اصفهان', 'اصفهان', '{"lat": 32.6562, "lng": 51.6750, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D42"}', 'کاخ سلطنتی و ورودی اصلی مجموعه دولتخانه صفوی در میدان نقش جهان اصفهان. این بنا با شش طبقه، ایوان بزرگ و ستون‌های بلند، به ویژه به دلیل تالار موسیقی (اتاق صوت) و نقاشی‌های مینیاتوری نفیس شهرت جهانی دارد.', 2);
INSERT INTO public.places VALUES (38, 'آرامگاه سعدی', 'شیراز', 'فارس', '{"lat": 29.6206, "lng": 52.5701, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D43"}', 'محل دفن شیخ مصلح‌الدین سعدی شیرازی، شاعر پرآوازه ایرانی. بنای فعلی به سبک معماری دوران زندیه و تلفیقی از معماری قدیم و جدید ایران با کاشی‌کاری‌های زیبا و فضای دلنشین ساخته شده است.', 2);
INSERT INTO public.places VALUES (39, 'پاسارگاد', 'پاسارگاد', 'فارس', '{"lat": 30.1988, "lng": 53.1764, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D44"}', 'نخستین پایتخت امپراتوری هخامنشی به دستور کوروش بزرگ که مجموعه‌ای از سازه‌های باستانی شامل کاخ‌ها، باغ سلطنتی و آرامگاه کوروش کبیر را در بر می‌گیرد و به عنوان میراث جهانی یونسکو ثبت شده است.', 2);
INSERT INTO public.places VALUES (95, 'حرم حضرت معصومه (س)', 'قم', 'قم', '{"lat": 34.6409, "lng": 50.8756, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D480..."}', 'آرامگاه حضرت فاطمه معصومه (س)، خواهر امام رضا (ع)، و یکی از مهم‌ترین مراکز مذهبی شیعه در ایران. معماری شکوهمند و کاشی‌کاری‌های زیبای آن بسیار چشم‌نواز است.', 4);
INSERT INTO public.places VALUES (40, 'باغ فین', 'فین', 'اصفهان', '{"lat": 33.9788, "lng": 51.3853, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D45"}', 'باغی ایرانی با قدمت دوران صفویه، مشهور به داشتن سیستم آبرسانی بسیار قوی و فواره‌های متعدد که آب آن از چشمه سلیمانیه تأمین می‌شود. این باغ به عنوان یکی از زیباترین نمونه‌های باغ ایرانی، همچنین محل قتل امیرکبیر، صدراعظم ناصرالدین شاه، است.', 2);
INSERT INTO public.places VALUES (41, 'خانه طباطبایی‌ها', 'کاشان', 'اصفهان', '{"lat": 33.9740, "lng": 51.4427, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D46"}', 'یکی از خانه‌های باشکوه و اعیانی کاشان مربوط به دوره قاجار. این بنا با معماری سنتی کویری، شامل اندرونی، بیرونی، و حیاط‌های متعدد با نقاشی‌های دیواری و آینه‌کاری‌های نفیس است و "عروس خانه‌های ایران" لقب دارد.', 2);
INSERT INTO public.places VALUES (42, 'مسجد جامع یزد', 'یزد', 'یزد', '{"lat": 31.8973, "lng": 54.3639, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D47"}', 'بنایی با شکوه که قدمت ساخت آن به دوره ایلخانی می‌رسد و نمادی از هنر کاشی‌کاری و معماری اسلامی ایران است. این مسجد به داشتن بلندترین مناره‌های ایران (حدود ۵۲ متر) شهرت دارد و گنبد زیبای آن از نقاط مختلف شهر قابل مشاهده است.', 2);
INSERT INTO public.places VALUES (43, 'دخمه زرتشتیان (برج خاموشان)', 'یزد', 'یزد', '{"lat": 31.8340, "lng": 54.3210, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D48"}', 'مکانی تاریخی و مذهبی متعلق به زرتشتیان در حومه شهر یزد. این سازه‌ها که بر روی تپه‌ای مرتفع قرار دارند، در گذشته برای اجرای آیین خاص دفن مردگان (قرار دادن اجساد در معرض پرندگان) استفاده می‌شدند.', 2);
INSERT INTO public.places VALUES (44, 'نارین قلعه', 'میبد', 'یزد', '{"lat": 32.2272, "lng": 54.0150, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D49"}', 'کهن‌ترین و بزرگترین بنای خشتی جهان که قدمت آن به دوران ساسانیان و حتی پیش از اسلام باز می‌گردد. این قلعه بر روی تپه‌ای مشرف به شهر میبد ساخته شده و دارای بخش‌های نظامی و مسکونی بوده است.', 2);
INSERT INTO public.places VALUES (45, 'چک چک', 'اردکان', 'یزد', '{"lat": 32.3687, "lng": 54.5422, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D50"}', 'یکی از مهم‌ترین زیارتگاه‌های زرتشتیان جهان که در دل کوهستان و در نزدیکی اردکان یزد واقع شده است. این مکان مقدس به دلیل قطرات آبی که به طور دائم از صخره‌ها می‌چکد، نامگذاری شده است.', 2);
INSERT INTO public.places VALUES (46, 'آرامگاه فردوسی', 'مشهد', 'خراسان رضوی', '{"lat": 36.4862, "lng": 59.4897, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D51"}', 'بنای یادبود و محل دفن حکیم ابوالقاسم فردوسی، سراینده شاهنامه، در توس مشهد. معماری بنا الهام گرفته از شیوه معماری هخامنشی و به ویژه آرامگاه کوروش است و عظمت حماسی شعر او را نشان می‌دهد.', 2);
INSERT INTO public.places VALUES (47, 'نادرشاه', 'مشهد', 'خراسان رضوی', '{"lat": 36.3113, "lng": 59.5997, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D52"}', 'آرامگاه پادشاه مقتدر افشار، نادرشاه، که در باغ نادری مشهد واقع شده است. بنای کنونی توسط هوشنگ سیحون طراحی شده و مجسمه معروف نادرشاه سوار بر اسب در ورودی آن قرار دارد.', 2);
INSERT INTO public.places VALUES (48, 'بازار تبریز', 'تبریز', 'آذربایجان شرقی', '{"lat": 38.0827, "lng": 46.2818, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D53"}', 'بزرگترین بازار سرپوشیده و به‌هم‌پیوسته جهان که در فهرست میراث جهانی یونسکو ثبت شده است. این بازار قلب تپنده تجارت در شمال غرب ایران و نمونه‌ای عالی از معماری سنتی بازار در خاورمیانه است که دارای ده‌ها راسته و سرا است.', 2);
INSERT INTO public.places VALUES (49, 'مسجد کبود', 'تبریز', 'آذربایجان شرقی', '{"lat": 38.0801, "lng": 46.2810, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D54"}', 'مسجدی تاریخی متعلق به دوره قراقویونلوها که به دلیل کاشی‌کاری‌های نفیس آبی و لاجوردی‌اش به "فیروزه اسلام" شهرت یافته است. بخش‌های زیادی از این مسجد در زلزله آسیب دیده‌اند و بازسازی شده‌اند.', 2);
INSERT INTO public.places VALUES (50, 'قلعه رودخان', 'فومن', 'گیلان', '{"lat": 37.0664, "lng": 49.2393, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D55"}', 'دژی نظامی متعلق به دوران ساسانیان که در دوره سلجوقیان بازسازی شد. این قلعه در ارتفاعات جنگلی فومن گیلان قرار دارد و دارای دو بخش ارگ و قورخانه با دیوارهای سنگی مستحکم و ۶۵ برج است.', 2);
INSERT INTO public.places VALUES (51, 'ارگ بم', 'بم', 'کرمان', '{"lat": 29.1062, "lng": 58.3619, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D56"}', 'بزرگترین سازه خشتی جهان که قدمت آن به بیش از ۲۵۰۰ سال پیش و دوره هخامنشیان باز می‌گردد. این ارگ تاریخی که در میراث جهانی یونسکو ثبت شده بود، در زلزله سال ۱۳۸۲ به شدت آسیب دید و در حال بازسازی است.', 2);
INSERT INTO public.places VALUES (52, 'باغ شازده ماهان', 'کرمان', 'کرمان', '{"lat": 30.0718, "lng": 57.2917, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D57"}', 'یکی از ۹ باغ ایرانی ثبت شده در یونسکو، که نمونه‌ای کامل از باغ‌های کویری با معماری دوره قاجار و فواره‌های متعدد و حوضچه‌های آب در دل منطقه‌ای خشک است. این باغ نماد غلبه بر طبیعت سخت کویر است.', 2);
INSERT INTO public.places VALUES (53, 'آرامگاه بوعلی سینا', 'همدان', 'همدان', '{"lat": 34.7997, "lng": 48.5130, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D58"}', 'بنای یادبود و محل دفن ابوعلی سینا، فیلسوف، پزشک و دانشمند بزرگ ایرانی، در همدان. این برج با الهام از معماری برج گنبد قابوس ساخته شده و شامل موزه و کتابخانه است.', 2);
INSERT INTO public.places VALUES (54, 'تپه هگمتانه', 'همدان', 'همدان', '{"lat": 34.8093, "lng": 48.5140, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D59"}', 'یکی از بزرگترین تپه‌های باستانی ایران که بقایای شهر باستانی هگمتانه، پایتخت مادها و هخامنشیان را در خود جای داده است. این تپه شاهد تاریخ غنی و کاوش‌های باستان‌شناسی مهم بوده است.', 2);
INSERT INTO public.places VALUES (55, 'آبشارهای شوشتر', 'شوشتر', 'خوزستان', '{"lat": 32.0308, "lng": 48.8914, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D60"}', 'سیستم هیدرولیکی باستانی که شامل پل‌ها، بندها، آسیاب‌ها، آبشارها و کانال‌های عظیم است. این شاهکار مهندسی مربوط به دوران ساسانیان بوده و به عنوان یک اثر جهانی در یونسکو ثبت شده است.', 2);
INSERT INTO public.places VALUES (56, 'زیگورات چغازنبیل', 'شوش', 'خوزستان', '{"lat": 32.0000, "lng": 48.5290, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D61"}', 'معبد ایلامی باستانی و یکی از معدود زیگورات‌های باقی‌مانده در خارج از بین‌النهرین که به دست اونتاش ناپیریشا، شاه ایلامی، ساخته شد. این بنا یکی از باارزش‌ترین آثار باستانی ایران و جهان و میراث جهانی یونسکو است.', 2);
INSERT INTO public.places VALUES (57, 'عمارت آصف (خانه کرد)', 'سقز', 'کردستان', '{"lat": 36.2167, "lng": 46.2667, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D62"}', 'عمارت آصف، معروف به خانه کرد، یکی از بناهای تاریخی سنندج است که نمونه‌ای برجسته از معماری مسکونی دوره صفوی و قاجار است و امروزه به موزه مردم‌شناسی و تاریخ کردستان تبدیل شده است.', 2);
INSERT INTO public.places VALUES (58, 'بیستون', 'بیستون', 'کرمانشاه', '{"lat": 34.4020, "lng": 47.4370, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D63"}', 'مجموعه‌ای بزرگ از آثار باستانی شامل کتیبه مشهور داریوش بزرگ که بر صخره‌ای عظیم حک شده است. این اثر که شامل نقش برجسته‌ها و خط میخی است، سند مهمی از تاریخ هخامنشی و در یونسکو ثبت شده است.', 2);
INSERT INTO public.places VALUES (59, 'تاق بستان', 'کرمانشاه', 'کرمانشاه', '{"lat": 34.3686, "lng": 47.1685, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D64"}', 'مجموعه‌ای از سنگ‌نگاره‌ها و تاق‌های ساسانی که صحنه‌های تاج‌گذاری، شکار، و پیکرتراشی شاهان ساسانی را به تصویر کشیده‌اند. این اثر در دامنه کوه و کنار چشمه‌ای در نزدیکی کرمانشاه قرار دارد.', 2);
INSERT INTO public.places VALUES (60, 'قلعه پرتغالی‌ها', 'قشم', 'هرمزگان', '{"lat": 26.9696, "lng": 56.2731, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D65"}', 'دژی نظامی و بزرگ که توسط استعمارگران پرتغالی در قرن ۱۶ میلادی در جزیره قشم و جزیره هرمز ساخته شد. این قلعه از مهم‌ترین یادگارهای حضور پرتغالی‌ها در خلیج فارس است.', 2);
INSERT INTO public.places VALUES (61, 'تخت سلیمان', 'تکاب', 'آذربایجان غربی', '{"lat": 36.6117, "lng": 47.2690, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D66"}', 'مجموعه تاریخی و مذهبی باستانی شامل آتشکده آذرگشنسب (یکی از سه آتشکده مهم ساسانی)، بقایای کاخ‌ها، و یک دریاچه آب‌زلال است. این مکان در میراث جهانی یونسکو ثبت شده و ترکیبی از تاریخ ایران باستان و دوره اسلامی است.', 2);
INSERT INTO public.places VALUES (62, 'قره کلیسا', 'چالدران', 'آذربایجان غربی', '{"lat": 39.2680, "lng": 44.5501, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D67"}', 'یکی از قدیمی‌ترین و مهم‌ترین کلیساهای ارامنه جهان که قدمت آن به قرن اول میلادی می‌رسد. این کلیسا در چالدران آذربایجان غربی واقع شده و به دلیل اهمیت مذهبی و معماری خاص خود، در یونسکو ثبت شده است.', 2);
INSERT INTO public.places VALUES (63, 'عمارت ملک', 'بندر بوشهر', 'بوشهر', '{"lat": 28.9711, "lng": 50.8351, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D68"}', 'عمارتی تاریخی و بسیار بزرگ در بندر بوشهر که متعلق به محمد ابراهیم خان، یکی از تجار بزرگ دوره قاجار، بوده است. این بنا با سبک معماری بومی و حیاط‌های وسیع، نمادی از معماری دوره قاجار در جنوب ایران است.', 2);
INSERT INTO public.places VALUES (64, 'گنبد قابوس', 'گنبد کاووس', 'گلستان', '{"lat": 37.3712, "lng": 55.1587, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D69"}', 'بلندترین برج تمام آجری دنیا که به دستور قابوس بن وشمگیر در قرن چهارم هجری (دوره آل زیار) در گنبد کاووس ساخته شد. این برج به عنوان شاهکار معماری اسلامی و میراث جهانی یونسکو شناخته می‌شود.', 2);
INSERT INTO public.places VALUES (65, 'مقبره کوروش کبیر', 'پاسارگاد', 'فارس', '{"lat": 30.1930, "lng": 53.1793, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D70"}', 'ساختمان اصلی و سنگی آرامگاه کوروش بزرگ در مجموعه پاسارگاد که بر روی یک سکوی ۶ پله‌ای قرار دارد. این بنا نماد معماری ساده و در عین حال مستحکم هخامنشی و عظمت پادشاهی ایران باستان است.', 2);
INSERT INTO public.places VALUES (66, 'مسجد وکیل', 'شیراز', 'فارس', '{"lat": 29.6087, "lng": 52.5457, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D71"}', 'مسجدی باشکوه و تاریخی در شیراز متعلق به دوره زندیه و به دستور کریمخان زند. این مسجد به داشتن ۷۵۰۰ متر مربع کاشی‌کاری‌های زیبا و شبستان‌های عظیم با ستون‌های مارپیچ معروف است.', 2);
INSERT INTO public.places VALUES (67, 'تپه سیلک', 'کاشان', 'اصفهان', '{"lat": 33.9785, "lng": 51.4285, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D72"}', 'کهن‌ترین زیستگاه فلات ایران که قدمت آن به بیش از ۷۵۰۰ سال پیش (عصر سفالگری) بازمی‌گردد. این تپه شامل دو تپه شمالی و جنوبی است و شواهد مهمی از تمدن‌های پیش از آریایی را در خود جای داده است.', 2);
INSERT INTO public.places VALUES (68, 'باغ دولت آباد', 'یزد', 'یزد', '{"lat": 31.9056, "lng": 54.3752, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D73"}', 'باغی تاریخی در یزد، که به دلیل داشتن بلندترین بادگیر جهان (بیش از ۳۳ متر) شهرت دارد. این باغ نمونه‌ای از معماری کویری و سیستم تهویه هوای سنتی در یزد است و در فهرست میراث جهانی یونسکو قرار دارد.', 2);
INSERT INTO public.places VALUES (69, 'قلعه فلک‌الافلاک', 'خرم‌آباد', 'لرستان', '{"lat": 33.4727, "lng": 48.3582, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D74"}', 'دژ و قلعه‌ای ساسانی که بر فراز تپه‌ای در مرکز خرم‌آباد قرار دارد. این بنا در طول تاریخ به عنوان مرکز حکومتی، زندان و پادگان استفاده شده و اکنون به موزه مردم‌شناسی لرستان تبدیل شده است.', 2);
INSERT INTO public.places VALUES (70, 'پارک ارم', 'تهران', 'تهران', '{"lat": 35.7597, "lng": 51.3093, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D481..."}', 'بزرگترین مجموعه تفریحی و شهربازی ایران که شامل سه شهربازی روباز (لاله، ارم و دنیای جادو) و یک باغ وحش با بیش از ۱۱۰ گونه جانوری است. مکانی عالی برای گذراندن یک روز هیجان‌انگیز.', 3);
INSERT INTO public.places VALUES (71, 'کوروش مال', 'تهران', 'تهران', '{"lat": 35.7601, "lng": 51.3283, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D482..."}', 'یکی از مدرن‌ترین و بزرگترین مراکز خرید تهران در غرب پایتخت که علاوه بر واحدهای تجاری متنوع، دارای پردیس سینمایی مجهز و فودکورت با غذاهای بین‌المللی است و یک مقصد تفریحی کامل محسوب می‌شود.', 3);
INSERT INTO public.places VALUES (72, 'بام لند', 'تهران', 'تهران', '{"lat": 35.7952, "lng": 51.2185, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D483..."}', 'اولین مرکز خرید روباز ایران که در کنار دریاچه چیتگر واقع شده است. این مجموعه با معماری زیبا، شامل فروشگاه‌های برند، رستوران‌ها و کافه‌های متعدد با منظره دریاچه و امکانات تفریحی مانند پیاده‌روی و قایق‌رانی است.', 3);
INSERT INTO public.places VALUES (73, 'سیتی سنتر اصفهان', 'اصفهان', 'اصفهان', '{"lat": 32.6186, "lng": 51.6853, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D484..."}', 'یکی از بزرگترین مراکز خرید خاورمیانه که علاوه بر فروشگاه‌ها، شامل پردیس سینمایی، مرکز همایش، هتل ۵ ستاره و شهربازی سرپوشیده است و یک مجموعه تجاری-تفریحی چندمنظوره محسوب می‌شود.', 3);
INSERT INTO public.places VALUES (74, 'باغ پرندگان', 'اصفهان', 'اصفهان', '{"lat": 32.6500, "lng": 51.6000, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D485..."}', 'باغی زیبا و بزرگ با طراحی خاص در حاشیه زاینده‌رود که محل نگهداری بیش از ۳۰۰۰ پرنده از ۱۳۰ گونه مختلف است. مکانی عالی برای علاقه‌مندان به طبیعت و پرنده‌نگری.', 3);
INSERT INTO public.places VALUES (75, 'مجتمع خلیج فارس', 'شیراز', 'فارس', '{"lat": 29.6922, "lng": 52.4842, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D486..."}', 'بزرگترین مرکز خرید شیراز و یکی از ۱۰ مرکز خرید بزرگ جهان بر اساس مساحت. شامل واحدهای تجاری، پردیس سینمایی، شهربازی سرپوشیده، سالن بیلیارد و هایپرمارکت است.', 3);
INSERT INTO public.places VALUES (76, 'لونا پارک', 'شیراز', 'فارس', '{"lat": 29.5663, "lng": 52.5028, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D487..."}', 'یک شهربازی بزرگ در دامنه کوه دراک شیراز که مشرف به شهر است. دارای دستگاه‌های هیجان‌انگیز، چرخ و فلک بزرگ و امکانات پذیرایی است و منظره شبانه‌روزی زیبایی از شهر ارائه می‌دهد.', 3);
INSERT INTO public.places VALUES (77, 'الماس شرق', 'مشهد', 'خراسان رضوی', '{"lat": 36.3683, "lng": 59.5444, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D488..."}', 'یکی از قدیمی‌ترین و شناخته‌شده‌ترین مراکز خرید مشهد با معماری خاص و گنبد شیشه‌ای بزرگ. این مرکز علاوه بر مغازه‌ها، دارای آب‌نمای موزیکال و شهربازی سرپوشیده نیز هست.', 3);
INSERT INTO public.places VALUES (78, 'سرزمین موج‌های آبی', 'مشهد', 'خراسان رضوی', '{"lat": 36.3333, "lng": 59.5290, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D489..."}', 'یکی از بزرگترین و مجهزترین پارک‌های آبی سرپوشیده در خاورمیانه، با انواع سرسره‌های هیجان‌انگیز، رودخانه آرام، استخر و امکانات ورزشی و رفاهی کامل.', 3);
INSERT INTO public.places VALUES (79, 'مرکز خرید لاله پارک', 'تبریز', 'آذربایجان شرقی', '{"lat": 38.0700, "lng": 46.2620, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D490..."}', 'یک مرکز خرید لوکس و مدرن که میزبان برندهای بین‌المللی و داخلی است. دارای فودکورت، هایپرمارکت و امکانات رفاهی درجه یک برای یک تجربه خرید و تفریح عالی.', 3);
INSERT INTO public.places VALUES (80, 'تله کابین رامسر', 'رامسر', 'مازندران', '{"lat": 36.9209, "lng": 50.6277, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D491..."}', 'یک مجتمع تفریحی ساحلی-کوهستانی که با تله‌کابین، گردشگران را از ساحل دریا به ارتفاعات کوه ایلمیلی می‌برد. شامل رستوران‌ها، کافه‌ها، شهربازی، زیپ‌لاین و کلبه‌های اقامتی است.', 3);
INSERT INTO public.places VALUES (81, 'شهربازی و باغ گلها ساری', 'ساری', 'مازندران', '{"lat": 36.7900, "lng": 53.0782, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D492..."}', 'مجموعه‌ای تفریحی در نزدیکی شهر ساری که شامل شهربازی با دستگاه‌های متنوع برای تمام سنین و همچنین فضای سبز و باغ گلها برای تفریح خانوادگی است.', 3);
INSERT INTO public.places VALUES (82, 'بازار رشت', 'رشت', 'گیلان', '{"lat": 37.2800, "lng": 49.5930, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D493..."}', 'یکی از بزرگترین بازارهای روباز ایران و قلب تپنده تجاری گیلان. این بازار علاوه بر مرکزیت خرید سنتی، به دلیل فضای پرجنب‌وجوش، معماری سنتی و فروش محصولات محلی یک جاذبه تفریحی و فرهنگی نیز محسوب می‌شود.', 3);
INSERT INTO public.places VALUES (83, 'کاسپین مال', 'بندر انزلی', 'گیلان', '{"lat": 37.4720, "lng": 49.4670, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D494..."}', 'مجتمع تجاری-تفریحی واقع در منطقه آزاد انزلی که به دلیل فروش کالاهای وارداتی و برند با قیمت مناسب، و همچنین دارا بودن فودکورت و امکانات تفریحی، مقصد محبوبی برای گردشگران است.', 3);
INSERT INTO public.places VALUES (84, 'کارون مال', 'اهواز', 'خوزستان', '{"lat": 31.3323, "lng": 48.6750, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D495..."}', 'یکی از مراکز خرید بزرگ و مدرن اهواز که به دلیل تنوع کالاها، برندهای پوشاک و همچنین فودکورت و کافه‌های لوکس، از مراکز تجاری پرطرفدار این شهر محسوب می‌شود.', 3);
INSERT INTO public.places VALUES (96, 'مسجد جمکران', 'قم', 'قم', '{"lat": 34.6625, "lng": 50.9329, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D481..."}', 'یکی از مساجد مهم شیعیان که بر اساس روایات، به دستور امام زمان (عج) بنا شده است. این مسجد در حومه شهر قم قرار دارد و هر هفته میزبان زائران بسیاری است.', 4);
INSERT INTO public.places VALUES (85, 'پارک مادر کرمان', 'کرمان', 'کرمان', '{"lat": 30.2900, "lng": 57.0600, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D496..."}', 'یکی از بزرگترین و مجهزترین پارک‌های شهری کرمان که دارای امکانات تفریحی مانند وسایل بازی، زمین‌های ورزشی، و فضای سبز مناسب برای استراحت و پیک‌نیک‌های خانوادگی است.', 3);
INSERT INTO public.places VALUES (86, 'مجتمع تجاری تفریحی ستاره', 'یزد', 'یزد', '{"lat": 31.8900, "lng": 54.3500, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D497..."}', 'یکی از اولین و مهم‌ترین مراکز خرید مدرن یزد که شامل فروشگاه‌های متعدد، سینما، شهربازی سرپوشیده و رستوران‌ها است و مرکزی برای خرید و تفریح خانواده‌ها محسوب می‌شود.', 3);
INSERT INTO public.places VALUES (87, 'سیتی سنتر قشم', 'قشم', 'هرمزگان', '{"lat": 26.9600, "lng": 56.2700, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D498..."}', 'بزرگترین و معروف‌ترین مرکز خرید جزیره قشم که به دلیل تنوع کالاها، به ویژه لوازم آرایشی، پوشاک و لوازم خانگی، مقصد اصلی خرید مسافران منطقه آزاد قشم است.', 3);
INSERT INTO public.places VALUES (88, 'بازار درگهان', 'قشم', 'هرمزگان', '{"lat": 26.9800, "lng": 56.1200, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D499..."}', 'مجموعه‌ای از بازارهای عمده فروشی و خرده فروشی که یکی از قطب‌های تجاری مهم جنوب کشور است و مکانی عالی برای خرید حجم بالا با قیمت مناسب محسوب می‌شود.', 3);
INSERT INTO public.places VALUES (89, 'باغ فاتح (پارک تنیس)', 'کرج', 'البرز', '{"lat": 35.8280, "lng": 50.9820, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D500..."}', 'یکی از قدیمی‌ترین و محبوب‌ترین پارک‌های کرج که به دلیل فضای سبز انبوه و امکانات ورزشی به‌خصوص زمین‌های تنیس استاندارد، پاتوق تفریحی و ورزشی شهروندان است.', 3);
INSERT INTO public.places VALUES (90, 'مجتمع تجاری تفریحی زیتون', 'قم', 'قم', '{"lat": 34.6200, "lng": 50.8800, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D501..."}', 'یکی از مدرن‌ترین و پربازدیدترین مجتمع‌های تجاری در قم که علاوه بر فروشگاه‌ها، دارای فودکورت بزرگ و شهربازی است و به عنوان یک مرکز خرید و تفریح در شهر شناخته می‌شود.', 3);
INSERT INTO public.places VALUES (91, 'مجتمع تجاری آفتاب', 'اراک', 'مرکزی', '{"lat": 34.0800, "lng": 49.6800, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D502..."}', 'یکی از مراکز خرید اصلی و مهم شهر اراک که مجموعه‌ای از فروشگاه‌های لباس، طلا و جواهر و لوازم خانگی را در خود جای داده و به عنوان یکی از پاتوق‌های خرید شهر شناخته می‌شود.', 3);
INSERT INTO public.places VALUES (92, 'مجتمع تجاری سیتادیوم', 'ارومیه', 'آذربایجان غربی', '{"lat": 37.5400, "lng": 45.0700, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D503..."}', 'بزرگترین مرکز خرید ارومیه که علاوه بر تنوع بالای برندهای پوشاک و فروشگاه‌ها، دارای یک پردیس سینمایی مدرن و امکانات تفریحی و رستوران‌های متنوع است.', 3);
INSERT INTO public.places VALUES (93, 'بازار قدیم بوشهر', 'بندر بوشهر', 'بوشهر', '{"lat": 28.9100, "lng": 50.8400, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D504..."}', 'بازار سنتی و تاریخی بندر بوشهر که با معماری سنتی و سقف‌های چوبی، محلی برای خرید انواع ادویه، ماهی و صنایع دستی محلی است و به دلیل قدمت و فضای خاص، یک جاذبه گردشگری نیز محسوب می‌شود.', 3);
INSERT INTO public.places VALUES (94, 'مسجد گوهرشاد', 'مشهد', 'خراسان رضوی', '{"lat": 36.2870, "lng": 59.6100, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D479..."}', 'یکی از مهم‌ترین مساجد تاریخی مشهد که به دستور گوهرشاد بیگم، همسر شاهرخ تیموری، در کنار حرم مطهر امام رضا (ع) بنا شده است و به معماری باشکوه دوران تیموری شهرت دارد.', 4);
INSERT INTO public.places VALUES (97, 'شاهچراغ', 'شیراز', 'فارس', '{"lat": 29.6080, "lng": 52.5441, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D482..."}', 'آرامگاه احمد بن موسی کاظم (ع)، معروف به شاهچراغ، برادر امام رضا (ع). آینه‌کاری‌های داخلی خیره‌کننده و معماری اسلامی بی‌نظیر آن، این مکان را به یک جاذبه مذهبی و هنری تبدیل کرده است.', 4);
INSERT INTO public.places VALUES (98, 'آرامگاه حافظ (حافظیه)', 'شیراز', 'فارس', '{"lat": 29.6008, "lng": 52.5593, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D483A..."}', 'آرامگاه لسان‌الغیب، حافظ شیرازی، شاعر بزرگ قرن هشتم هجری. این مکان یک مرکز ادبی و عرفانی مهم است و معماری زیبای آن نماد فرهنگ ایرانی است.', 4);
INSERT INTO public.places VALUES (99, 'آستانه سید علاءالدین حسین', 'شیراز', 'فارس', '{"lat": 29.6000, "lng": 52.5460, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D484..."}', 'آرامگاه یکی دیگر از فرزندان امام موسی کاظم (ع)، که در نزدیکی شاهچراغ واقع شده و دارای معماری و تزیینات مذهبی زیبایی است.', 4);
INSERT INTO public.places VALUES (100, 'آرامگاه سعدی (سعدیه)', 'شیراز', 'فارس', '{"lat": 29.6000, "lng": 52.5700, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D485A..."}', 'آرامگاه استاد سخن، شیخ مصلح الدین سعدی شیرازی. این مکان علاوه بر ارزش ادبی، دارای معماری چشم‌نواز و فضایی معنوی است.', 4);
INSERT INTO public.places VALUES (101, 'مسجد جامع اصفهان', 'اصفهان', 'اصفهان', '{"lat": 32.6601, "lng": 51.6780, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D486..."}', 'یکی از قدیمی‌ترین و مهم‌ترین بناهای مذهبی در ایران که شامل سبک‌های مختلف معماری از دوران عباسی تا قاجار است و یک شاهکار معماری اسلامی محسوب می‌شود.', 4);
INSERT INTO public.places VALUES (102, 'کلیسای وانک', 'اصفهان', 'اصفهان', '{"lat": 32.6318, "lng": 51.6560, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D487..."}', 'زیباترین کلیسای تاریخی ایران در محله جلفا که به دلیل نقاشی‌های دیواری شگفت‌انگیز و ترکیب هنر ایرانی و اروپایی شهرت جهانی دارد.', 4);
INSERT INTO public.places VALUES (103, 'مسجد آقا بزرگ', 'کاشان', 'اصفهان', '{"lat": 33.9875, "lng": 51.4428, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D488..."}', 'مسجدی تاریخی و مدرسه علمیه در کاشان با معماری خاص گودال باغچه و سقف‌های چوبی زیبا، یکی از نمونه‌های برجسته معماری دوره قاجار.', 4);
INSERT INTO public.places VALUES (104, 'آرامگاه سید رکن الدین', 'یزد', 'یزد', '{"lat": 31.8980, "lng": 54.3660, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D489A..."}', 'آرامگاهی با شکوه در نزدیکی مسجد جامع یزد که دارای گنبد کاشی‌کاری شده آبی فیروزه‌ای و معماری دوره ایلخانی است و به عنوان یک مکان مذهبی-تاریخی مهم شناخته می‌شود.', 4);
INSERT INTO public.places VALUES (105, 'آتشکده زرتشتیان یزد', 'یزد', 'یزد', '{"lat": 31.8950, "lng": 54.3400, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D490..."}', 'مکان مقدس زرتشتیان که آتش ورهرام در آن بیش از ۱۵۰۰ سال است که روشن نگاه داشته شده. این مکان به دلیل اهمیت مذهبی و معماری خاصش مورد بازدید قرار می‌گیرد.', 4);
INSERT INTO public.places VALUES (106, 'کلیسای سنت استپانوس', 'جلفا', 'آذربایجان شرقی', '{"lat": 38.9700, "lng": 46.2000, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D493..."}', 'کلیسای تاریخی ارامنه که در منطقه‌ای کوهستانی واقع شده و جزو میراث جهانی یونسکو است. معماری قرون وسطایی و موقعیت طبیعی آن بی‌نظیر است.', 4);
INSERT INTO public.places VALUES (107, 'کلیسای مریم مقدس', 'ارومیه', 'آذربایجان غربی', '{"lat": 37.5540, "lng": 45.0740, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D494..."}', 'یکی از قدیمی‌ترین کلیساهای ایران و جهان که قدمت آن به دوران ساسانی و حتی قبل از آن باز می‌گردد و از نظر مذهبی برای مسیحیان بسیار حائز اهمیت است.', 4);
INSERT INTO public.places VALUES (108, 'قره کلیسا (تاتاووس مقدس)', 'چالدران', 'آذربایجان غربی', '{"lat": 39.0910, "lng": 44.4980, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D495A..."}', 'یکی از قدیمی‌ترین کلیساهای جهان مسیحیت و از مهم‌ترین مکان‌های مذهبی ارامنه. این کلیسا به دلیل معماری منحصربه‌فرد و رنگ سنگ‌هایش مشهور است و ثبت جهانی یونسکو می‌باشد.', 4);
INSERT INTO public.places VALUES (109, 'آرامگاه بایزید بسطامی', 'بسطام', 'سمنان', '{"lat": 36.4350, "lng": 54.9860, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D497..."}', 'مجموعه آرامگاهی شامل مزار یکی از بزرگترین عرفای ایران، بایزید بسطامی، که به دلیل معماری عرفانی و آرامش خاص محیط، مورد توجه است.', 4);
INSERT INTO public.places VALUES (110, 'زیارتگاه خالد نبی', 'کلاله', 'گلستان', '{"lat": 37.8100, "lng": 55.4800, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D498..."}', 'آرامگاه منسوب به یکی از پیامبران الهی، با طبیعت تپه‌ای و گورستان تاریخی عجیب و مرموز که در منطقه‌ای دورافتاده و خوش آب و هوا قرار دارد.', 4);
INSERT INTO public.places VALUES (111, 'آرامگاه دانیال نبی (ع)', 'شوش', 'خوزستان', '{"lat": 32.2030, "lng": 48.2435, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D499..."}', 'مزار یکی از پیامبران بنی‌اسرائیل با گنبد پلکانی خاص و منحصربه‌فرد که به عنوان یک نماد مذهبی و معماری در منطقه شناخته می‌شود.', 4);
INSERT INTO public.places VALUES (112, 'مسجد جامع شوشتر', 'شوشتر', 'خوزستان', '{"lat": 32.0300, "lng": 48.8600, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D500..."}', 'یکی از قدیمی‌ترین مساجد ایران که در قرون اولیه اسلامی بنا شده و دارای معماری تلفیقی از دوره‌های مختلف است.', 4);
INSERT INTO public.places VALUES (113, 'آرامگاه یعقوب لیث صفاری', 'دزفول', 'خوزستان', '{"lat": 32.3910, "lng": 48.4230, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D501A..."}', 'آرامگاه بنیانگذار سلسله صفاریان، که به دلیل داشتن گنبد مضرس و مخروطی شکل و موقعیت تاریخی، یک مکان مذهبی-ملی مهم محسوب می‌شود.', 4);
INSERT INTO public.places VALUES (114, 'امامزاده صالح', 'تهران', 'تهران', '{"lat": 35.8052, "lng": 51.4284, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D502..."}', 'آرامگاه یکی از نوادگان امام موسی کاظم (ع) در منطقه تجریش تهران که یکی از پربازدیدترین اماکن مذهبی پایتخت است و به معماری و کاشی‌کاری‌های زیبای قاجاری شهرت دارد.', 4);
INSERT INTO public.places VALUES (115, 'کلیسای ننه مریم', 'ارومیه', 'آذربایجان غربی', '{"lat": 37.5540, "lng": 45.0740, "url": "https://www.google.com/maps/place/Golestan+Palace/@35.6797566,51.4179378,17z/data=!4m14!1m7!3m6!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!2sGolestan+Palace!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs!3m5!1s0x3f8e01f27917eb6b:0xe953925ee5058ce!8m2!3d35.6797523!4d51.4205181!16zL20vMDF0ZzVs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D4812A..."}', 'یکی از قدیمی‌ترین کلیساهای جهان و از نظر تاریخی و مذهبی برای مسیحیان بسیار حائز اهمیت است و قدمت آن به دوران ساسانی باز می‌گردد.', 4);


--
-- Data for Name: provinces; Type: TABLE DATA; Schema: public; Owner: irangard
--

INSERT INTO public.provinces VALUES ('تهران');
INSERT INTO public.provinces VALUES ('اصفهان');
INSERT INTO public.provinces VALUES ('فارس');
INSERT INTO public.provinces VALUES ('یزد');
INSERT INTO public.provinces VALUES ('مازندران');
INSERT INTO public.provinces VALUES ('گیلان');
INSERT INTO public.provinces VALUES ('خوزستان');
INSERT INTO public.provinces VALUES ('آذربایجان شرقی');
INSERT INTO public.provinces VALUES ('خراسان رضوی');
INSERT INTO public.provinces VALUES ('کرمان');
INSERT INTO public.provinces VALUES ('هرمزگان');
INSERT INTO public.provinces VALUES ('سمنان');
INSERT INTO public.provinces VALUES ('همدان');
INSERT INTO public.provinces VALUES ('لرستان');
INSERT INTO public.provinces VALUES ('اردبیل');
INSERT INTO public.provinces VALUES ('گلستان');
INSERT INTO public.provinces VALUES ('سیستان و بلوچستان');
INSERT INTO public.provinces VALUES ('آذربایجان غربی');
INSERT INTO public.provinces VALUES ('کردستان');
INSERT INTO public.provinces VALUES ('بوشهر');
INSERT INTO public.provinces VALUES ('کرمانشاه');
INSERT INTO public.provinces VALUES ('البرز');
INSERT INTO public.provinces VALUES ('قم');
INSERT INTO public.provinces VALUES ('مرکزی');


--
-- Data for Name: trip_invitations; Type: TABLE DATA; Schema: public; Owner: irangard
--

INSERT INTO public.trip_invitations VALUES (2, 1, 2, 4, 'PENDING', '2026-02-13 10:00:49.290505+00');
INSERT INTO public.trip_invitations VALUES (4, 2, 2, 4, 'PENDING', '2026-02-13 10:11:01.42441+00');
INSERT INTO public.trip_invitations VALUES (1, 1, 2, 3, 'ACCEPTED', '2026-02-13 10:00:49.272115+00');
INSERT INTO public.trip_invitations VALUES (3, 2, 2, 3, 'ACCEPTED', '2026-02-13 10:11:01.424596+00');
INSERT INTO public.trip_invitations VALUES (6, 3, 3, 1, 'PENDING', '2026-02-13 12:53:20.342899+00');
INSERT INTO public.trip_invitations VALUES (7, 4, 3, 10, 'PENDING', '2026-02-13 12:59:30.807602+00');
INSERT INTO public.trip_invitations VALUES (8, 4, 3, 2, 'PENDING', '2026-02-13 12:59:30.806516+00');
INSERT INTO public.trip_invitations VALUES (9, 4, 3, 1, 'PENDING', '2026-02-13 12:59:30.8075+00');
INSERT INTO public.trip_invitations VALUES (5, 3, 3, 2, 'ACCEPTED', '2026-02-13 12:53:20.317455+00');


--
-- Data for Name: trip_location_votes; Type: TABLE DATA; Schema: public; Owner: irangard
--



--
-- Data for Name: trip_locations; Type: TABLE DATA; Schema: public; Owner: irangard
--

INSERT INTO public.trip_locations VALUES (1, 56, false, '2026-02-13 10:00:49.066905+00');
INSERT INTO public.trip_locations VALUES (1, 111, false, '2026-02-13 10:00:49.066905+00');
INSERT INTO public.trip_locations VALUES (1, 89, false, '2026-02-13 10:00:49.066905+00');
INSERT INTO public.trip_locations VALUES (2, 4, false, '2026-02-13 10:11:01.217792+00');
INSERT INTO public.trip_locations VALUES (2, 114, false, '2026-02-13 10:11:01.217792+00');
INSERT INTO public.trip_locations VALUES (2, 3, false, '2026-02-13 10:11:01.217792+00');
INSERT INTO public.trip_locations VALUES (2, 70, false, '2026-02-13 10:11:01.217792+00');
INSERT INTO public.trip_locations VALUES (2, 1, false, '2026-02-13 10:11:01.217792+00');
INSERT INTO public.trip_locations VALUES (2, 56, false, '2026-02-13 10:11:01.217792+00');
INSERT INTO public.trip_locations VALUES (3, 7, false, '2026-02-13 12:53:20.14412+00');
INSERT INTO public.trip_locations VALUES (3, 36, false, '2026-02-13 12:53:20.14412+00');
INSERT INTO public.trip_locations VALUES (4, 6, false, '2026-02-13 12:59:30.606122+00');
INSERT INTO public.trip_locations VALUES (4, 37, false, '2026-02-13 12:59:30.606122+00');
INSERT INTO public.trip_locations VALUES (4, 5, false, '2026-02-13 12:59:30.606122+00');


--
-- Data for Name: trip_participants; Type: TABLE DATA; Schema: public; Owner: irangard
--

INSERT INTO public.trip_participants VALUES (1, 2);
INSERT INTO public.trip_participants VALUES (2, 2);
INSERT INTO public.trip_participants VALUES (1, 3);
INSERT INTO public.trip_participants VALUES (2, 3);
INSERT INTO public.trip_participants VALUES (3, 3);
INSERT INTO public.trip_participants VALUES (4, 3);
INSERT INTO public.trip_participants VALUES (3, 2);


--
-- Data for Name: trip_plan_locations; Type: TABLE DATA; Schema: public; Owner: irangard
--

INSERT INTO public.trip_plan_locations VALUES (1, 56, 0, 120);
INSERT INTO public.trip_plan_locations VALUES (1, 111, 1, 120);
INSERT INTO public.trip_plan_locations VALUES (2, 89, 0, 120);
INSERT INTO public.trip_plan_locations VALUES (3, 4, 0, 120);
INSERT INTO public.trip_plan_locations VALUES (3, 1, 1, 120);
INSERT INTO public.trip_plan_locations VALUES (3, 3, 2, 120);
INSERT INTO public.trip_plan_locations VALUES (4, 70, 0, 120);
INSERT INTO public.trip_plan_locations VALUES (4, 114, 1, 120);
INSERT INTO public.trip_plan_locations VALUES (5, 56, 0, 120);


--
-- Data for Name: trip_plan_votes; Type: TABLE DATA; Schema: public; Owner: irangard
--

INSERT INTO public.trip_plan_votes VALUES (3, 2, 'LIKE');
INSERT INTO public.trip_plan_votes VALUES (4, 2, 'DISLIKE');
INSERT INTO public.trip_plan_votes VALUES (5, 2, 'LIKE');


--
-- Data for Name: trip_plans; Type: TABLE DATA; Schema: public; Owner: irangard
--

INSERT INTO public.trip_plans VALUES (1, 1, 'روز اول', 'شوش', '2026-02-13 10:01:24.400522+00');
INSERT INTO public.trip_plans VALUES (2, 1, 'روز دوم', 'کرج', '2026-02-13 10:01:24.426718+00');
INSERT INTO public.trip_plans VALUES (3, 2, 'روز اول', 'تهران', '2026-02-13 10:15:16.851481+00');
INSERT INTO public.trip_plans VALUES (4, 2, 'روز دوم', 'تهران', '2026-02-13 10:15:16.884431+00');
INSERT INTO public.trip_plans VALUES (5, 2, 'روز سوم', 'شوش', '2026-02-13 10:15:16.895547+00');


--
-- Data for Name: trips; Type: TABLE DATA; Schema: public; Owner: irangard
--

INSERT INTO public.trips VALUES (1, 2, '2026-02-13', '2026-02-16', 'ONGOING', '/static/images/cities/شوش.jpg', '{شوش,کرج}');
INSERT INTO public.trips VALUES (2, 2, '2026-02-13', '2026-02-15', 'COMPLETED', '/static/images/cities/تهران.jpg', '{شوش,تهران}');
INSERT INTO public.trips VALUES (3, 3, '2026-02-18', '2026-03-04', 'COMPLETED', '/static/images/cities/اصفهان.jpg', '{اصفهان}');
INSERT INTO public.trips VALUES (4, 3, '2026-02-18', '2026-03-11', 'COMPLETED', '/static/images/cities/اصفهان.jpg', '{اصفهان}');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: irangard
--

INSERT INTO public.users VALUES (5, 'admin', 'admin@iranggard.com', '$2b$12$oOKjcmJeA.5Heyv8m5Qa6.Us/44k9kTT8HnHjCmf4dHe2rbMW4hPW', 'Other', '/static/images/genders/Other.png', NULL, NULL, '{}');
INSERT INTO public.users VALUES (8, 'Moien34', 'moientalebinew@gmail.com', '$2b$12$MTf7wyOstpirLBRQV82WRedMRn8ocivtjF6JLrfIO.mcVgRuu4viy', 'Male', '/static/images/genders/Male.png', 'ترجیح می‌دهم نگویم', 'سکوتم بشکنه، خیلیا میشکنن... ', '{Nature,Historical,Entertainment}');
INSERT INTO public.users VALUES (2, 'ali', 'ali@iranggard.com', '$2b$12$oOKjcmJeA.5Heyv8m5Qa6.Us/44k9kTT8HnHjCmf4dHe2rbMW4hPW', 'Male', '/static/images/genders/Male.png', 'ali abbasi', 'Loving this', '{Nature,Historical}');
INSERT INTO public.users VALUES (12, 'donya', 'fd.mehrabi@gmail.com', '$2b$12$kktKJgL91QaLxJt8No8d5Odpj8W94teZzFCJf3NxaHRXMrW2WV/be', 'Female', '/static/images/genders/Female.png', 'دنیا محرابی', 'من عاشق طبیعتم', '{Nature,Entertainment}');
INSERT INTO public.users VALUES (3, 'yasamin', 'yasamin@iranggard.com', '$2b$12$oOKjcmJeA.5Heyv8m5Qa6.Us/44k9kTT8HnHjCmf4dHe2rbMW4hPW', 'Female', '/static/images/genders/Female.png', 'یاسمین ریاحی', NULL, '{Nature,Historical,Entertainment}');
INSERT INTO public.users VALUES (9, 'Abolfazl', 'abolfazl.sheikhoveisi@gmail.com', '$2b$12$mLK8NPzswqdLtGu1S17ptu.34IvdJB6Zmmf9wv7KT4/uDDmypQdtq', 'Female', '/static/images/genders/Female.png', 'ابولفضل', 'نسفر نسفر نسفر', '{Nature,Historical}');
INSERT INTO public.users VALUES (10, 'Ranger', 'rangermaryam6@gmail.com', '$2b$12$JQgMhNyEmVcL38Ejtdy09OQ0ePh5kErIln7q8anFFE59u7kY0YBpi', 'Female', '/static/images/genders/Female.png', NULL, 'پرواز را به خاطر بسپار پرنده مردنیست💔😔', '{Nature,Historical}');
INSERT INTO public.users VALUES (1, 'mmd', 'mmd@iranggard.com', '$2b$12$oOKjcmJeA.5Heyv8m5Qa6.Us/44k9kTT8HnHjCmf4dHe2rbMW4hPW', 'Male', '/static/images/genders/Male.png', 'ممد عابد', NULL, '{Entertainment}');
INSERT INTO public.users VALUES (11, 'Mmdreza_abedin_varamin', 'sepehr.ghardashi@gmail.com', '$2b$12$ZqA2As5hvsp5jcwdUE0lkeWNp0HwQfO14lMwTN4Q70rLHPr0FKnqW', 'Other', '/static/images/genders/Other.png', 'Mmd Abed Var', 'Varamin <3', '{Entertainment}');
INSERT INTO public.users VALUES (4, 'kimia', 'kimia@iranggard.com', '$2b$12$oOKjcmJeA.5Heyv8m5Qa6.Us/44k9kTT8HnHjCmf4dHe2rbMW4hPW', 'Female', '/static/images/genders/Female.png', 'کیمیا', 'سفر سفر سفر', '{Nature,Historical,Entertainment}');
INSERT INTO public.users VALUES (13, 'kimkim', 'kimiasq83@gmail.com', '$2b$12$L3WZZ9h3w1CePjxxx0psO.SsNb99QTqPObDOev4I3rO6pGOjPfjOG', 'Male', 'default.jpg', NULL, NULL, '{}');
INSERT INTO public.users VALUES (14, 'traveller', 'kimiasa730@gmail.com', '$2b$12$kpzXNMdXwsbWwBY3Ca827evzAkrfwfHJuNb3nChxX0j.iAoyI1YiO', 'Male', 'default.jpg', NULL, NULL, '{}');
INSERT INTO public.users VALUES (7, 'amir', 'mehrzadian.amir@gmail.com', '$2b$12$Tik/kEWWUr2C/xdEM9FdPerZ6K0nrV6BIWSWghJzCEGxf9XdGv1iO', 'Male', '/static/images/genders/Male.png', NULL, 'doivofivn', '{Nature}');
INSERT INTO public.users VALUES (6, 'Ali1', 'abbasi8312@gmail.com', '$2b$12$1adZahK8fbc45Ir.D/8HmuEMITaTs7aUMPXngE3rrtDMXPmxDTdna', 'Male', 'default.jpg', NULL, NULL, '{}');


--
-- Data for Name: verification_codes; Type: TABLE DATA; Schema: public; Owner: irangard
--

INSERT INTO public.verification_codes VALUES (2, 'amirhosseinassaran18@gmail.com', '551829', 'signup', '2025-12-12 17:42:22.269664', '2025-12-12 20:54:22.351292', false);
INSERT INTO public.verification_codes VALUES (3, 'abbasi8312@gmail.com', '146667', 'signup', '2025-12-12 17:42:22.269664', '2025-12-12 21:39:34.342246', true);
INSERT INTO public.verification_codes VALUES (4, 'rezajeffrey19@gmail.com', '855664', 'signup', '2025-12-16 12:07:29.031476', '2025-12-16 18:36:16.749448', false);
INSERT INTO public.verification_codes VALUES (5, 'abbasi8313@gmail.com', '569615', 'signup', '2025-12-23 15:53:05.075681', '2025-12-23 16:19:55.517031', false);
INSERT INTO public.verification_codes VALUES (6, 'mehrzadian.amir@gmail.com', '870709', 'signup', '2025-12-23 15:53:05.075681', '2025-12-23 16:23:51.563183', true);
INSERT INTO public.verification_codes VALUES (7, 'moientalebinew@gmail.com', '260090', 'signup', '2025-12-23 15:53:05.075681', '2025-12-23 17:33:20.948572', true);
INSERT INTO public.verification_codes VALUES (8, 'abolfazl.sheikhoveisi@gmail.com', '811844', 'signup', '2025-12-23 15:53:05.075681', '2025-12-23 17:34:52.278928', true);
INSERT INTO public.verification_codes VALUES (9, 'rangermaryam6@gmail.com', '148493', 'signup', '2025-12-23 15:53:05.075681', '2025-12-24 05:46:11.307051', true);
INSERT INTO public.verification_codes VALUES (10, 'sepehr.ghardashi@gmail.com', '834469', 'signup', '2025-12-23 15:53:05.075681', '2025-12-28 14:13:53.890914', true);
INSERT INTO public.verification_codes VALUES (11, 'fd.mehrabi@gmmail.com', '524290', 'signup', '2025-12-23 15:53:05.075681', '2025-12-31 16:58:16.214213', false);
INSERT INTO public.verification_codes VALUES (12, 'fd.mehrabi@gmail.com', '282504', 'signup', '2025-12-23 15:53:05.075681', '2025-12-31 16:59:29.212607', true);
INSERT INTO public.verification_codes VALUES (13, 'kimiasq83@gmail.com', '501509', 'signup', '2026-02-13 12:05:35.152925', '2026-02-13 12:41:07.20724', true);
INSERT INTO public.verification_codes VALUES (14, 'kimiasa730@gmial.com', '655639', 'signup', '2026-02-13 12:31:48.832261', '2026-02-13 12:42:52.20024', false);
INSERT INTO public.verification_codes VALUES (15, 'kimiasa730@gmail.com', '481791', 'signup', '2026-02-13 12:31:48.832261', '2026-02-13 12:44:16.646281', true);
INSERT INTO public.verification_codes VALUES (17, 'mehrzadian.amir@gmail.com', '493686', 'reset', '2026-02-13 12:46:38.988266', '2026-02-13 13:03:50.514008', true);
INSERT INTO public.verification_codes VALUES (19, 'abbasi8312@gmail.com', '872547', 'reset', '2026-02-13 12:46:38.988266', '2026-02-13 13:10:11.104178', true);


--
-- Data for Name: wishlist; Type: TABLE DATA; Schema: public; Owner: irangard
--

INSERT INTO public.wishlist VALUES (2, 79, '2025-12-23');
INSERT INTO public.wishlist VALUES (7, 80, '2025-12-23');
INSERT INTO public.wishlist VALUES (3, 24, '2025-12-23');
INSERT INTO public.wishlist VALUES (5, 24, '2025-12-24');
INSERT INTO public.wishlist VALUES (12, 19, '2025-12-31');
INSERT INTO public.wishlist VALUES (4, 24, '2026-01-02');
INSERT INTO public.wishlist VALUES (2, 4, '2026-02-13');


--
-- Name: expenses_expense_id_seq; Type: SEQUENCE SET; Schema: public; Owner: irangard
--

SELECT pg_catalog.setval('public.expenses_expense_id_seq', 3, true);


--
-- Name: friendships_friendship_id_seq; Type: SEQUENCE SET; Schema: public; Owner: irangard
--

SELECT pg_catalog.setval('public.friendships_friendship_id_seq', 22, true);


--
-- Name: place_photos_photo_num_seq; Type: SEQUENCE SET; Schema: public; Owner: irangard
--

SELECT pg_catalog.setval('public.place_photos_photo_num_seq', 368, true);


--
-- Name: place_reviews_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: irangard
--

SELECT pg_catalog.setval('public.place_reviews_review_id_seq', 20, true);


--
-- Name: places_place_id_seq; Type: SEQUENCE SET; Schema: public; Owner: irangard
--

SELECT pg_catalog.setval('public.places_place_id_seq', 115, true);


--
-- Name: trip_invitations_invitation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: irangard
--

SELECT pg_catalog.setval('public.trip_invitations_invitation_id_seq', 9, true);


--
-- Name: trip_plans_plan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: irangard
--

SELECT pg_catalog.setval('public.trip_plans_plan_id_seq', 5, true);


--
-- Name: trips_trip_id_seq; Type: SEQUENCE SET; Schema: public; Owner: irangard
--

SELECT pg_catalog.setval('public.trips_trip_id_seq', 4, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: irangard
--

SELECT pg_catalog.setval('public.users_user_id_seq', 14, true);


--
-- Name: verification_codes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: irangard
--

SELECT pg_catalog.setval('public.verification_codes_id_seq', 19, true);


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: cities cities_pkey; Type: CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.cities
    ADD CONSTRAINT cities_pkey PRIMARY KEY (city_name);


--
-- Name: expense_participants expense_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.expense_participants
    ADD CONSTRAINT expense_participants_pkey PRIMARY KEY (expense_id, user_id);


--
-- Name: expenses expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_pkey PRIMARY KEY (expense_id);


--
-- Name: friendships friendships_pkey; Type: CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.friendships
    ADD CONSTRAINT friendships_pkey PRIMARY KEY (friendship_id);


--
-- Name: liked_reviews liked_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.liked_reviews
    ADD CONSTRAINT liked_reviews_pkey PRIMARY KEY (review_id, user_id);


--
-- Name: place_photos place_photos_pkey; Type: CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.place_photos
    ADD CONSTRAINT place_photos_pkey PRIMARY KEY (photo_num);


--
-- Name: place_reviews place_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.place_reviews
    ADD CONSTRAINT place_reviews_pkey PRIMARY KEY (review_id);


--
-- Name: places places_pkey; Type: CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.places
    ADD CONSTRAINT places_pkey PRIMARY KEY (place_id);


--
-- Name: provinces provinces_pkey; Type: CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.provinces
    ADD CONSTRAINT provinces_pkey PRIMARY KEY (province_name);


--
-- Name: trip_invitations trip_invitations_pkey; Type: CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.trip_invitations
    ADD CONSTRAINT trip_invitations_pkey PRIMARY KEY (invitation_id);


--
-- Name: trip_location_votes trip_location_votes_pkey; Type: CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.trip_location_votes
    ADD CONSTRAINT trip_location_votes_pkey PRIMARY KEY (trip_id, place_id, user_id);


--
-- Name: trip_locations trip_locations_pkey; Type: CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.trip_locations
    ADD CONSTRAINT trip_locations_pkey PRIMARY KEY (trip_id, place_id);


--
-- Name: trip_participants trip_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.trip_participants
    ADD CONSTRAINT trip_participants_pkey PRIMARY KEY (trip_id, user_id);


--
-- Name: trip_plan_locations trip_plan_locations_pkey; Type: CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.trip_plan_locations
    ADD CONSTRAINT trip_plan_locations_pkey PRIMARY KEY (plan_id, place_id);


--
-- Name: trip_plan_votes trip_plan_votes_pkey; Type: CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.trip_plan_votes
    ADD CONSTRAINT trip_plan_votes_pkey PRIMARY KEY (plan_id, user_id);


--
-- Name: trip_plans trip_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.trip_plans
    ADD CONSTRAINT trip_plans_pkey PRIMARY KEY (plan_id);


--
-- Name: trips trips_pkey; Type: CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.trips
    ADD CONSTRAINT trips_pkey PRIMARY KEY (trip_id);


--
-- Name: friendships unique_friendship; Type: CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.friendships
    ADD CONSTRAINT unique_friendship UNIQUE (requester_id, addressee_id);


--
-- Name: place_reviews unique_user_place_review; Type: CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.place_reviews
    ADD CONSTRAINT unique_user_place_review UNIQUE (user_id, place_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: verification_codes verification_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.verification_codes
    ADD CONSTRAINT verification_codes_pkey PRIMARY KEY (id);


--
-- Name: wishlist wishlist_pkey; Type: CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT wishlist_pkey PRIMARY KEY (user_id, place_id);


--
-- Name: ix_expenses_expense_id; Type: INDEX; Schema: public; Owner: irangard
--

CREATE INDEX ix_expenses_expense_id ON public.expenses USING btree (expense_id);


--
-- Name: ix_friendships_friendship_id; Type: INDEX; Schema: public; Owner: irangard
--

CREATE INDEX ix_friendships_friendship_id ON public.friendships USING btree (friendship_id);


--
-- Name: ix_place_photos_place_id; Type: INDEX; Schema: public; Owner: irangard
--

CREATE INDEX ix_place_photos_place_id ON public.place_photos USING btree (place_id);


--
-- Name: ix_place_reviews_review_id; Type: INDEX; Schema: public; Owner: irangard
--

CREATE INDEX ix_place_reviews_review_id ON public.place_reviews USING btree (review_id);


--
-- Name: ix_places_city_name; Type: INDEX; Schema: public; Owner: irangard
--

CREATE INDEX ix_places_city_name ON public.places USING btree (city_name);


--
-- Name: ix_places_place_id; Type: INDEX; Schema: public; Owner: irangard
--

CREATE INDEX ix_places_place_id ON public.places USING btree (place_id);


--
-- Name: ix_trip_invitations_invitation_id; Type: INDEX; Schema: public; Owner: irangard
--

CREATE INDEX ix_trip_invitations_invitation_id ON public.trip_invitations USING btree (invitation_id);


--
-- Name: ix_trip_plans_plan_id; Type: INDEX; Schema: public; Owner: irangard
--

CREATE INDEX ix_trip_plans_plan_id ON public.trip_plans USING btree (plan_id);


--
-- Name: ix_trips_trip_id; Type: INDEX; Schema: public; Owner: irangard
--

CREATE INDEX ix_trips_trip_id ON public.trips USING btree (trip_id);


--
-- Name: ix_users_email; Type: INDEX; Schema: public; Owner: irangard
--

CREATE UNIQUE INDEX ix_users_email ON public.users USING btree (email);


--
-- Name: ix_users_user_id; Type: INDEX; Schema: public; Owner: irangard
--

CREATE INDEX ix_users_user_id ON public.users USING btree (user_id);


--
-- Name: ix_users_username; Type: INDEX; Schema: public; Owner: irangard
--

CREATE UNIQUE INDEX ix_users_username ON public.users USING btree (username);


--
-- Name: ix_verification_codes_email; Type: INDEX; Schema: public; Owner: irangard
--

CREATE INDEX ix_verification_codes_email ON public.verification_codes USING btree (email);


--
-- Name: ix_verification_codes_id; Type: INDEX; Schema: public; Owner: irangard
--

CREATE INDEX ix_verification_codes_id ON public.verification_codes USING btree (id);


--
-- Name: expense_participants expense_participants_expense_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.expense_participants
    ADD CONSTRAINT expense_participants_expense_id_fkey FOREIGN KEY (expense_id) REFERENCES public.expenses(expense_id) ON DELETE CASCADE;


--
-- Name: expense_participants expense_participants_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.expense_participants
    ADD CONSTRAINT expense_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: expenses expenses_payer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_payer_id_fkey FOREIGN KEY (payer_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: expenses expenses_trip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(trip_id) ON DELETE CASCADE;


--
-- Name: friendships friendships_addressee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.friendships
    ADD CONSTRAINT friendships_addressee_id_fkey FOREIGN KEY (addressee_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: friendships friendships_requester_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.friendships
    ADD CONSTRAINT friendships_requester_id_fkey FOREIGN KEY (requester_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: liked_reviews liked_reviews_review_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.liked_reviews
    ADD CONSTRAINT liked_reviews_review_id_fkey FOREIGN KEY (review_id) REFERENCES public.place_reviews(review_id) ON DELETE CASCADE;


--
-- Name: liked_reviews liked_reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.liked_reviews
    ADD CONSTRAINT liked_reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: place_photos place_photos_place_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.place_photos
    ADD CONSTRAINT place_photos_place_id_fkey FOREIGN KEY (place_id) REFERENCES public.places(place_id) ON DELETE CASCADE;


--
-- Name: place_reviews place_reviews_place_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.place_reviews
    ADD CONSTRAINT place_reviews_place_id_fkey FOREIGN KEY (place_id) REFERENCES public.places(place_id) ON DELETE CASCADE;


--
-- Name: place_reviews place_reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.place_reviews
    ADD CONSTRAINT place_reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: places places_city_name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.places
    ADD CONSTRAINT places_city_name_fkey FOREIGN KEY (city_name) REFERENCES public.cities(city_name) ON DELETE SET NULL;


--
-- Name: places places_province_name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.places
    ADD CONSTRAINT places_province_name_fkey FOREIGN KEY (province_name) REFERENCES public.provinces(province_name) ON DELETE SET NULL;


--
-- Name: trip_invitations trip_invitations_receiver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.trip_invitations
    ADD CONSTRAINT trip_invitations_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: trip_invitations trip_invitations_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.trip_invitations
    ADD CONSTRAINT trip_invitations_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: trip_invitations trip_invitations_trip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.trip_invitations
    ADD CONSTRAINT trip_invitations_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(trip_id) ON DELETE CASCADE;


--
-- Name: trip_location_votes trip_location_votes_place_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.trip_location_votes
    ADD CONSTRAINT trip_location_votes_place_id_fkey FOREIGN KEY (place_id) REFERENCES public.places(place_id) ON DELETE CASCADE;


--
-- Name: trip_location_votes trip_location_votes_trip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.trip_location_votes
    ADD CONSTRAINT trip_location_votes_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(trip_id) ON DELETE CASCADE;


--
-- Name: trip_location_votes trip_location_votes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.trip_location_votes
    ADD CONSTRAINT trip_location_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: trip_locations trip_locations_place_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.trip_locations
    ADD CONSTRAINT trip_locations_place_id_fkey FOREIGN KEY (place_id) REFERENCES public.places(place_id) ON DELETE CASCADE;


--
-- Name: trip_locations trip_locations_trip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.trip_locations
    ADD CONSTRAINT trip_locations_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(trip_id) ON DELETE CASCADE;


--
-- Name: trip_participants trip_participants_trip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.trip_participants
    ADD CONSTRAINT trip_participants_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(trip_id) ON DELETE CASCADE;


--
-- Name: trip_participants trip_participants_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.trip_participants
    ADD CONSTRAINT trip_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: trip_plan_locations trip_plan_locations_place_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.trip_plan_locations
    ADD CONSTRAINT trip_plan_locations_place_id_fkey FOREIGN KEY (place_id) REFERENCES public.places(place_id) ON DELETE CASCADE;


--
-- Name: trip_plan_locations trip_plan_locations_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.trip_plan_locations
    ADD CONSTRAINT trip_plan_locations_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.trip_plans(plan_id) ON DELETE CASCADE;


--
-- Name: trip_plan_votes trip_plan_votes_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.trip_plan_votes
    ADD CONSTRAINT trip_plan_votes_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.trip_plans(plan_id) ON DELETE CASCADE;


--
-- Name: trip_plan_votes trip_plan_votes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.trip_plan_votes
    ADD CONSTRAINT trip_plan_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: trip_plans trip_plans_city_name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.trip_plans
    ADD CONSTRAINT trip_plans_city_name_fkey FOREIGN KEY (city_name) REFERENCES public.cities(city_name) ON DELETE SET NULL;


--
-- Name: trip_plans trip_plans_trip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.trip_plans
    ADD CONSTRAINT trip_plans_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(trip_id) ON DELETE CASCADE;


--
-- Name: trips trips_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.trips
    ADD CONSTRAINT trips_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: wishlist wishlist_place_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT wishlist_place_id_fkey FOREIGN KEY (place_id) REFERENCES public.places(place_id) ON DELETE CASCADE;


--
-- Name: wishlist wishlist_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irangard
--

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT wishlist_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict LAVwQ3YB9LEdXDzQVNoCvIXPnxcBP1ARzW8rdNVgC0KL59GepOXJsq1INLimExQ

