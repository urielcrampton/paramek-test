CREATE TABLE IF NOT EXISTS trips (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  country     TEXT NOT NULL,
  start_date  DATE NOT NULL,
  end_date    DATE NOT NULL,
  notes       TEXT DEFAULT ''
);

-- Stored procedure: create
CREATE OR REPLACE FUNCTION sp_create_trip(
  p_name TEXT, p_country TEXT, p_start DATE, p_end DATE, p_notes TEXT
) RETURNS trips AS $$
DECLARE
  new_row trips;
BEGIN
  INSERT INTO trips(name, country, start_date, end_date, notes)
  VALUES (p_name, p_country, p_start, p_end, p_notes)
  RETURNING * INTO new_row;
  RETURN new_row;
END;
$$ LANGUAGE plpgsql;

-- Stored procedure: update
CREATE OR REPLACE FUNCTION sp_update_trip(
  p_id BIGINT, p_name TEXT, p_country TEXT, p_start DATE, p_end DATE, p_notes TEXT
) RETURNS trips AS $$
DECLARE
  upd_row trips;
BEGIN
  UPDATE trips
     SET name = p_name,
         country = p_country,
         start_date = p_start,
         end_date = p_end,
         notes = p_notes
   WHERE id = p_id
  RETURNING * INTO upd_row;
  RETURN upd_row;
END;
$$ LANGUAGE plpgsql;