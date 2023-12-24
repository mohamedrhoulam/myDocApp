-- this stored function returns all expired medicines
CREATE OR REPLACE FUNCTION get_expired_medicines()
    RETURNS TABLE (
                      MED_serial_num INT,
                      MED_name VARCHAR(255),
                      MED_expDate DATE,
                      MED_prodDate DATE,
                      MED_amount INT
                  ) AS $$
BEGIN
    RETURN QUERY SELECT * FROM MEDICINE WHERE MED_expDate < CURRENT_DATE;
END; $$
    LANGUAGE 'plpgsql';

-- this function deletes expired medicine and notifies the user
CREATE OR REPLACE FUNCTION delete_expired_medicine()
    RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM MEDICINE WHERE MED_serial_num = OLD.MED_serial_num;
    RAISE NOTICE 'Medicine % has been deleted', OLD.MED_name;
    RETURN OLD;
END; $$
    LANGUAGE 'plpgsql';