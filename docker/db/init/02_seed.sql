--
-- PostgreSQL database dump
--

\restrict ORBDfY0YyMMEHCBWULeBLfDZ18k6YWVy7Y1baGNijudqaY06avSGrE8T61aBtJL

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

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
-- Data for Name: system_prompts; Type: TABLE DATA; Schema: chatbot; Owner: -
--

INSERT INTO chatbot.system_prompts VALUES (1, 'v1', 'You are Crammbling''s study assistant. Be concise, accurate, and encouraging. If you are unsure of an answer, say so rather than guessing.', false, '2026-09-30 15:24:11.880851', '[]', NULL);
INSERT INTO chatbot.system_prompts VALUES (2, 'v2', 'You are a strict, no-nonsense tutor. Be direct.', true, '2026-09-30 15:48:06.512409', '[]', NULL);


--
-- Name: system_prompts_prompt_id_seq; Type: SEQUENCE SET; Schema: chatbot; Owner: -
--

SELECT pg_catalog.setval('chatbot.system_prompts_prompt_id_seq', 2, true);


--
-- PostgreSQL database dump complete
--

\unrestrict ORBDfY0YyMMEHCBWULeBLfDZ18k6YWVy7Y1baGNijudqaY06avSGrE8T61aBtJL

