INSERT INTO public.users(
	id, login, password, age, is_deleted)
	VALUES
		(gen_random_uuid(), 'Anna3', 'Anna123', 25, false),
		(gen_random_uuid(), 'Andrew3', 'Andrew123', 26, false),
		(gen_random_uuid(), 'Mark3', 'Mark123', 27, false),
		(gen_random_uuid(), 'Maria3', 'Maria123', 28, false),
		(gen_random_uuid(), 'Marta6', 'Marta123', 29, false),
		(gen_random_uuid(), 'Anna4', 'Anna123', 25, false),
		(gen_random_uuid(), 'Andrew4', 'Andrew123', 26, false),
		(gen_random_uuid(), 'Mark4', 'Mark123', 27, false),
		(gen_random_uuid(), 'Maria4', 'Maria123', 28, false),
		(gen_random_uuid(), 'Marta5', 'Marta123', 29, true);