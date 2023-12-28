-- Create a single user with the predefined UUID
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'c65f2389-0f5f-4dee-a33c-4d413126d2c3',  -- Predefined UUID
    'authenticated',
    'authenticated',
    'user@example.com',
    crypt('password123', gen_salt('bf')),
    current_timestamp,
    current_timestamp,
    current_timestamp,
    '{"provider":"email","providers":["email"]}',
    '{}',
    current_timestamp,
    current_timestamp,
    '',
    '',
    '',
    ''
);

-- Insert data into 'board' table
INSERT INTO public.board (title, user_id)
VALUES 
('Project Alpha', 'c65f2389-0f5f-4dee-a33c-4d413126d2c3'),
('Project Beta', 'c65f2389-0f5f-4dee-a33c-4d413126d2c3'),
('Project Gamma', 'c65f2389-0f5f-4dee-a33c-4d413126d2c3');

-- Insert data into 'lane' table
INSERT INTO public.lane (board_id, title, position, user_id)
VALUES
((SELECT id FROM public.board WHERE title = 'Project Alpha'), 'To Do', 65535, 'c65f2389-0f5f-4dee-a33c-4d413126d2c3'),
((SELECT id FROM public.board WHERE title = 'Project Alpha'), 'In Progress', 65535 * 2, 'c65f2389-0f5f-4dee-a33c-4d413126d2c3'),
((SELECT id FROM public.board WHERE title = 'Project Alpha'), 'Done', 65535 * 3, 'c65f2389-0f5f-4dee-a33c-4d413126d2c3');

-- Insert data into 'card' table
INSERT INTO public.card (board_id, lane_id, title, position, user_id)
VALUES
((SELECT id FROM public.board WHERE title = 'Project Alpha'), (SELECT id FROM public.lane WHERE title = 'To Do'), 'Implement feature X', 65535, 'c65f2389-0f5f-4dee-a33c-4d413126d2c3');
