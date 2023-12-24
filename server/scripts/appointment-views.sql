-- displays all appointments for today in the overview page
CREATE VIEW todays_appointments AS
SELECT *
FROM APPOINTMENT
WHERE DATE(apt_date) = CURRENT_DATE;