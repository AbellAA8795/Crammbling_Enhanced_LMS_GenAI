--
-- PostgreSQL database dump
--

\restrict g7xA5BrfKmUgo6zrDomBaR16vnEvs89xU5t8VQeaEQjSxigwUCtLUVsv55AggQD

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
-- Name: audit; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA audit;


--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA auth;


--
-- Name: chatbot; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA chatbot;


--
-- Name: group_collab; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA group_collab;


--
-- Name: notification; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA notification;


--
-- Name: personalization; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA personalization;


--
-- Name: social; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA social;


--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: sprint_status; Type: TYPE; Schema: personalization; Owner: -
--

CREATE TYPE personalization.sprint_status AS ENUM (
    'backlog',
    'in_progress',
    'done'
);


--
-- Name: user_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.user_role AS ENUM (
    'student',
    'teacher',
    'super_admin'
);


--
-- Name: friend_request_status; Type: TYPE; Schema: social; Owner: -
--

CREATE TYPE social.friend_request_status AS ENUM (
    'pending',
    'accepted',
    'declined',
    'cancelled'
);


--
-- Name: log_action_procedure(integer, character varying, character varying, integer, jsonb, character varying); Type: PROCEDURE; Schema: audit; Owner: -
--

CREATE PROCEDURE audit.log_action_procedure(IN p_actor_user_id integer, IN p_action character varying, IN p_target_type character varying, IN p_target_id integer, IN p_details jsonb, IN p_ip_address character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO audit.audit_logs (actor_user_id, action, target_type, target_id, details, ip_address)
    VALUES (p_actor_user_id, p_action, p_target_type, p_target_id, p_details, p_ip_address);
END;
$$;


--
-- Name: create_user_procedure(character varying, character varying, character varying, character varying); Type: PROCEDURE; Schema: auth; Owner: -
--

CREATE PROCEDURE auth.create_user_procedure(IN p_username character varying, IN p_email character varying, IN p_password character varying, IN p_phone_number character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM auth.users WHERE username = p_username) THEN
        RAISE EXCEPTION 'USERNAME_EXISTS: Username "%" already exists', p_username;
    END IF;

    IF EXISTS (SELECT 1 FROM auth.users WHERE email = p_email AND auth_provider = 'google') THEN
        RAISE EXCEPTION 'EMAIL_IS_GOOGLE_ACCOUNT: This email is already registered via Google Sign-In';
    END IF;

    IF EXISTS (SELECT 1 FROM auth.users WHERE email = p_email) THEN
        RAISE EXCEPTION 'EMAIL_EXISTS: Email "%" already exists', p_email;
    END IF;

    INSERT INTO auth.users (username, email, password_hash, phone_number, auth_provider, is_verified)
    VALUES (
        p_username,
        p_email,
        crypt(p_password, gen_salt('bf')),
        p_phone_number,
        'local',
        false
    );
END;
$$;


--
-- Name: insert_otp_procedure(character varying, character varying, integer); Type: PROCEDURE; Schema: auth; Owner: -
--

CREATE PROCEDURE auth.insert_otp_procedure(IN p_email character varying, IN p_otp_code character varying, IN p_expires_minutes integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE auth.otp_codes
    SET is_used = true
    WHERE email = p_email AND is_used = false;

    INSERT INTO auth.otp_codes (email, otp_code, expires_at)
    VALUES (p_email, p_otp_code, now() + (p_expires_minutes || ' minutes')::interval);
END;
$$;


--
-- Name: verify_login_procedure(character varying, character varying); Type: PROCEDURE; Schema: auth; Owner: -
--

CREATE PROCEDURE auth.verify_login_procedure(IN p_email character varying, IN p_password character varying, OUT o_user_id integer, OUT o_username character varying, OUT o_email character varying, OUT o_phone_number character varying, OUT o_avatar_url text, OUT o_auth_provider character varying, OUT o_is_verified boolean, OUT o_is_password_valid boolean, OUT o_role public.user_role)
    LANGUAGE plpgsql
    AS $$
BEGIN
    SELECT
        u.user_id,
        u.username,
        u.email,
        u.phone_number,
        u.avatar_url,
        u.auth_provider,
        u.is_verified,
        (u.password_hash IS NOT NULL AND u.password_hash = crypt(p_password, u.password_hash)),
        u.role
    INTO
        o_user_id,
        o_username,
        o_email,
        o_phone_number,
        o_avatar_url,
        o_auth_provider,
        o_is_verified,
        o_is_password_valid,
        o_role
    FROM auth.users u
    WHERE u.email = p_email;
END;
$$;


--
-- Name: verify_otp_function(character varying, character varying); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.verify_otp_function(p_email character varying, p_otp_code character varying) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_valid BOOLEAN := false;
BEGIN
    SELECT true INTO v_valid
    FROM auth.otp_codes
    WHERE email = p_email
      AND otp_code = p_otp_code
      AND is_used = false
      AND expires_at > now()
    LIMIT 1;

    IF v_valid THEN
        UPDATE auth.otp_codes
        SET is_used = true
        WHERE email = p_email AND otp_code = p_otp_code AND is_used = false;

        UPDATE auth.users
        SET is_verified = true
        WHERE email = p_email;
    END IF;

    RETURN COALESCE(v_valid, false);
END;
$$;


--
-- Name: activate_prompt_version_procedure(character varying); Type: PROCEDURE; Schema: chatbot; Owner: -
--

CREATE PROCEDURE chatbot.activate_prompt_version_procedure(IN p_version character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM chatbot.system_prompts WHERE version = p_version) THEN
        RAISE EXCEPTION 'PROMPT_VERSION_NOT_FOUND';
    END IF;
    UPDATE chatbot.system_prompts SET is_active = false WHERE is_active = true;
    UPDATE chatbot.system_prompts SET is_active = true WHERE version = p_version;
END;
$$;


--
-- Name: chat_belongs_to_user_function(integer, integer); Type: FUNCTION; Schema: chatbot; Owner: -
--

CREATE FUNCTION chatbot.chat_belongs_to_user_function(p_chat_id integer, p_user_id integer) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM chatbot.chats WHERE chat_id = p_chat_id AND user_id = p_user_id
    ) INTO v_exists;
    RETURN v_exists;
END;
$$;


--
-- Name: create_chat_procedure(integer, character varying); Type: PROCEDURE; Schema: chatbot; Owner: -
--

CREATE PROCEDURE chatbot.create_chat_procedure(IN p_user_id integer, IN p_title character varying, OUT o_chat_id integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO chatbot.chats (user_id, title)
    VALUES (p_user_id, p_title)
    RETURNING chat_id INTO o_chat_id;
END;
$$;


--
-- Name: create_prompt_version_procedure(character varying, text, boolean, jsonb, text); Type: PROCEDURE; Schema: chatbot; Owner: -
--

CREATE PROCEDURE chatbot.create_prompt_version_procedure(IN p_version character varying, IN p_content text, IN p_activate boolean, IN p_few_shot_examples jsonb DEFAULT '[]'::jsonb, IN p_response_guidelines text DEFAULT NULL::text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO chatbot.system_prompts (version, content, is_active, few_shot_examples, response_guidelines)
    VALUES (p_version, p_content, FALSE, p_few_shot_examples, p_response_guidelines);

    IF p_activate THEN
        UPDATE chatbot.system_prompts SET is_active = FALSE WHERE is_active = TRUE;
        UPDATE chatbot.system_prompts SET is_active = TRUE WHERE version = p_version;
    END IF;
END;
$$;


--
-- Name: get_active_prompt_function(); Type: FUNCTION; Schema: chatbot; Owner: -
--

CREATE FUNCTION chatbot.get_active_prompt_function() RETURNS TABLE(version character varying, content text, few_shot_examples jsonb, response_guidelines text)
    LANGUAGE sql
    AS $$
    SELECT version, content, few_shot_examples, response_guidelines
    FROM chatbot.system_prompts
    WHERE is_active = TRUE
    LIMIT 1;
$$;


--
-- Name: get_chat_messages_function(integer, integer); Type: FUNCTION; Schema: chatbot; Owner: -
--

CREATE FUNCTION chatbot.get_chat_messages_function(p_chat_id integer, p_user_id integer) RETURNS TABLE(message_id integer, role character varying, content text, created_at timestamp without time zone)
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- p_user_id is passed in to enforce that a user can only fetch their OWN chat's messages
    RETURN QUERY
    SELECT m.message_id, m.role, m.content, m.created_at
    FROM chatbot.chat_messages m
    JOIN chatbot.chats c ON c.chat_id = m.chat_id
    WHERE m.chat_id = p_chat_id AND c.user_id = p_user_id
    ORDER BY m.created_at ASC;
END;
$$;


--
-- Name: get_chat_summary_function(integer); Type: FUNCTION; Schema: chatbot; Owner: -
--

CREATE FUNCTION chatbot.get_chat_summary_function(p_chat_id integer) RETURNS TABLE(summary text, summary_covers_up_to_message_id integer)
    LANGUAGE sql
    AS $$
    SELECT summary, summary_covers_up_to_message_id
    FROM chatbot.chats
    WHERE chat_id = p_chat_id;
$$;


--
-- Name: get_feedback_stats_function(timestamp with time zone); Type: FUNCTION; Schema: chatbot; Owner: -
--

CREATE FUNCTION chatbot.get_feedback_stats_function(p_since timestamp with time zone DEFAULT (now() - '30 days'::interval)) RETURNS TABLE(thumbs_up bigint, thumbs_down bigint, with_comment bigint)
    LANGUAGE sql
    AS $$
    SELECT
        COUNT(*) FILTER (WHERE rating = 1) AS thumbs_up,
        COUNT(*) FILTER (WHERE rating = -1) AS thumbs_down,
        COUNT(*) FILTER (WHERE comment IS NOT NULL AND comment <> '') AS with_comment
    FROM chatbot.message_feedback
    WHERE created_at >= p_since;
$$;


--
-- Name: get_flagged_messages_function(timestamp with time zone); Type: FUNCTION; Schema: chatbot; Owner: -
--

CREATE FUNCTION chatbot.get_flagged_messages_function(p_since timestamp with time zone DEFAULT (now() - '30 days'::interval)) RETURNS TABLE(message_id integer, chat_id integer, content text, rating smallint, comment text, created_at timestamp with time zone)
    LANGUAGE sql
    AS $$
    SELECT m.message_id, m.chat_id, m.content, f.rating, f.comment, f.created_at
    FROM chatbot.message_feedback f
    JOIN chatbot.chat_messages m ON m.message_id = f.message_id
    WHERE f.rating = -1 AND f.created_at >= p_since
    ORDER BY f.created_at DESC;
$$;


--
-- Name: get_usage_stats_function(timestamp with time zone); Type: FUNCTION; Schema: chatbot; Owner: -
--

CREATE FUNCTION chatbot.get_usage_stats_function(p_since timestamp with time zone DEFAULT (now() - '7 days'::interval)) RETURNS TABLE(model_used character varying, message_count bigint, total_prompt_tokens bigint, total_completion_tokens bigint, avg_latency_ms numeric)
    LANGUAGE sql
    AS $$
    SELECT
        model_used,
        COUNT(*) AS message_count,
        COALESCE(SUM(prompt_tokens), 0) AS total_prompt_tokens,
        COALESCE(SUM(completion_tokens), 0) AS total_completion_tokens,
        ROUND(AVG(latency_ms), 1) AS avg_latency_ms
    FROM chatbot.chat_messages
    WHERE role = 'assistant' AND created_at >= p_since
    GROUP BY model_used
    ORDER BY message_count DESC;
$$;


--
-- Name: get_user_chats_function(integer); Type: FUNCTION; Schema: chatbot; Owner: -
--

CREATE FUNCTION chatbot.get_user_chats_function(p_user_id integer) RETURNS TABLE(chat_id integer, title character varying, created_at timestamp without time zone, updated_at timestamp without time zone)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT c.chat_id, c.title, c.created_at, c.updated_at
    FROM chatbot.chats c
    WHERE c.user_id = p_user_id
    ORDER BY c.updated_at DESC;
END;
$$;


--
-- Name: insert_chat_message_procedure(integer, character varying, text, character varying, integer, integer, integer, character varying); Type: PROCEDURE; Schema: chatbot; Owner: -
--

CREATE PROCEDURE chatbot.insert_chat_message_procedure(IN p_chat_id integer, IN p_role character varying, IN p_content text, IN p_prompt_version character varying DEFAULT NULL::character varying, IN p_prompt_tokens integer DEFAULT NULL::integer, IN p_completion_tokens integer DEFAULT NULL::integer, IN p_latency_ms integer DEFAULT NULL::integer, IN p_model_used character varying DEFAULT NULL::character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO chatbot.chat_messages (
        chat_id, role, content, prompt_version,
        prompt_tokens, completion_tokens, latency_ms, model_used
    )
    VALUES (
        p_chat_id, p_role, p_content, p_prompt_version,
        p_prompt_tokens, p_completion_tokens, p_latency_ms, p_model_used
    );

    UPDATE chatbot.chats SET updated_at = now() WHERE chat_id = p_chat_id;
END;
$$;


--
-- Name: submit_feedback_procedure(integer, integer, smallint, text); Type: PROCEDURE; Schema: chatbot; Owner: -
--

CREATE PROCEDURE chatbot.submit_feedback_procedure(IN p_message_id integer, IN p_user_id integer, IN p_rating smallint, IN p_comment text DEFAULT NULL::text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF p_rating NOT IN (-1, 1) THEN
        RAISE EXCEPTION 'INVALID_RATING';
    END IF;

    INSERT INTO chatbot.message_feedback (message_id, user_id, rating, comment)
    VALUES (p_message_id, p_user_id, p_rating, p_comment)
    ON CONFLICT (message_id, user_id)
    DO UPDATE SET rating = EXCLUDED.rating, comment = EXCLUDED.comment, created_at = now();
END;
$$;


--
-- Name: update_chat_summary_procedure(integer, text, integer); Type: PROCEDURE; Schema: chatbot; Owner: -
--

CREATE PROCEDURE chatbot.update_chat_summary_procedure(IN p_chat_id integer, IN p_summary text, IN p_covers_up_to_message_id integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE chatbot.chats
    SET summary = p_summary,
        summary_covers_up_to_message_id = p_covers_up_to_message_id,
        summary_updated_at = now()
    WHERE chat_id = p_chat_id;
END;
$$;


--
-- Name: clear_all_notifications_procedure(integer); Type: PROCEDURE; Schema: notification; Owner: -
--

CREATE PROCEDURE notification.clear_all_notifications_procedure(IN p_user_id integer, OUT o_deleted_count integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM notification.notifications WHERE recipient_user_id = p_user_id;
    GET DIAGNOSTICS o_deleted_count = ROW_COUNT;
END;
$$;


--
-- Name: create_notification_for_role_procedure(public.user_role, character varying, character varying, text, jsonb); Type: PROCEDURE; Schema: notification; Owner: -
--

CREATE PROCEDURE notification.create_notification_for_role_procedure(IN p_role public.user_role, IN p_type character varying, IN p_title character varying, IN p_message text, IN p_data jsonb, OUT o_notified_count integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO notification.notifications (recipient_user_id, type, title, message, data)
    SELECT user_id, p_type, p_title, p_message, p_data
    FROM auth.users
    WHERE role = p_role;

    GET DIAGNOSTICS o_notified_count = ROW_COUNT;
END;
$$;


--
-- Name: create_notification_procedure(integer, character varying, character varying, text, jsonb); Type: PROCEDURE; Schema: notification; Owner: -
--

CREATE PROCEDURE notification.create_notification_procedure(IN p_recipient_user_id integer, IN p_type character varying, IN p_title character varying, IN p_message text, IN p_data jsonb, OUT o_notification_id integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO notification.notifications (recipient_user_id, type, title, message, data)
    VALUES (p_recipient_user_id, p_type, p_title, p_message, p_data)
    RETURNING notification_id INTO o_notification_id;
END;
$$;


--
-- Name: delete_notification_procedure(integer, integer); Type: PROCEDURE; Schema: notification; Owner: -
--

CREATE PROCEDURE notification.delete_notification_procedure(IN p_notification_id integer, IN p_user_id integer, OUT o_status character varying)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_owner_id INT;
BEGIN
    SELECT recipient_user_id INTO v_owner_id
    FROM notification.notifications WHERE notification_id = p_notification_id;

    IF v_owner_id IS NULL THEN
        o_status := 'not_found';
        RETURN;
    END IF;

    IF v_owner_id <> p_user_id THEN
        o_status := 'forbidden';
        RETURN;
    END IF;

    DELETE FROM notification.notifications WHERE notification_id = p_notification_id;
    o_status := 'deleted';
END;
$$;


--
-- Name: get_notifications_function(integer, integer, integer); Type: FUNCTION; Schema: notification; Owner: -
--

CREATE FUNCTION notification.get_notifications_function(p_user_id integer, p_limit integer DEFAULT 50, p_offset integer DEFAULT 0) RETURNS TABLE(notification_id integer, type character varying, title character varying, message text, data jsonb, is_read boolean, created_at timestamp with time zone, read_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT n.notification_id::INT, n.type, n.title, n.message, n.data, n.is_read, n.created_at, n.read_at
    FROM notification.notifications n
    WHERE n.recipient_user_id = p_user_id
    ORDER BY n.created_at DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$;


--
-- Name: get_unread_count_function(integer); Type: FUNCTION; Schema: notification; Owner: -
--

CREATE FUNCTION notification.get_unread_count_function(p_user_id integer) RETURNS integer
    LANGUAGE sql
    AS $$
    SELECT COUNT(*)::INT
    FROM notification.notifications
    WHERE recipient_user_id = p_user_id AND is_read = FALSE;
$$;


--
-- Name: mark_all_read_procedure(integer); Type: PROCEDURE; Schema: notification; Owner: -
--

CREATE PROCEDURE notification.mark_all_read_procedure(IN p_user_id integer, OUT o_marked_count integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE notification.notifications
    SET is_read = TRUE, read_at = now()
    WHERE recipient_user_id = p_user_id AND is_read = FALSE;

    GET DIAGNOSTICS o_marked_count = ROW_COUNT;
END;
$$;


--
-- Name: mark_notification_read_procedure(integer, integer); Type: PROCEDURE; Schema: notification; Owner: -
--

CREATE PROCEDURE notification.mark_notification_read_procedure(IN p_notification_id integer, IN p_user_id integer, OUT o_status character varying)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_notification notification.notifications%ROWTYPE;
BEGIN
    SELECT * INTO v_notification FROM notification.notifications WHERE notification_id = p_notification_id;

    IF v_notification IS NULL THEN
        o_status := 'not_found';
        RETURN;
    END IF;

    IF v_notification.recipient_user_id <> p_user_id THEN
        o_status := 'forbidden';
        RETURN;
    END IF;

    IF v_notification.is_read THEN
        o_status := 'already_read';
        RETURN;
    END IF;

    UPDATE notification.notifications
    SET is_read = TRUE, read_at = now()
    WHERE notification_id = p_notification_id;

    o_status := 'marked_read';
END;
$$;


--
-- Name: clear_sprint_board_procedure(integer); Type: PROCEDURE; Schema: personalization; Owner: -
--

CREATE PROCEDURE personalization.clear_sprint_board_procedure(IN p_user_id integer, OUT o_deleted_count integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM personalization.sprint_tasks WHERE user_id = p_user_id;
    GET DIAGNOSTICS o_deleted_count = ROW_COUNT;
    -- Only clears the board's cards. Any calendar events those cards
    -- were linked to are untouched — this is a board reset, not a
    -- calendar wipe.
END;
$$;


--
-- Name: create_sprint_task_from_event_trigger_fn(); Type: FUNCTION; Schema: personalization; Owner: -
--

CREATE FUNCTION personalization.create_sprint_task_from_event_trigger_fn() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_next_position INT;
BEGIN
    SELECT COALESCE(MAX(position), -1) + 1 INTO v_next_position
    FROM personalization.sprint_tasks
    WHERE user_id = NEW.user_id AND status = 'backlog';

    INSERT INTO personalization.sprint_tasks (user_id, source_event_id, title, subject, status, position)
    VALUES (NEW.user_id, NEW.event_id, NEW.title, NEW.subject, 'backlog', v_next_position);

    RETURN NEW;
END;
$$;


--
-- Name: create_sprint_task_procedure(integer, character varying, character varying); Type: PROCEDURE; Schema: personalization; Owner: -
--

CREATE PROCEDURE personalization.create_sprint_task_procedure(IN p_user_id integer, IN p_title character varying, IN p_subject character varying, OUT o_task_id integer)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_next_position INT;
BEGIN
    SELECT COALESCE(MAX(position), -1) + 1 INTO v_next_position
    FROM personalization.sprint_tasks
    WHERE user_id = p_user_id AND status = 'backlog';

    INSERT INTO personalization.sprint_tasks (user_id, title, subject, status, position)
    VALUES (p_user_id, p_title, p_subject, 'backlog', v_next_position)
    RETURNING task_id INTO o_task_id;
END;
$$;


--
-- Name: create_study_event_procedure(integer, character varying, character varying, timestamp with time zone, character varying, text); Type: PROCEDURE; Schema: personalization; Owner: -
--

CREATE PROCEDURE personalization.create_study_event_procedure(IN p_user_id integer, IN p_title character varying, IN p_type character varying, IN p_due_date timestamp with time zone, IN p_subject character varying, IN p_description text, OUT o_event_id integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO personalization.study_events (user_id, title, type, due_date, subject, description)
    VALUES (p_user_id, p_title, p_type, p_due_date, p_subject, p_description)
    RETURNING event_id INTO o_event_id;
    -- The AAFTER INSERT trigger below automatically creates the matching
    -- Sprint Board card in 'backlog'.
END;
$$;


--
-- Name: delete_google_calendar_connection_procedure(integer, character varying); Type: PROCEDURE; Schema: personalization; Owner: -
--

CREATE PROCEDURE personalization.delete_google_calendar_connection_procedure(IN p_user_id integer, IN p_ip_address character varying, OUT o_status character varying)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_deleted INT;
BEGIN
    DELETE FROM personalization.google_calendar_connections WHERE user_id = p_user_id;
    GET DIAGNOSTICS v_deleted = ROW_COUNT;

    IF v_deleted = 0 THEN
        o_status := 'not_found';
        RETURN;
    END IF;

    CALL audit.log_action_procedure(
        p_user_id,
        'GOOGLE_CALENDAR_DISCONNECTED',
        'google_calendar_connection',
        p_user_id,
        '{}'::jsonb,
        p_ip_address
    );

    o_status := 'disconnected';
END;
$$;


--
-- Name: delete_sprint_task_procedure(integer, integer); Type: PROCEDURE; Schema: personalization; Owner: -
--

CREATE PROCEDURE personalization.delete_sprint_task_procedure(IN p_task_id integer, IN p_user_id integer, OUT o_status character varying)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_owner_id INT;
BEGIN
    SELECT user_id INTO v_owner_id FROM personalization.sprint_tasks WHERE task_id = p_task_id;

    IF v_owner_id IS NULL THEN
        o_status := 'not_found';
        RETURN;
    END IF;

    IF v_owner_id <> p_user_id THEN
        o_status := 'forbidden';
        RETURN;
    END IF;

    DELETE FROM personalization.sprint_tasks WHERE task_id = p_task_id;
    o_status := 'deleted';
END;
$$;


--
-- Name: delete_study_event_procedure(integer, integer); Type: PROCEDURE; Schema: personalization; Owner: -
--

CREATE PROCEDURE personalization.delete_study_event_procedure(IN p_event_id integer, IN p_user_id integer, OUT o_google_calendar_event_id character varying, OUT o_status character varying)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_owner_id INT;
BEGIN
    SELECT user_id, google_calendar_event_id INTO v_owner_id, o_google_calendar_event_id
    FROM personalization.study_events WHERE event_id = p_event_id;

    IF v_owner_id IS NULL THEN
        o_status := 'not_found';
        RETURN;
    END IF;

    IF v_owner_id <> p_user_id THEN
        o_status := 'forbidden';
        RETURN;
    END IF;

    DELETE FROM personalization.study_events WHERE event_id = p_event_id;
    -- CASCADE automatically removes the linked Sprint Board card too.

    o_status := 'deleted';
END;
$$;


--
-- Name: get_google_calendar_connection_function(integer); Type: FUNCTION; Schema: personalization; Owner: -
--

CREATE FUNCTION personalization.get_google_calendar_connection_function(p_user_id integer) RETURNS TABLE(access_token text, refresh_token text, token_expiry timestamp with time zone, calendar_id character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT c.access_token, c.refresh_token, c.token_expiry, c.calendar_id
    FROM personalization.google_calendar_connections c
    WHERE c.user_id = p_user_id;
    -- Empty result = not connected.
END;
$$;


--
-- Name: get_sprint_tasks_function(integer); Type: FUNCTION; Schema: personalization; Owner: -
--

CREATE FUNCTION personalization.get_sprint_tasks_function(p_user_id integer) RETURNS TABLE(task_id integer, title character varying, subject character varying, status personalization.sprint_status, task_position integer, source_event_id integer, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT t.task_id::INT, t.title, t.subject, t.status, t."position",
           t.source_event_id::INT, t.created_at
    FROM personalization.sprint_tasks t
    WHERE t.user_id = p_user_id
    ORDER BY t.status, t."position" ASC;
END;
$$;


--
-- Name: get_study_event_function(integer, integer); Type: FUNCTION; Schema: personalization; Owner: -
--

CREATE FUNCTION personalization.get_study_event_function(p_event_id integer, p_user_id integer) RETURNS TABLE(event_id integer, title character varying, type character varying, due_date timestamp with time zone, subject character varying, description text, google_calendar_event_id character varying, synced_to_google boolean)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT e.event_id::INT, e.title, e.type, e.due_date, e.subject, e.description,
           e.google_calendar_event_id, e.synced_to_google
    FROM personalization.study_events e
    WHERE e.event_id = p_event_id AND e.user_id = p_user_id;
    -- Empty result = not found OR not owned by this user; the controller
    -- can't distinguish which, which is the correct behavior (don't leak
    -- existence of another user's event).
END;
$$;


--
-- Name: get_study_events_function(integer, timestamp with time zone, timestamp with time zone); Type: FUNCTION; Schema: personalization; Owner: -
--

CREATE FUNCTION personalization.get_study_events_function(p_user_id integer, p_start_date timestamp with time zone DEFAULT NULL::timestamp with time zone, p_end_date timestamp with time zone DEFAULT NULL::timestamp with time zone) RETURNS TABLE(event_id integer, title character varying, type character varying, due_date timestamp with time zone, subject character varying, description text, google_calendar_event_id character varying, synced_to_google boolean, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT e.event_id::INT, e.title, e.type, e.due_date, e.subject, e.description,
           e.google_calendar_event_id, e.synced_to_google, e.created_at
    FROM personalization.study_events e
    WHERE e.user_id = p_user_id
      AND (p_start_date IS NULL OR e.due_date >= p_start_date)
      AND (p_end_date IS NULL OR e.due_date <= p_end_date)
    ORDER BY e.due_date ASC;
END;
$$;


--
-- Name: move_sprint_task_procedure(integer, integer, personalization.sprint_status, integer); Type: PROCEDURE; Schema: personalization; Owner: -
--

CREATE PROCEDURE personalization.move_sprint_task_procedure(IN p_task_id integer, IN p_user_id integer, IN p_new_status personalization.sprint_status, IN p_new_position integer, OUT o_status character varying)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_owner_id INT;
BEGIN
    SELECT user_id INTO v_owner_id FROM personalization.sprint_tasks WHERE task_id = p_task_id;

    IF v_owner_id IS NULL THEN
        o_status := 'not_found';
        RETURN;
    END IF;

    IF v_owner_id <> p_user_id THEN
        o_status := 'forbidden';
        RETURN;
    END IF;

    UPDATE personalization.sprint_tasks
    SET status = p_new_status, position = p_new_position, updated_at = now()
    WHERE task_id = p_task_id;

    o_status := 'moved';
END;
$$;


--
-- Name: sync_sprint_task_from_event_trigger_fn(); Type: FUNCTION; Schema: personalization; Owner: -
--

CREATE FUNCTION personalization.sync_sprint_task_from_event_trigger_fn() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.title IS DISTINCT FROM OLD.title OR NEW.subject IS DISTINCT FROM OLD.subject THEN
        UPDATE personalization.sprint_tasks
        SET title = NEW.title, subject = NEW.subject, updated_at = now()
        WHERE source_event_id = NEW.event_id;
    END IF;
    RETURN NEW;
END;
$$;


--
-- Name: update_google_calendar_tokens_procedure(integer, text, text, timestamp with time zone); Type: PROCEDURE; Schema: personalization; Owner: -
--

CREATE PROCEDURE personalization.update_google_calendar_tokens_procedure(IN p_user_id integer, IN p_access_token text, IN p_refresh_token text, IN p_token_expiry timestamp with time zone, OUT o_status character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE personalization.google_calendar_connections
    SET access_token  = p_access_token,
        refresh_token = p_refresh_token,
        token_expiry  = p_token_expiry,
        updated_at    = now()
    WHERE user_id = p_user_id;

    o_status := CASE WHEN FOUND THEN 'updated' ELSE 'not_found' END;
END;
$$;


--
-- Name: update_google_sync_status_procedure(integer, integer, character varying); Type: PROCEDURE; Schema: personalization; Owner: -
--

CREATE PROCEDURE personalization.update_google_sync_status_procedure(IN p_event_id integer, IN p_user_id integer, IN p_google_calendar_event_id character varying, OUT o_status character varying)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_owner_id INT;
BEGIN
    SELECT user_id INTO v_owner_id FROM personalization.study_events WHERE event_id = p_event_id;

    IF v_owner_id IS NULL THEN
        o_status := 'not_found';
        RETURN;
    END IF;

    IF v_owner_id <> p_user_id THEN
        o_status := 'forbidden';
        RETURN;
    END IF;

    UPDATE personalization.study_events
    SET google_calendar_event_id = p_google_calendar_event_id, synced_to_google = TRUE, updated_at = now()
    WHERE event_id = p_event_id;

    o_status := 'synced';
END;
$$;


--
-- Name: update_study_event_procedure(integer, integer, character varying, character varying, timestamp with time zone, character varying, text); Type: PROCEDURE; Schema: personalization; Owner: -
--

CREATE PROCEDURE personalization.update_study_event_procedure(IN p_event_id integer, IN p_user_id integer, IN p_title character varying, IN p_type character varying, IN p_due_date timestamp with time zone, IN p_subject character varying, IN p_description text, OUT o_status character varying)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_owner_id INT;
BEGIN
    SELECT user_id INTO v_owner_id FROM personalization.study_events WHERE event_id = p_event_id;

    IF v_owner_id IS NULL THEN
        o_status := 'not_found';
        RETURN;
    END IF;

    IF v_owner_id <> p_user_id THEN
        o_status := 'forbidden';
        RETURN;
    END IF;

    UPDATE personalization.study_events
    SET title = p_title, type = p_type, due_date = p_due_date,
        subject = p_subject, description = p_description, updated_at = now()
    WHERE event_id = p_event_id;
    -- The AFTER UPDATE trigger below keeps the linked Sprint Board card's
    -- title/subject in sync automatically.

    o_status := 'updated';
END;
$$;


--
-- Name: upsert_google_calendar_connection_procedure(integer, text, text, timestamp with time zone, character varying, character varying); Type: PROCEDURE; Schema: personalization; Owner: -
--

CREATE PROCEDURE personalization.upsert_google_calendar_connection_procedure(IN p_user_id integer, IN p_access_token text, IN p_refresh_token text, IN p_token_expiry timestamp with time zone, IN p_calendar_id character varying, IN p_ip_address character varying, OUT o_status character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO personalization.google_calendar_connections
        (user_id, access_token, refresh_token, token_expiry, calendar_id, connected_at, updated_at)
    VALUES (p_user_id, p_access_token, p_refresh_token, p_token_expiry, COALESCE(p_calendar_id, 'primary'), now(), now())
    ON CONFLICT (user_id) DO UPDATE
        SET access_token  = EXCLUDED.access_token,
            refresh_token = EXCLUDED.refresh_token,
            token_expiry  = EXCLUDED.token_expiry,
            calendar_id   = EXCLUDED.calendar_id,
            connected_at  = now(),
            updated_at    = now();

    CALL audit.log_action_procedure(
        p_user_id,
        'GOOGLE_CALENDAR_CONNECTED',
        'google_calendar_connection',
        p_user_id,
        jsonb_build_object('calendar_id', COALESCE(p_calendar_id, 'primary')),
        p_ip_address
    );

    o_status := 'connected';
END;
$$;


--
-- Name: find_or_create_google_user(character varying, character varying, character varying, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.find_or_create_google_user(p_google_id character varying, p_email character varying, p_name character varying, p_avatar_url text) RETURNS TABLE(user_id integer, username character varying, email character varying, phone_number character varying, google_id character varying, avatar_url text, auth_provider character varying, is_verified boolean, role public.user_role)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_generated_username VARCHAR;
BEGIN
    -- Case 1: existing Google user
    IF EXISTS (SELECT 1 FROM auth.users u WHERE u.google_id = p_google_id) THEN
        RETURN QUERY
        SELECT u.user_id, u.username, u.email, u.phone_number,
               u.google_id, u.avatar_url, u.auth_provider, u.is_verified, u.role
        FROM auth.users u WHERE u.google_id = p_google_id;
        RETURN;
    END IF;

    -- Case 2: existing local account with matching email -> merge/link Google
    IF EXISTS (SELECT 1 FROM auth.users u WHERE u.email = p_email) THEN
        UPDATE auth.users u
        SET google_id = p_google_id,
            is_verified = true,
            avatar_url = COALESCE(u.avatar_url, p_avatar_url),
            auth_provider = CASE WHEN u.auth_provider = 'local' THEN 'local' ELSE 'google' END
        WHERE u.email = p_email;

        RETURN QUERY
        SELECT u.user_id, u.username, u.email, u.phone_number,
               u.google_id, u.avatar_url, u.auth_provider, u.is_verified, u.role
        FROM auth.users u WHERE u.email = p_email;
        RETURN;
    END IF;

    -- Case 3: brand-new user via Google
    v_generated_username := split_part(p_email, '@', 1) || '_' || substr(md5(random()::text), 1, 5);

    INSERT INTO auth.users (username, email, phone_number, google_id, avatar_url, auth_provider, is_verified)
    VALUES (v_generated_username, p_email, NULL, p_google_id, p_avatar_url, 'google', true);

    RETURN QUERY
    SELECT u.user_id, u.username, u.email, u.phone_number,
           u.google_id, u.avatar_url, u.auth_provider, u.is_verified, u.role
    FROM auth.users u WHERE u.google_id = p_google_id;
END;
$$;


--
-- Name: cancel_friend_request_procedure(integer, integer); Type: PROCEDURE; Schema: social; Owner: -
--

CREATE PROCEDURE social.cancel_friend_request_procedure(IN p_request_id integer, IN p_requester_id integer, OUT o_status character varying)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_request social.friend_requests%ROWTYPE;
BEGIN
    SELECT * INTO v_request FROM social.friend_requests WHERE request_id = p_request_id;

    IF v_request IS NULL THEN
        o_status := 'not_found';
        RETURN;
    END IF;

    IF v_request.requester_id <> p_requester_id THEN
        o_status := 'forbidden';
        RETURN;
    END IF;

    IF v_request.status <> 'pending' THEN
        o_status := 'already_resolved';
        RETURN;
    END IF;

    UPDATE social.friend_requests
    SET status = 'cancelled', responded_at = now()
    WHERE request_id = p_request_id;

    o_status := 'cancelled';
END;
$$;


--
-- Name: get_friends_list_function(integer); Type: FUNCTION; Schema: social; Owner: -
--

CREATE FUNCTION social.get_friends_list_function(p_user_id integer) RETURNS TABLE(friend_user_id integer, username character varying, email character varying, avatar_url text, friends_since timestamp with time zone)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        u.user_id,
        u.username,
        u.email,
        u.avatar_url,
        f.created_at
    FROM social.friendships f
    JOIN auth.users u ON u.user_id = (
        CASE WHEN f.user_id_a = p_user_id THEN f.user_id_b ELSE f.user_id_a END
    )
    WHERE f.user_id_a = p_user_id OR f.user_id_b = p_user_id
    ORDER BY f.created_at DESC;
END;
$$;


--
-- Name: get_pending_requests_function(integer, character varying); Type: FUNCTION; Schema: social; Owner: -
--

CREATE FUNCTION social.get_pending_requests_function(p_user_id integer, p_direction character varying) RETURNS TABLE(request_id integer, other_user_id integer, username character varying, email character varying, avatar_url text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF p_direction = 'incoming' THEN
        RETURN QUERY
        SELECT r.request_id::INT, u.user_id, u.username, u.email, u.avatar_url, r.created_at
        FROM social.friend_requests r
        JOIN auth.users u ON u.user_id = r.requester_id
        WHERE r.recipient_id = p_user_id AND r.status = 'pending'
        ORDER BY r.created_at DESC;
    ELSE
        RETURN QUERY
        SELECT r.request_id::INT, u.user_id, u.username, u.email, u.avatar_url, r.created_at
        FROM social.friend_requests r
        JOIN auth.users u ON u.user_id = r.recipient_id
        WHERE r.requester_id = p_user_id AND r.status = 'pending'
        ORDER BY r.created_at DESC;
    END IF;
END;
$$;


--
-- Name: get_user_profile_function(integer, integer); Type: FUNCTION; Schema: social; Owner: -
--

CREATE FUNCTION social.get_user_profile_function(p_target_user_id integer, p_requesting_user_id integer) RETURNS TABLE(user_id integer, username character varying, email character varying, avatar_url text, friend_count integer, relationship_status character varying, pending_request_id integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        u.user_id,
        u.username,
        u.email,
        u.avatar_url,
        u.friend_count,
        (CASE
            WHEN f.friendship_id IS NOT NULL THEN 'friends'
            WHEN pr_out.request_id IS NOT NULL THEN 'request_sent'
            WHEN pr_in.request_id IS NOT NULL THEN 'request_received'
            WHEN u.user_id = p_requesting_user_id THEN 'self'
            ELSE 'none'
        END)::VARCHAR AS relationship_status,
        COALESCE(pr_out.request_id, pr_in.request_id)::INT AS pending_request_id
    FROM auth.users u
    LEFT JOIN social.friendships f
        ON (f.user_id_a = LEAST(u.user_id, p_requesting_user_id)
            AND f.user_id_b = GREATEST(u.user_id, p_requesting_user_id))
    LEFT JOIN social.friend_requests pr_out
        ON pr_out.requester_id = p_requesting_user_id
        AND pr_out.recipient_id = u.user_id
        AND pr_out.status = 'pending'
    LEFT JOIN social.friend_requests pr_in
        ON pr_in.requester_id = u.user_id
        AND pr_in.recipient_id = p_requesting_user_id
        AND pr_in.status = 'pending'
    WHERE u.user_id = p_target_user_id;
END;
$$;


--
-- Name: notify_on_friend_request_accepted_trigger_fn(); Type: FUNCTION; Schema: social; Owner: -
--

CREATE FUNCTION social.notify_on_friend_request_accepted_trigger_fn() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_accepter_username VARCHAR;
    v_dummy_id INT;
BEGIN
    IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
        SELECT username INTO v_accepter_username FROM auth.users WHERE user_id = NEW.recipient_id;

        -- Notify the ORIGINAL REQUESTER that the recipient accepted.
        CALL notification.create_notification_procedure(
            NEW.requester_id,
            'friend_request_accepted',
            'Friend request accepted',
            v_accepter_username || ' accepted your friend request.',
            jsonb_build_object('friendId', NEW.recipient_id, 'requestId', NEW.request_id),
            v_dummy_id
        );
    END IF;
    RETURN NEW;
END;
$$;


--
-- Name: on_friend_request_accepted_trigger_fn(); Type: FUNCTION; Schema: social; Owner: -
--

CREATE FUNCTION social.on_friend_request_accepted_trigger_fn() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
        INSERT INTO social.friendships (user_id_a, user_id_b)
        VALUES (LEAST(NEW.requester_id, NEW.recipient_id), GREATEST(NEW.requester_id, NEW.recipient_id))
        ON CONFLICT (user_id_a, user_id_b) DO NOTHING;

        UPDATE auth.users SET friend_count = friend_count + 1
        WHERE user_id IN (NEW.requester_id, NEW.recipient_id);
    END IF;
    RETURN NEW;
END;
$$;


--
-- Name: on_friendship_removed_trigger_fn(); Type: FUNCTION; Schema: social; Owner: -
--

CREATE FUNCTION social.on_friendship_removed_trigger_fn() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE auth.users SET friend_count = GREATEST(friend_count - 1, 0)
    WHERE user_id IN (OLD.user_id_a, OLD.user_id_b);
    RETURN OLD;
END;
$$;


--
-- Name: remove_friend_procedure(integer, integer, character varying); Type: PROCEDURE; Schema: social; Owner: -
--

CREATE PROCEDURE social.remove_friend_procedure(IN p_user_id integer, IN p_friend_id integer, IN p_ip_address character varying, OUT o_status character varying)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_deleted INT;
BEGIN
    DELETE FROM social.friendships
    WHERE user_id_a = LEAST(p_user_id, p_friend_id)
      AND user_id_b = GREATEST(p_user_id, p_friend_id);

    GET DIAGNOSTICS v_deleted = ROW_COUNT;

    IF v_deleted = 0 THEN
        o_status := 'not_friends';
        RETURN;
    END IF;

    -- The AFTER DELETE trigger (below) decrements both friend_counts.
    o_status := 'removed';

    CALL audit.log_action_procedure(
        p_user_id, 'FRIEND_REMOVED', 'user', p_friend_id, NULL, p_ip_address
    );
END;
$$;


--
-- Name: respond_friend_request_procedure(integer, integer, character varying, character varying); Type: PROCEDURE; Schema: social; Owner: -
--

CREATE PROCEDURE social.respond_friend_request_procedure(IN p_request_id integer, IN p_responder_id integer, IN p_action character varying, IN p_ip_address character varying, OUT o_status character varying)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_request social.friend_requests%ROWTYPE;
BEGIN
    IF p_action NOT IN ('accept', 'decline') THEN
        o_status := 'invalid_action';
        RETURN;
    END IF;

    SELECT * INTO v_request FROM social.friend_requests WHERE request_id = p_request_id;

    IF v_request IS NULL THEN
        o_status := 'not_found';
        RETURN;
    END IF;

    IF v_request.recipient_id <> p_responder_id THEN
        o_status := 'forbidden';
        RETURN;
    END IF;

    IF v_request.status <> 'pending' THEN
        o_status := 'already_resolved';
        RETURN;
    END IF;

    IF p_action = 'accept' THEN
        UPDATE social.friend_requests
        SET status = 'accepted', responded_at = now()
        WHERE request_id = p_request_id;
        -- The AFTER UPDATE trigger (below) creates the friendship row
        -- and increments both friend_count values.
        o_status := 'accepted';
    ELSE
        UPDATE social.friend_requests
        SET status = 'declined', responded_at = now()
        WHERE request_id = p_request_id;
        o_status := 'declined';
    END IF;

    CALL audit.log_action_procedure(
        p_responder_id,
        CASE WHEN p_action = 'accept' THEN 'FRIEND_REQUEST_ACCEPTED' ELSE 'FRIEND_REQUEST_DECLINED' END,
        'friend_request', p_request_id,
        jsonb_build_object('requester_id', v_request.requester_id), p_ip_address
    );
END;
$$;


--
-- Name: search_users_function(character varying, integer); Type: FUNCTION; Schema: social; Owner: -
--

CREATE FUNCTION social.search_users_function(p_query character varying, p_requesting_user_id integer) RETURNS TABLE(user_id integer, username character varying, email character varying, avatar_url text, relationship_status character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        u.user_id,
        u.username,
        u.email,
        u.avatar_url,
        (CASE
            WHEN f.friendship_id IS NOT NULL THEN 'friends'
            WHEN pr_out.request_id IS NOT NULL THEN 'request_sent'
            WHEN pr_in.request_id IS NOT NULL THEN 'request_received'
            ELSE 'none'
        END)::VARCHAR AS relationship_status
    FROM auth.users u
    LEFT JOIN social.friendships f
        ON (f.user_id_a = LEAST(u.user_id, p_requesting_user_id)
            AND f.user_id_b = GREATEST(u.user_id, p_requesting_user_id))
    LEFT JOIN social.friend_requests pr_out
        ON pr_out.requester_id = p_requesting_user_id
        AND pr_out.recipient_id = u.user_id
        AND pr_out.status = 'pending'
    LEFT JOIN social.friend_requests pr_in
        ON pr_in.requester_id = u.user_id
        AND pr_in.recipient_id = p_requesting_user_id
        AND pr_in.status = 'pending'
    WHERE u.user_id <> p_requesting_user_id
      AND (u.username ILIKE '%' || p_query || '%' OR u.email ILIKE '%' || p_query || '%')
    ORDER BY u.username ASC
    LIMIT 20;
END;
$$;


--
-- Name: send_friend_request_procedure(integer, integer, character varying); Type: PROCEDURE; Schema: social; Owner: -
--

CREATE PROCEDURE social.send_friend_request_procedure(IN p_requester_id integer, IN p_recipient_id integer, IN p_ip_address character varying, OUT o_request_id integer, OUT o_status character varying)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_exists_friendship BOOLEAN;
    v_recipient_exists BOOLEAN;
BEGIN
    IF p_requester_id = p_recipient_id THEN
        o_status := 'self_request';
        RETURN;
    END IF;

    SELECT EXISTS(SELECT 1 FROM auth.users WHERE user_id = p_recipient_id) INTO v_recipient_exists;
    IF NOT v_recipient_exists THEN
        o_status := 'recipient_not_found';
        RETURN;
    END IF;

    SELECT EXISTS (
        SELECT 1 FROM social.friendships
        WHERE user_id_a = LEAST(p_requester_id, p_recipient_id)
          AND user_id_b = GREATEST(p_requester_id, p_recipient_id)
    ) INTO v_exists_friendship;

    IF v_exists_friendship THEN
        o_status := 'already_friends';
        RETURN;
    END IF;

    BEGIN
        INSERT INTO social.friend_requests (requester_id, recipient_id)
        VALUES (p_requester_id, p_recipient_id)
        RETURNING request_id INTO o_request_id;

        o_status := 'created';
    EXCEPTION WHEN unique_violation THEN
        -- Caught by idx_unique_pending_request: a pending request already
        -- exists in either direction between this pair.
        o_status := 'already_pending';
        RETURN;
    END;

    CALL audit.log_action_procedure(
        p_requester_id, 'FRIEND_REQUEST_SENT', 'friend_request', o_request_id,
        jsonb_build_object('recipient_id', p_recipient_id), p_ip_address
    );
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_logs; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.audit_logs (
    log_id bigint NOT NULL,
    actor_user_id integer NOT NULL,
    action character varying(50) NOT NULL,
    target_type character varying(50),
    target_id integer,
    details jsonb,
    ip_address character varying(45),
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: audit_logs_log_id_seq; Type: SEQUENCE; Schema: audit; Owner: -
--

CREATE SEQUENCE audit.audit_logs_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: audit_logs_log_id_seq; Type: SEQUENCE OWNED BY; Schema: audit; Owner: -
--

ALTER SEQUENCE audit.audit_logs_log_id_seq OWNED BY audit.audit_logs.log_id;


--
-- Name: otp_codes; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.otp_codes (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    otp_code character varying(6) NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    is_used boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: otp_codes_id_seq; Type: SEQUENCE; Schema: auth; Owner: -
--

CREATE SEQUENCE auth.otp_codes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: otp_codes_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: -
--

ALTER SEQUENCE auth.otp_codes_id_seq OWNED BY auth.otp_codes.id;


--
-- Name: users; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.users (
    user_id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash text,
    phone_number character varying(20),
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    google_id character varying(255),
    avatar_url text,
    auth_provider character varying(20) DEFAULT 'local'::character varying NOT NULL,
    is_verified boolean DEFAULT false NOT NULL,
    role public.user_role DEFAULT 'student'::public.user_role NOT NULL,
    friend_count integer DEFAULT 0 NOT NULL
);


--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: auth; Owner: -
--

CREATE SEQUENCE auth.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: -
--

ALTER SEQUENCE auth.users_user_id_seq OWNED BY auth.users.user_id;


--
-- Name: chat_messages; Type: TABLE; Schema: chatbot; Owner: -
--

CREATE TABLE chatbot.chat_messages (
    message_id integer NOT NULL,
    chat_id integer NOT NULL,
    role character varying(20) NOT NULL,
    content text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    prompt_version character varying(50),
    prompt_tokens integer,
    completion_tokens integer,
    latency_ms integer,
    model_used character varying(50),
    CONSTRAINT chat_messages_role_check CHECK (((role)::text = ANY ((ARRAY['user'::character varying, 'assistant'::character varying])::text[])))
);


--
-- Name: chat_messages_message_id_seq; Type: SEQUENCE; Schema: chatbot; Owner: -
--

CREATE SEQUENCE chatbot.chat_messages_message_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: chat_messages_message_id_seq; Type: SEQUENCE OWNED BY; Schema: chatbot; Owner: -
--

ALTER SEQUENCE chatbot.chat_messages_message_id_seq OWNED BY chatbot.chat_messages.message_id;


--
-- Name: chats; Type: TABLE; Schema: chatbot; Owner: -
--

CREATE TABLE chatbot.chats (
    chat_id integer NOT NULL,
    user_id integer NOT NULL,
    title character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    summary text,
    summary_covers_up_to_message_id integer,
    summary_updated_at timestamp with time zone
);


--
-- Name: chats_chat_id_seq; Type: SEQUENCE; Schema: chatbot; Owner: -
--

CREATE SEQUENCE chatbot.chats_chat_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: chats_chat_id_seq; Type: SEQUENCE OWNED BY; Schema: chatbot; Owner: -
--

ALTER SEQUENCE chatbot.chats_chat_id_seq OWNED BY chatbot.chats.chat_id;


--
-- Name: message_feedback; Type: TABLE; Schema: chatbot; Owner: -
--

CREATE TABLE chatbot.message_feedback (
    feedback_id bigint NOT NULL,
    message_id integer NOT NULL,
    user_id integer NOT NULL,
    rating smallint NOT NULL,
    comment text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT message_feedback_rating_check CHECK ((rating = ANY (ARRAY['-1'::integer, 1])))
);


--
-- Name: message_feedback_feedback_id_seq; Type: SEQUENCE; Schema: chatbot; Owner: -
--

CREATE SEQUENCE chatbot.message_feedback_feedback_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: message_feedback_feedback_id_seq; Type: SEQUENCE OWNED BY; Schema: chatbot; Owner: -
--

ALTER SEQUENCE chatbot.message_feedback_feedback_id_seq OWNED BY chatbot.message_feedback.feedback_id;


--
-- Name: system_prompts; Type: TABLE; Schema: chatbot; Owner: -
--

CREATE TABLE chatbot.system_prompts (
    prompt_id integer NOT NULL,
    version character varying(50) NOT NULL,
    content text NOT NULL,
    is_active boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    few_shot_examples jsonb DEFAULT '[]'::jsonb NOT NULL,
    response_guidelines text
);


--
-- Name: system_prompts_prompt_id_seq; Type: SEQUENCE; Schema: chatbot; Owner: -
--

CREATE SEQUENCE chatbot.system_prompts_prompt_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: system_prompts_prompt_id_seq; Type: SEQUENCE OWNED BY; Schema: chatbot; Owner: -
--

ALTER SEQUENCE chatbot.system_prompts_prompt_id_seq OWNED BY chatbot.system_prompts.prompt_id;


--
-- Name: notifications; Type: TABLE; Schema: notification; Owner: -
--

CREATE TABLE notification.notifications (
    notification_id bigint NOT NULL,
    recipient_user_id integer NOT NULL,
    type character varying(50) NOT NULL,
    title character varying(255) NOT NULL,
    message text,
    data jsonb,
    is_read boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    read_at timestamp with time zone
);


--
-- Name: notifications_notification_id_seq; Type: SEQUENCE; Schema: notification; Owner: -
--

CREATE SEQUENCE notification.notifications_notification_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: notifications_notification_id_seq; Type: SEQUENCE OWNED BY; Schema: notification; Owner: -
--

ALTER SEQUENCE notification.notifications_notification_id_seq OWNED BY notification.notifications.notification_id;


--
-- Name: google_calendar_connections; Type: TABLE; Schema: personalization; Owner: -
--

CREATE TABLE personalization.google_calendar_connections (
    user_id integer NOT NULL,
    access_token text NOT NULL,
    refresh_token text NOT NULL,
    token_expiry timestamp with time zone NOT NULL,
    calendar_id character varying(255) DEFAULT 'primary'::character varying NOT NULL,
    connected_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: sprint_tasks; Type: TABLE; Schema: personalization; Owner: -
--

CREATE TABLE personalization.sprint_tasks (
    task_id bigint NOT NULL,
    user_id integer NOT NULL,
    source_event_id bigint,
    title character varying(255) NOT NULL,
    subject character varying(100) NOT NULL,
    status personalization.sprint_status DEFAULT 'backlog'::personalization.sprint_status NOT NULL,
    "position" integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: sprint_tasks_task_id_seq; Type: SEQUENCE; Schema: personalization; Owner: -
--

CREATE SEQUENCE personalization.sprint_tasks_task_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sprint_tasks_task_id_seq; Type: SEQUENCE OWNED BY; Schema: personalization; Owner: -
--

ALTER SEQUENCE personalization.sprint_tasks_task_id_seq OWNED BY personalization.sprint_tasks.task_id;


--
-- Name: study_events; Type: TABLE; Schema: personalization; Owner: -
--

CREATE TABLE personalization.study_events (
    event_id bigint NOT NULL,
    user_id integer NOT NULL,
    title character varying(255) NOT NULL,
    type character varying(50) NOT NULL,
    due_date timestamp with time zone NOT NULL,
    subject character varying(100) NOT NULL,
    description text,
    google_calendar_event_id character varying(255),
    synced_to_google boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: study_events_event_id_seq; Type: SEQUENCE; Schema: personalization; Owner: -
--

CREATE SEQUENCE personalization.study_events_event_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: study_events_event_id_seq; Type: SEQUENCE OWNED BY; Schema: personalization; Owner: -
--

ALTER SEQUENCE personalization.study_events_event_id_seq OWNED BY personalization.study_events.event_id;


--
-- Name: friend_requests; Type: TABLE; Schema: social; Owner: -
--

CREATE TABLE social.friend_requests (
    request_id bigint NOT NULL,
    requester_id integer NOT NULL,
    recipient_id integer NOT NULL,
    status social.friend_request_status DEFAULT 'pending'::social.friend_request_status NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    responded_at timestamp with time zone,
    CONSTRAINT no_self_request CHECK ((requester_id <> recipient_id))
);


--
-- Name: friend_requests_request_id_seq; Type: SEQUENCE; Schema: social; Owner: -
--

CREATE SEQUENCE social.friend_requests_request_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: friend_requests_request_id_seq; Type: SEQUENCE OWNED BY; Schema: social; Owner: -
--

ALTER SEQUENCE social.friend_requests_request_id_seq OWNED BY social.friend_requests.request_id;


--
-- Name: friendships; Type: TABLE; Schema: social; Owner: -
--

CREATE TABLE social.friendships (
    friendship_id bigint NOT NULL,
    user_id_a integer NOT NULL,
    user_id_b integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT ordered_pair CHECK ((user_id_a < user_id_b))
);


--
-- Name: friendships_friendship_id_seq; Type: SEQUENCE; Schema: social; Owner: -
--

CREATE SEQUENCE social.friendships_friendship_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: friendships_friendship_id_seq; Type: SEQUENCE OWNED BY; Schema: social; Owner: -
--

ALTER SEQUENCE social.friendships_friendship_id_seq OWNED BY social.friendships.friendship_id;


--
-- Name: audit_logs log_id; Type: DEFAULT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.audit_logs ALTER COLUMN log_id SET DEFAULT nextval('audit.audit_logs_log_id_seq'::regclass);


--
-- Name: otp_codes id; Type: DEFAULT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.otp_codes ALTER COLUMN id SET DEFAULT nextval('auth.otp_codes_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.users ALTER COLUMN user_id SET DEFAULT nextval('auth.users_user_id_seq'::regclass);


--
-- Name: chat_messages message_id; Type: DEFAULT; Schema: chatbot; Owner: -
--

ALTER TABLE ONLY chatbot.chat_messages ALTER COLUMN message_id SET DEFAULT nextval('chatbot.chat_messages_message_id_seq'::regclass);


--
-- Name: chats chat_id; Type: DEFAULT; Schema: chatbot; Owner: -
--

ALTER TABLE ONLY chatbot.chats ALTER COLUMN chat_id SET DEFAULT nextval('chatbot.chats_chat_id_seq'::regclass);


--
-- Name: message_feedback feedback_id; Type: DEFAULT; Schema: chatbot; Owner: -
--

ALTER TABLE ONLY chatbot.message_feedback ALTER COLUMN feedback_id SET DEFAULT nextval('chatbot.message_feedback_feedback_id_seq'::regclass);


--
-- Name: system_prompts prompt_id; Type: DEFAULT; Schema: chatbot; Owner: -
--

ALTER TABLE ONLY chatbot.system_prompts ALTER COLUMN prompt_id SET DEFAULT nextval('chatbot.system_prompts_prompt_id_seq'::regclass);


--
-- Name: notifications notification_id; Type: DEFAULT; Schema: notification; Owner: -
--

ALTER TABLE ONLY notification.notifications ALTER COLUMN notification_id SET DEFAULT nextval('notification.notifications_notification_id_seq'::regclass);


--
-- Name: sprint_tasks task_id; Type: DEFAULT; Schema: personalization; Owner: -
--

ALTER TABLE ONLY personalization.sprint_tasks ALTER COLUMN task_id SET DEFAULT nextval('personalization.sprint_tasks_task_id_seq'::regclass);


--
-- Name: study_events event_id; Type: DEFAULT; Schema: personalization; Owner: -
--

ALTER TABLE ONLY personalization.study_events ALTER COLUMN event_id SET DEFAULT nextval('personalization.study_events_event_id_seq'::regclass);


--
-- Name: friend_requests request_id; Type: DEFAULT; Schema: social; Owner: -
--

ALTER TABLE ONLY social.friend_requests ALTER COLUMN request_id SET DEFAULT nextval('social.friend_requests_request_id_seq'::regclass);


--
-- Name: friendships friendship_id; Type: DEFAULT; Schema: social; Owner: -
--

ALTER TABLE ONLY social.friendships ALTER COLUMN friendship_id SET DEFAULT nextval('social.friendships_friendship_id_seq'::regclass);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (log_id);


--
-- Name: otp_codes otp_codes_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.otp_codes
    ADD CONSTRAINT otp_codes_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_google_id_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_google_id_key UNIQUE (google_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: chat_messages chat_messages_pkey; Type: CONSTRAINT; Schema: chatbot; Owner: -
--

ALTER TABLE ONLY chatbot.chat_messages
    ADD CONSTRAINT chat_messages_pkey PRIMARY KEY (message_id);


--
-- Name: chats chats_pkey; Type: CONSTRAINT; Schema: chatbot; Owner: -
--

ALTER TABLE ONLY chatbot.chats
    ADD CONSTRAINT chats_pkey PRIMARY KEY (chat_id);


--
-- Name: message_feedback message_feedback_message_id_user_id_key; Type: CONSTRAINT; Schema: chatbot; Owner: -
--

ALTER TABLE ONLY chatbot.message_feedback
    ADD CONSTRAINT message_feedback_message_id_user_id_key UNIQUE (message_id, user_id);


--
-- Name: message_feedback message_feedback_pkey; Type: CONSTRAINT; Schema: chatbot; Owner: -
--

ALTER TABLE ONLY chatbot.message_feedback
    ADD CONSTRAINT message_feedback_pkey PRIMARY KEY (feedback_id);


--
-- Name: system_prompts system_prompts_pkey; Type: CONSTRAINT; Schema: chatbot; Owner: -
--

ALTER TABLE ONLY chatbot.system_prompts
    ADD CONSTRAINT system_prompts_pkey PRIMARY KEY (prompt_id);


--
-- Name: system_prompts system_prompts_version_key; Type: CONSTRAINT; Schema: chatbot; Owner: -
--

ALTER TABLE ONLY chatbot.system_prompts
    ADD CONSTRAINT system_prompts_version_key UNIQUE (version);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: notification; Owner: -
--

ALTER TABLE ONLY notification.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (notification_id);


--
-- Name: google_calendar_connections google_calendar_connections_pkey; Type: CONSTRAINT; Schema: personalization; Owner: -
--

ALTER TABLE ONLY personalization.google_calendar_connections
    ADD CONSTRAINT google_calendar_connections_pkey PRIMARY KEY (user_id);


--
-- Name: sprint_tasks sprint_tasks_pkey; Type: CONSTRAINT; Schema: personalization; Owner: -
--

ALTER TABLE ONLY personalization.sprint_tasks
    ADD CONSTRAINT sprint_tasks_pkey PRIMARY KEY (task_id);


--
-- Name: study_events study_events_pkey; Type: CONSTRAINT; Schema: personalization; Owner: -
--

ALTER TABLE ONLY personalization.study_events
    ADD CONSTRAINT study_events_pkey PRIMARY KEY (event_id);


--
-- Name: friend_requests friend_requests_pkey; Type: CONSTRAINT; Schema: social; Owner: -
--

ALTER TABLE ONLY social.friend_requests
    ADD CONSTRAINT friend_requests_pkey PRIMARY KEY (request_id);


--
-- Name: friendships friendships_pkey; Type: CONSTRAINT; Schema: social; Owner: -
--

ALTER TABLE ONLY social.friendships
    ADD CONSTRAINT friendships_pkey PRIMARY KEY (friendship_id);


--
-- Name: friendships unique_pair; Type: CONSTRAINT; Schema: social; Owner: -
--

ALTER TABLE ONLY social.friendships
    ADD CONSTRAINT unique_pair UNIQUE (user_id_a, user_id_b);


--
-- Name: idx_audit_logs_action; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX idx_audit_logs_action ON audit.audit_logs USING btree (action);


--
-- Name: idx_audit_logs_actor; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX idx_audit_logs_actor ON audit.audit_logs USING btree (actor_user_id);


--
-- Name: idx_otp_email_active; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_otp_email_active ON auth.otp_codes USING btree (email, is_used, expires_at);


--
-- Name: idx_users_email_trgm; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_users_email_trgm ON auth.users USING gin (email public.gin_trgm_ops);


--
-- Name: idx_users_username_trgm; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_users_username_trgm ON auth.users USING gin (username public.gin_trgm_ops);


--
-- Name: idx_chat_messages_chat_id; Type: INDEX; Schema: chatbot; Owner: -
--

CREATE INDEX idx_chat_messages_chat_id ON chatbot.chat_messages USING btree (chat_id);


--
-- Name: idx_chats_user_id; Type: INDEX; Schema: chatbot; Owner: -
--

CREATE INDEX idx_chats_user_id ON chatbot.chats USING btree (user_id);


--
-- Name: idx_one_active_prompt; Type: INDEX; Schema: chatbot; Owner: -
--

CREATE UNIQUE INDEX idx_one_active_prompt ON chatbot.system_prompts USING btree (is_active) WHERE (is_active = true);


--
-- Name: idx_notifications_recipient_created; Type: INDEX; Schema: notification; Owner: -
--

CREATE INDEX idx_notifications_recipient_created ON notification.notifications USING btree (recipient_user_id, created_at DESC);


--
-- Name: idx_notifications_recipient_unread; Type: INDEX; Schema: notification; Owner: -
--

CREATE INDEX idx_notifications_recipient_unread ON notification.notifications USING btree (recipient_user_id) WHERE (is_read = false);


--
-- Name: idx_sprint_tasks_user_status; Type: INDEX; Schema: personalization; Owner: -
--

CREATE INDEX idx_sprint_tasks_user_status ON personalization.sprint_tasks USING btree (user_id, status, "position");


--
-- Name: idx_study_events_user_due; Type: INDEX; Schema: personalization; Owner: -
--

CREATE INDEX idx_study_events_user_due ON personalization.study_events USING btree (user_id, due_date);


--
-- Name: idx_friend_requests_recipient; Type: INDEX; Schema: social; Owner: -
--

CREATE INDEX idx_friend_requests_recipient ON social.friend_requests USING btree (recipient_id, status);


--
-- Name: idx_friend_requests_requester; Type: INDEX; Schema: social; Owner: -
--

CREATE INDEX idx_friend_requests_requester ON social.friend_requests USING btree (requester_id, status);


--
-- Name: idx_friendships_a; Type: INDEX; Schema: social; Owner: -
--

CREATE INDEX idx_friendships_a ON social.friendships USING btree (user_id_a);


--
-- Name: idx_friendships_b; Type: INDEX; Schema: social; Owner: -
--

CREATE INDEX idx_friendships_b ON social.friendships USING btree (user_id_b);


--
-- Name: idx_unique_pending_request; Type: INDEX; Schema: social; Owner: -
--

CREATE UNIQUE INDEX idx_unique_pending_request ON social.friend_requests USING btree (LEAST(requester_id, recipient_id), GREATEST(requester_id, recipient_id)) WHERE (status = 'pending'::social.friend_request_status);


--
-- Name: study_events trg_create_sprint_task_from_event; Type: TRIGGER; Schema: personalization; Owner: -
--

CREATE TRIGGER trg_create_sprint_task_from_event AFTER INSERT ON personalization.study_events FOR EACH ROW EXECUTE FUNCTION personalization.create_sprint_task_from_event_trigger_fn();


--
-- Name: study_events trg_sync_sprint_task_from_event; Type: TRIGGER; Schema: personalization; Owner: -
--

CREATE TRIGGER trg_sync_sprint_task_from_event AFTER UPDATE ON personalization.study_events FOR EACH ROW EXECUTE FUNCTION personalization.sync_sprint_task_from_event_trigger_fn();


--
-- Name: friend_requests trg_friend_request_accepted; Type: TRIGGER; Schema: social; Owner: -
--

CREATE TRIGGER trg_friend_request_accepted AFTER UPDATE ON social.friend_requests FOR EACH ROW EXECUTE FUNCTION social.on_friend_request_accepted_trigger_fn();


--
-- Name: friendships trg_friendship_removed; Type: TRIGGER; Schema: social; Owner: -
--

CREATE TRIGGER trg_friendship_removed AFTER DELETE ON social.friendships FOR EACH ROW EXECUTE FUNCTION social.on_friendship_removed_trigger_fn();


--
-- Name: friend_requests trg_notify_friend_request_accepted; Type: TRIGGER; Schema: social; Owner: -
--

CREATE TRIGGER trg_notify_friend_request_accepted AFTER UPDATE ON social.friend_requests FOR EACH ROW EXECUTE FUNCTION social.notify_on_friend_request_accepted_trigger_fn();


--
-- Name: chat_messages chat_messages_chat_id_fkey; Type: FK CONSTRAINT; Schema: chatbot; Owner: -
--

ALTER TABLE ONLY chatbot.chat_messages
    ADD CONSTRAINT chat_messages_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES chatbot.chats(chat_id) ON DELETE CASCADE;


--
-- Name: chats chats_user_id_fkey; Type: FK CONSTRAINT; Schema: chatbot; Owner: -
--

ALTER TABLE ONLY chatbot.chats
    ADD CONSTRAINT chats_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(user_id) ON DELETE CASCADE;


--
-- Name: message_feedback message_feedback_message_id_fkey; Type: FK CONSTRAINT; Schema: chatbot; Owner: -
--

ALTER TABLE ONLY chatbot.message_feedback
    ADD CONSTRAINT message_feedback_message_id_fkey FOREIGN KEY (message_id) REFERENCES chatbot.chat_messages(message_id) ON DELETE CASCADE;


--
-- Name: notifications notifications_recipient_user_id_fkey; Type: FK CONSTRAINT; Schema: notification; Owner: -
--

ALTER TABLE ONLY notification.notifications
    ADD CONSTRAINT notifications_recipient_user_id_fkey FOREIGN KEY (recipient_user_id) REFERENCES auth.users(user_id) ON DELETE CASCADE;


--
-- Name: google_calendar_connections google_calendar_connections_user_id_fkey; Type: FK CONSTRAINT; Schema: personalization; Owner: -
--

ALTER TABLE ONLY personalization.google_calendar_connections
    ADD CONSTRAINT google_calendar_connections_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(user_id) ON DELETE CASCADE;


--
-- Name: sprint_tasks sprint_tasks_source_event_id_fkey; Type: FK CONSTRAINT; Schema: personalization; Owner: -
--

ALTER TABLE ONLY personalization.sprint_tasks
    ADD CONSTRAINT sprint_tasks_source_event_id_fkey FOREIGN KEY (source_event_id) REFERENCES personalization.study_events(event_id) ON DELETE CASCADE;


--
-- Name: sprint_tasks sprint_tasks_user_id_fkey; Type: FK CONSTRAINT; Schema: personalization; Owner: -
--

ALTER TABLE ONLY personalization.sprint_tasks
    ADD CONSTRAINT sprint_tasks_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(user_id) ON DELETE CASCADE;


--
-- Name: study_events study_events_user_id_fkey; Type: FK CONSTRAINT; Schema: personalization; Owner: -
--

ALTER TABLE ONLY personalization.study_events
    ADD CONSTRAINT study_events_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(user_id) ON DELETE CASCADE;


--
-- Name: friend_requests friend_requests_recipient_id_fkey; Type: FK CONSTRAINT; Schema: social; Owner: -
--

ALTER TABLE ONLY social.friend_requests
    ADD CONSTRAINT friend_requests_recipient_id_fkey FOREIGN KEY (recipient_id) REFERENCES auth.users(user_id) ON DELETE CASCADE;


--
-- Name: friend_requests friend_requests_requester_id_fkey; Type: FK CONSTRAINT; Schema: social; Owner: -
--

ALTER TABLE ONLY social.friend_requests
    ADD CONSTRAINT friend_requests_requester_id_fkey FOREIGN KEY (requester_id) REFERENCES auth.users(user_id) ON DELETE CASCADE;


--
-- Name: friendships friendships_user_id_a_fkey; Type: FK CONSTRAINT; Schema: social; Owner: -
--

ALTER TABLE ONLY social.friendships
    ADD CONSTRAINT friendships_user_id_a_fkey FOREIGN KEY (user_id_a) REFERENCES auth.users(user_id) ON DELETE CASCADE;


--
-- Name: friendships friendships_user_id_b_fkey; Type: FK CONSTRAINT; Schema: social; Owner: -
--

ALTER TABLE ONLY social.friendships
    ADD CONSTRAINT friendships_user_id_b_fkey FOREIGN KEY (user_id_b) REFERENCES auth.users(user_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict g7xA5BrfKmUgo6zrDomBaR16vnEvs89xU5t8VQeaEQjSxigwUCtLUVsv55AggQD

