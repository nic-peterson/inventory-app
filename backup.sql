--
-- PostgreSQL database dump
--

-- Dumped from database version 14.15 (Homebrew)
-- Dumped by pg_dump version 14.15 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: authors; Type: TABLE; Schema: public; Owner: nicpeterson
--

CREATE TABLE public.authors (
    id integer NOT NULL,
    name text NOT NULL,
    bio text
);


ALTER TABLE public.authors OWNER TO nicpeterson;

--
-- Name: authors_id_seq; Type: SEQUENCE; Schema: public; Owner: nicpeterson
--

CREATE SEQUENCE public.authors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.authors_id_seq OWNER TO nicpeterson;

--
-- Name: authors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nicpeterson
--

ALTER SEQUENCE public.authors_id_seq OWNED BY public.authors.id;


--
-- Name: book_authors; Type: TABLE; Schema: public; Owner: nicpeterson
--

CREATE TABLE public.book_authors (
    book_id integer NOT NULL,
    author_id integer NOT NULL
);


ALTER TABLE public.book_authors OWNER TO nicpeterson;

--
-- Name: books; Type: TABLE; Schema: public; Owner: nicpeterson
--

CREATE TABLE public.books (
    id integer NOT NULL,
    title text NOT NULL,
    genre_id integer,
    quantity integer DEFAULT 0,
    description text,
    cover_image text
);


ALTER TABLE public.books OWNER TO nicpeterson;

--
-- Name: books_id_seq; Type: SEQUENCE; Schema: public; Owner: nicpeterson
--

CREATE SEQUENCE public.books_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.books_id_seq OWNER TO nicpeterson;

--
-- Name: books_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nicpeterson
--

ALTER SEQUENCE public.books_id_seq OWNED BY public.books.id;


--
-- Name: genres; Type: TABLE; Schema: public; Owner: nicpeterson
--

CREATE TABLE public.genres (
    id integer NOT NULL,
    name text NOT NULL,
    description text
);


ALTER TABLE public.genres OWNER TO nicpeterson;

--
-- Name: genres_id_seq; Type: SEQUENCE; Schema: public; Owner: nicpeterson
--

CREATE SEQUENCE public.genres_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.genres_id_seq OWNER TO nicpeterson;

--
-- Name: genres_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nicpeterson
--

ALTER SEQUENCE public.genres_id_seq OWNED BY public.genres.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: nicpeterson
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username text NOT NULL,
    password text NOT NULL
);


ALTER TABLE public.users OWNER TO nicpeterson;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: nicpeterson
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO nicpeterson;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nicpeterson
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: authors id; Type: DEFAULT; Schema: public; Owner: nicpeterson
--

ALTER TABLE ONLY public.authors ALTER COLUMN id SET DEFAULT nextval('public.authors_id_seq'::regclass);


--
-- Name: books id; Type: DEFAULT; Schema: public; Owner: nicpeterson
--

ALTER TABLE ONLY public.books ALTER COLUMN id SET DEFAULT nextval('public.books_id_seq'::regclass);


--
-- Name: genres id; Type: DEFAULT; Schema: public; Owner: nicpeterson
--

ALTER TABLE ONLY public.genres ALTER COLUMN id SET DEFAULT nextval('public.genres_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: nicpeterson
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: authors; Type: TABLE DATA; Schema: public; Owner: nicpeterson
--

COPY public.authors (id, name, bio) FROM stdin;
\.


--
-- Data for Name: book_authors; Type: TABLE DATA; Schema: public; Owner: nicpeterson
--

COPY public.book_authors (book_id, author_id) FROM stdin;
\.


--
-- Data for Name: books; Type: TABLE DATA; Schema: public; Owner: nicpeterson
--

COPY public.books (id, title, genre_id, quantity, description, cover_image) FROM stdin;
\.


--
-- Data for Name: genres; Type: TABLE DATA; Schema: public; Owner: nicpeterson
--

COPY public.genres (id, name, description) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: nicpeterson
--

COPY public.users (id, username, password) FROM stdin;
\.


--
-- Name: authors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nicpeterson
--

SELECT pg_catalog.setval('public.authors_id_seq', 1, false);


--
-- Name: books_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nicpeterson
--

SELECT pg_catalog.setval('public.books_id_seq', 1, false);


--
-- Name: genres_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nicpeterson
--

SELECT pg_catalog.setval('public.genres_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nicpeterson
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- Name: authors authors_pkey; Type: CONSTRAINT; Schema: public; Owner: nicpeterson
--

ALTER TABLE ONLY public.authors
    ADD CONSTRAINT authors_pkey PRIMARY KEY (id);


--
-- Name: book_authors book_authors_pkey; Type: CONSTRAINT; Schema: public; Owner: nicpeterson
--

ALTER TABLE ONLY public.book_authors
    ADD CONSTRAINT book_authors_pkey PRIMARY KEY (book_id, author_id);


--
-- Name: books books_pkey; Type: CONSTRAINT; Schema: public; Owner: nicpeterson
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_pkey PRIMARY KEY (id);


--
-- Name: genres genres_pkey; Type: CONSTRAINT; Schema: public; Owner: nicpeterson
--

ALTER TABLE ONLY public.genres
    ADD CONSTRAINT genres_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: nicpeterson
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: nicpeterson
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: book_authors book_authors_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nicpeterson
--

ALTER TABLE ONLY public.book_authors
    ADD CONSTRAINT book_authors_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.authors(id) ON DELETE CASCADE;


--
-- Name: book_authors book_authors_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nicpeterson
--

ALTER TABLE ONLY public.book_authors
    ADD CONSTRAINT book_authors_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE CASCADE;


--
-- Name: books books_genre_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nicpeterson
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_genre_id_fkey FOREIGN KEY (genre_id) REFERENCES public.genres(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

