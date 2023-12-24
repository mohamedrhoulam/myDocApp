-- This stored function notifies the user if the medicine will expire in a month
CREATE OR REPLACE FUNCTION notify_medicine_expiry()
    RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.MED_expDate - INTERVAL '1 month') <= CURRENT_DATE THEN
        RAISE NOTICE 'Medicine % will expire in a month', NEW.MED_name;
    END IF;
    RETURN NEW;
END; $$
    LANGUAGE 'plpgsql';

-- This trigger calls the notify_medicine_expiry function after an insert or update operation on the MEDICINE table
CREATE TRIGGER notify_medicine_expiry_trigger
    AFTER INSERT OR UPDATE ON MEDICINE
    FOR EACH ROW EXECUTE PROCEDURE notify_medicine_expiry();