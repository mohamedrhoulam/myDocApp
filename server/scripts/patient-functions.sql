-- get patient age
CREATE OR REPLACE FUNCTION get_patient_age(p_id integer) RETURNS integer
    LANGUAGE plpgsql
AS
$$
DECLARE
    dob DATE;
    age INT;
BEGIN
    SELECT patient_dateOfBirth INTO dob FROM PATIENT WHERE patient_id = p_id;
    age = EXTRACT(YEAR FROM AGE(dob));
    RETURN age;
END; $$;

ALTER FUNCTION get_patient_age(integer) OWNER TO postgres;