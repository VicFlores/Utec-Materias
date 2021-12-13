CREATE TABLE public.users
(
    id serial NOT NULL,
    firstname character varying(50) NOT NULL,
    lastname character varying(50) NOT NULL,
	email character varying(150) UNIQUE NOT NULL,
	passwd character varying(25) NOT NULL,
	roles character varying(10) NOT NULL,
   	PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public.users
    OWNER to vicflores11;