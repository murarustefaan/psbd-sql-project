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