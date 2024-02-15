--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2 (Postgres.app)
-- Dumped by pg_dump version 16.2 (Postgres.app)

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
-- Name: DNext; Type: DATABASE; Schema: -; Owner: UNext
--

CREATE DATABASE "DNext" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF-8';


ALTER DATABASE "DNext" OWNER TO "UNext";

\connect "DNext"

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
-- Name: MembershipType; Type: TYPE; Schema: public; Owner: UNext
--

CREATE TYPE public."MembershipType" AS ENUM (
    'FREE',
    'PREMIUM',
    'ADMIN'
);


ALTER TYPE public."MembershipType" OWNER TO "UNext";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Account; Type: TABLE; Schema: public; Owner: UNext
--

CREATE TABLE public."Account" (
    "accountId" integer NOT NULL,
    username character varying(16) NOT NULL,
    password character varying(60) NOT NULL,
    membership public."MembershipType" DEFAULT 'FREE'::public."MembershipType" NOT NULL
);


ALTER TABLE public."Account" OWNER TO "UNext";

--
-- Name: Account_accountId_seq; Type: SEQUENCE; Schema: public; Owner: UNext
--

CREATE SEQUENCE public."Account_accountId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Account_accountId_seq" OWNER TO "UNext";

--
-- Name: Account_accountId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: UNext
--

ALTER SEQUENCE public."Account_accountId_seq" OWNED BY public."Account"."accountId";


--
-- Name: Session; Type: TABLE; Schema: public; Owner: UNext
--

CREATE TABLE public."Session" (
    "sessionId" integer NOT NULL,
    "accountId" integer NOT NULL,
    "sessionKey" character varying(128) NOT NULL,
    "refreshToken" character varying(256) DEFAULT 'dummy_refresh_token'::character varying NOT NULL,
    "lastActivityDate" date DEFAULT CURRENT_DATE NOT NULL
);


ALTER TABLE public."Session" OWNER TO "UNext";

--
-- Name: Session_sessionId_seq; Type: SEQUENCE; Schema: public; Owner: UNext
--

CREATE SEQUENCE public."Session_sessionId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Session_sessionId_seq" OWNER TO "UNext";

--
-- Name: Session_sessionId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: UNext
--

ALTER SEQUENCE public."Session_sessionId_seq" OWNED BY public."Session"."sessionId";


--
-- Name: Account accountId; Type: DEFAULT; Schema: public; Owner: UNext
--

ALTER TABLE ONLY public."Account" ALTER COLUMN "accountId" SET DEFAULT nextval('public."Account_accountId_seq"'::regclass);


--
-- Name: Session sessionId; Type: DEFAULT; Schema: public; Owner: UNext
--

ALTER TABLE ONLY public."Session" ALTER COLUMN "sessionId" SET DEFAULT nextval('public."Session_sessionId_seq"'::regclass);


--
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: UNext
--

COPY public."Account" ("accountId", username, password, membership) FROM stdin;
11	Alper	$2b$10$BBtrF3xmlo8pzC.Jbn8Sb.bGkv3xjuN1utcrVXXknAh76j7Xq4pPu	FREE
\.


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: UNext
--

COPY public."Session" ("sessionId", "accountId", "sessionKey", "refreshToken", "lastActivityDate") FROM stdin;
17	11	OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5.Tk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk____1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOjExLCJtZW1iZXJzaGlwIjoiRlJFRSIsInNlc3Npb25JZCI6MTcsImlhdCI6MTcwNjg4MDk5MSwiZXhwIjoxNzA5NDcyOTkxfQ.Ve7t6nWueQFhT648zvB2auESRhJP0dywzxpqvPkCqOU	2024-02-02
\.


--
-- Name: Account_accountId_seq; Type: SEQUENCE SET; Schema: public; Owner: UNext
--

SELECT pg_catalog.setval('public."Account_accountId_seq"', 11, true);


--
-- Name: Session_sessionId_seq; Type: SEQUENCE SET; Schema: public; Owner: UNext
--

SELECT pg_catalog.setval('public."Session_sessionId_seq"', 17, true);


--
-- Name: Account Account_name_uk; Type: CONSTRAINT; Schema: public; Owner: UNext
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_name_uk" UNIQUE (username);


--
-- Name: Account Account_pk; Type: CONSTRAINT; Schema: public; Owner: UNext
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pk" PRIMARY KEY ("accountId");


--
-- Name: Session Session_pk; Type: CONSTRAINT; Schema: public; Owner: UNext
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pk" PRIMARY KEY ("sessionId");


--
-- Name: Session Session_Account_fk; Type: FK CONSTRAINT; Schema: public; Owner: UNext
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_Account_fk" FOREIGN KEY ("accountId") REFERENCES public."Account"("accountId");


--
-- PostgreSQL database dump complete
--

