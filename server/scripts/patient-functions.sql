create function get_patient_age(p_id integer) returns integer
    language plpgsql
as
$$
DECLARE
    dob DATE;
    age INT;
BEGIN
    SELECT patient_dateOfBirth INTO dob FROM PATIENT WHERE patient_id = p_id;
    age = EXTRACT(YEAR FROM AGE(dob));
    RETURN age;
END; $$;

alter function get_patient_age(integer) owner to postgres;

