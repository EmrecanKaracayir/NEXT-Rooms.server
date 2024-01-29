--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

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

--
-- Name: MembershipType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."MembershipType" AS ENUM (
    'FREE',
    'PREMIUM',
    'ADMIN'
);


ALTER TYPE public."MembershipType" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Account" (
    "accountId" integer NOT NULL,
    username character varying(16) NOT NULL,
    password character varying(60) NOT NULL,
    membership public."MembershipType" DEFAULT 'FREE'::public."MembershipType" NOT NULL
);


ALTER TABLE public."Account" OWNER TO postgres;

--
-- Name: Account_accountId_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Account_accountId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Account_accountId_seq" OWNER TO postgres;

--
-- Name: Account_accountId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Account_accountId_seq" OWNED BY public."Account"."accountId";


--
-- Name: Session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Session" (
    "sessionId" integer NOT NULL,
    "accountId" integer NOT NULL,
    sessionkey character varying(128) NOT NULL,
    refreshtoken character varying(1024) NOT NULL,
    "lastActivityDate" date DEFAULT CURRENT_DATE NOT NULL
);


ALTER TABLE public."Session" OWNER TO postgres;

--
-- Name: Session_sessionId_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Session_sessionId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Session_sessionId_seq" OWNER TO postgres;

--
-- Name: Session_sessionId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Session_sessionId_seq" OWNED BY public."Session"."sessionId";


--
-- Name: Account accountId; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Account" ALTER COLUMN "accountId" SET DEFAULT nextval('public."Account_accountId_seq"'::regclass);


--
-- Name: Session sessionId; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Session" ALTER COLUMN "sessionId" SET DEFAULT nextval('public."Session_sessionId_seq"'::regclass);


--
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Account" ("accountId", username, password, membership) FROM stdin;
\.


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Session" ("sessionId", "accountId", sessionkey, refreshtoken, "lastActivityDate") FROM stdin;
\.


--
-- Name: Account_accountId_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Account_accountId_seq"', 1, false);


--
-- Name: Session_sessionId_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Session_sessionId_seq"', 1, false);


--
-- Name: Account Account_name_uk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_name_uk" UNIQUE (username);


--
-- Name: Account Account_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pk" PRIMARY KEY ("accountId");


--
-- Name: Session Session_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pk" PRIMARY KEY ("sessionId");


--
-- Name: Session Session_Account_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_Account_fk" FOREIGN KEY ("accountId") REFERENCES public."Account"("accountId");


--
-- PostgreSQL database dump complete
--

