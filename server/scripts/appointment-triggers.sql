ALTER TABLE APPOINTMENT ADD COLUMN daily_appointments_count INTEGER DEFAULT 0;

CREATE OR REPLACE FUNCTION increment_appointments_count() RETURNS TRIGGER AS $$
BEGIN
    NEW.daily_appointments_count = (SELECT COUNT(*) FROM APPOINTMENT WHERE apt_date = NEW.apt_date) + 1;

    IF NEW.daily_appointments_count > 5 THEN
        -- stops adding new appointments once the daily limit is reached
        RAISE EXCEPTION 'The number of appointments for the day has exceeded 5.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_appointments_count
    AFTER INSERT ON APPOINTMENT
    FOR EACH ROW EXECUTE PROCEDURE increment_appointments_count();