----------------------------------
-- GET MOVIE DETAILS BY BASE_ID --
CREATE OR REPLACE
FUNCTION GET_MOVIE_DETAILS (
  V_BASE_ID IN NUMBER
) RETURN SYS_REFCURSOR
AS
  rc_movie SYS_REFCURSOR;
BEGIN
  OPEN rc_movie FOR
    SELECT
      BASE.id             AS BASE_ID,
      BASE.imdb_link      AS IMDB_LINK,
      BASE.type           AS TYPE,
      MOVIES.description  AS DESCRIPTION,
      MOVIES.image_url    AS IMAGE_URL,
      MOVIES.length       AS LENGTH,
      MOVIES.release_date AS RELEASE_DATE,
      MOVIES.name         AS NAME
    FROM MOVIES
      JOIN BASE ON MOVIES.base_id = BASE.id
      WHERE V_BASE_ID = MOVIES.base_id;
  RETURN rc_movie;
END;

-----------------------------
-- GET MOVIE RUNTIME BY ID --
CREATE OR REPLACE
FUNCTION GET_MOVIE_RUNTIME (
  V_BASE_ID IN NUMBER
) RETURN NUMBER
AS
  v_runtime NUMBER;
BEGIN
  SELECT MOVIES.length INTO v_runtime
  FROM BASE
  JOIN MOVIES ON MOVIES.base_id = BASE.id
    WHERE BASE.id = V_BASE_ID;

  RETURN v_runtime;
END;

------------------------------
-- CREATE OR UPDATE A MOVIE --
CREATE OR REPLACE PROCEDURE CREATE_OR_UPDATE_MOVIE (
  V_BASE_ID       NUMBER,
  V_IMDB_LINK     VARCHAR,
  V_NAME          VARCHAR,
  V_DESCRIPTION   VARCHAR,
  V_IMAGE_URL     VARCHAR,
  V_LENGTH        NUMBER,
  V_RELEASE_DATE  DATE,
  V_RET_ID        OUT NUMBER
) AS
  V_MOVIE_EXISTS  NUMBER;
BEGIN
  SELECT 
    CASE WHEN COUNT(base_id) > 0 THEN 1 ELSE 0 END INTO V_MOVIE_EXISTS
  FROM MOVIES
  WHERE base_id = V_BASE_ID;
  
  IF V_MOVIE_EXISTS = 1 THEN
    UPDATE MOVIES SET
      name = V_NAME,
      description = V_DESCRIPTION,
      image_url = V_IMAGE_URL,
      length = V_LENGTH,
      release_date = V_RELEASE_DATE
    WHERE base_id = V_BASE_ID;
    
    UPDATE BASE SET
      imdb_link = V_IMDB_LINK
    WHERE id = V_BASE_ID;  
  ELSE
    INSERT INTO BASE (type, imdb_link)
      VALUES ('movie', V_IMDB_LINK)
      RETURNING id INTO V_RET_ID;
    INSERT INTO MOVIES (name, length, release_date, image_url, description, base_id)
      VALUES (V_NAME, V_LENGTH, V_RELEASE_DATE, V_IMAGE_URL, V_DESCRIPTION, V_RET_ID);
  END IF;
END CREATE_OR_UPDATE_MOVIE;

-------------------------------------------------------
-- DELETE MOVIE AND BASE ENTRIES FOR A GIVEN BASE_ID --  
CREATE OR REPLACE PROCEDURE DELETE_MOVIE_BY_BASE_ID (
  V_BASE_ID   IN NUMBER,
  V_RET_ID    OUT NUMBER
) AS
BEGIN
  DELETE FROM MOVIES WHERE base_id = V_BASE_ID;
  DELETE FROM BASE WHERE id = V_BASE_ID
    RETURNING id INTO V_RET_ID;
END;

------------------------------------------------------------------------
-- SEARCH THE MOVIES AND SHOWS TABLES FOR A RECORDS WITH A GIVEN NAME --
CREATE OR REPLACE
FUNCTION SEARCH_BY_NAME (
  V_NAME IN VARCHAR
) RETURN SYS_REFCURSOR
AS
  rc_search SYS_REFCURSOR;
BEGIN
  OPEN rc_search FOR
    SELECT base_id, type, name, image_url FROM (
      SELECT base_id, type, name, image_url FROM SHOWS JOIN BASE ON SHOWS.base_id = BASE.id 
      UNION 
      SELECT base_id, type, name, image_url FROM MOVIES JOIN BASE ON MOVIES.base_id = BASE.id 
    )
    WHERE LOWER(NAME) LIKE '%'|| LOWER(V_NAME) || '%';
  RETURN rc_search;  
END;