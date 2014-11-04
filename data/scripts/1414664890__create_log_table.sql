--  create log table --
-- @DO sql script --
CREATE TABLE app_log (
  id SERIAL PRIMARY KEY,
  event VARCHAR(500)
);

-- @UNDO sql script --
DROP TABLE app_log ;
