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