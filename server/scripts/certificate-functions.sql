-- finds and returns the remaining days of validity of the certificate
CREATE OR REPLACE FUNCTION remaining_days(doc_date DATE, cert_duration INTEGER)
    RETURNS INTEGER AS $$
BEGIN
    RETURN cert_duration - (CURRENT_DATE - doc_date);
END;
$$ LANGUAGE plpgsql;