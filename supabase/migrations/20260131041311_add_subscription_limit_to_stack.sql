CREATE TYPE subscription_duration AS ENUM ('1 month', '3 month', '6 month');

ALTER TABLE stacks 
ADD COLUMN subscription_duration subscription_duration;